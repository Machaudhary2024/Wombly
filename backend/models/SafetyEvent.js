// models/SafetyEvent.js
// Append-only crisis-detection events. PII-free by schema.
// Retention: 90 days (Mongo TTL index on `ts`).

const mongoose = require("mongoose");

const VALID_SEVERITIES = ["none", "low", "medium", "high"];
const VALID_CATEGORIES = [
  "none",
  "self_harm",
  "obstetric_emergency",
  "infant_distress",
  "domestic_violence",
  "other_crisis",
];
const VALID_ACTIONS = [
  "none",
  "soft_resource",
  "confirm_then_offer_call",
  "immediate_offer_call",
];

const safetyEventSchema = new mongoose.Schema(
  {
    schemaVersion: { type: String, default: "1.0" },
    hashedSessionId: { type: String, required: true, index: true },
    hashedUserId: { type: String, default: null },
    ts: { type: Date, default: Date.now, index: true },
    severity: { type: String, enum: VALID_SEVERITIES, required: true },
    category: { type: String, enum: VALID_CATEGORIES, required: true },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    triggeringRuleIds: { type: [String], default: [] },
    classifierScore: { type: Number, default: null }, // reserved for v2
    windowTurnCount: { type: Number, default: 1 },
    language: { type: String, default: null },
    clientCountry: { type: String, default: null },
    actionRecommended: { type: String, enum: VALID_ACTIONS, required: true },
  },
  { timestamps: false }
);

// 90-day TTL - design §7 retention policy
safetyEventSchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

safetyEventSchema.statics.VALID_SEVERITIES = VALID_SEVERITIES;
safetyEventSchema.statics.VALID_CATEGORIES = VALID_CATEGORIES;
safetyEventSchema.statics.VALID_ACTIONS = VALID_ACTIONS;

module.exports = mongoose.model("SafetyEvent", safetyEventSchema);
