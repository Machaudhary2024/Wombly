/**
 * Unit tests for the safety pipeline.
 * Run with: node tests/safety.test.js
 * No DB required - all DB-touching paths are isolated to consentService/telemetry,
 * which are exercised at the route/integration level (out of scope here).
 *
 * No test-framework dependency - uses Node's built-in `assert`.
 */

const assert = require("assert");

// ============================================================================
// rules.evaluateWindow
// ============================================================================
const { evaluateWindow } = require("../services/safety/rules");

function testRules() {
  console.log("--- rules.evaluateWindow ---");

  // Self-harm hard hit
  {
    const r = evaluateWindow("I just want to kill myself, I can't do this anymore.");
    assert.strictEqual(r.severity, "high", "explicit SI must be high");
    assert.strictEqual(r.category, "self_harm");
    assert.strictEqual(r.actionRecommended, "confirm_then_offer_call");
    assert.ok(r.triggeringRuleIds.length >= 1, "should fire at least one rule");
    console.log("  PASS: self-harm explicit hard hit");
  }

  // Negation must NOT fire
  {
    const r = evaluateWindow("I'd never kill myself, just venting honestly");
    assert.strictEqual(r.severity, "none", "negated phrase must not fire");
    assert.strictEqual(r.triggeringRuleIds.length, 0);
    console.log("  PASS: negation suppresses");
  }

  // Third-person should downgrade hard → soft
  {
    const r = evaluateWindow("My sister tried to kill herself last year.");
    // "kill myself" rule won't fire here because it's "kill herself".
    // But "suicide" rules around third person would downgrade. This phrase shouldn't
    // even fire our patterns - so severity should be none. Verify that.
    assert.strictEqual(r.severity, "none", "third-person specific phrasing shouldn't fire kill_myself rule");
    console.log("  PASS: third-person 'kill herself' not matched");
  }

  // Third-person + first-person-required rule should be skipped
  {
    const r = evaluateWindow("My friend keeps saying she wants to die.");
    // 'wants to die' is a first-person-flexible pattern; third-person marker downgrades.
    if (r.severity === "high") {
      assert.fail("third-person hypothetical should downgrade to soft");
    }
    console.log("  PASS: third-person downgrades hard to soft");
  }

  // Hypothetical "what if"
  {
    const r = evaluateWindow("What if someone wanted to commit suicide, hypothetically?");
    assert.notStrictEqual(r.severity, "high", "hypothetical should downgrade");
    console.log("  PASS: hypothetical downgrades");
  }

  // Urdu script explicit
  {
    const r = evaluateWindow("میں خودکشی کرنا چاہتی ہوں");
    assert.strictEqual(r.severity, "high", "Urdu khudkushi must fire high");
    assert.strictEqual(r.category, "self_harm");
    console.log("  PASS: Urdu script self-harm");
  }

  // Roman-Urdu
  {
    const r = evaluateWindow("Main marna chahti hoon, koi raasta nahi");
    assert.strictEqual(r.severity, "high", "Roman-Urdu must fire high");
    console.log("  PASS: Roman-Urdu self-harm");
  }

  // Obstetric red flag
  {
    const r = evaluateWindow("I'm 32 weeks and bleeding heavily, soaking a pad in an hour");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "obstetric_emergency");
    assert.strictEqual(r.actionRecommended, "immediate_offer_call",
      "obstetric high should go straight to immediate_offer_call");
    console.log("  PASS: obstetric heavy bleeding");
  }

  // Obstetric severe headache + vision
  {
    const r = evaluateWindow("I have the worst headache ever and my vision is blurry.");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "obstetric_emergency");
    console.log("  PASS: obstetric headache + vision");
  }

  // Infant not breathing
  {
    const r = evaluateWindow("My baby isn't breathing right now please help");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "infant_distress");
    assert.strictEqual(r.actionRecommended, "immediate_offer_call");
    console.log("  PASS: infant not breathing");
  }

  // Infant vomiting blood - newly added rule
  {
    const r = evaluateWindow("my toddler is vomiting blood");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "infant_distress");
    console.log("  PASS: infant vomiting blood");
  }

  // Infant bleeding heavily - newly added rule
  {
    const r = evaluateWindow("my baby is bleeding heavily after a fall");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "infant_distress");
    console.log("  PASS: infant bleeding heavily");
  }

  // Domestic violence - past-tense (existing)
  {
    const r = evaluateWindow("He hit me again last night and I'm scared he'll come back");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "domestic_violence");
    console.log("  PASS: DV past-tense (hit me)");
  }

  // DV - present-tense "beats me" - newly fixed
  {
    const r = evaluateWindow("my husband beats me");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "domestic_violence");
    console.log("  PASS: DV 'husband beats me'");
  }

  // DV - progressive "is beating me" - newly fixed
  {
    const r = evaluateWindow("he is beating me right now");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "domestic_violence");
    console.log("  PASS: DV 'he is beating me'");
  }

  // DV - imminent weapon threat - newly added
  {
    const r = evaluateWindow("HE IS COMING WITH A BELT");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "domestic_violence");
    console.log("  PASS: DV imminent weapon threat");
  }

  // DV - weapon present - newly added
  {
    const r = evaluateWindow("my husband has a knife");
    assert.strictEqual(r.severity, "high");
    assert.strictEqual(r.category, "domestic_violence");
    console.log("  PASS: DV weapon present");
  }

  // Benign chat
  {
    const r = evaluateWindow("What should I eat for breakfast during my second trimester?");
    assert.strictEqual(r.severity, "none");
    assert.strictEqual(r.category, "none");
    assert.strictEqual(r.actionRecommended, "none");
    console.log("  PASS: benign chat untouched");
  }

  // Empty input
  {
    const r = evaluateWindow("");
    assert.strictEqual(r.severity, "none");
    const r2 = evaluateWindow(null);
    assert.strictEqual(r2.severity, "none");
    console.log("  PASS: empty/null safe");
  }

  // Confidence range
  {
    const r = evaluateWindow("I want to kill myself I really do, it hurts so bad");
    assert.ok(r.confidence > 0.8 && r.confidence <= 0.99, `confidence should be high, got ${r.confidence}`);
    console.log("  PASS: confidence in expected range");
  }
}

