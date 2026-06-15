// services/safety/emergencyLookup.js
// Resolves a country (from lat/lng or explicit param) into emergency contacts.
// Backed by config/emergency_config.json. Falls back to `default` (112) if unknown.

const fs = require("fs");
const path = require("path");
const { TTLCache } = require("./cache");

const CONFIG_PATH = path.join(__dirname, "..", "..", "config", "emergency_config.json");
const COUNTRY_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days per geohash5
const NOMINATIM_TIMEOUT_MS = 5000;
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Wombly-Safety/1.0 (https://wombly.app)";

let _config = null;
function loadConfig(force = false) {
  if (_config && !force) return _config;
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  _config = JSON.parse(raw);
  return _config;
}

const countryCache = new TTLCache(2000);

function geohash5(lat, lng) {
  // Truncate coords to 0.1 degree (~11km) granularity for cache key.
  return `${lat.toFixed(1)},${lng.toFixed(1)}`;
}

/**
 * Reverse-geocode lat/lng to ISO-3166 alpha-2 country code.
 * Uses Nominatim public endpoint with caching + descriptive User-Agent.
 * Caller may inject a custom fetch for testability.
 */
async function resolveCountryFromCoords(lat, lng, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const key = geohash5(lat, lng);
  const cached = countryCache.get(key);
  if (cached) return cached;

  if (typeof fetchImpl !== "function") return null;

  const url = `${NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json&zoom=3&addressdetails=1`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NOMINATIM_TIMEOUT_MS);

  try {
    const resp = await fetchImpl(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const cc = data?.address?.country_code;
    if (!cc || typeof cc !== "string") return null;
    const iso = cc.toUpperCase();
    countryCache.set(key, iso, COUNTRY_CACHE_TTL_MS);
    return iso;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Look up emergency contacts for a country, with full resolution trail.
 *
 * @param {Object} args
 * @param {string} [args.country] - ISO alpha-2
 * @param {number} [args.lat]
 * @param {number} [args.lng]
 * @param {function} [args.fetchImpl] - injectable fetch for tests
 * @returns {Promise<Object>} EmergencyContacts shape
 */
async function lookup({ country, lat, lng, fetchImpl = globalThis.fetch } = {}) {
  const config = loadConfig();

  let resolvedCountry = null;
  let resolvedVia = null;

  if (country && /^[A-Za-z]{2}$/.test(country)) {
    resolvedCountry = country.toUpperCase();
    resolvedVia = "query_param";
  } else if (typeof lat === "number" && typeof lng === "number") {
    const cc = await resolveCountryFromCoords(lat, lng, { fetchImpl });
    if (cc) {
      resolvedCountry = cc;
      resolvedVia = "reverse_geocode";
    }
  }

  // If we still don't have a country, fall back to the configured default_country.
  // This is what makes "audience country" the right thing to call when GPS + locale both fail.
  if (!resolvedCountry && config.default_country) {
    resolvedCountry = config.default_country;
    resolvedVia = "default_country";
  }

  const countryBlock = resolvedCountry ? config.countries[resolvedCountry] : null;

  if (!countryBlock) {
    // Last-resort universal number.
    return {
      country: resolvedCountry || null,
      resolved_via: "default_fallback",
      primary: config.default.primary,
      category_routes: {},
      crisis_lines: [],
    };
  }

  return {
    country: resolvedCountry,
    resolved_via: resolvedVia,
    primary: countryBlock.primary,
    police: countryBlock.police,
    ambulance: countryBlock.ambulance,
    non_emergency: countryBlock.non_emergency,
    category_routes: countryBlock.category_routes || {},
    crisis_lines: countryBlock.crisis_lines || [],
  };
}

/**
 * Pick the right action for a detected category from a contacts block.
 * Falls back to the country's primary if no category-specific route exists.
 *
 * @param {Object} contacts - shape returned by lookup()
 * @param {string} category - "self_harm" | "obstetric_emergency" | "infant_distress" | "domestic_violence" | other
 * @returns {{ primary: Object, place_category: string }}
 */
function resolveCategoryRoute(contacts, category) {
  const route = contacts?.category_routes?.[category];
  if (route && route.primary) {
    return { primary: route.primary, place_category: route.place_category || "general" };
  }
  return { primary: contacts?.primary || { number: "112" }, place_category: "general" };
}

module.exports = {
  lookup,
  loadConfig,
  resolveCountryFromCoords,
  resolveCategoryRoute,
  _testHelpers: { countryCache, geohash5 },
};
