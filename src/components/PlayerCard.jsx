import React from 'react';
import { T, glass } from '../theme';

export default function PlayerCard({ player, rank, distance }) {
  const sportEmojis = {
    Cricket: '🏏', Football: '⚽', Badminton: '🏸', Basketball: '🏀', Tennis: '🎾',
    Volleyball: '🏐', Kabaddi: '🤼', Hockey: '🏑',
  };

  const medal =
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank ? `#${rank}` : '📡';

  return (
    <div style={styles.card}>
      <div style={styles.rank}>{medal}</div>
      <div style={styles.avatar}>{(player.name || '?').charAt(0)}</div>
      <div style={styles.info}>
        <p style={styles.name}>
          {player.name} {player.isDemo && <span style={styles.demoTag}>community legend</span>}
        </p>
        <p style={styles.meta}>
          {sportEmojis[player.sport] || '⚽'} {player.sport || 'Multi-sport'} • {player.skill || 'All levels'}
          {player.location && ` • ${player.location}`}
          {distance != null && ` • ${distance.toFixed(1)}km away`}
        </p>
        {player.bio && <p style={styles.bio}>“{player.bio}”</p>}
      </div>
      <div style={styles.stats}>
        <span style={styles.rating}>⭐ {player.rating?.toFixed(1) || 'New'}</span>
        <span style={styles.matches}>{player.matches ?? 0} matches</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...glass,
    borderRadius: '14px',
    padding: '12px 16px',
    marginBottom: '10px',
  },
  rank: {
    fontSize: '15px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    color: T.neon,
    width: '36px',
    textAlign: 'center',
    textShadow: T.glow,
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: T.grad,
    color: '#04101c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '17px',
    boxShadow: T.glow,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: T.text,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  demoTag: {
    fontSize: '10px',
    color: T.neon2,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  meta: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: T.muted,
  },
  bio: {
    margin: '3px 0 0 0',
    fontSize: '11px',
    color: T.muted,
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: '13px',
    color: T.amber,
    fontWeight: 'bold',
    textShadow: '0 0 8px rgba(255, 176, 32, 0.4)',
  },
  matches: {
    fontSize: '11px',
    color: T.muted,
  },
};
