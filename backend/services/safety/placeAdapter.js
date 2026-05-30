// services/safety/placeAdapter.js
// Find nearby places relevant to a crisis category, via OpenStreetMap Overpass.
//
// Categories (mapped to Overpass tag filters in PLACE_QUERIES below):
//   mental_health → psychotherapists, psychiatrists, hospitals with psychiatry speciality
//   maternity     → hospitals with obstetrics/gynaecology speciality (+ generic hospital fallback)
//   pediatric     → hospitals with paediatric speciality (+ generic hospital fallback)
//   police        → police stations (DV crisis)
//   general       → hospitals + clinics
//
// To add a new category: append one entry to PLACE_QUERIES - the rest of the
// pipeline (cache, ranking, fallback) is shared.

const { TTLCache } = require("./cache");

const OVERPASS_URL = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const OVERPASS_TIMEOUT_MS = 10000;
const USER_AGENT = "Wombly-Safety/1.0 (https://wombly.app)";
const CACHE_TTL_MS = 1000 * 60 * 15;
const DEFAULT_RADIUS_M = 5000;
const EXPAND_RADII_M = [5000, 15000, 30000];
const MIN_RESULTS_BEFORE_EXPAND = 3;

const queryCache = new TTLCache(1000);

const VALID_CATEGORIES = ["general", "mental_health", "maternity", "pediatric", "police"];

// Each entry returns the body of an Overpass `()` union. We wrap with the full
// query template once in buildOverpassQuery - single template, no duplication.
const PLACE_QUERIES = {
  general: (lat, lng, r) =>
    `node["amenity"~"hospital|clinic"](around:${r},${lat},${lng});` +
    `way ["amenity"~"hospital|clinic"](around:${r},${lat},${lng});`,
  mental_health: (lat, lng, r) =>
    `node["healthcare"~"psychotherapist|psychiatrist"](around:${r},${lat},${lng});` +
    `way ["healthcare"~"psychotherapist|psychiatrist"](around:${r},${lat},${lng});` +
    `node["amenity"="hospital"]["healthcare:speciality"~"psychiatry|mental_health"](around:${r},${lat},${lng});` +
    `way ["amenity"="hospital"]["healthcare:speciality"~"psychiatry|mental_health"](around:${r},${lat},${lng});`,
  maternity: (lat, lng, r) =>
    `node["amenity"="hospital"]["healthcare:speciality"~"obstetrics|gynaecology|maternity"](around:${r},${lat},${lng});` +
    `way ["amenity"="hospital"]["healthcare:speciality"~"obstetrics|gynaecology|maternity"](around:${r},${lat},${lng});` +
    // Generic-hospital fallback so we don't show an empty list in regions with sparse OSM tagging.
    `node["amenity"="hospital"](around:${r},${lat},${lng});` +
    `way ["amenity"="hospital"](around:${r},${lat},${lng});`,
  pediatric: (lat, lng, r) =>
    `node["amenity"="hospital"]["healthcare:speciality"~"paediatrics|pediatrics"](around:${r},${lat},${lng});` +
    `way ["amenity"="hospital"]["healthcare:speciality"~"paediatrics|pediatrics"](around:${r},${lat},${lng});` +
    `node["amenity"="hospital"](around:${r},${lat},${lng});` +
    `way ["amenity"="hospital"](around:${r},${lat},${lng});`,
  police: (lat, lng, r) =>
    `node["amenity"="police"](around:${r},${lat},${lng});` +
    `way ["amenity"="police"](around:${r},${lat},${lng});`,
};

