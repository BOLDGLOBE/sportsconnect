import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMatchDetails, joinMatch, leaveMatch, deleteMatch } from '../../api';
import { T, glass, neonBtn } from '../../theme';

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
          <button onClick={() => navigate('/discover')} style={styles.backBtn}>← BACK</button>
          <h1 style={styles.title}>MATCH DETAILS</h1>
          <div style={{ width: '56px' }} />
        </div>
        <p style={styles.errorBox}>{error || 'Match not found.'}</p>
      </div>
    );
  }

  const isCreator = match.creatorId === currentUser?.id;
  const isJoined = (match.participants || []).some((p) => p.id === currentUser?.id);
  const isFull = (match.participants || []).length >= match.playersNeeded;
  const sportEmojis = {
    Cricket: '🏏', Football: '⚽', Badminton: '🏸', Basketball: '🏀', Tennis: '🎾',
    Volleyball: '🏐', Kabaddi: '🤼', Hockey: '🏑',
  };
  const skillColors = { Beginner: '#39ff88', Intermediate: '#ffb020', Advanced: '#ff4d6d' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← BACK</button>
        <h1 style={styles.title}>MATCH DETAILS</h1>
        <div style={{ width: '56px' }} />
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.emoji}>{sportEmojis[match.sport] || '⚡'}</span>
            <div>
              <h2 style={styles.sport}>{match.sport?.toUpperCase()}</h2>
              <p style={styles.location}>📍 {match.location?.name}</p>
            </div>
            <span style={{ ...styles.badge, color: skillColors[match.skillLevel] || T.muted, borderColor: skillColors[match.skillLevel] || T.border }}>
              {match.skillLevel}
            </span>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>📅 DATE</span>
              <span style={styles.infoValue}>{match.date}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>🕐 TIME</span>
              <span style={styles.infoValue}>{match.time}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>⏱ DURATION</span>
              <span style={styles.infoValue}>{match.duration} hours</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>👥 PLAYERS</span>
              <span style={styles.infoValue}>
                {match.participants?.length || 0} / {match.playersNeeded}
              </span>
            </div>
          </div>

          {match.distance != null && (
            <p style={styles.distance}>📏 {match.distance.toFixed(1)} km from your grid</p>
          )}

          {match.description && (
            <div style={styles.descriptionBox}>
              <p style={styles.descriptionLabel}>BRIEFING</p>
              <p style={styles.descriptionText}>{match.description}</p>
            </div>
          )}

          <div style={styles.participantsSection}>
            <p style={styles.participantsTitle}>
              👥 SQUAD ({match.participants?.length || 0}/{match.playersNeeded})
            </p>
            {(match.participants || []).map((p) => (
              <div key={p.id} style={styles.participantRow}>
                <div style={styles.avatar}>
                  {(p.displayName || '?').charAt(0).toUpperCase()}
                </div>
                <div style={styles.participantInfo}>
                  <span style={styles.participantName}>
                    {p.displayName} {p.id === match.creatorId && <span style={styles.creatorTag}>👑 HOST</span>}
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
                🗑 DELETE MATCH
              </button>
            ) : isJoined ? (
              <button onClick={handleLeave} disabled={actionLoading} style={styles.leaveBtn}>
                LEAVE MATCH
              </button>
            ) : match.status === 'open' && !isFull ? (
              <button onClick={handleJoin} disabled={actionLoading} style={{ ...styles.joinBtn, ...neonBtn }}>
                ⚡ JOIN MATCH
              </button>
            ) : (
              <button disabled style={styles.fullBtn}>
                {isFull ? 'MATCH IS FULL' : 'MATCH CLOSED'}
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${T.border}`,
  },
  emoji: {
    fontSize: '38px',
    filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.4))',
  },
  sport: {
    margin: '0',
    fontSize: '22px',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    flex: 1,
    color: T.text,
  },
  location: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: T.muted,
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    border: '1px solid',
    background: 'rgba(255,255,255,0.03)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  infoItem: {
    background: 'rgba(0, 245, 255, 0.04)',
    border: `1px solid ${T.border}`,
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    color: T.text,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: T.muted,
    marginBottom: '4px',
    fontSize: '10px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  infoValue: {
    color: T.text,
  },
  distance: {
    fontSize: '13px',
    color: T.neon,
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  },
  descriptionBox: {
    background: 'rgba(176, 38, 255, 0.06)',
    border: `1px solid ${T.border}`,
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  descriptionLabel: {
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    color: T.neon2,
    margin: '0 0 4px 0',
  },
  descriptionText: {
    fontSize: '14px',
    color: T.text,
    margin: '0',
    lineHeight: 1.6,
  },
  participantsSection: {
    marginBottom: '20px',
  },
  participantsTitle: {
    fontWeight: 'bold',
    fontSize: '12px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: T.text,
    margin: '0 0 12px 0',
  },
  participantRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderBottom: `1px solid ${T.border}`,
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: T.grad,
    color: '#04101c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    flexShrink: 0,
  },
  participantInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  participantName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: T.text,
  },
  creatorTag: {
    fontSize: '11px',
    color: T.amber,
  },
  youTag: {
    fontSize: '11px',
    color: T.muted,
    fontWeight: 'normal',
  },
  participantMeta: {
    fontSize: '12px',
    color: T.muted,
  },
  rating: {
    fontSize: '12px',
    color: T.amber,
  },
  actions: {
    marginTop: '20px',
  },
  joinBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  leaveBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: T.red,
    background: 'rgba(255, 77, 109, 0.08)',
    border: `1px solid ${T.borderPink}`,
    borderRadius: '10px',
    cursor: 'pointer',
  },
  deleteBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: '#04101c',
    background: T.red,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: T.glowPink,
  },
  fullBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: T.muted,
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${T.border}`,
    borderRadius: '10px',
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
  errorBox: {
    background: 'rgba(255, 77, 109, 0.12)',
    border: `1px solid ${T.borderPink}`,
    color: T.red,
    padding: '12px',
    borderRadius: '10px',
    margin: '20px',
    maxWidth: '600px',
  },
};