// ============================================================================
// detectionService.detect
// ============================================================================
const detectionService = require("../services/safety/detectionService");

function testDetectionService() {
  console.log("\n--- detectionService.detect ---");

  // Basic happy path
  {
    const ev = detectionService.detect({
      session_id: "550e8400-e29b-41d4-a716-446655440000",
      turns: [{ role: "user", text: "hi", ts: new Date().toISOString() }],
      locale: "en-PK",
      client_country: "PK",
    });
    assert.strictEqual(ev.schema_version, "1.0");
    assert.strictEqual(ev.severity, "none");
    assert.strictEqual(ev.classifier_score, null, "v1 must keep classifier_score null");
    assert.strictEqual(ev.language, "en-PK");
    assert.strictEqual(ev.client_country, "PK");
    assert.ok(/^[0-9a-f-]{36}$/.test(ev.event_id), "event_id should be UUID");
    assert.ok(ev.hashed_session_id && ev.hashed_session_id.length === 64, "session_id must be hashed (sha256 hex)");
    console.log("  PASS: detect returns valid SafetyEvent shape");
  }

  // No raw text echoed back
  {
    const secret = "this message contains XYZ-SECRET-PAYLOAD-9999";
    const ev = detectionService.detect({
      session_id: "s2",
      turns: [{ role: "user", text: secret, ts: new Date().toISOString() }],
    });
    const json = JSON.stringify(ev);
    assert.ok(!json.includes("XYZ-SECRET-PAYLOAD-9999"), "SafetyEvent must not echo message text");
    console.log("  PASS: no message text in returned event");
  }

  // Bad input rejected
  {
    assert.throws(() => detectionService.detect({}), /session_id required/);
    assert.throws(() => detectionService.detect({ session_id: "x", turns: [] }), /turns must be/);
    assert.throws(
      () => detectionService.detect({ session_id: "x", turns: new Array(20).fill({ role: "user", text: "a" }) }),
      /turns must be/
    );
    console.log("  PASS: input validation rejects bad shapes");
  }

  // Detection classifies the LATEST user turn only.
  // Critical: a prior crisis must NOT keep firing when the user moves on.
  {
    const turns = [
      { role: "user", text: "hi", ts: "t1" },
      { role: "assistant", text: "hello", ts: "t2" },
      { role: "user", text: "I want to kill myself", ts: "t3" },
    ];
    const ev = detectionService.detect({ session_id: "s", turns });
    assert.strictEqual(ev.severity, "high");
    assert.strictEqual(ev.category, "self_harm");
    assert.strictEqual(ev.window_turn_count, 1, "window_turn_count is now 1 (latest user turn only)");
    console.log("  PASS: classifies latest user turn");
  }

  // Topic-shift: self-harm earlier → infant emergency NOW.
  // Must report infant_distress, NOT self_harm.
  {
    const turns = [
      { role: "user", text: "I want to kill myself", ts: "t1" },
      { role: "assistant", text: "let's get you help", ts: "t2" },
      { role: "user", text: "my toddler is vomiting blood", ts: "t3" },
    ];
    const ev = detectionService.detect({ session_id: "s2", turns });
    assert.strictEqual(ev.category, "infant_distress",
      "category must follow the LATEST user turn, not the earlier one");
    assert.strictEqual(ev.severity, "high");
    console.log("  PASS: topic-shift to new emergency (no category stick)");
  }

  // Topic-shift the other way: medical → recovered → benign now should NOT fire.
  {
    const turns = [
      { role: "user", text: "my baby isn't breathing", ts: "t1" },
      { role: "assistant", text: "call 1122", ts: "t2" },
      { role: "user", text: "thanks, all good now, just wanted to chat about diet", ts: "t3" },
    ];
    const ev = detectionService.detect({ session_id: "s3", turns });
    assert.strictEqual(ev.severity, "none",
      "benign latest turn must not inherit earlier crisis verdict");
    console.log("  PASS: prior crisis does not stick when latest turn is benign");
  }
}

