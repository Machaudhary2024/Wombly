// services/safety/hash.js
// Daily-salted SHA-256 hashes for session/user IDs in telemetry.
// Salt rotates every UTC day - hashes from day N are NOT linkable to day N+1.

const crypto = require("crypto");

const SALT_BASE = process.env.SAFETY_HASH_SALT || "wombly-safety-default-salt";

function dailySalt(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${SALT_BASE}:${y}-${m}-${d}`;
}

function hashId(rawId, date = new Date()) {
  if (rawId == null) return null;
  const salt = dailySalt(date);
  return crypto.createHash("sha256").update(`${salt}|${rawId}`).digest("hex");
}

module.exports = { hashId, dailySalt };
