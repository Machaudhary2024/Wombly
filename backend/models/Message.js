// models/Message.js
// Individual message within a conversation. Each message belongs to exactly one conversation.

const mongoose = require("mongoose");

const VALID_ROLES = ["user", "assistant", "system"];

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: VALID_ROLES,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    // Snapshot of pregnancy week at message time (for pregnancy/both modes)
    pregnancyWeekAtTime: {
      type: Number,
      default: null,
    },
    // Optional deduplication key — checked in application code, not via unique index
    idempotencyKey: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Primary query pattern: messages in a conversation, chronological
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Idempotency lookup (not unique — dedup enforced in application code)
messageSchema.index({ conversationId: 1, idempotencyKey: 1 }, { sparse: true });

// Prevent cross-user reads at query level
messageSchema.index({ userEmail: 1, conversationId: 1 });

messageSchema.statics.VALID_ROLES = VALID_ROLES;

module.exports = mongoose.model("Message", messageSchema);
