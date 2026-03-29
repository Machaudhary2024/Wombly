// models/ChatLog.js
const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String, required: true },
  pregnancyWeekAtTime: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("ChatLog", chatLogSchema);