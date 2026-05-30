// models/ConsentRecord.js
// Append-only consent ledger. Legal evidence - never delete, never mutate.
// Retention: lifetime of account + 7 years (no TTL).

const mongoose = require("mongoose");

const VALID_SCOPES = [
  "precise_location_oneshot",
  "emergency_feature_general",
  "crisis_telemetry",
  "share_with_emergency_contact",
];
const VALID_STATES = ["granted", "denied", "revoked"];

const consentRecordSchema = new mongoose.Schema(
  {
    hashedUserId: { type: String, required: true, index: true },
    ts: { type: Date, default: Date.now, index: true },
    scope: { type: String, enum: VALID_SCOPES, required: true },
    state: { type: String, enum: VALID_STATES, required: true },
    uiSurface: { type: String, default: null },
    locale: { type: String, default: null },
    policyVersion: { type: String, required: true },
  },
  { timestamps: false }
);

consentRecordSchema.index({ hashedUserId: 1, scope: 1, ts: -1 });

consentRecordSchema.statics.VALID_SCOPES = VALID_SCOPES;
consentRecordSchema.statics.VALID_STATES = VALID_STATES;

module.exports = mongoose.model("ConsentRecord", consentRecordSchema);
