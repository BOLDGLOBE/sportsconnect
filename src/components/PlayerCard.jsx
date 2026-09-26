import React from 'react';

export default function PlayerCard({ player, rank }) {
  const sportEmojis = {
    Cricket: '🏏', Football: '⚽', Badminton: '🏸', Basketball: '🏀', Tennis: '🎾',
  };

  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <div style={styles.card}>
      <div style={styles.rank}>{medal}</div>
      <div style={styles.avatar}>{(player.name || '?').charAt(0)}</div>
      <div style={styles.info}>
        <p style={styles.name}>
          {player.name} {player.isDemo && <span style={styles.demoTag}>community legend</span>}
        </p>
        <p style={styles.meta}>
          {sportEmojis[player.sport] || '⚽'} {player.sport} • {player.skill}
          {player.location && ` • ${player.location}`}
        </p>
      </div>
      <div style={styles.stats}>
        <span style={styles.rating}>⭐ {player.rating?.toFixed(1)}</span>
        <span style={styles.matches}>{player.matches} matches</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  rank: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#667eea',
    width: '34px',
    textAlign: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  info: {
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  demoTag: {
    fontSize: '10px',
    color: '#999',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  meta: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#888',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: '13px',
    color: '#f39c12',
    fontWeight: 'bold',
  },
  matches: {
    fontSize: '11px',
    color: '#999',
  },
};
