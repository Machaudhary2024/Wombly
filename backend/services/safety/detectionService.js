// services/safety/detectionService.js
// Top-level detection: takes a conversation window, returns a SafetyEvent shape.
// v1 = rules-only (classifier hook reserved for v2 - classifierScore stays null).

const { randomUUID } = require("crypto");
const { evaluateWindow } = require("./rules");
const { hashId } = require("./hash");

const MAX_TURNS = 10;
const MAX_TURN_CHARS = 4000;
const WINDOW_SIZE = 5; // last N user turns to consider

/**
 * @param {Object} input
 * @param {string} input.session_id
 * @param {Array<{role:string,text:string,ts:string}>} input.turns
 * @param {string} [input.locale]
 * @param {string} [input.client_country] - ISO-3166 alpha-2
 * @returns {Object} SafetyEvent payload (no message text)
 */
function detect(input) {
  if (!input || typeof input !== "object") {
    throw Object.assign(new Error("input required"), { statusCode: 400 });
  }
  const { session_id, turns, locale, client_country } = input;

  if (!session_id || typeof session_id !== "string") {
    throw Object.assign(new Error("session_id required"), { statusCode: 400 });
  }
  if (!Array.isArray(turns) || turns.length === 0 || turns.length > MAX_TURNS) {
    throw Object.assign(new Error(`turns must be a 1..${MAX_TURNS} array`), { statusCode: 400 });
  }
  for (const t of turns) {
    if (!t || typeof t.text !== "string" || t.text.length > MAX_TURN_CHARS) {
      throw Object.assign(new Error(`each turn must have text (<= ${MAX_TURN_CHARS} chars)`), { statusCode: 400 });
    }
  }

  // Classify the LATEST user turn only. Older turns are kept in the API
  // contract for future multi-turn use, but at v1.1 they don't influence the
  // verdict - otherwise a prior crisis "sticks" when the user moves on to a
  // different emergency (or vice versa). The user's most recent message is
  // what we react to.
  const userTurns = turns.filter((t) => t.role === "user");
  const latestUserText = userTurns.length ? userTurns[userTurns.length - 1].text : "";

  const evalResult = evaluateWindow(latestUserText);

  return {
    event_id: randomUUID(),
    schema_version: "1.0",
    hashed_session_id: hashId(session_id),
    ts: new Date().toISOString(),
    severity: evalResult.severity,
    category: evalResult.category,
    confidence: evalResult.confidence,
    triggering_rule_ids: evalResult.triggeringRuleIds,
    classifier_score: null, // reserved for v2
    window_turn_count: latestUserText ? 1 : 0,
    language: locale || null,
    client_country: client_country || null,
    action_recommended: evalResult.actionRecommended,
  };
}

module.exports = { detect, MAX_TURNS, MAX_TURN_CHARS, WINDOW_SIZE };
