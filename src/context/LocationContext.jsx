import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

export const LocationContext = createContext(null);

// Default center (Chennai) used when the user denies location access,
// so clubs & distances still work. Change DEFAULT_CENTER to your city.
const DEFAULT_CENTER = { latitude: 13.0827, longitude: 80.2707, label: 'Chennai' };

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null);
  const [placeLabel, setPlaceLabel] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | granted | denied | unavailable
  const [manualEntry, setManualEntry] = useState(null); // {latitude, longitude, label}

  const requestLocation = useCallback(() => {
    setStatus('loading');
    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setStatus('granted');
        reverseGeocode(latitude, longitude);
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Reverse geocode via OpenStreetMap Nominatim (free, no key needed)
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&accept-language=en`
      );
      const data = await res.json();
      const a = data.address || {};
      const label =
        a.suburb || a.neighbourhood || a.village || a.town || a.city_district || a.city || 'Your area';
      setPlaceLabel(label);
    } catch {
      setPlaceLabel(null);
    }
  }

  // Fallback used when GPS is denied or unavailable
  const effectiveCoords = coords || manualEntry || (status === 'denied' || status === 'unavailable' ? DEFAULT_CENTER : null);

  const value = {
    coords: effectiveCoords,
    isRealLocation: Boolean(coords || manualEntry),
    placeLabel: placeLabel || manualEntry?.label || (effectiveCoords && !coords ? DEFAULT_CENTER.label : null),
    status,
    requestLocation,
    setManualLocation: (lat, lng, label) => {
      setManualEntry({ latitude: Number(lat), longitude: Number(lng), label });
      setStatus('granted');
    },
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  return useContext(LocationContext);
}
