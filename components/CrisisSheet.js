// components/CrisisSheet.js
// One Modal, four stages, per design doc §6 (Flows A–F).
//
//   soft_checkin  → "Are you safe?" + primary CTA / dismiss
//   crisis_sheet  → primary CTA + find-nearest + topical crisis line + dismiss
//   location_ask  → one-shot location consent
//   places        → in-app Leaflet map (WebView) + ranked list of nearby places
//
// Routing is data-driven by emergency_config.json `category_routes`:
//   self_harm           → mental health line + mental-health facilities
//   obstetric_emergency → emergency ambulance + maternity hospitals
//   infant_distress     → emergency ambulance + paediatric hospitals
//   domestic_violence   → police + police stations + DV hotline
//
// Hard rules honoured:
//   - tel: never auto-triggered. Every call is a user tap.
//   - Location is foreground-only, one-shot, never persisted.
//   - "I'm safe, dismiss" always available.
//   - Topical crisis line still surfaced on dismiss path.

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { lookupEmergency, findNearby, sendTelemetry } from "../services/safetyApi";
import { useLocation } from "../contexts/LocationContext";

// ── Theme ──────────────────────────────────────────────────────────────────
const DANGER = "#C0392B";
const DANGER_DARK = "#922B21";
const INK = "#1F1F2C";
const MUTED = "#6B6B7B";
const CARD_BG = "#FFFFFF";
const SOFT_BG = "#FFF3F0";
const BORDER = "#EADADA";

const DISCLAIMER = "Wombly is not a substitute for medical care or emergency services.";

// ── Category-driven UI strings ─────────────────────────────────────────────
// Single source of truth for the "find nearest X" wording, empty-state copy,
// and the place_category fallback when contacts.category_routes is missing.
const CATEGORY_UI = {
  self_harm: {
    findLabel: "Find nearest mental health support",
    placeCategoryFallback: "mental_health",
    emptyPlacesCopy: "No mental health facilities found nearby. The crisis line is your best help right now.",
    topicalCrisisTopic: "general",
  },
  obstetric_emergency: {
    findLabel: "Find nearest maternity hospital",
    placeCategoryFallback: "maternity",
    emptyPlacesCopy: "No maternity hospital found nearby. Please call the emergency number.",
    topicalCrisisTopic: "postpartum",
  },
  infant_distress: {
    findLabel: "Find nearest paediatric hospital",
    placeCategoryFallback: "pediatric",
    emptyPlacesCopy: "No paediatric hospital found nearby. Please call the emergency number.",
    topicalCrisisTopic: "postpartum",
  },
  domestic_violence: {
    findLabel: "Find nearest police station",
    placeCategoryFallback: "police",
    emptyPlacesCopy: "No police station found nearby. The DV hotline can help - please tap it below.",
    topicalCrisisTopic: "dv",
  },
};
const FALLBACK_UI = {
  findLabel: "Find nearest hospital",
  placeCategoryFallback: "general",
  emptyPlacesCopy: "No places found nearby. Please call the emergency number.",
  topicalCrisisTopic: "general",
};

/**
 * @param {object} props
 * @param {boolean} props.visible
 * @param {"confirm_then_offer_call"|"immediate_offer_call"|"soft_resource"} props.action
 * @param {string} [props.category]   self_harm | obstetric_emergency | infant_distress | domestic_violence
 * @param {string} [props.sessionId]  raw conv id; backend hashes for telemetry
 * @param {function} props.onClose
 */
