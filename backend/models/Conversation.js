// models/Conversation.js
// Represents an independent chat thread scoped to one user and one mode.

const mongoose = require("mongoose");

const VALID_MODES = ["pregnancy", "toddler", "both"];
const VALID_STATUSES = ["active", "archived"];

const conversationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      default: "New Conversation",
      maxlength: 200,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      enum: VALID_MODES,
    },
    // Intake metadata — persisted at conversation creation, never repeated
    intake: {
      pregnancyWeek: { type: Number, min: 1, max: 42, default: null },
      trimester: { type: Number, min: 1, max: 3, default: null },
      toddlerAgeMonths: { type: Number, min: 0, max: 60, default: null },
      completedAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: "active",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Flag for migrated legacy conversations
    isLegacy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Compound indexes for query patterns
conversationSchema.index({ userEmail: 1, lastMessageAt: -1 });
conversationSchema.index({ userEmail: 1, status: 1, lastMessageAt: -1 });

// Static constants exposed for validation reuse
conversationSchema.statics.VALID_MODES = VALID_MODES;
conversationSchema.statics.VALID_STATUSES = VALID_STATUSES;

module.exports = mongoose.model("Conversation", conversationSchema);