// ============================================================================
// hash
// ============================================================================
const { hashId, dailySalt } = require("../services/safety/hash");

function testHash() {
  console.log("\n--- hash ---");

  // Stable within the same day
  {
    const a = hashId("user-123");
    const b = hashId("user-123");
    assert.strictEqual(a, b, "same input same day must hash identically");
    console.log("  PASS: same-day stability");
  }

  // Different across days
  {
    const d1 = new Date("2026-01-01T12:00:00Z");
    const d2 = new Date("2026-01-02T12:00:00Z");
    const h1 = hashId("user-123", d1);
    const h2 = hashId("user-123", d2);
    assert.notStrictEqual(h1, h2, "salt must rotate across UTC days");
    console.log("  PASS: cross-day rotation");
  }

  // Null safety
  {
    assert.strictEqual(hashId(null), null);
    assert.strictEqual(hashId(undefined), null);
    console.log("  PASS: null/undefined returns null");
  }

  // SHA-256 hex length
  {
    const h = hashId("anything");
    assert.strictEqual(h.length, 64, "sha-256 hex must be 64 chars");
    assert.ok(/^[0-9a-f]{64}$/.test(h), "must be lowercase hex");
    console.log("  PASS: hash format");
  }

  // dailySalt format includes date
  {
    const salt = dailySalt(new Date("2026-05-18T00:00:00Z"));
    assert.ok(salt.includes("2026-05-18"));
    console.log("  PASS: dailySalt format");
  }
}

// ============================================================================
// redaction
// ============================================================================
const { redact, redactDeep } = require("../services/safety/redaction");

function testRedaction() {
  console.log("\n--- redaction ---");

  assert.strictEqual(redact("call me at +44 7700 900123"), "call me at [PHONE]");
  assert.strictEqual(redact("email me jane@example.com please"), "email me [EMAIL] please");
  assert.strictEqual(redact("at 33.6844,73.0479 now"), "at [COORDS] now");
  assert.strictEqual(redact("id 1234567 here"), "id [DIGITS] here");
  assert.strictEqual(redact(""), "");
  assert.strictEqual(redact(null), null);
  console.log("  PASS: redact basic patterns");

  const deep = redactDeep({
    msg: "ping me at jane@example.com",
    nested: { phone: "+1 555 0100", lat: 33.7, list: ["call +92 300 1234567"] },
  });
  assert.strictEqual(deep.msg, "ping me at [EMAIL]");
  assert.ok(deep.nested.phone.includes("[PHONE]"));
  assert.ok(deep.nested.list[0].includes("[PHONE]"));
  console.log("  PASS: redactDeep recurses");
}

// ============================================================================
// emergencyLookup
// ============================================================================
const emergencyLookup = require("../services/safety/emergencyLookup");

