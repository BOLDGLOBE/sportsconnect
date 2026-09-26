import React from 'react';
import { T, glass, neonBtn, ghostBtn } from '../theme';

export default function MatchCard({ match, onJoin, onViewDetails, isJoined = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sportEmojis = {
    Cricket: '🏏', Football: '⚽', Badminton: '🏸', Basketball: '🏀', Tennis: '🎾',
    Volleyball: '🏐', Kabaddi: '🤼', Hockey: '🏑',
  };

  const skillColors = {
    Beginner: '#39ff88',
    Intermediate: '#ffb020',
    Advanced: '#ff4d6d',
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.sportSection}>
          <span style={styles.emoji}>{sportEmojis[match.sport] || '⚡'}</span>
          <div>
            <h3 style={styles.sport}>{match.sport?.toUpperCase()}</h3>
            <p style={styles.location}>
              📍 {match.location?.name || 'Location TBD'}
              {match.distance != null && ` • ${match.distance.toFixed(1)}km away`}
            </p>
          </div>
        </div>
        <span style={{ ...styles.badge, color: skillColors[match.skillLevel] || T.muted, borderColor: skillColors[match.skillLevel] || T.border }}>
          {match.skillLevel}
        </span>
      </div>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.label}>📅 DATE</span>
          <span>{formatDate(match.date)}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.label}>🕐 TIME</span>
          <span>{match.time || 'TBD'}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.label}>👥 PLAYERS</span>
          <span>{match.participants?.length || 0} / {match.playersNeeded}</span>
        </div>
      </div>

      {match.description && <p style={styles.description}>{match.description}</p>}

      <div style={styles.footer}>
        <button onClick={() => onViewDetails(match.id)} style={{ ...styles.detailsBtn, ...ghostBtn }}>
          VIEW DETAILS
        </button>
        <button
          onClick={() => onJoin(match.id)}
          disabled={isJoined}
          style={{
            ...styles.joinBtn,
            ...neonBtn,
            ...(isJoined ? { background: 'rgba(57, 255, 136, 0.12)', color: T.green, boxShadow: 'none' } : {}),
          }}
        >
          {isJoined ? '✓ JOINED' : 'JOIN MATCH'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    ...glass,
    padding: '20px',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    borderBottom: `1px solid ${T.border}`,
    paddingBottom: '12px',
  },
  sportSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  emoji: {
    fontSize: '30px',
    filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))',
  },
  sport: {
    margin: '0',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '1.5px',
    color: T.text,
  },
  location: {
    margin: '4px 0 0 0',
    fontSize: '12px',
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
    fontFamily: T.fontBody,
    letterSpacing: '0.5px',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: 'rgba(0, 245, 255, 0.04)',
    border: `1px solid ${T.border}`,
    borderRadius: '10px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '13px',
    color: T.text,
  },
  label: {
    fontWeight: 'bold',
    color: T.muted,
    marginBottom: '4px',
    fontSize: '10px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  description: {
    fontSize: '13px',
    color: T.muted,
    marginBottom: '16px',
    marginTop: '0',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    gap: '12px',
  },
  detailsBtn: {
    flex: 1,
    padding: '11px',
    fontSize: '12px',
    letterSpacing: '1px',
  },
  joinBtn: {
    flex: 1,
    padding: '11px',
    fontSize: '12px',
    letterSpacing: '1px',
  },
};
