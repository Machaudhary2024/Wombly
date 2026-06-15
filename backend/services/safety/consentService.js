// services/safety/consentService.js
// Append-only consent ledger operations.

const ConsentRecord = require("../../models/ConsentRecord");

const POLICY_VERSION = process.env.SAFETY_POLICY_VERSION || "2026.05.18";

/**
 * Record a consent grant/denial/revocation. Append-only - never overwrites.
 *
 * @param {Object} args
 * @param {string} args.hashedUserId  - pre-hashed by caller (no raw IDs accepted)
 * @param {string} args.scope
 * @param {string} args.state         - "granted" | "denied" | "revoked"
 * @param {string} [args.uiSurface]
 * @param {string} [args.locale]
 * @param {string} [args.policyVersion]
 * @returns {Promise<{consent_id: string}>}
 */
async function record({ hashedUserId, scope, state, uiSurface, locale, policyVersion } = {}) {
  if (!hashedUserId || typeof hashedUserId !== "string") {
    throw Object.assign(new Error("hashedUserId required"), { statusCode: 400 });
  }
  if (!ConsentRecord.VALID_SCOPES.includes(scope)) {
    throw Object.assign(new Error(`scope must be one of: ${ConsentRecord.VALID_SCOPES.join(", ")}`), { statusCode: 400 });
  }
  if (!ConsentRecord.VALID_STATES.includes(state)) {
    throw Object.assign(new Error(`state must be one of: ${ConsentRecord.VALID_STATES.join(", ")}`), { statusCode: 400 });
  }

  const doc = await ConsentRecord.create({
    hashedUserId,
    scope,
    state,
    uiSurface: uiSurface || null,
    locale: locale || null,
    policyVersion: policyVersion || POLICY_VERSION,
  });

  return { consent_id: doc._id.toString() };
}

/**
 * Get the current effective state for a (user, scope) pair.
 * Returns most recent record's state, or null if no record exists.
 */
async function currentState(hashedUserId, scope) {
  const last = await ConsentRecord
    .findOne({ hashedUserId, scope })
    .sort({ ts: -1 })
    .lean();
  return last ? last.state : null;
}

module.exports = { record, currentState, POLICY_VERSION };
