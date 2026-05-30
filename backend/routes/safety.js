// routes/safety.js
// Express router for the Wombly safety API.
// Endpoints: /detect, /emergency/lookup, /places/hospitals, /consent, /telemetry/safety
// See docs/SAFETY_DESIGN.md §16 for the OpenAPI spec these implement.

const express = require("express");
const router = express.Router();

const detectionService = require("../services/safety/detectionService");
const emergencyLookup = require("../services/safety/emergencyLookup");
const placeAdapter = require("../services/safety/placeAdapter");
const consentService = require("../services/safety/consentService");
const telemetry = require("../services/safety/telemetry");

// ---------------------------------------------------------------------------
// POST /api/safety/detect
// ---------------------------------------------------------------------------
router.post("/detect", async (req, res) => {
  try {
    const result = detectionService.detect(req.body || {});
    res.json(result);
  } catch (err) {
    console.error("[POST /safety/detect]", err.message);
    res.status(err.statusCode || 500).json({ error: err.message, code: "detect_failed" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/safety/emergency/lookup?country=&lat=&lng=
// ---------------------------------------------------------------------------
router.get("/emergency/lookup", async (req, res) => {
  try {
    const { country } = req.query;
    const lat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
    const lng = req.query.lng !== undefined ? Number(req.query.lng) : undefined;
    if (lat !== undefined && Number.isNaN(lat)) {
      return res.status(400).json({ error: "lat must be a number" });
    }
    if (lng !== undefined && Number.isNaN(lng)) {
      return res.status(400).json({ error: "lng must be a number" });
    }
    const result = await emergencyLookup.lookup({ country, lat, lng });
    res.json(result);
  } catch (err) {
    console.error("[GET /safety/emergency/lookup]", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/safety/places/nearby?lat=&lng=&category=&radius_m=&limit=
// `category` ∈ general | mental_health | maternity | pediatric | police
// ---------------------------------------------------------------------------
router.get("/places/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: "lat and lng required" });
    }
    const radius_m = req.query.radius_m ? Number(req.query.radius_m) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const category = req.query.category || "general";

    const result = await placeAdapter.findPlaces({ lat, lng, radius_m, category, limit });
    res.json({ query_id: cryptoRandomId(), ...result });
  } catch (err) {
    console.error("[GET /safety/places/nearby]", err.message);
    if (err.statusCode === 503) {
      return res.status(503).json({
        fallback_message: "We couldn't load nearby places right now. Please call your local emergency number.",
      });
    }
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/safety/consent
// Body: { hashed_user_id, scope, state, ui_surface?, locale?, policy_version? }
// ---------------------------------------------------------------------------
router.post("/consent", async (req, res) => {
  try {
    const body = req.body || {};
    const result = await consentService.record({
      hashedUserId: body.hashed_user_id || body.hashedUserId,
      scope: body.scope,
      state: body.state,
      uiSurface: body.ui_surface || body.uiSurface,
      locale: body.locale,
      policyVersion: body.policy_version || body.policyVersion,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("[POST /safety/consent]", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/safety/telemetry/safety
// Body: { events: [{ name, ts, hashed_session_id?, attrs? }] }
// ---------------------------------------------------------------------------
router.post("/telemetry/safety", async (req, res) => {
  try {
    const result = await telemetry.ingest(req.body?.events || []);
    res.status(202).json(result);
  } catch (err) {
    console.error("[POST /safety/telemetry]", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

function cryptoRandomId() {
  return require("crypto").randomUUID();
}

module.exports = router;
