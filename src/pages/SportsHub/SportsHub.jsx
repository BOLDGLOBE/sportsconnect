import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopPlayers } from '../../api';
import { SPORTS, HOT_SPORTS, popularSports } from '../../data/sports';
import PlayerCard from '../../components/PlayerCard';
import { T, glass, neonBtn } from '../../theme';

export default function SportsHub() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(popularSports[0].name);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sport = popularSports.find((s) => s.name === selected) || popularSports[0];
  const isHot = HOT_SPORTS.includes(sport.name);

  const loadPlayers = useCallback(async (sportName) => {
    setLoading(true);
    setError('');
    try {
      const list = await getTopPlayers(sportName);
      setPlayers(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlayers(selected);
  }, [selected, loadPlayers]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/discover')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>⌬ SPORTS DATABASE</h1>
        <div style={{ width: '56px' }} />
      </div>

      <div style={styles.content}>
        {/* Sport selector grid — popularity sorted, hot sports glowing */}
        <p style={styles.sectionLabel}>▚ ALL SPORTS · RANKED BY POPULARITY</p>
        <div style={styles.sportGrid}>
          {popularSports.map((s) => {
            const hot = HOT_SPORTS.includes(s.name);
            const active = s.name === selected;
            return (
              <button
                key={s.name}
                onClick={() => setSelected(s.name)}
                style={{
                  ...styles.sportTile,
                  ...(active ? { ...styles.sportTileActive, borderColor: s.accent } : {}),
                  ...(hot && !active ? { boxShadow: `0 0 14px ${s.accent}44` } : {}),
                }}
              >
                {hot && <span style={{ ...styles.hotBadge, background: s.accent }}>🔥 HOT</span>}
                <span style={styles.sportTileEmoji}>{s.emoji}</span>
                <span style={styles.sportTileName}>{s.name}</span>
                <span style={styles.popTrack}>
                  <span style={{ ...styles.popFill, width: `${s.popularity}%`, background: s.accent }} />
                </span>
                <span style={styles.popLabel}>{s.popularity}% demand</span>
              </button>
            );
          })}
        </div>

        {/* About panel */}
        <div style={styles.aboutPanel}>
          <div style={styles.aboutHeader}>
            <span style={{ ...styles.aboutEmoji, filter: `drop-shadow(0 0 10px ${sport.accent})` }}>
              {sport.emoji}
            </span>
            <div>
              <h2 style={{ ...styles.aboutTitle, color: sport.accent }}>{sport.name.toUpperCase()}</h2>
              <p style={styles.tagline}>{sport.tagline}</p>
            </div>
            {isHot && (
              <span style={{ ...styles.hostBadge, borderColor: sport.accent, color: sport.accent }}>
                ★ MOST HOSTED
              </span>
            )}
          </div>

          <p style={styles.aboutText}>{sport.about}</p>

          <p style={styles.rulesTitle}>◈ HOW IT WORKS</p>
          <ul style={styles.rulesList}>
            {sport.rules.map((rule) => (
              <li key={rule} style={styles.ruleItem}>
                <span style={{ ...styles.ruleDot, background: sport.accent }} />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Popular players of this sport */}
        <p style={styles.sectionLabel}>⌁ POPULAR PLAYERS · {sport.name.toUpperCase()}</p>

        <div style={styles.legendsRow}>
          {sport.legends.map((legend, i) => (
            <div key={legend.name} style={styles.legendCard}>
              <span style={{ ...styles.legendRank, color: sport.accent }}>#{i + 1} GOAT TIER</span>
              <span style={styles.legendName}>{legend.name}</span>
              <span style={styles.legendNote}>{legend.note}</span>
            </div>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {loading && (
          <div style={styles.loader}>
            <div style={styles.spinner} />
            <p>Scanning the player grid…</p>
          </div>
        )}

        {!loading && (
          <div style={styles.playersList}>
            {players.length === 0 && (
              <div style={styles.empty}>
                <p style={styles.emptyIcon}>🛰️</p>
                <p style={styles.emptyText}>No community players for {sport.name} yet</p>
                <p style={styles.emptySub}>Host a match and claim the leaderboard</p>
              </div>
            )}
            {players.map((player, idx) => (
              <PlayerCard key={player.uid || player.id} player={player} rank={idx + 1} />
            ))}
          </div>
        )}

        <button onClick={() => navigate('/create-match')} style={{ ...styles.cta, ...neonBtn }}>
          ⚡ HOST A {sport.name.toUpperCase()} MATCH
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
  },
  header: {
    background: 'linear-gradient(90deg, rgba(7,11,24,0.95) 0%, rgba(13,18,38,0.9) 50%, rgba(7,11,24,0.95) 100%)',
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
    fontSize: '13px',
    fontWeight: 'bold',
  },
  title: {
    margin: '0',
    fontSize: '20px',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    textShadow: T.glow,
    color: T.neon,
  },
  content: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionLabel: {
    fontFamily: T.fontDisplay,
    fontSize: '12px',
    letterSpacing: '2px',
    color: T.muted,
    margin: '8px 0 0 0',
  },
  sportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
  },
  sportTile: {
    position: 'relative',
    ...glass,
    borderRadius: '14px',
    padding: '14px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    color: T.text,
    transition: 'transform 0.15s',
  },
  sportTileActive: {
    background: 'rgba(0, 245, 255, 0.1)',
    boxShadow: `0 0 20px rgba(0, 245, 255, 0.25)`,
  },
  hotBadge: {
    position: 'absolute',
    top: '-8px',
    right: '8px',
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#04101c',
    padding: '2px 7px',
    borderRadius: '8px',
    letterSpacing: '1px',
  },
  sportTileEmoji: {
    fontSize: '28px',
  },
  sportTileName: {
    fontFamily: T.fontDisplay,
    fontSize: '12px',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  popTrack: {
    width: '100%',
    height: '5px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    display: 'block',
  },
  popFill: {
    display: 'block',
    height: '100%',
    borderRadius: '3px',
  },
  popLabel: {
    fontSize: '10px',
    color: T.muted,
  },
  aboutPanel: {
    ...glass,
    padding: '24px',
  },
  aboutHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
    flexWrap: 'wrap',
  },
  aboutEmoji: {
    fontSize: '44px',
  },
  aboutTitle: {
    margin: '0',
    fontFamily: T.fontDisplay,
    fontSize: '22px',
    letterSpacing: '2px',
  },
  tagline: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: T.muted,
  },
  hostBadge: {
    marginLeft: 'auto',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    border: '1px solid',
    borderRadius: '10px',
    padding: '5px 10px',
    animation: 'floatY 3s ease-in-out infinite',
  },
  aboutText: {
    fontSize: '15px',
    lineHeight: '1.65',
    color: T.text,
    marginBottom: '16px',
  },
  rulesTitle: {
    fontFamily: T.fontDisplay,
    fontSize: '12px',
    letterSpacing: '2px',
    color: T.neon,
    marginBottom: '10px',
  },
  rulesList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: T.text,
  },
  ruleDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 8px rgba(0, 245, 255, 0.6)',
  },
  legendsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  legendCard: {
    ...glass,
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  legendRank: {
    fontFamily: T.fontDisplay,
    fontSize: '10px',
    letterSpacing: '1.5px',
    fontWeight: 'bold',
  },
  legendName: {
    fontFamily: T.fontDisplay,
    fontSize: '16px',
    color: T.text,
  },
  legendNote: {
    fontSize: '12px',
    color: T.muted,
    lineHeight: '1.4',
  },
  playersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  error: {
    background: 'rgba(255, 77, 109, 0.12)',
    border: `1px solid ${T.borderPink}`,
    color: T.red,
    padding: '12px',
    borderRadius: '10px',
  },
  loader: {
    textAlign: 'center',
    padding: '30px',
    color: T.muted,
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: `3px solid rgba(0, 245, 255, 0.15)`,
    borderTop: `3px solid ${T.neon}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 10px auto',
  },
  empty: {
    ...glass,
    textAlign: 'center',
    padding: '36px 20px',
  },
  emptyIcon: {
    fontSize: '40px',
    margin: 0,
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: T.text,
    margin: '10px 0 0 0',
  },
  emptySub: {
    fontSize: '13px',
    color: T.muted,
    margin: '6px 0 0 0',
  },
  cta: {
    padding: '14px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
};
