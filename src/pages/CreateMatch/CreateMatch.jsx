import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../../api';
import { useLocationContext } from '../../context/LocationContext';

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
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>Create a Match</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Sport</label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option>Cricket</option>
              <option>Football</option>
              <option>Badminton</option>
              <option>Basketball</option>
              <option>Tennis</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Date</label>
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
              <label style={styles.label}>Time</label>
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
              <label style={styles.label}>Duration (hours)</label>
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
              <label style={styles.label}>Players Needed</label>
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
            <label style={styles.label}>Location Name</label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="e.g., Central Park, Sports Ground XYZ"
              style={styles.input}
              required
            />
            <p style={styles.hint}>
              Current location:{' '}
              {location
                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : 'Not detected'}
            </p>
            {status !== 'granted' && (
              <button type="button" onClick={requestLocation} style={styles.retryLocBtn}>
                🔄 Try detecting location again
              </button>
            )}
          </div>

          {!location && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Or enter coordinates manually</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g. 13.0827)"
                  value={manualCoords.lat}
                  onChange={(e) => setManualCoords((p) => ({ ...p, lat: e.target.value }))}
                  style={styles.input}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g. 80.2707)"
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
            <label style={styles.label}>Skill Level Required</label>
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
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any additional details about the match..."
              style={{ ...styles.input, minHeight: '100px', fontFamily: 'Arial' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating Match...' : 'Create Match'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.5)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    margin: '0',
    fontSize: '24px',
  },
  formContainer: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '0 20px',
  },
  form: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    margin: '4px 0 0 0',
  },
  retryLocBtn: {
    marginTop: '8px',
    padding: '8px 14px',
    background: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
  },
};
