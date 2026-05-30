// services/safetyApi.js
// Thin client for the backend safety endpoints. See backend/routes/safety.js.

import { API_BASE_URL } from "../apiConfig";

const SAFETY_BASE = `${API_BASE_URL}/api/safety`;

async function jsonFetch(url, init = {}) {
  const resp = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(data.error || `HTTP ${resp.status}`);
    err.status = resp.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * Look up emergency contacts. Either country (ISO-2) or lat/lng required.
 * Always resolves - falls back to default (112) if nothing matches.
 */
export async function lookupEmergency({ country, lat, lng } = {}) {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (typeof lat === "number") params.set("lat", String(lat));
  if (typeof lng === "number") params.set("lng", String(lng));
  return jsonFetch(`${SAFETY_BASE}/emergency/lookup?${params.toString()}`);
}

/**
 * Find nearby places by category via OSM Overpass. Throws on 503 (provider down).
 * category ∈ general | mental_health | maternity | pediatric | police
 */
export async function findNearby({ lat, lng, category = "general", radius_m, limit } = {}) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng), category });
  if (radius_m) params.set("radius_m", String(radius_m));
  if (limit) params.set("limit", String(limit));
  return jsonFetch(`${SAFETY_BASE}/places/nearby?${params.toString()}`);
}

/**
 * Fire-and-forget telemetry batch. Never throws - telemetry must not break UX.
 * Pass a raw session_id; the server hashes with its daily salt.
 */
export function sendTelemetry(events, sessionId) {
  const enriched = (events || []).map((e) => ({
    ts: new Date().toISOString(),
    session_id: sessionId || undefined,
    ...e,
  }));
  fetch(`${SAFETY_BASE}/telemetry/safety`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events: enriched }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Standalone detect endpoint - only needed if you want to classify outside the
 * chat flow. The chat endpoint already attaches `safety` to its reply.
 */
export async function detect({ session_id, turns, locale, client_country }) {
  return jsonFetch(`${SAFETY_BASE}/detect`, {
    method: "POST",
    body: JSON.stringify({ session_id, turns, locale, client_country }),
  });
}
