// services/safety/telemetry.js
// PII-scrubbed event ingest. Events arrive from the client already hashed.
// Server-side this performs a defence-in-depth scrub and validates against
// an allow-list of event names + attrs.

const SafetyEvent = require("../../models/SafetyEvent");
const { redactDeep } = require("./redaction");
const { hashId } = require("./hash");

const VALID_EVENT_NAMES = new Set([
  "safety.detection.fired",
  "safety.confirmation.shown",
  "safety.confirmation.response",
  "safety.crisis_sheet.shown",
  "safety.call_button.tapped",
  "safety.location.requested",
  "safety.location.granted",
  "safety.location.denied",
  "safety.hospitals.shown",
  "safety.hospitals.directions_tapped",
  "safety.provider.error",
]);

// Allow-list of attribute keys per event name. Anything else is dropped.
const ALLOWED_ATTRS = {
  "safety.detection.fired": ["severity", "category", "language", "country"],
  "safety.confirmation.shown": [],
  "safety.confirmation.response": ["response"], // "yes" | "no" | "dismissed"
  "safety.crisis_sheet.shown": [],
  "safety.call_button.tapped": ["number_kind"], // "emergency" | "crisis_line" | "hospital"
  "safety.location.requested": [],
  "safety.location.granted": [],
  "safety.location.denied": [],
  "safety.hospitals.shown": ["count", "source_mix"],
  "safety.hospitals.directions_tapped": [],
  "safety.provider.error": ["provider", "http_status"],
};

// Prohibited keys - even if appearing in attrs, drop them. Defence in depth.
const PROHIBITED_KEYS = new Set([
  "text", "message", "content", "body",
  "name", "first_name", "last_name", "fullName",
  "email", "phone", "phoneNumber",
  "lat", "lng", "latitude", "longitude", "address",
  "userId", "user_id",
]);

function sanitizeAttrs(eventName, rawAttrs) {
  if (!rawAttrs || typeof rawAttrs !== "object") return {};
  const allowed = ALLOWED_ATTRS[eventName] || [];
  const clean = {};
  for (const k of allowed) {
    if (PROHIBITED_KEYS.has(k)) continue;
    if (rawAttrs[k] !== undefined) clean[k] = redactDeep(rawAttrs[k]);
  }
  return clean;
}

/**
 * Validate and accept a batch of telemetry events.
 * Persists `safety.detection.fired` events to the SafetyEvent collection;
 * other events are forwarded to console for now (analytics pipe wiring is Phase 4).
 *
 * @param {Array<{name:string,ts:string,hashed_session_id?:string,attrs?:object}>} events
 * @returns {Promise<{accepted: number, rejected: number}>}
 */
async function ingest(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return { accepted: 0, rejected: 0 };
  }
  if (events.length > 50) {
    throw Object.assign(new Error("Max 50 events per batch"), { statusCode: 400 });
  }

  let accepted = 0;
  let rejected = 0;

  for (const ev of events) {
    if (!ev || !VALID_EVENT_NAMES.has(ev.name)) {
      rejected++;
      continue;
    }
    const cleanAttrs = sanitizeAttrs(ev.name, ev.attrs);
    // Hash server-side: client sends raw session_id, server applies daily salt.
    // Accept pre-hashed too for tests / advanced callers.
    let hashedSessionId = null;
    if (typeof ev.hashed_session_id === "string" && ev.hashed_session_id.length === 64) {
      hashedSessionId = ev.hashed_session_id;
    } else if (typeof ev.session_id === "string" && ev.session_id.length > 0) {
      hashedSessionId = hashId(ev.session_id);
    }

    // Detection events get persisted; everything else just logged.
    if (ev.name === "safety.detection.fired" && hashedSessionId) {
      try {
        await SafetyEvent.create({
          hashedSessionId,
          severity: cleanAttrs.severity || "none",
          category: cleanAttrs.category || "none",
          confidence: 0,
          triggeringRuleIds: [],
          windowTurnCount: 0,
          language: cleanAttrs.language || null,
          clientCountry: cleanAttrs.country || null,
          actionRecommended: "none",
        });
      } catch (_e) {
        // If DB write fails we don't surface that to the client - telemetry is best-effort.
        rejected++;
        continue;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log("[safety.telemetry]", ev.name, JSON.stringify(cleanAttrs));
    }
    accepted++;
  }

  return { accepted, rejected };
}

module.exports = { ingest, VALID_EVENT_NAMES, ALLOWED_ATTRS, PROHIBITED_KEYS };
