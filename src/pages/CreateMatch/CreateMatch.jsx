import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../../api';
import { useLocationContext } from '../../context/LocationContext';
import { SPORTS } from '../../data/sports';
import { T, glass, neonBtn, ghostBtn } from '../../theme';

export default function CreateMatch() {
  const navigate = useNavigate();
  const { coords, status, requestLocation } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [useManual, setUseManual] = useState(false);
  const [formData, setFormData] = useState({
    sport: 'Cricket',
    date: '',
    time: '',
    duration: '2',
    locationName: '',
    playersNeeded: '10',
    skillLevel: 'Beginner',
    description: '',
  });

  useEffect(() => {
    if (coords) {
      setLocation(coords);
      setFormData((prev) => ({
        ...prev,
        locationName:
          prev.locationName ||
          `Near ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
      }));
    }
  }, [coords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const finalLocation = location ||
      (useManual && manualCoords.lat && manualCoords.lng
        ? { latitude: Number(manualCoords.lat), longitude: Number(manualCoords.lng) }
        : null);

    if (!finalLocation) {
      setError('No location. Allow location access or enter coordinates below.');
      setLoading(false);
      return;
    }

    try {
      await createMatch({
        ...formData,
        latitude: finalLocation.latitude,
        longitude: finalLocation.longitude,
        playersNeeded: parseInt(formData.playersNeeded, 10),
        duration: Number(formData.duration),
      });
      navigate('/discover');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← BACK</button>
        <h1 style={styles.title}>⚡ HOST A MATCH</h1>
        <div style={{ width: '70px' }}></div>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label}>SPORT</label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              style={styles.input}
              required
            >
              {SPORTS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>DATE</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>TIME</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>DURATION (HRS)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="8"
                style={styles.input}
                required
              />
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>PLAYERS NEEDED</label>
              <input
                type="number"
                name="playersNeeded"
                value={formData.playersNeeded}
                onChange={handleChange}
                min="2"
                max="50"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>LOCATION NAME</label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="e.g., Marina Beach Ground"
              style={styles.input}
              required
            />
            <p style={styles.hint}>
              GRID LOCK:{' '}
              {location
                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : 'NO SIGNAL'}
            </p>
            {status !== 'granted' && (
              <button type="button" onClick={requestLocation} style={{ ...styles.retryLocBtn, ...ghostBtn }}>
                🔄 RE-SCAN LOCATION
              </button>
            )}
          </div>

          {!location && (
            <div style={styles.formGroup}>
              <label style={styles.label}>OR ENTER COORDINATES MANUALLY</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (13.0827)"
                  value={manualCoords.lat}
                  onChange={(e) => setManualCoords((p) => ({ ...p, lat: e.target.value }))}
                  style={styles.input}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (80.2707)"
                  value={manualCoords.lng}
                  onChange={(e) => setManualCoords((p) => ({ ...p, lng: e.target.value }))}
                  style={styles.input}
                />
              </div>
              <p style={styles.hint}>
                Tip: right-click anywhere in Google Maps and copy the first number (lat), then the
                second (lng).
              </p>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>SKILL LEVEL REQUIRED</label>
            <select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>DESCRIPTION (OPTIONAL)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any additional details about the match..."
              style={{ ...styles.input, minHeight: '90px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...neonBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'LAUNCHING…' : '⚡ LAUNCH MATCH'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: T.fontBody,
  },
  header: {
    background:
      'linear-gradient(90deg, rgba(7,11,24,0.95) 0%, rgba(13,18,38,0.9) 50%, rgba(7,11,24,0.95) 100%)',
    borderBottom: `1px solid ${T.border}`,
    color: T.text,
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'rgba(0, 245, 255, 0.06)',
    border: `1px solid ${T.border}`,
    color: T.neon,
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  title: {
    margin: '0',
    fontSize: '18px',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    color: T.neon,
    textShadow: T.glow,
  },
  formContainer: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '0 16px',
  },
  form: {
    ...glass,
    padding: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    marginBottom: '8px',
    color: T.muted,
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: `1px solid ${T.border}`,
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: 'rgba(7, 11, 24, 0.85)',
    color: T.text,
    transition: 'border-color 0.3s',
  },
  hint: {
    fontSize: '12px',
    color: T.muted,
    margin: '6px 0 0 0',
  },
  retryLocBtn: {
    marginTop: '8px',
    padding: '8px 14px',
    fontSize: '11px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  error: {
    background: 'rgba(255, 77, 109, 0.12)',
    border: `1px solid ${T.borderPink}`,
    color: T.red,
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
};
