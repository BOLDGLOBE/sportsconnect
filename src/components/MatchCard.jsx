import React from 'react';

export default function MatchCard({ match, onJoin, onViewDetails, isJoined = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sportEmojis = {
    Cricket: '🏏',
    Football: '⚽',
    Badminton: '🏸',
    Basketball: '🏀',
    Tennis: '🎾',
  };

  const skillColors = {
    Beginner: '#27ae60',
    Intermediate: '#f39c12',
    Advanced: '#e74c3c',
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.sportSection}>
          <span style={styles.emoji}>{sportEmojis[match.sport] || '⚽'}</span>
          <div>
            <h3 style={styles.sport}>{match.sport}</h3>
            <p style={styles.location}>
              📍 {match.location?.name || 'Location TBD'}
              {match.distance != null && ` • ${match.distance.toFixed(1)}km away`}
            </p>
          </div>
        </div>
        <span style={{ ...styles.badge, background: skillColors[match.skillLevel] || '#999' }}>
          {match.skillLevel}
        </span>
      </div>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.label}>📅 Date</span>
          <span>{formatDate(match.date)}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.label}>🕐 Time</span>
          <span>{match.time || 'TBD'}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.label}>👥 Players</span>
          <span>{match.participants?.length || 0} / {match.playersNeeded}</span>
        </div>
      </div>

      {match.description && <p style={styles.description}>{match.description}</p>}

      <div style={styles.footer}>
        <button onClick={() => onViewDetails(match.id)} style={styles.detailsBtn}>
          View Details
        </button>
        <button
          onClick={() => onJoin(match.id)}
          disabled={isJoined}
          style={{
            ...styles.joinBtn,
            background: isJoined ? '#bdc3c7' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            cursor: isJoined ? 'not-allowed' : 'pointer',
          }}
        >
          {isJoined ? '✓ Joined' : 'Join Match'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '12px',
  },
  sportSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  emoji: {
    fontSize: '32px',
  },
  sport: {
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    margin: '4px 0 0 0',
    fontSize: '12px',
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
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '13px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '4px',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    marginTop: '0',
  },
  footer: {
    display: 'flex',
    gap: '12px',
  },
  detailsBtn: {
    flex: 1,
    padding: '10px',
    border: '2px solid #667eea',
    background: 'white',
    color: '#667eea',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  joinBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
