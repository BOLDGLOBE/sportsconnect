import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMatchDetails, joinMatch, leaveMatch, deleteMatch } from '../../api';

export default function MatchDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadMatch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMatchDetails(id);
      setMatch(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  async function handleJoin() {
    setActionLoading(true);
    try {
      const updated = await joinMatch(id);
      setMatch(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    setActionLoading(true);
    try {
      const updated = await leaveMatch(id);
      setMatch(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this match? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await deleteMatch(id);
      navigate('/discover');
    } catch (err) {
      alert(err.message);
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner} />
        <p>Loading match…</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate('/discover')} style={styles.backBtn}>← Back</button>
          <h1 style={styles.title}>Match Details</h1>
          <div style={{ width: '40px' }} />
        </div>
        <p style={styles.errorBox}>{error || 'Match not found.'}</p>
      </div>
    );
  }

  const isCreator = match.creatorId === currentUser?.id;
  const isJoined = (match.participants || []).some((p) => p.id === currentUser?.id);
  const isFull = (match.participants || []).length >= match.playersNeeded;
  const sportEmojis = { Cricket: '🏏', Football: '⚽', Badminton: '🏸', Basketball: '🏀', Tennis: '🎾' };
  const skillColors = { Beginner: '#27ae60', Intermediate: '#f39c12', Advanced: '#e74c3c' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>Match Details</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.emoji}>{sportEmojis[match.sport] || '⚽'}</span>
            <div>
              <h2 style={styles.sport}>{match.sport}</h2>
              <p style={styles.location}>📍 {match.location?.name}</p>
            </div>
            <span style={{ ...styles.badge, background: skillColors[match.skillLevel] || '#999' }}>
              {match.skillLevel}
            </span>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>📅 Date</span>
              <span style={styles.infoValue}>{match.date}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>🕐 Time</span>
              <span style={styles.infoValue}>{match.time}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>⏱ Duration</span>
              <span style={styles.infoValue}>{match.duration} hours</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>👥 Players</span>
              <span style={styles.infoValue}>
                {match.participants?.length || 0} / {match.playersNeeded}
              </span>
            </div>
          </div>

          {match.distance != null && (
            <p style={styles.distance}>📏 {match.distance.toFixed(1)} km from you</p>
          )}

          {match.description && (
            <div style={styles.descriptionBox}>
              <p style={styles.descriptionLabel}>Description</p>
              <p style={styles.descriptionText}>{match.description}</p>
            </div>
          )}

          <div style={styles.participantsSection}>
            <p style={styles.participantsTitle}>
              👥 Participants ({match.participants?.length || 0}/{match.playersNeeded})
            </p>
            {(match.participants || []).map((p) => (
              <div key={p.id} style={styles.participantRow}>
                <div style={styles.avatar}>
                  {(p.displayName || '?').charAt(0).toUpperCase()}
                </div>
                <div style={styles.participantInfo}>
                  <span style={styles.participantName}>
                    {p.displayName} {p.id === match.creatorId && <span style={styles.creatorTag}>👑 Creator</span>}
                    {p.id === currentUser?.id && <span style={styles.youTag}> (you)</span>}
                  </span>
                  <span style={styles.participantMeta}>
                    {p.sport || ''} {p.skillLevel ? `• ${p.skillLevel}` : ''}
                  </span>
                </div>
                <span style={styles.rating}>⭐ {p.rating?.toFixed(1) || 'New'}</span>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            {isCreator ? (
              <button onClick={handleDelete} disabled={actionLoading} style={styles.deleteBtn}>
                🗑 Delete Match
              </button>
            ) : isJoined ? (
              <button onClick={handleLeave} disabled={actionLoading} style={styles.leaveBtn}>
                Leave Match
              </button>
            ) : match.status === 'open' && !isFull ? (
              <button onClick={handleJoin} disabled={actionLoading} style={styles.joinBtn}>
                Join Match
              </button>
            ) : (
              <button disabled style={styles.fullBtn}>
                {isFull ? 'Match is Full' : 'Match Closed'}
              </button>
            )}
          </div>
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
  },
  emoji: {
    fontSize: '40px',
  },
  sport: {
    margin: '0',
    fontSize: '24px',
    flex: 1,
  },
  location: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#666',
  },
  badge: {
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  infoItem: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '4px',
    fontSize: '12px',
  },
  infoValue: {
    color: '#333',
  },
  distance: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  },
  descriptionBox: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  descriptionLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#555',
    margin: '0 0 4px 0',
  },
  descriptionText: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
  participantsSection: {
    marginBottom: '20px',
  },
  participantsTitle: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
    margin: '0 0 12px 0',
  },
  participantRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  participantInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  participantName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  creatorTag: {
    fontSize: '11px',
    color: '#f39c12',
  },
  youTag: {
    fontSize: '11px',
    color: '#999',
    fontWeight: 'normal',
  },
  participantMeta: {
    fontSize: '12px',
    color: '#999',
  },
  rating: {
    fontSize: '12px',
    color: '#f39c12',
  },
  actions: {
    marginTop: '20px',
  },
  joinBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  leaveBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#e74c3c',
    background: 'white',
    border: '2px solid #e74c3c',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  fullBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#999',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
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
  errorBox: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    margin: '20px',
    maxWidth: '600px',
  },
};
