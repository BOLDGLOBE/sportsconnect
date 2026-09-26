import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api';
import { SPORTS } from '../../data/sports';
import { T, glass, neonBtn, ghostBtn } from '../../theme';

export default function Profile() {
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    sport: 'Cricket',
    skillLevel: 'Beginner',
    bio: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setFormData({
        displayName: data.displayName || '',
        sport: data.sport || 'Cricket',
        skillLevel: data.skillLevel || 'Beginner',
        bio: data.bio || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updated = await updateMyProfile(formData);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner} />
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← BACK</button>
        <h1 style={styles.title}>PLAYER PROFILE</h1>
        <div style={{ width: '56px' }} />
      </div>

      <div style={styles.content}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              {(profile?.displayName || '?').charAt(0).toUpperCase()}
            </div>
            <div style={styles.profileInfo}>
              <h2 style={styles.name}>{profile?.displayName}</h2>
              <p style={styles.email}>{profile?.email}</p>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile?.matchesCreated ?? 0}</span>
              <span style={styles.statLabel}>HOSTED</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile?.matchesJoined ?? 0}</span>
              <span style={styles.statLabel}>JOINED</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile?.rating > 0 ? profile.rating.toFixed(1) : '—'}</span>
              <span style={styles.statLabel}>RATING</span>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>DISPLAY NAME</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>PRIMARY SPORT</label>
                  <select name="sport" value={formData.sport} onChange={handleChange} style={styles.input}>
                    {SPORTS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.emoji} {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>SKILL LEVEL</label>
                  <select name="skillLevel" value={formData.skillLevel} onChange={handleChange} style={styles.input}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>BIO</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell other players about yourself..."
                  style={{ ...styles.input, minHeight: '80px' }}
                  maxLength={300}
                />
              </div>

              <div style={styles.actionsRow}>
                <button type="button" onClick={() => setEditMode(false)} style={{ ...styles.cancelBtn, ...ghostBtn }}>
                  CANCEL
                </button>
                <button type="submit" disabled={saving} style={{ ...styles.saveBtn, ...neonBtn }}>
                  {saving ? 'SAVING…' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🏏 PRIMARY SPORT</span>
                <span>{profile?.sport}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📊 SKILL LEVEL</span>
                <span>{profile?.skillLevel}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📝 BIO</span>
                <span style={styles.bioText}>{profile?.bio || 'No bio yet'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📍 GRID LOCATION</span>
                <span>
                  {profile?.location?.latitude != null
                    ? `${profile.location.latitude.toFixed(4)}, ${profile.location.longitude.toFixed(4)}`
                    : 'Not set'}
                </span>
              </div>

              <button onClick={() => setEditMode(true)} style={{ ...styles.editBtn, ...neonBtn }}>
                ⚡ EDIT PROFILE
              </button>
            </div>
          )}
        </div>
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
  content: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '0 16px',
  },
  card: {
    ...glass,
    padding: '30px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: T.grad,
    color: '#04101c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    boxShadow: T.glow,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    margin: '0',
    fontSize: '22px',
    color: T.text,
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  email: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: T.muted,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  statBox: {
    background: 'rgba(0, 245, 255, 0.04)',
    border: `1px solid ${T.border}`,
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    color: T.neon,
    textShadow: T.glow,
  },
  statLabel: {
    fontSize: '10px',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    color: T.muted,
    marginTop: '4px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    marginBottom: '6px',
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
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${T.border}`,
    fontSize: '14px',
    gap: '12px',
    color: T.text,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    fontSize: '11px',
    letterSpacing: '1px',
    color: T.muted,
    whiteSpace: 'nowrap',
  },
  bioText: {
    textAlign: 'right',
    color: T.muted,
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '12px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '12px',
    letterSpacing: '1px',
  },
  editBtn: {
    width: '100%',
    marginTop: '20px',
    padding: '12px',
    fontSize: '13px',
    letterSpacing: '1px',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '12px',
    color: T.neon,
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid rgba(0, 245, 255, 0.15)',
    borderTop: `4px solid ${T.neon}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    background: 'rgba(255, 77, 109, 0.12)',
    border: `1px solid ${T.borderPink}`,
    color: T.red,
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  success: {
    background: 'rgba(57, 255, 136, 0.1)',
    border: '1px solid rgba(57, 255, 136, 0.35)',
    color: T.green,
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
};