export default function CrisisSheet({ visible, action, category, sessionId, onClose }) {
  const [stage, setStage] = useState("soft_checkin");
  const [contacts, setContacts] = useState(null);
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState(null);
  const [placesError, setPlacesError] = useState(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const ui = CATEGORY_UI[category] || FALLBACK_UI;
  const appLocation = useLocation();   // { location: { lat, lng, country }?, status, refresh }

  // Reset state on every open and announce the confirmation event.
  useEffect(() => {
    if (!visible) return;
    setStage("soft_checkin");
    setPlaces(null);
    setPlacesError(null);
    // Carry over any app-level location we already have - saves a permission prompt.
    setCoords(appLocation?.location ? { lat: appLocation.location.lat, lng: appLocation.location.lng } : null);
    sendTelemetry([{ name: "safety.confirmation.shown", attrs: {} }], sessionId);
  }, [visible, sessionId, appLocation?.location]);

  // Resolve contacts when modal opens. Prefer real coords (app-level) over
  // any guess - we deliberately do NOT use navigator.language here because it
  // returns en-US in Expo Go even for Pakistani users.
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const args = appLocation?.location
      ? { lat: appLocation.location.lat, lng: appLocation.location.lng }
      : {}; // empty → backend uses default_country (PK)
    lookupEmergency(args)
      .then((data) => { if (!cancelled) setContacts(data); })
      .catch(() => { if (!cancelled) setContacts({ primary: { number: "1122", label: "Rescue 1122" }, crisis_lines: [], category_routes: {} }); });
    return () => { cancelled = true; };
  }, [visible, appLocation?.location]);

  // ── Derived: category-aware primary number + topical secondary ──────────
  const route = contacts?.category_routes?.[category];
  const primary = route?.primary || contacts?.primary || { number: "1122", label: "Emergency" };
  const placeCategory = route?.place_category || ui.placeCategoryFallback;
  const topicalCrisisLine = useMemo(
    () => pickCrisisLine(contacts?.crisis_lines, ui.topicalCrisisTopic, primary?.number),
    [contacts, ui.topicalCrisisTopic, primary?.number]
  );

  // ── Map HTML (Leaflet + OSM tiles) - recompute when coords/places change ─
  const mapHtml = useMemo(() => {
    if (!coords) return null;
    return buildLeafletHtml(coords, places || []);
  }, [coords, places]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleCall = useCallback((number, kind) => {
    if (!number) return;
    const url = `tel:${String(number).replace(/[^\d+]/g, "")}`;
    sendTelemetry([{ name: "safety.call_button.tapped", attrs: { number_kind: kind } }], sessionId);
    Linking.canOpenURL(url)
      .then((ok) => {
        if (ok) Linking.openURL(url);
        else alert(`This device can't make calls. The number is ${number} - please call from another phone.`);
      })
      .catch(() => {});
  }, [sessionId]);

  const handleNeedHelp = () => {
    sendTelemetry([{ name: "safety.confirmation.response", attrs: { response: "yes" } }], sessionId);
    setStage("crisis_sheet");
    sendTelemetry([{ name: "safety.crisis_sheet.shown", attrs: {} }], sessionId);
  };

  const handleDismissSafe = () => {
    sendTelemetry(
      [{ name: "safety.confirmation.response", attrs: { response: stage === "soft_checkin" ? "no" : "dismissed" } }],
      sessionId
    );
    onClose && onClose();
  };

  // If we already have coords (app-level grant), skip the in-modal ask and
  // jump straight into fetching places. Otherwise show the consent stage.
  const handleFindPlaces = () => {
    if (appLocation?.location) {
      fetchPlacesWithCoords({ lat: appLocation.location.lat, lng: appLocation.location.lng });
    } else {
      setStage("location_ask");
      sendTelemetry([{ name: "safety.location.requested", attrs: {} }], sessionId);
    }
  };

  const fetchPlacesWithCoords = async (c) => {
    setStage("places");
    setLoadingPlaces(true);
    setPlacesError(null);
    setCoords(c);
    try {
      const data = await findNearby({ lat: c.lat, lng: c.lng, category: placeCategory });
      setPlaces(data.results || []);
      sendTelemetry(
        [{ name: "safety.hospitals.shown", attrs: { count: data.results?.length || 0 } }],
        sessionId
      );
    } catch (e) {
      sendTelemetry(
        [{ name: "safety.provider.error", attrs: { provider: "osm", http_status: e.status || 0 } }],
        sessionId
      );
      setPlacesError("provider_failed");
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handleLocationGrant = async () => {
    sendTelemetry([{ name: "safety.location.requested", attrs: {} }], sessionId);
    const c = await requestOneShotLocation();
    if (!c) {
      sendTelemetry([{ name: "safety.location.denied", attrs: {} }], sessionId);
      setStage("places");
      setPlacesError("location_denied");
      return;
    }
    sendTelemetry([{ name: "safety.location.granted", attrs: {} }], sessionId);
    // Refresh contacts to real country once we know coords
    lookupEmergency({ lat: c.lat, lng: c.lng })
      .then((data) => data && setContacts(data))
      .catch(() => {});
    fetchPlacesWithCoords(c);
  };

  const handleLocationDeny = () => {
    sendTelemetry([{ name: "safety.location.denied", attrs: {} }], sessionId);
    setStage("places");
    setPlacesError("location_denied");
  };

  const handleOpenDirections = (p) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
    sendTelemetry([{ name: "safety.hospitals.directions_tapped", attrs: {} }], sessionId);
    Linking.openURL(url).catch(() => {});
  };

  if (!visible) return null;

  const primaryButtonLabel = formatPrimaryLabel(primary);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleDismissSafe}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessible accessibilityViewIsModal accessibilityLabel="Safety check-in">

          <View style={styles.headerRow}>
            <MaterialCommunityIcons name="heart-pulse" size={22} color={DANGER} />
            <Text style={styles.headerText}>
              {stage === "soft_checkin" ? "Just checking in" : "You're not alone"}
            </Text>
            <TouchableOpacity onPress={handleDismissSafe} hitSlop={12} accessibilityLabel="Close">
              <MaterialCommunityIcons name="close" size={22} color={MUTED} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ paddingBottom: 12 }}>

            {/* ── soft_checkin ── */}
            {stage === "soft_checkin" && (
              <>
                <Text style={styles.body}>
                  What you're sharing sounds really heavy, and I want to make sure you're okay.
                  Are you safe right now?
                </Text>

                {action === "immediate_offer_call" ? (
                  // Time-critical: surface BOTH call and map immediately - user shouldn't have to dismiss to find a hospital.
                  <>
                    <CallButton label={`Call ${primaryButtonLabel}`} onPress={() => handleCall(primary.number, "emergency")} />
                    <SecondaryButton label={ui.findLabel} icon="map-marker-radius" onPress={handleFindPlaces} />
                  </>
                ) : (
                  <CallButton label="I need help" onPress={handleNeedHelp} />
                )}
                <SecondaryButton label="I'm okay, keep chatting" onPress={handleDismissSafe} />

                <SafetyFooter primary={primary.number} />
              </>
            )}

            {/* ── crisis_sheet ── */}
            {stage === "crisis_sheet" && (
              <>
                <Text style={styles.body}>
                  If you're in immediate danger, please call now.
                </Text>

                <CallButton label={`Call ${primaryButtonLabel}`} onPress={() => handleCall(primary.number, "emergency")} />

                <SecondaryButton label={ui.findLabel} icon="map-marker-radius" onPress={handleFindPlaces} />

                {topicalCrisisLine && (
                  <SecondaryButton
                    label={`Talk to ${topicalCrisisLine.name} - ${topicalCrisisLine.number}`}
                    icon="phone-in-talk-outline"
                    onPress={() => handleCall(topicalCrisisLine.number, "crisis_line")}
                  />
                )}

                <TouchableOpacity style={styles.dismissLink} onPress={handleDismissSafe}>
                  <Text style={styles.dismissText}>I'm safe - close this</Text>
                </TouchableOpacity>

                <SafetyFooter primary={primary.number} />
              </>
            )}

            {/* ── location_ask ── */}
            {stage === "location_ask" && (
              <>
                <Text style={styles.body}>
                  To show places near you, I'll use your location for this screen only.
                  We won't save it.
                </Text>
                <CallButton label="Share location" onPress={handleLocationGrant} />
                <SecondaryButton label="Not now" onPress={handleLocationDeny} />
                <SafetyFooter primary={primary.number} />
              </>
            )}

            {/* ── places (map + list) ── */}
            {stage === "places" && (
              <>
                {loadingPlaces && (
                  <View style={{ padding: 16, alignItems: "center" }}>
                    <ActivityIndicator color={DANGER} />
                  </View>
                )}

                {!loadingPlaces && mapHtml && (
                  <View style={styles.mapBox}>
                    <WebView
                      originWhitelist={["*"]}
                      source={{ html: mapHtml }}
                      style={styles.map}
                      javaScriptEnabled
                      scalesPageToFit
                    />
                  </View>
                )}

                {!loadingPlaces && placesError && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                      {placesError === "location_denied"
                        ? `We can't find nearby places without your location. Please call ${primary.number}.`
                        : `We couldn't load places right now. Please call ${primary.number}.`}
                    </Text>
                  </View>
                )}

                {!loadingPlaces && places && places.length === 0 && !placesError && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{ui.emptyPlacesCopy}</Text>
                  </View>
                )}

                {!loadingPlaces && places && places.map((p) => (
                  <View key={p.place_id} style={styles.placeRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.placeName}>{p.name}</Text>
                      <Text style={styles.placeMeta}>
                        {formatDistance(p.distance_m)}{p.open_now === true ? " · Open" : ""}
                      </Text>
                    </View>
                    {p.phone && (
                      <TouchableOpacity style={styles.smallBtn} onPress={() => handleCall(p.phone, "hospital")} accessibilityLabel={`Call ${p.name}`}>
                        <MaterialCommunityIcons name="phone" size={16} color="#fff" />
                        <Text style={styles.smallBtnText}>Call</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.smallBtn, styles.smallBtnAlt]} onPress={() => handleOpenDirections(p)} accessibilityLabel={`Directions to ${p.name}`}>
                      <MaterialCommunityIcons name="map-marker" size={16} color={DANGER} />
                      <Text style={[styles.smallBtnText, { color: DANGER }]}>Map</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <CallButton label={`Call ${primaryButtonLabel}`} onPress={() => handleCall(primary.number, "emergency")} />

                {topicalCrisisLine && (
                  <SecondaryButton
                    label={`Talk to ${topicalCrisisLine.name} - ${topicalCrisisLine.number}`}
                    icon="phone-in-talk-outline"
                    onPress={() => handleCall(topicalCrisisLine.number, "crisis_line")}
                  />
                )}
                <TouchableOpacity style={styles.dismissLink} onPress={handleDismissSafe}>
                  <Text style={styles.dismissText}>I'm safe - close this</Text>
                </TouchableOpacity>
                <SafetyFooter primary={primary.number} />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function CallButton({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
    >
      <MaterialCommunityIcons name="phone" size={18} color="#fff" />
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.secondaryBtn} onPress={onPress} accessibilityLabel={label}>
      {icon && <MaterialCommunityIcons name={icon} size={18} color={DANGER} />}
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SafetyFooter({ primary }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerStrong}>If you are in immediate danger, please call {primary} now.</Text>
      <Text style={styles.footerMuted}>{DISCLAIMER}</Text>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function pickCrisisLine(lines, topic, excludeNumber) {
  if (!Array.isArray(lines) || lines.length === 0) return null;
  // Prefer topic-match; skip if it would just duplicate the primary CTA number.
  const candidates = [
    ...lines.filter((l) => l.topic === topic && l.number !== excludeNumber),
    ...lines.filter((l) => l.topic !== topic && l.number !== excludeNumber),
  ];
  return candidates[0] || null;
}

function formatPrimaryLabel(p) {
  if (!p) return "";
  if (p.name && p.name !== "Emergency") return `${p.name} - ${p.number}`;
  return `${p.number}${p.label ? ` (${p.label})` : ""}`;
}

function formatDistance(m) {
  if (typeof m !== "number") return "";
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

async function requestOneShotLocation() {
  try {
    const Location = require("expo-location");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch (_e) {
    return null;
  }
}

/**
 * Leaflet + OSM tiles inside a WebView. Free, no API key, works in Expo Go.
 * Markers come from server-side data only - no user-typed text injected.
 */
function buildLeafletHtml(user, places) {
  const payload = JSON.stringify({
    user: { lat: user.lat, lng: user.lng },
    places: (places || []).map((p) => ({
      lat: p.lat,
      lng: p.lng,
      name: String(p.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 80),
    })),
  });
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>html,body,#map{margin:0;padding:0;height:100%;width:100%;}</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var d = ${payload};
  var map = L.map('map', { zoomControl: true, attributionControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap', maxZoom: 19
  }).addTo(map);
  var bounds = L.latLngBounds([]);
  var youIcon = L.divIcon({
    className: 'you',
    html: '<div style="background:#2D78F4;border:3px solid #fff;border-radius:50%;width:14px;height:14px;box-shadow:0 0 0 2px #2D78F4;"></div>',
    iconSize: [14,14], iconAnchor: [7,7]
  });
  L.marker([d.user.lat, d.user.lng], { icon: youIcon, title: 'You' }).addTo(map).bindPopup('You are here');
  bounds.extend([d.user.lat, d.user.lng]);
  d.places.forEach(function(p) {
    L.marker([p.lat, p.lng]).addTo(map).bindPopup('<b>' + p.name + '</b>');
    bounds.extend([p.lat, p.lng]);
  });
  if (d.places.length) {
    map.fitBounds(bounds, { padding: [24,24], maxZoom: 15 });
  } else {
    map.setView([d.user.lat, d.user.lng], 14);
  }
</script>
</body></html>`;
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", paddingHorizontal: 20 },
  card: { backgroundColor: CARD_BG, borderRadius: 18, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: BORDER, marginBottom: 10 },
  headerText: { flex: 1, fontSize: 16, fontWeight: "700", color: INK },
  body: { fontSize: 15, color: INK, lineHeight: 21, marginBottom: 14 },
  primaryBtn: {
    backgroundColor: DANGER, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, minHeight: 48,
  },
  primaryBtnDisabled: { backgroundColor: DANGER_DARK, opacity: 0.7 },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700", textAlign: "center", flexShrink: 1 },
  secondaryBtn: {
    backgroundColor: SOFT_BG, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, minHeight: 46,
  },
  secondaryBtnText: { color: DANGER, fontSize: 15, fontWeight: "600", textAlign: "center", flexShrink: 1 },
  dismissLink: { alignItems: "center", paddingVertical: 8 },
  dismissText: { color: MUTED, fontSize: 13, textDecorationLine: "underline" },
  footer: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  footerStrong: { color: DANGER, fontSize: 13, fontWeight: "600", marginBottom: 4 },
  footerMuted: { color: MUTED, fontSize: 11 },
  errorBox: { backgroundColor: SOFT_BG, padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  errorText: { color: INK, fontSize: 13 },
  mapBox: {
    height: 200, borderRadius: 12, overflow: "hidden", marginBottom: 12,
    borderWidth: 1, borderColor: BORDER, backgroundColor: "#EEE",
  },
  map: { flex: 1 },
  placeRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  placeName: { fontSize: 14, fontWeight: "600", color: INK },
  placeMeta: { fontSize: 12, color: MUTED, marginTop: 2 },
  smallBtn: { backgroundColor: DANGER, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 4 },
  smallBtnAlt: { backgroundColor: "#fff", borderWidth: 1, borderColor: DANGER },
  smallBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