async function testEmergencyLookup() {
  console.log("\n--- emergencyLookup ---");

  // Explicit country PK
  {
    const r = await emergencyLookup.lookup({ country: "PK" });
    assert.strictEqual(r.country, "PK");
    assert.strictEqual(r.primary.number, "1122");
    assert.strictEqual(r.resolved_via, "query_param");
    assert.ok(r.crisis_lines.length >= 1, "PK should have crisis lines");
    console.log("  PASS: explicit PK");
  }

  // Explicit country US
  {
    const r = await emergencyLookup.lookup({ country: "us" });
    assert.strictEqual(r.country, "US");
    assert.strictEqual(r.primary.number, "911");
    console.log("  PASS: explicit US (case-insensitive)");
  }

  // Explicit country GB
  {
    const r = await emergencyLookup.lookup({ country: "GB" });
    assert.strictEqual(r.country, "GB");
    assert.strictEqual(r.primary.number, "999");
    assert.strictEqual(r.non_emergency.number, "111");
    console.log("  PASS: explicit GB (with NHS 111)");
  }

  // Unknown explicit country → fall back via default_country (PK at v1.1)
  {
    const r = await emergencyLookup.lookup({ country: "ZZ" });
    // ZZ is honored as the query_param country, but no block exists for it → default 112
    assert.strictEqual(r.primary.number, "112");
    console.log("  PASS: explicit unknown country -> 112 last-resort");
  }

  // No args → default_country (PK) - this is the key v1.1 behaviour for Pakistani audience
  {
    const r = await emergencyLookup.lookup({});
    assert.strictEqual(r.country, "PK");
    assert.strictEqual(r.primary.number, "1122");
    assert.strictEqual(r.resolved_via, "default_country");
    console.log("  PASS: no args -> default_country PK (1122)");
  }

  // Category routes are exposed on the country block
  {
    const r = await emergencyLookup.lookup({ country: "PK" });
    assert.ok(r.category_routes, "category_routes must be present");
    assert.strictEqual(r.category_routes.self_harm.place_category, "mental_health");
    assert.strictEqual(r.category_routes.self_harm.primary.number, "03117786264");
    assert.strictEqual(r.category_routes.domestic_violence.primary.number, "15");
    assert.strictEqual(r.category_routes.obstetric_emergency.primary.number, "1122");
    console.log("  PASS: PK category_routes correct");
  }

  // resolveCategoryRoute helper
  {
    const contacts = await emergencyLookup.lookup({ country: "US" });
    const sh = emergencyLookup.resolveCategoryRoute(contacts, "self_harm");
    assert.strictEqual(sh.primary.number, "988");
    assert.strictEqual(sh.place_category, "mental_health");

    const dv = emergencyLookup.resolveCategoryRoute(contacts, "domestic_violence");
    assert.strictEqual(dv.primary.number, "911");
    assert.strictEqual(dv.place_category, "police");

    // Unknown category → falls back to country primary
    const unk = emergencyLookup.resolveCategoryRoute(contacts, "made_up");
    assert.strictEqual(unk.primary.number, "911");
    assert.strictEqual(unk.place_category, "general");
    console.log("  PASS: resolveCategoryRoute picks correct routes + falls back");
  }

  // Reverse geocode with injected fetch
  {
    const fakeFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ address: { country_code: "pk" } }),
    });
    const r = await emergencyLookup.lookup({ lat: 33.68, lng: 73.04, fetchImpl: fakeFetch });
    assert.strictEqual(r.country, "PK");
    assert.strictEqual(r.resolved_via, "reverse_geocode");
    console.log("  PASS: reverse-geocode via injected fetch");
  }

  // Nominatim 5xx → fallback chain: reverse-geocode fails → default_country (PK)
  {
    const fakeFetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
    // Use a fresh coordinate so we don't hit the cache from previous tests
    const r = await emergencyLookup.lookup({ lat: 0.0, lng: 0.0, fetchImpl: fakeFetch });
    assert.strictEqual(r.country, "PK");
    assert.strictEqual(r.primary.number, "1122");
    assert.strictEqual(r.resolved_via, "default_country");
    console.log("  PASS: Nominatim 5xx -> default_country PK (1122)");
  }
}

// ============================================================================
// placeAdapter
// ============================================================================
const placeAdapter = require("../services/safety/placeAdapter");

