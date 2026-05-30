// services/safety/redaction.js
// Scrubs PII from any string before it leaves the trust boundary.
// Removes: phone numbers, emails, ID/passport patterns, coordinates.

const PHONE_RE = /(?:\+?\d[\d\s\-().]{7,}\d)/g;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const COORD_RE = /-?\d{1,3}\.\d{3,},\s*-?\d{1,3}\.\d{3,}/g;
const LONG_DIGITS_RE = /\b\d{7,}\b/g;

function redact(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  return text
    .replace(EMAIL_RE, "[EMAIL]")
    .replace(PHONE_RE, "[PHONE]")
    .replace(COORD_RE, "[COORDS]")
    .replace(LONG_DIGITS_RE, "[DIGITS]");
}

function redactDeep(value) {
  if (value == null) return value;
  if (typeof value === "string") return redact(value);
  if (Array.isArray(value)) return value.map(redactDeep);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = redactDeep(v);
    return out;
  }
  return value;
}

module.exports = { redact, redactDeep };
