import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api';

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
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>My Profile</h1>
        <div style={{ width: '40px' }} />
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
              <span style={styles.statLabel}>Created</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile?.matchesJoined ?? 0}</span>
              <span style={styles.statLabel}>Joined</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile?.rating > 0 ? profile.rating.toFixed(1) : '—'}</span>
              <span style={styles.statLabel}>Rating</span>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Display Name</label>
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
                  <label style={styles.label}>Primary Sport</label>
                  <select name="sport" value={formData.sport} onChange={handleChange} style={styles.input}>
                    <option>Cricket</option>
                    <option>Football</option>
                    <option>Badminton</option>
                    <option>Basketball</option>
                    <option>Tennis</option>
                  </select>
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Skill Level</label>
                  <select name="skillLevel" value={formData.skillLevel} onChange={handleChange} style={styles.input}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
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
                <button type="button" onClick={() => setEditMode(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={styles.saveBtn}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🏏 Primary Sport</span>
                <span>{profile?.sport}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📊 Skill Level</span>
                <span>{profile?.skillLevel}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📝 Bio</span>
                <span style={styles.bioText}>{profile?.bio || 'No bio yet'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📍 Location</span>
                <span>
                  {profile?.location?.latitude != null
                    ? `${profile.location.latitude.toFixed(4)}, ${profile.location.longitude.toFixed(4)}`
                    : 'Not set'}
                </span>
              </div>

              <button onClick={() => setEditMode(true)} style={styles.editBtn}>
                ✏️ Edit Profile
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
  content: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '0 20px',
  },
  card: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    margin: '0',
    fontSize: '22px',
    color: '#333',
  },
  email: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#999',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  statBox: {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
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
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    gap: '12px',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
    whiteSpace: 'nowrap',
  },
  bioText: {
    textAlign: 'right',
    color: '#666',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  editBtn: {
    width: '100%',
    marginTop: '20px',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '12px',
    color: '#667eea',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e0e0f5',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  success: {
    background: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
};