function testPlaceAdapter() {
  console.log("\n--- placeAdapter ---");

  // haversine sanity (Karachi to Lahore ~1100km)
  {
    const d = placeAdapter.haversineM(24.86, 67.01, 31.55, 74.34);
    assert.ok(d > 1_000_000 && d < 1_200_000, `expected ~1.1Mm, got ${d}`);
    console.log("  PASS: haversine distance");
  }

  // Parse Overpass JSON
  {
    const json = {
      elements: [
        {
          type: "node",
          id: 1,
          lat: 33.7,
          lon: 73.05,
          tags: { name: "Test Hospital", amenity: "hospital", "contact:phone": "+92 51 1234567", opening_hours: "24/7" },
        },
        {
          type: "way",
          id: 2,
          center: { lat: 33.71, lon: 73.06 },
          tags: { name: "Clinic A", amenity: "clinic" },
        },
        { type: "node", id: 3, lat: 33.69, lon: 73.04, tags: { amenity: "hospital" } }, // no name → dropped
      ],
    };
    const parsed = placeAdapter.parseOverpass(json, 33.69, 73.05);
    assert.strictEqual(parsed.length, 2, "two named results expected");
    assert.strictEqual(parsed[0].name, "Test Hospital");
    assert.strictEqual(parsed[0].source, "osm");
    assert.strictEqual(parsed[0].open_now, true);
    assert.ok(parsed[0].phone.startsWith("+"), "phone should be normalized");
    assert.ok(parsed[0].place_id.startsWith("osm:"), "place_id should be prefixed");
    console.log("  PASS: parseOverpass");
  }

  // Empty JSON
  {
    assert.deepStrictEqual(placeAdapter.parseOverpass({ elements: [] }, 0, 0), []);
    assert.deepStrictEqual(placeAdapter.parseOverpass(null, 0, 0), []);
    console.log("  PASS: parseOverpass empty");
  }

  // Ranking - closer + open + has_phone should win
  {
    const a = { distance_m: 5000, open_now: false, phone: null };
    const b = { distance_m: 500, open_now: true, phone: "+1" };
    const c = { distance_m: 2000, open_now: null, phone: null };
    const ranked = placeAdapter.rank([a, b, c]);
    assert.strictEqual(ranked[0], b, "closer+open+phone should rank first");
    console.log("  PASS: ranking weights");
  }
}

