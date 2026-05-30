// contexts/LocationContext.js
// App-wide foreground location, held in MEMORY only (never persisted to disk).
// Lives for one app session; on cold start we re-request.
//
// Design intent (SAFETY_DESIGN.md §7): location is sensitive; we get explicit
// permission, use it only for emergency-adjacent features (Crisis Sheet,
// emergency-number country resolution, optional chat awareness), and never
// write it to AsyncStorage / disk.
//
// Status values:
//   "idle"       - not requested yet
//   "requesting" - permission prompt or fix in flight
//   "granted"    - coords + (optionally) country available
//   "denied"     - user declined; consumers should fall back gracefully
//   "error"      - expo-location threw or wasn't installed

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../apiConfig";

const LocationContext = createContext({
  location: null,        // { lat, lng, country?: string }
  status: "idle",
  refresh: () => {},
});

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("idle");

  const fetchLocation = useCallback(async () => {
    setStatus("requesting");
    try {
      // expo-location is required lazily so the app builds even before install.
      let Location;
      try {
        Location = require("expo-location");
      } catch (_e) {
        setStatus("error");
        return;
      }

      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setStatus("denied");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Resolve country via our backend (which already wraps Nominatim with caching).
      // Fails open - we still set the coords even if country lookup errors.
      let country = null;
      try {
        const resp = await fetch(
          `${API_BASE_URL}/api/safety/emergency/lookup?lat=${lat}&lng=${lng}`
        );
        if (resp.ok) {
          const data = await resp.json();
          country = data.country || null;
        }
      } catch (_e) {
        /* network blip - proceed without country */
      }

      setLocation({ lat, lng, country });
      setStatus("granted");
    } catch (_e) {
      setStatus("error");
    }
  }, []);

  // Auto-request once on mount. If the OS already granted previously, this is
  // silent. If the user denied, we'll just stay in "denied" state and the
  // Crisis Sheet's in-flow consent prompt is still there as a second chance.
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <LocationContext.Provider value={{ location, status, refresh: fetchLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