function geohash7(lat, lng) {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

function buildOverpassQuery(lat, lng, radius, category) {
  const body = (PLACE_QUERIES[category] || PLACE_QUERIES.general)(lat, lng, radius);
  return `[out:json][timeout:10];\n(\n${body}\n);\nout center 25;`;
}

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

function parseOverpass(json, userLat, userLng) {
  if (!json || !Array.isArray(json.elements)) return [];
  const seen = new Set();
  const results = [];
  for (const el of json.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    const tags = el.tags || {};
    const name = tags.name || tags["name:en"] || tags.operator;
    if (!name) continue;

    // Dedup across the union (maternity-tagged + generic-hospital fallback can return the same node)
    const id = `osm:${el.type}/${el.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const addressParts = [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:city"],
    ].filter(Boolean);
    const address = addressParts.join(" ") || tags["addr:full"] || "";

    const phoneRaw = tags["contact:phone"] || tags.phone || null;
    const phone = phoneRaw ? phoneRaw.replace(/[^\d+]/g, "") : null;
    const openNow = parseOpenNow(tags.opening_hours);

    results.push({
      place_id: id,
      name,
      address,
      phone,
      distance_m: haversineM(userLat, userLng, lat, lng),
      eta_seconds: null,
      open_now: openNow,
      lat,
      lng,
      source: "osm",
      attribution_required: true,
    });
  }
  return results;
}

function parseOpenNow(openingHoursStr) {
  if (!openingHoursStr || typeof openingHoursStr !== "string") return null;
  if (/^24\/7$/.test(openingHoursStr.trim())) return true;
  return null;
}

function rank(results) {
  return [...results].sort((a, b) => score(b) - score(a));
}

function score(r) {
  const distKm = Math.max(0.1, r.distance_m / 1000);
  const closeness = 1 / distKm;
  const openBoost = r.open_now === true ? 1 : 0;
  const phoneBoost = r.phone ? 1 : 0;
  return 0.5 * closeness + 0.3 * openBoost + 0.2 * phoneBoost;
}

/**
 * Find nearby places for a given crisis category.
 *
 * @param {Object} args
 * @param {number} args.lat
 * @param {number} args.lng
 * @param {string} [args.category="general"]
 * @param {number} [args.radius_m]
 * @param {number} [args.limit=5]
 * @param {function} [args.fetchImpl=globalThis.fetch]
 * @returns {Promise<{results: Array, source_mix: Object, category: string}>}
 */
async function findPlaces({
  lat,
  lng,
  category = "general",
  radius_m = DEFAULT_RADIUS_M,
  limit = 5,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    throw Object.assign(new Error("lat and lng required"), { statusCode: 400 });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw Object.assign(new Error("lat/lng out of range"), { statusCode: 400 });
  }
  if (limit < 1 || limit > 10) {
    throw Object.assign(new Error("limit must be 1..10"), { statusCode: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) category = "general";

  const cacheKey = `${geohash7(lat, lng)}|${category}|${limit}`;
  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  if (typeof fetchImpl !== "function") {
    throw Object.assign(new Error("fetch unavailable"), { statusCode: 503 });
  }

  const radii = EXPAND_RADII_M.filter((r) => r >= radius_m);
  const tried = radii.length > 0 ? radii : [radius_m];

  let lastError = null;
  let merged = [];

  for (const r of tried) {
    try {
      const res = await callOverpass(lat, lng, r, category, fetchImpl);
      merged = parseOverpass(res, lat, lng);
      if (merged.length >= MIN_RESULTS_BEFORE_EXPAND) break;
    } catch (e) {
      lastError = e;
    }
  }

  if (merged.length === 0 && lastError) {
    throw Object.assign(new Error("Place provider unavailable"), {
      statusCode: 503,
      cause: lastError.message,
    });
  }

  const ranked = rank(merged).slice(0, limit);
  const payload = {
    results: ranked,
    source_mix: { osm: ranked.length },
    category,
  };
  queryCache.set(cacheKey, payload, CACHE_TTL_MS);
  return payload;
}

async function callOverpass(lat, lng, radius, category, fetchImpl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);
  try {
    const resp = await fetchImpl(OVERPASS_URL, {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(buildOverpassQuery(lat, lng, radius, category))}`,
      signal: controller.signal,
    });
    if (resp.status === 429 || resp.status >= 500) {
      throw new Error(`Overpass ${resp.status}`);
    }
    if (!resp.ok) throw new Error(`Overpass ${resp.status}`);
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  findPlaces,
  parseOverpass,
  rank,
  haversineM,
  VALID_CATEGORIES,
  _testHelpers: { queryCache, geohash7, buildOverpassQuery },
};
