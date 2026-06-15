# Wombly Emergency Detection and Response Pipeline

A safety pipeline that listens to chat messages, detects four kinds of crisis (self-harm, obstetric emergency, infant distress, domestic violence), and shows the user a Crisis Sheet with the right local emergency number, a topical crisis line, and a map of nearby places (mental health centres, maternity hospitals, paediatric hospitals, or police stations) based on the kind of crisis detected.

- Owner: Product / Safety
- Markets at v1: PK (default), US, UK. Extensible via one JSON block per country.
- Provider: OpenStreetMap (free). Adapter pattern keeps room for paid providers later.
- Classifier: rules-only at v1. Classifier hook is reserved in the data schema for v2.
- Status: detection, lookup, places, in-app map, location-on-app-load, and chat integration all working. Tests green.

## Table of contents

1. [What this pipeline does, in plain English](#1-what-this-pipeline-does-in-plain-english)
2. [End-to-end pipeline diagram](#2-end-to-end-pipeline-diagram)
3. [File inventory: every file in the pipeline and what it does](#3-file-inventory)
4. [Crisis Sheet state machine](#4-crisis-sheet-state-machine)
5. [Step-by-step flows](#5-step-by-step-flows)
6. [Detection rules reference](#6-detection-rules-reference)
7. [Emergency configuration reference](#7-emergency-configuration-reference)
8. [API endpoints reference](#8-api-endpoints-reference)
9. [Tests](#9-tests)
10. [Setup and run](#10-setup-and-run)
11. [Privacy posture](#11-privacy-posture)
12. [Known limitations](#12-known-limitations)
13. [Changelog](#13-changelog)

---

## 1. What this pipeline does, in plain English

When a user types a message in the Wombly chat, the backend does two things in parallel:

1. **Generates a normal AI reply** (Groq LLM) using the existing chat service.
2. **Runs a rules-based safety check** on the latest user message.

If the safety check classifies the latest message as a real crisis (high severity in any of the four categories), the API response carries a `safety` block. The mobile app reads that block and pops up a **Crisis Sheet** modal that:

- Says something empathetic ("What you're sharing sounds really heavy. Are you safe right now?").
- Offers a single explicit tap to call the right local number for that *kind* of crisis (Umang Helpline for self-harm in Pakistan, Rescue 1122 for obstetric / infant emergencies, Police 15 for domestic violence).
- Offers a second button to find the right *kind* of nearby place (mental health support, maternity hospital, paediatric hospital, police station). Tapping this shows an in-app Leaflet map plus a ranked list with Call / Directions buttons.
- Never auto-dials. Every phone call is a user tap.
- Always provides an "I'm safe, close this" escape.

There are three additional pieces:

- **App-load location**: a React Context (`LocationProvider`) asks for foreground location once when the app starts, stores it **in memory only**, and shares it with both the Crisis Sheet (skip the in-modal location prompt) and the chat (the LLM knows the user's country).
- **Bot awareness**: the system prompt now tells the LLM that the Wombly app HAS emergency features and location, so it stops saying "I cannot help with real-time location."
- **Telemetry**: every step of the Crisis Sheet (shown, confirmed, dismissed, call tapped, location granted/denied, hospitals shown, directions tapped) emits a small PII-free event. Detection events also persist to MongoDB with a 90-day TTL.

---

## 2. End-to-end pipeline diagram

```
+---------------------------------------------------------------------------+
|  REACT NATIVE APP                                                         |
|                                                                           |
|   App.js                                                                  |
|    |                                                                      |
|    +-- LocationProvider (in-memory only)                                  |
|    |     |                                                                |
|    |     +-- expo-location.requestForegroundPermissionsAsync              |
|    |     +-- getCurrentPositionAsync ----> { lat, lng, country }          |
|    |                                                                      |
|    +-- AIChatScreen                                                       |
|         |                                                                 |
|         |  user types a message                                           |
|         |                                                                 |
|         +-- POST /api/conversations/:id/messages                          |
|         |    body: { email, message, client_country }                     |
|         |                                                                 |
|         |  response = { reply, safety: { severity, category, action } }   |
|         |                                                                 |
|         +-- if safety.action in {confirm_then_offer_call,                 |
|         |                        immediate_offer_call}:                   |
|         |       open CrisisSheet(category, action, sessionId)             |
|         |                                                                 |
|         +-- CrisisSheet (modal)                                           |
|              |                                                            |
|              +-- lookupEmergency()      -> contacts, category_routes      |
|              +-- (optional) findNearby() -> places                        |
|              +-- WebView + Leaflet + OSM tiles -> in-app map              |
|              +-- Linking.openURL('tel:...') for explicit-tap dialing      |
|                                                                           |
+----------------------|---------------------|------------------------------+
                       | HTTP                | HTTP
                       v                     v
+---------------------------------------------------------------------------+
|  EXPRESS BACKEND                                                          |
|                                                                           |
|   routes/conversations.js                                                 |
|    |                                                                      |
|    +-- POST /:id/messages -> chatService.sendMessage(...)                 |
|         |                                                                 |
|         +-- buildSystemPrompt({...}, client_country)  -> LLM context      |
|         +-- Groq LLM call                                                 |
|         +-- detectionService.detect({session_id, turns})                  |
|         |     |                                                           |
|         |     +-- rules.evaluateWindow(latest user turn)                  |
|         |          |                                                      |
|         |          +-- 27 regex rules across 4 categories                 |
|         |          +-- negation / third-person / hypothetical downgrade   |
|         |          +-- tie-break: more specific category wins             |
|         |                                                                 |
|         +-- returns reply AND safety SafetyEvent shape                    |
|                                                                           |
|   routes/safety.js                                                        |
|    |                                                                      |
|    +-- GET  /emergency/lookup -> emergencyLookup.lookup()                 |
|    |        |                                                             |
|    |        +-- reverse-geocode via Nominatim (cached 30d)                |
|    |        +-- fall back to default_country (PK -> 1122)                 |
|    |        +-- final fallback default.primary (112)                      |
|    |                                                                      |
|    +-- GET  /places/nearby -> placeAdapter.findPlaces({category})         |
|    |        |                                                             |
|    |        +-- OSM Overpass query (category-specific tag union)          |
|    |        +-- radius expansion 5 -> 15 -> 30 km                         |
|    |        +-- rank by distance + open_now + has_phone                   |
|    |        +-- dedup by place_id, cache 15m                              |
|    |                                                                      |
|    +-- POST /consent  -> consentService.record() (append-only)            |
|    +-- POST /detect   -> detectionService.detect() (standalone)           |
|    +-- POST /telemetry/safety -> telemetry.ingest()                       |
|         |                                                                 |
|         +-- allow-list event names + attrs                                |
|         +-- hash session_id with daily salt                               |
|         +-- detection.fired persists to SafetyEvent (TTL 90d)             |
|                                                                           |
+----------------------|----------------------------------|-----------------+
                       |                                  |
                       v                                  v
+---------------------------------+    +----------------------------------+
|  MongoDB                        |    |  External (free) APIs            |
|   SafetyEvent (90d TTL)         |    |   Nominatim (reverse geocode)    |
|   ConsentRecord (account+7y)    |    |   Overpass (OSM places)          |
|   Conversation, Message, User   |    |   OSM tile server (Leaflet map)  |
+---------------------------------+    +----------------------------------+
```

---

## 3. File inventory

Every file added or modified for this pipeline, grouped by location, with what it does and what it exports.

### Backend: configuration

#### `backend/config/emergency_config.json`
**Purpose**: single source of truth for emergency numbers, crisis lines, and category-aware routing per country. New countries are added by appending one JSON block. No code change required.

Top-level keys:
- `default_country` (string, ISO-2): country to use when location and locale both fail. Set to `"PK"` for the Pakistani audience.
- `default.primary` (object): universal last-resort number if even the default_country block is missing.
- `countries[CC]`: per-country block with `primary`, optional `police`, `ambulance`, `non_emergency`, `category_routes`, and `crisis_lines`.
- `countries[CC].category_routes[CATEGORY]`: maps a detected crisis category to its own primary number and the OSM place category to search.

### Backend: Mongoose models

#### `backend/models/SafetyEvent.js`
**Purpose**: append-only crisis-detection log. PII-free by schema (no message text, no exact coords). 90-day TTL via MongoDB index.

Schema fields: `schemaVersion`, `hashedSessionId`, `hashedUserId`, `ts`, `severity`, `category`, `confidence`, `triggeringRuleIds`, `classifierScore` (null at v1), `windowTurnCount`, `language`, `clientCountry`, `actionRecommended`.

Statics: `VALID_SEVERITIES`, `VALID_CATEGORIES`, `VALID_ACTIONS`.

#### `backend/models/ConsentRecord.js`
**Purpose**: append-only consent ledger. Legal evidence of consent grants, denials, revocations. Never deleted, never mutated. Retention: account lifetime + 7 years.

Schema fields: `hashedUserId`, `ts`, `scope`, `state`, `uiSurface`, `locale`, `policyVersion`.

Valid scopes: `precise_location_oneshot`, `emergency_feature_general`, `crisis_telemetry`, `share_with_emergency_contact`.

### Backend: safety services

#### `backend/services/safety/hash.js`
**Purpose**: daily-salted SHA-256 hashes for session/user IDs. Salt rotates every UTC day so hashes from day N cannot be linked to day N+1.

Exports: `hashId(rawId, date?)`, `dailySalt(date?)`.

#### `backend/services/safety/redaction.js`
**Purpose**: PII scrubber. Removes phone numbers, emails, lat/lng pairs, and long digit runs from any string before it leaves the trust boundary.

Exports: `redact(text)`, `redactDeep(value)`.

#### `backend/services/safety/cache.js`
**Purpose**: small in-memory TTL cache for places + reverse-geocode results. Single-process only at v1. Marked for Redis swap when scaling.

Exports: `TTLCache` class with `get`, `set`, `delete`, `clear`, `size`.

#### `backend/services/safety/rules.js`
**Purpose**: the rule library. 27 rules across self-harm, obstetric, infant, and domestic violence categories in English, Roman-Urdu, and Urdu script. Handles negation suppression, third-person and hypothetical downgrade (except for DV, which inherently mentions a third-party actor), and tie-break by category specificity.

Exports: `evaluateWindow(text)`, `RULES` (read-only for tests), `NEGATION_WINDOW`.

#### `backend/services/safety/detectionService.js`
**Purpose**: top-level detection entry point. Validates the request shape, takes the **latest user turn only**, runs `rules.evaluateWindow`, and assembles the `SafetyEvent` payload. Classifies latest turn only so that prior crises do not "stick" when the user moves on.

Exports: `detect({session_id, turns, locale?, client_country?})`, plus constants `MAX_TURNS`, `MAX_TURN_CHARS`, `WINDOW_SIZE`.

#### `backend/services/safety/emergencyLookup.js`
**Purpose**: resolves a country (from explicit param or reverse-geocoded lat/lng) into emergency contacts. Backed by `emergency_config.json` with Nominatim caching. Also exposes `resolveCategoryRoute` for picking the right primary number per detected category.

Exports: `lookup({country?, lat?, lng?, fetchImpl?})`, `loadConfig()`, `resolveCountryFromCoords(lat, lng, opts?)`, `resolveCategoryRoute(contacts, category)`.

#### `backend/services/safety/placeAdapter.js`
**Purpose**: nearby-place finder, backed by OSM Overpass. Builds category-specific tag-filter queries (mental_health, maternity, pediatric, police, general). Handles radius expansion, ranking, dedup, and 503 on hard provider failure.

Exports: `findPlaces({lat, lng, category?, radius_m?, limit?, fetchImpl?})`, `parseOverpass(json, userLat, userLng)`, `rank(results)`, `haversineM(lat1, lng1, lat2, lng2)`, `VALID_CATEGORIES`.

Internal: `PLACE_QUERIES` constant (the one place where category-to-OSM-tag mapping lives).

#### `backend/services/safety/consentService.js`
**Purpose**: append-only writes to the consent ledger.

Exports: `record({hashedUserId, scope, state, uiSurface?, locale?, policyVersion?})`, `currentState(hashedUserId, scope)`, `POLICY_VERSION` constant.

#### `backend/services/safety/telemetry.js`
**Purpose**: PII-scrubbed event ingest. Allow-listed event names and per-event attribute keys. Hashes raw `session_id` server-side with daily salt. Persists `safety.detection.fired` events to `SafetyEvent` collection; everything else logged to console for now.

Exports: `ingest(events)`, `VALID_EVENT_NAMES`, `ALLOWED_ATTRS`, `PROHIBITED_KEYS`.

### Backend: chat integration

#### `backend/services/chatService.js`  (modified)
**What changed**: after the LLM reply is saved, `sendMessage` now also calls `detectionService.detect()` on the recent user turns and attaches the result as `safety` on the return value. Detection failures never break chat. Also accepts an optional `clientContext` argument (`client_country`, `client_city`) and forwards it to `buildSystemPrompt`.

Key exported function: `sendMessage(groq, conversationId, email, userMessage, idempotencyKey?, clientContext?)`.

#### `backend/services/promptRouter.js`  (modified)
**What changed**: `SAFETY_PREAMBLE` extended with an EMERGENCY FEATURES section explicitly telling the LLM that the app HAS detection, Crisis Sheet, and a place map. The LLM is told not to say "I cannot help with real-time location" and is given local emergency numbers for PK / US / UK. `buildSystemPrompt` now also accepts `client_country` and `client_city` and appends a coarse location line.

Key exported function: `buildSystemPrompt({user, mode, intake, currentWeek, client_country?, client_city?})`, plus `SAFETY_PREAMBLE`.

### Backend: routes

#### `backend/routes/safety.js`
**Purpose**: thin Express router for the 5 safety endpoints.
- `POST /detect` -> `detectionService.detect`
- `GET  /emergency/lookup` -> `emergencyLookup.lookup`
- `GET  /places/nearby` -> `placeAdapter.findPlaces`
- `POST /consent` -> `consentService.record`
- `POST /telemetry/safety` -> `telemetry.ingest`

#### `backend/routes/conversations.js`  (modified)
**What changed**: `POST /:id/messages` now reads optional `client_country` and `client_city` from the request body, validates `client_country` against `^[A-Za-z]{2}$`, builds a `clientContext` object, forwards it to `chatService.sendMessage`, and returns the `safety` field on the response.

#### `backend/server.js`  (modified)
**What changed**: registers `routes/safety` under `/api/safety`.

### Backend: tests

#### `backend/tests/safety.test.js`
**Purpose**: standalone Node assertion suite. No test framework dependency. Covers rules (positive, negation, third-person, hypothetical, Urdu, infant vomiting blood, DV present-tense + weapon), detection service (no message text echoed back, input validation, latest-turn classification, topic-shift, no category stick on benign turn), hash (daily rotation, format), redaction, emergencyLookup (PK / US / GB explicit, default_country fallback, resolveCategoryRoute), placeAdapter (parse, dedup, ranking, cache per category, 503 path, query routing per category), and telemetry allow-list.

Run via `npm test` or `npm run test:safety`.

### Frontend: contexts

#### `contexts/LocationContext.js`
**Purpose**: app-wide foreground location, held in memory only. On mount, requests permission via `expo-location` (loaded lazily so the app still builds before the dep is installed). On grant, calls the backend `/emergency/lookup?lat=&lng=` to get the country, then sets context state. Never writes to disk.

Exports: `LocationProvider` component, `useLocation()` hook returning `{ location, status, refresh }`.

Status values: `idle`, `requesting`, `granted`, `denied`, `error`.

### Frontend: services

#### `services/safetyApi.js`
**Purpose**: thin REST client for the backend safety endpoints. Never throws on telemetry (fire-and-forget).

Exports:
- `lookupEmergency({country?, lat?, lng?})`
- `findNearby({lat, lng, category?, radius_m?, limit?})`
- `sendTelemetry(events, sessionId?)`
- `detect({session_id, turns, locale?, client_country?})`

### Frontend: components

#### `components/CrisisSheet.js`
**Purpose**: the four-stage Modal that handles the entire user-facing flow. State machine: `soft_checkin` -> `crisis_sheet` -> `location_ask` -> `places`. Reads `useLocation()` so it can skip the location consent stage when the app-level grant already exists. Maps category to: the right primary number, the right "Find nearest ..." label, and the right empty-state copy via a single `CATEGORY_UI` constant. Renders the in-app map via `react-native-webview` + Leaflet + OSM tiles. Sends telemetry at every step.

Exports: `CrisisSheet` (default).

Subcomponents and helpers (internal): `CallButton`, `SecondaryButton`, `SafetyFooter`, `pickCrisisLine`, `formatPrimaryLabel`, `formatDistance`, `requestOneShotLocation`, `buildLeafletHtml`.

### Frontend: app entry

#### `App.js`  (modified)
**What changed**: wraps `NavigationContainer` with `LocationProvider` (inside `UserProvider`), so the location request runs once on app launch and is available to every screen.

#### `AIChatScreen.js`  (modified)
**What changed**: imports `CrisisSheet`, `sendTelemetry`, and `useLocation`. Reads `appLocation` from context and sends `client_country` with every message. After every chat response, checks `response.safety.action_recommended` and opens the Crisis Sheet for `confirm_then_offer_call` or `immediate_offer_call`. Fires `safety.detection.fired` telemetry at that moment. The Crisis Sheet is rendered at the bottom of the JSX tree.

### Docs

#### `docs/SAFETY_DESIGN.md`
This document.

---

## 4. Crisis Sheet state machine

```
                          (visible = true)
                                 |
                                 v
                   +-------------------------------+
                   |        soft_checkin           |
                   |  "Are you safe right now?"    |
                   +-------------------------------+
                   |                               |
        action ==  | "immediate_offer_call"        | action == "confirm_then_offer_call"
                   |                               |
                   v                               v
   primary: [Call <emergency>]            primary: [I need help]
   secondary: [Find nearest ...]          secondary: [I'm okay, keep chatting]
   tertiary: [I'm okay]                            |
                   |                               | tap "I need help"
   tap [Find nearest ...]                          v
                   |                   +-----------------------------+
                   |                   |        crisis_sheet         |
                   |                   |  primary: [Call <number>]   |
                   |                   |  [Find nearest <category>]  |
                   |                   |  [Talk to <crisis line>]    |
                   |                   |  [I'm safe - close this]    |
                   |                   +-----------------------------+
                   |                               |
                   |                               | tap [Find nearest ...]
                   v                               v
              if appLocation grant exists ----> skip to "places"
                              else
                              v
                   +-------------------------------+
                   |        location_ask           |
                   |  "Share location once?"       |
                   |  [Share location] [Not now]   |
                   +-------------------------------+
                              |
                  grant       |       deny
                              v
                   +-------------------------------+
                   |           places              |
                   |  WebView + Leaflet map        |
                   |  Ranked list of places        |
                   |  (Call / Map per row)         |
                   |  primary: [Call <number>]     |
                   |  [Talk to <crisis line>]      |
                   |  [I'm safe - close this]      |
                   +-------------------------------+
                              |
                              | onClose
                              v
                          (visible = false)
```

Every stage shows the always-visible safety footer: "If you are in immediate danger, please call <number> now." plus the legal disclaimer "Wombly is not a substitute for medical care or emergency services."

---

## 5. Step-by-step flows

### 5.1 Normal (non-crisis) chat flow

1. User opens chat in `AIChatScreen`.
2. `LocationProvider` (already mounted at app launch via `App.js`) has either granted, denied, or is still in `requesting` state. Chat does not block on it.
3. User types "What should I eat in trimester 2?" and taps Send.
4. `AIChatScreen.sendMessageMultiConv` POSTs to `/api/conversations/:id/messages` with `{ email, message, client_country }`.
5. `routes/conversations.js` validates and calls `chatService.sendMessage(..., clientContext)`.
6. `chatService` builds the system prompt with the user's country added, runs the Groq LLM, saves messages, and calls `detectionService.detect()` on the recent user window.
7. Rules find no matches. `safety.action_recommended` is `"none"`.
8. Response returned with `reply` and `safety` (severity `none`).
9. Frontend appends bot reply to the chat. Because action is `none`, no Crisis Sheet.

### 5.2 Crisis detected flow (self-harm in Pakistan)

1. User types "I want to kill myself" and taps Send.
2. Same backend path. `rules.evaluateWindow` finds `sh.en.explicit.kill_myself` (hard).
3. `detectionService` returns `severity=high`, `category=self_harm`, `action_recommended=confirm_then_offer_call`.
4. Response: `{ reply, safety: { ..., action_recommended: "confirm_then_offer_call" } }`.
5. `AIChatScreen` fires `safety.detection.fired` telemetry, sets `crisisOpen=true`, `crisisAction="confirm_then_offer_call"`, `crisisCategory="self_harm"`.
6. `CrisisSheet` opens at stage `soft_checkin`. Empathetic message + [I need help] / [I'm okay, keep chatting].
7. In parallel, the Sheet calls `lookupEmergency({lat, lng})` (or with no args, falling back to `default_country=PK`) and gets the PK block plus `category_routes`.
8. `category_routes.self_harm.primary` resolves to Umang Helpline 0311-7786264. `place_category` resolves to `mental_health`.
9. User taps [I need help] -> stage `crisis_sheet`.
10. Sheet shows: [Call Umang Helpline - 0311-7786264], [Find nearest mental health support], [Talk to Rozan Counselling], [I'm safe - close this].
11. User taps [Find nearest mental health support]. Because `LocationProvider` already granted, skip the consent step and go straight to fetching places.
12. `findNearby({lat, lng, category: "mental_health"})` hits `/api/safety/places/nearby?...&category=mental_health`. Backend builds the mental-health Overpass query (psychotherapists, psychiatrists, hospitals with psychiatry speciality), expands radius if fewer than 3 results, ranks, returns.
13. Sheet renders the Leaflet map (WebView) above a list of up to 5 ranked places. Each row has Call and Directions (deep link to system maps app).
14. User can tap Call on a place (`tel:<phone>`), or tap Map for directions, or dismiss with "I'm safe - close this".

### 5.3 Topic shift mid-conversation (no category stick)

1. User says "I want to kill myself" -> Crisis Sheet opens with `self_harm` category. User dismisses.
2. User then types "my toddler is vomiting blood" in the same conversation.
3. `detectionService` classifies only the **latest user turn** (not the joined window).
4. `inf.en.vomiting_blood` fires. Tiebreak prefers `infant_distress` because the rule requires a child/toddler subject.
5. `category_routes.infant_distress.primary` resolves to Rescue 1122. `place_category` resolves to `pediatric`.
6. Crisis Sheet opens fresh with the right number AND a path to paediatric hospitals on a map. The earlier `self_harm` does not stick.

### 5.4 Time-critical crisis flow (infant not breathing)

1. User types "my baby isn't breathing".
2. Rules fire `inf.en.not_breathing` (hard). Category `infant_distress`. Action is `immediate_offer_call` (the category is in the immediate set: `obstetric_emergency` and `infant_distress`).
3. `CrisisSheet` opens at `soft_checkin` but the layout is different: the big button is **[Call 1122]** directly, with **[Find nearest paediatric hospital]** as a strong secondary, plus the small [I'm okay] dismiss.
4. The user does not have to tap "I need help" first. One tap calls. A second tap surfaces the map.

### 5.5 Domestic violence flow

1. User types "my husband beats me" or "HE IS COMING WITH A BELT".
2. Rules: `dv.en.physical_violence` for present-tense "beats", or `dv.en.weapon_imminent` for the weapon threat. DV rules do not get downgraded by the third-person check because the third-party actor IS the abuser in DV semantics (the fix that closed the "my husband" downgrade bug).
3. Category `domestic_violence`. `action_recommended=confirm_then_offer_call`.
4. `category_routes.domestic_violence.primary` resolves to Police 15 in PK. `place_category` resolves to `police`.
5. Crisis Sheet:
   - Stage `crisis_sheet`: [Call Police - 15], [Find nearest police station], [Talk to Rozan Counselling - 0304-1111741] (topic-matched DV crisis line), [I'm safe].
6. The Overpass query searches `amenity=police` near the user.

### 5.6 App-load location flow

1. `App.js` mounts and renders `<LocationProvider>` around the navigation tree.
2. `LocationProvider` calls `expo-location.requestForegroundPermissionsAsync()` on mount.
3. If the OS already granted previously, the prompt is silent. If it's the first time, the OS shows its own permission dialog.
4. On grant, `getCurrentPositionAsync({ accuracy: Balanced })` returns coords.
5. The provider fetches `/api/safety/emergency/lookup?lat=&lng=` to enrich the coords with an ISO-2 country.
6. Context state becomes `{ location: { lat, lng, country }, status: "granted" }`.
7. Every component that calls `useLocation()` now has the coords.
8. `AIChatScreen` sends `client_country` with every chat message; the LLM gets a "User's country: PK" line in its system prompt and stops claiming inability.
9. `CrisisSheet` reads `useLocation()`. If granted, it skips its own location prompt and goes straight to `places` when the user taps "Find nearest ...".
10. The coords live in memory for the app session only. On app close, they're gone. Nothing is persisted to disk.

### 5.7 Telemetry funnel

Every Crisis Sheet open emits a sequence of events. Backend hashes the raw `session_id` (conversation id) with the daily salt before any logging or persistence.

```
   message sent
       |
       v
   safety.detection.fired             { severity, category, language, country }
       |
       v
   safety.confirmation.shown
       |
       +-- user taps "I'm okay" ---> safety.confirmation.response { response: "no" }
       |                                  |
       |                                  v
       |                              (sheet closes)
       |
       +-- user taps "I need help" -> safety.confirmation.response { response: "yes" }
                                          |
                                          v
                                     safety.crisis_sheet.shown
                                          |
       +--- tap Call ---> safety.call_button.tapped { number_kind: "emergency"|"crisis_line"|"hospital" }
       |
       +--- tap Find nearest ---> safety.location.requested
                                          |
                                          +-- granted ---> safety.location.granted
                                          |                       |
                                          |                       v
                                          |                  safety.hospitals.shown { count }
                                          |                       |
                                          |                       +-- tap Map row ---> safety.hospitals.directions_tapped
                                          |
                                          +-- denied ----> safety.location.denied
```

Only `safety.detection.fired` is persisted (as a `SafetyEvent` row, 90d TTL). The rest is logged to stdout in v1 and would route to an analytics pipe in Phase 4.

---

## 6. Detection rules reference

Rules live in `backend/services/safety/rules.js` and are organised by `id` prefix.

### Self-harm (`sh.*`)

| id | Language | Tier | Example trigger |
|---|---|---|---|
| `sh.en.explicit.kill_myself` | English | hard | "I want to kill myself" |
| `sh.en.explicit.end_my_life` | English | hard | "I want to end my life" |
| `sh.en.explicit.suicide_ideation` | English | hard | "I want to die", "wanna die", "suicidal" |
| `sh.en.passive.dont_want_to_wake` | English | hard | "I don't want to wake up" |
| `sh.en.passive.disappear` | English | soft | "better off dead", "disappear forever" |
| `sh.ur.roman.khudkushi` | Roman-Urdu | hard | "khudkushi" |
| `sh.ur.roman.mar_jaun` | Roman-Urdu | hard | "marna chahti", "mar jaun" |
| `sh.ur.script.khudkushi` | Urdu | hard | contains "خودکشی" |
| `sh.ur.script.mar_jaun` | Urdu | hard | "مرنا چاہتی", "مر جاؤں" |

### Obstetric emergency (`obs.*`)

| id | Language | Tier | Example trigger |
|---|---|---|---|
| `obs.en.heavy_bleeding` | English | hard | "bleeding heavily", "heavy bleeding", "soaking a pad" |
| `obs.en.severe_headache_vision` | English | hard | "severe headache" + "blurry vision" |
| `obs.en.no_fetal_movement` | English | hard | "baby isn't moving", "baby stopped kicking" |
| `obs.en.water_broke_early` | English | hard | "water broke" |
| `obs.en.severe_abdominal_pain` | English | hard | "severe abdominal pain" |
| `obs.ur.roman.bleeding` | Roman-Urdu | hard | "khoon bohat", "zyada khoon" |
| `obs.ur.script.bleeding` | Urdu | hard | "زیادہ خون", "بہت خون" |

### Infant distress (`inf.*`)

| id | Language | Tier | Example trigger |
|---|---|---|---|
| `inf.en.not_breathing` | English | hard | "my baby isn't breathing", "toddler not breathing" |
| `inf.en.vomiting_blood` | English | hard | "my toddler is vomiting blood", "baby threw up blood" |
| `inf.en.bleeding` | English | hard | "my baby is bleeding heavily" |
| `inf.en.severe_dehydration` | English | hard | "hasn't eaten in 12 hours", "won't wake to feed" |
| `inf.en.blue_lips` | English | hard | "blue lips", "purple face" |
| `inf.en.unresponsive` | English | hard | "baby unresponsive", "won't wake" |
| `inf.en.seizure` | English | hard | "baby" + "seizure"/"convulsion"/"fit" |
| `inf.ur.roman.saans` | Roman-Urdu | hard | "bachi saans nahi" |

### Domestic violence (`dv.*`)

| id | Language | Tier | Example trigger |
|---|---|---|---|
| `dv.en.physical_violence` | English | hard | "he hit me", "my husband beats me", "he is beating me" |
| `dv.en.afraid_of_him` | English | hard | "scared of my husband", "afraid of him" |
| `dv.en.threatening` | English | hard | "threatened to kill me" |
| `dv.en.weapon_imminent` | English | hard | "HE IS COMING WITH A BELT", "coming at me with a knife" |
| `dv.en.weapon_present` | English | hard | "my husband has a knife" |
| `dv.en.locked_in_trapped` | English | hard | "he locked me in", "won't let me leave" |
| `dv.en.abuse_general` | English | soft | "domestic abuse", "abusive partner" |
| `dv.ur.roman.maara` | Roman-Urdu | hard | "shohar ne maara" |

### Cross-cutting logic

- **Negation suppression**: if a negation token ("never", "wouldn't", "won't", "nahi", "نہیں") appears within 4 tokens before a match, the rule is suppressed. Applies to rules with `requiresFirstPerson: true`.
- **First-person requirement**: some self-harm rules require an `I`/`me`/`myself`/`میں`/`مجھے` somewhere in the text.
- **Third-person downgrade**: phrases like "my friend", "my sister", "she said" downgrade hard hits to soft hits. **Exception**: domestic_violence rules are exempt because their pattern inherently mentions a third-party actor (the abuser).
- **Hypothetical downgrade**: phrases like "what if", "hypothetically", "in a movie" downgrade hard hits to soft hits (DV exempt as above).
- **Category tie-break**: if two categories have the same hit count, priority order is `infant_distress > domestic_violence > self_harm > obstetric_emergency`. The more specific category wins. Example: "my baby is bleeding heavily" matches both `obs.en.heavy_bleeding` (generic) and `inf.en.bleeding` (specific subject); infant wins.
- **Severity to action mapping**:
  - All `none`/`low` -> action `none`.
  - `medium` -> action `soft_resource`.
  - `high` + category in {`obstetric_emergency`, `infant_distress`} -> `immediate_offer_call`.
  - `high` otherwise -> `confirm_then_offer_call`.

---

## 7. Emergency configuration reference

`backend/config/emergency_config.json` schema:

```
{
  "schema_version": "1.1",
  "default_country": "PK",
  "default": {
    "primary": { "number": "112", "label": "Emergency (GSM universal)" }
  },
  "countries": {
    "PK": {
      "primary":   { "number": "1122", "label": "Rescue 1122" },
      "police":    { "number": "15" },
      "ambulance": { "number": "115", "label": "Edhi Ambulance" },
      "category_routes": {
        "self_harm":           { "primary": {...}, "place_category": "mental_health" },
        "obstetric_emergency": { "primary": {...}, "place_category": "maternity" },
        "infant_distress":     { "primary": {...}, "place_category": "pediatric" },
        "domestic_violence":   { "primary": {...}, "place_category": "police" }
      },
      "crisis_lines": [
        { "name": "...", "number": "...", "hours": "...", "languages": ["..."], "topic": "general|postpartum|dv|infant" }
      ]
    }
  }
}
```

Resolution chain for `lookup()`:

1. If `country` query param is given and valid, use it.
2. Else if `lat` and `lng` given, reverse-geocode via Nominatim (cached 30 days per geohash5).
3. Else use `default_country` (currently `"PK"`).
4. If the resolved country has no block, fall through to `default.primary` (`112`).

Per-category place categories map to OSM tag unions in `placeAdapter.js`:

| `place_category` | OSM tag union |
|---|---|
| `general` | `amenity=hospital` or `amenity=clinic` |
| `mental_health` | `healthcare~"psychotherapist|psychiatrist"` plus `amenity=hospital` with `healthcare:speciality~"psychiatry|mental_health"` |
| `maternity` | `amenity=hospital` with `healthcare:speciality~"obstetrics|gynaecology|maternity"`, fallback `amenity=hospital` |
| `pediatric` | `amenity=hospital` with `healthcare:speciality~"paediatrics|pediatrics"`, fallback `amenity=hospital` |
| `police` | `amenity=police` |

---

## 8. API endpoints reference

Base path: `/api/safety` (registered in `backend/server.js`).

### POST /api/safety/detect
Standalone classifier. Used when you want to classify outside the chat flow. The chat endpoint already attaches `safety` automatically.

Request body:
```
{
  "session_id": "uuid or conv id",
  "turns": [ { "role": "user"|"assistant", "text": "...", "ts": "ISO date" } ],
  "locale": "en-PK",
  "client_country": "PK"
}
```

Response: a `SafetyEvent` object (see schema in `models/SafetyEvent.js`). Never echoes back the message text.

### GET /api/safety/emergency/lookup
Returns the resolved emergency contacts.

Query params: `country` (optional ISO-2), `lat`, `lng` (optional floats).

Response:
```
{
  "country": "PK",
  "resolved_via": "query_param" | "reverse_geocode" | "default_country" | "default_fallback",
  "primary": { "number": "1122", "label": "Rescue 1122" },
  "police": { "number": "15" },
  "ambulance": { "number": "115", "label": "Edhi Ambulance" },
  "non_emergency": { ... },
  "category_routes": { ... },
  "crisis_lines": [ ... ]
}
```

### GET /api/safety/places/nearby
Returns ranked nearby places for a category.

Query params: `lat` (required), `lng` (required), `category` (`general` | `mental_health` | `maternity` | `pediatric` | `police`, default `general`), `radius_m` (default 5000), `limit` (default 5).

Response: `{ query_id, results: HospitalResult[], source_mix: { osm: N }, category }`.

On hard provider failure: 503 with `{ fallback_message }`.

### POST /api/safety/consent
Records a consent grant/denial/revocation.

Request body: `{ hashed_user_id, scope, state, ui_surface?, locale?, policy_version? }`.

Response: `{ consent_id }` (201 Created).

### POST /api/safety/telemetry/safety
Batch-ingests PII-scrubbed events.

Request body: `{ events: [ { name, ts, session_id, attrs } ] }`. Max 50 per batch.

Response: `{ accepted, rejected }` (202 Accepted).

### POST /api/conversations/:id/messages  (modified, not new)
This is the existing chat endpoint, now augmented.

Request body adds: `client_country` (optional ISO-2), `client_city` (optional string, max 80 chars).

Response adds: `safety` (a `SafetyEvent` object, or `null` if detection errored).

---

## 9. Tests

`backend/tests/safety.test.js`. Run with `npm test` from the `backend` directory.

The suite uses plain Node `assert` (no test framework). It covers:

**Rules**
- self-harm explicit hard hit
- negation suppresses
- third-person "kill herself" not matched
- third-person downgrades hard to soft
- hypothetical downgrades
- Urdu script self-harm
- Roman-Urdu self-harm
- obstetric heavy bleeding
- obstetric headache + vision
- infant not breathing
- infant vomiting blood
- infant bleeding heavily
- DV past-tense (hit me)
- DV present-tense (husband beats me)
- DV progressive (he is beating me)
- DV imminent weapon threat
- DV weapon present
- benign chat untouched
- empty / null safe
- confidence in expected range

**Detection service**
- returns valid SafetyEvent shape (UUID, sha-256 hashed session id)
- no message text echoed back
- input validation rejects bad shapes
- classifies latest user turn (window_turn_count = 1)
- topic-shift to new emergency (no category stick)
- prior crisis does not stick when latest turn is benign

**Hash**
- same-day stability
- cross-day rotation
- null / undefined safe
- format (sha-256 hex, 64 chars)
- `dailySalt` format includes UTC date

**Redaction**
- basic patterns (email, phone, coords, long digits)
- `redactDeep` recurses

**Emergency lookup**
- explicit PK / US / GB
- explicit unknown country -> 112
- no args -> default_country PK (1122)
- PK category_routes correct
- `resolveCategoryRoute` fallbacks
- reverse-geocode via injected fetch
- Nominatim 5xx -> default_country PK

**Place adapter**
- haversine distance
- `parseOverpass`
- `parseOverpass` empty
- ranking weights
- `findPlaces` caches by geohash7 + category
- `buildOverpassQuery` routes by category
- cache key separates by category
- 503 on provider failure
- validates lat/lng
- dedups union duplicates

**Telemetry allow-list**
- event name allow-list
- detection.fired doesn't allow text/message attrs
- PII keys explicitly prohibited

---

## 10. Setup and run

### Backend

```
cd backend
npm install
npm start            # or: npm run dev for nodemon
npm test             # runs both chatService and safety tests
npm run test:safety  # safety tests only
```

The backend listens on `PORT` (default 5000). MongoDB connection comes from `MONGODB_URI`.

### Frontend (Expo)

```
npx expo install expo-location   # one-time, required for LocationProvider
npx expo start
```

`LocationContext.js` lazy-requires `expo-location`, so the app still builds before this install; location-dependent UI just stays in the `denied`/`error` state until the package is present.

### One-shot manual sanity test (no UI)

```
curl -X POST http://localhost:5000/api/safety/detect \
  -H "Content-Type: application/json" \
  -d '{"session_id":"smoke","turns":[{"role":"user","text":"I want to kill myself","ts":"2026-05-20T00:00:00Z"}]}'
```

Expected: `severity: "high"`, `category: "self_harm"`, `action_recommended: "confirm_then_offer_call"`.

---

## 11. Privacy posture

- No raw message text in logs, ever. Telemetry stores only event names + bounded, allow-listed attrs.
- All session and user IDs in telemetry are SHA-256 hashed with a daily-rotating salt. Hashes from day N are not linkable to day N+1.
- Precise lat/lng never leaves `/api/safety/emergency/lookup` or `/api/safety/places/nearby`. The chat API only ever receives coarse country (ISO-2).
- Precise location is never persisted on the device (no AsyncStorage write) and never persisted in MongoDB. The `LocationProvider` holds coords in memory for the session only.
- `SafetyEvent` rows expire after 90 days (MongoDB TTL index).
- `ConsentRecord` rows are append-only, never mutated, retained for account lifetime + 7 years (legal evidence).
- PII regex scrubber (`redaction.js`) sits at the trust boundary and removes phone, email, coords, and long digit runs from any string passed through it.
- `tel:` deep-link only. Never `ACTION_CALL`. Every call is a user tap.
- Foreground location only. No background location, no location services for any non-emergency purpose.

---

## 12. Known limitations

- OSM coverage of smaller clinics in Pakistan is patchy. The Crisis Sheet's empty-state copy ("No paediatric hospital found nearby. Please call the emergency number.") handles this, but the user sees no list when this happens.
- The classifier is rules-only at v1. A Haiku-class LLM classifier hook (`classifier_score` in `SafetyEvent`) is reserved for v2 once labeled data exists.
- The location prompt on app launch is OS-level (no in-app pre-rationale screen). If a user denies the OS prompt, they can still grant later through the Crisis Sheet's own consent stage.
- Telemetry beyond `safety.detection.fired` is currently logged to stdout. Wiring to a real analytics pipe is Phase 4.
- Only English / Roman-Urdu / Urdu detection at v1. Adding a new language is one entry per category in `rules.js`.
- In-memory caches (`TTLCache`) and an in-memory `LocationContext` mean this is single-process at v1. Redis swap and a multi-instance plan are documented but not implemented.

---

## 13. Changelog

**v1.2 (2026-05-20)**
- Detection now classifies the **latest user turn only**. Fixes the "category sticks" bug where an earlier crisis kept firing when the user moved on.
- Added infant rules for vomiting blood, bleeding, severe dehydration.
- Added DV rules for present-tense ("beats"), progressive ("is beating"), and weapon threats. Domestic_violence rules exempt from third-person downgrade.
- Added category tie-break (`infant_distress > domestic_violence > self_harm > obstetric_emergency`) so more specific subjects win over generic patterns.
- Crisis Sheet `immediate_offer_call` now shows both Call and Find-nearest from the soft check-in, no two-step tap required.
- Dropped `navigator.language` country guess (returned en-US in Expo Go regardless of user). Backend default_country resolves first call until real coords arrive.
- New `LocationProvider` context. Foreground location requested once on app mount, kept in memory only, available to both Crisis Sheet and chat.
- System prompt now mentions the app's emergency features, location awareness, and per-country numbers. The LLM stops claiming inability to help with hospitals or location.
- `client_country` plumbed from app -> chat route -> chatService -> promptRouter.

**v1.1 (2026-05-18)**
- Category-aware routing. Each country block now has `category_routes` keyed by detected crisis category; each route specifies its own `primary` contact and `place_category`.
- Top-level `default_country: "PK"` for the Pakistani audience.
- `/places/hospitals` renamed to `/places/nearby` and made category-driven.
- In-app Leaflet map (WebView + OSM tiles) added.

**v1.0 (2026-05-18)**
- Initial design: rules-only detection, OSM-only places, single-tier emergency routing.