async function testPlaceAdapterAsync() {
  // Cached path with injected fetch
  {
    placeAdapter._testHelpers.queryCache.clear();
    let calls = 0;
    const hospitals = [
      { type: "node", id: 7, lat: 33.7, lon: 73.05, tags: { name: "H1", amenity: "hospital" } },
      { type: "node", id: 8, lat: 33.71, lon: 73.06, tags: { name: "H2", amenity: "hospital" } },
      { type: "node", id: 9, lat: 33.72, lon: 73.07, tags: { name: "H3", amenity: "hospital" } },
    ];
    const fakeFetch = async () => {
      calls++;
      return { ok: true, status: 200, json: async () => ({ elements: hospitals }) };
    };
    const r1 = await placeAdapter.findPlaces({ lat: 33.7, lng: 73.05, fetchImpl: fakeFetch });
    const callsAfterFirst = calls;
    const r2 = await placeAdapter.findPlaces({ lat: 33.7, lng: 73.05, fetchImpl: fakeFetch });
    assert.strictEqual(r1.results.length, 3);
    assert.strictEqual(r2.results.length, 3);
    assert.strictEqual(r1.category, "general");
    assert.strictEqual(calls, callsAfterFirst, "second call must not hit fetch (cache hit)");
    console.log("  PASS: findPlaces caches by geohash7+category");
  }

  // Category routes to correct Overpass query
  {
    const cases = [
      { category: "mental_health", mustInclude: ["psychotherapist", "psychiatrist"] },
      { category: "maternity",     mustInclude: ["obstetrics", "gynaecology"] },
      { category: "pediatric",     mustInclude: ["paediatrics", "pediatrics"] },
      { category: "police",        mustInclude: ['amenity"="police'] },
      { category: "general",       mustInclude: ['amenity"~"hospital|clinic'] },
    ];
    for (const c of cases) {
      const q = placeAdapter._testHelpers.buildOverpassQuery(33.7, 73.05, 5000, c.category);
      for (const fragment of c.mustInclude) {
        assert.ok(q.includes(fragment), `${c.category} query should include "${fragment}"; got: ${q}`);
      }
    }
    // Unknown category falls back to general
    const fallback = placeAdapter._testHelpers.buildOverpassQuery(33.7, 73.05, 5000, "made_up");
    assert.ok(fallback.includes('amenity"~"hospital|clinic'), "unknown category should fall back to general");
    console.log("  PASS: buildOverpassQuery routes by category");
  }

  // Cache key separates by category - same coords, different categories don't collide
  {
    placeAdapter._testHelpers.queryCache.clear();
    let calls = 0;
    const fakeFetch = async () => {
      calls++;
      return {
        ok: true, status: 200,
        json: async () => ({ elements: [
          { type: "node", id: 1, lat: 33.7, lon: 73.05, tags: { name: "X", amenity: "hospital" } },
          { type: "node", id: 2, lat: 33.71, lon: 73.06, tags: { name: "Y", amenity: "hospital" } },
          { type: "node", id: 3, lat: 33.72, lon: 73.07, tags: { name: "Z", amenity: "hospital" } },
        ] }),
      };
    };
    await placeAdapter.findPlaces({ lat: 10, lng: 10, category: "maternity", fetchImpl: fakeFetch });
    await placeAdapter.findPlaces({ lat: 10, lng: 10, category: "pediatric", fetchImpl: fakeFetch });
    assert.strictEqual(calls, 2, "different categories must miss each other's cache");
    console.log("  PASS: cache key separates by category");
  }

  // 503 path when provider keeps failing
  {
    placeAdapter._testHelpers.queryCache.clear();
    const fakeFetch = async () => ({ ok: false, status: 429, json: async () => ({}) });
    let threw = false;
    try {
      await placeAdapter.findPlaces({ lat: 11.123, lng: 21.456, fetchImpl: fakeFetch });
    } catch (e) {
      threw = true;
      assert.strictEqual(e.statusCode, 503);
    }
    assert.ok(threw, "should throw 503 when provider fails");
    console.log("  PASS: findPlaces throws 503 on provider failure");
  }

  // Input validation
  {
    let threw = false;
    try {
      await placeAdapter.findPlaces({ lat: "x", lng: 0 });
    } catch (e) {
      threw = true;
      assert.strictEqual(e.statusCode, 400);
    }
    assert.ok(threw);
    console.log("  PASS: findPlaces validates lat/lng");
  }

  // Dedup across union (maternity tagged + generic hospital fallback can return same node)
  {
    const dupe = [
      { type: "node", id: 100, lat: 33.7, lon: 73.05, tags: { name: "Same", amenity: "hospital" } },
      { type: "node", id: 100, lat: 33.7, lon: 73.05, tags: { name: "Same", amenity: "hospital" } },
    ];
    const parsed = placeAdapter.parseOverpass({ elements: dupe }, 33.7, 73.05);
    assert.strictEqual(parsed.length, 1, "duplicates from union must be deduped by place_id");
    console.log("  PASS: parseOverpass dedups union duplicates");
  }
}

// ============================================================================
// telemetry (input shaping only - no DB required)
// ============================================================================
const { VALID_EVENT_NAMES, ALLOWED_ATTRS, PROHIBITED_KEYS } = require("../services/safety/telemetry");

function testTelemetryShapes() {
  console.log("\n--- telemetry allow-list ---");

  // Allow-list discipline
  assert.ok(VALID_EVENT_NAMES.has("safety.detection.fired"));
  assert.ok(!VALID_EVENT_NAMES.has("safety.detection.text_payload"));
  console.log("  PASS: event name allow-list");

  // Detection.fired has no PII attrs allowed
  const allowed = ALLOWED_ATTRS["safety.detection.fired"];
  assert.ok(!allowed.includes("text"));
  assert.ok(!allowed.includes("message"));
  console.log("  PASS: detection.fired does not allow text/message attrs");

  // Prohibited keys cover the obvious PII
  for (const k of ["text", "email", "phone", "lat", "lng", "address", "userId"]) {
    assert.ok(PROHIBITED_KEYS.has(k), `${k} must be prohibited`);
  }
  console.log("  PASS: PII keys explicitly prohibited");
}

// ============================================================================
// Run all
// ============================================================================
(async () => {
  try {
    testRules();
    testDetectionService();
    testHash();
    testRedaction();
    await testEmergencyLookup();
    testPlaceAdapter();
    await testPlaceAdapterAsync();
    testTelemetryShapes();
    console.log("\n=== ALL SAFETY TESTS PASSED ===");
    process.exit(0);
  } catch (err) {
    console.error("\n=== SAFETY TEST FAILED ===");
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
