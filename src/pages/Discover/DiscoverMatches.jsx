import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import {
  getMatches, joinMatch, getVenues, getTopPlayers,
  getNearbyPlayers, getSportsStats,
} from '../../api';
import { SPORTS, HOT_SPORTS, popularSports } from '../../data/sports';
import { T, glass, neonBtn, ghostBtn } from '../../theme';
import MatchCard from '../../components/MatchCard';
import VenueCard from '../../components/VenueCard';
import PlayerCard from '../../components/PlayerCard';

const ALL_SPORTS = ['All', ...SPORTS.map((s) => s.name)];

export default function DiscoverMatches() {
  const { currentUser, logout } = useAuth();
  const { coords, placeLabel, status, requestLocation } = useLocationContext();
  const navigate = useNavigate();

  const [tab, setTab] = useState('matches'); // matches | nearby | clubs | players | sports
  const [matches, setMatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [players, setPlayers] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [stats, setStats] = useState(null); // live match counts per sport
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinedIds, setJoinedIds] = useState([]);
  const [selectedSport, setSelectedSport] = useState('All');

  const loadTab = useCallback(async (activeTab, sport, lat, lng) => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'matches') {
        const list = await getMatches({ sport, lat, lng });
        setMatches(list);
      } else if (activeTab === 'nearby') {
        if (lat != null && lng != null) {
          const list = await getNearbyPlayers({ lat, lng, sport });
          setNearby(list);
        } else {
          setNearby([]);
        }
      } else if (activeTab === 'clubs') {
        const list = await getVenues({ sport, lat, lng });
        setVenues(list);
      } else if (activeTab === 'players') {
        const list = await getTopPlayers(sport);
        setPlayers(list);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await getSportsStats();
      setStats(data.sports || []);
    } catch {
      setStats(null); // strip still works with static popularity
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTab('matches', selectedSport, null, null);
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload distance-sorted content whenever coords become available
  useEffect(() => {
    if (coords && (tab === 'matches' || tab === 'nearby' || tab === 'clubs')) {
      loadTab(tab, selectedSport, coords.latitude, coords.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  async function handleTab(newTab) {
    setTab(newTab);
    if (newTab === 'sports') return; // static catalog, nothing to fetch
    loadTab(newTab, selectedSport, coords?.latitude, coords?.longitude);
  }

  function handleSportFilter(sport) {
    setSelectedSport(sport);
    if (tab !== 'sports') {
      loadTab(tab, sport, coords?.latitude, coords?.longitude);
    }
  }

  async function handleJoin(matchId) {
    try {
      const updated = await joinMatch(matchId);
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setJoinedIds((prev) => [...prev, matchId]);
    } catch (err) {
      alert('Error joining match: ' + err.message);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  // Merge live match counts into the popular-sports hero strip
  const matchesFor = (name) => stats?.find((s) => s.name === name)?.matches ?? 0;
  const totalMatches = stats?.reduce((sum, s) => sum + s.matches, 0) ?? matches.length;
  const hottest = [...(stats || [])].sort((a, b) => b.matches - a.matches)[0]?.name;

  const TABS = [
    { id: 'matches', label: '⚡ Matches' },
    { id: 'nearby', label: '📡 Nearby Players' },
    { id: 'clubs', label: '🏟️ Clubs' },
    { id: 'players', label: '🏆 Top Players' },
    { id: 'sports', label: '⌬ Sports' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          ⚡ SPORTS<span style={{ color: T.pink }}>CONNECT</span>
        </h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>
            {currentUser?.displayName || currentUser?.email?.split('@')[0]}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </div>

      {/* Popular sports hero strip */}
      <div style={styles.heroStrip}>
        <div style={styles.heroHead}>
          <span style={styles.heroLabel}>◈ TRENDING ARENAS · MOST HOSTED SPORTS</span>
          <span style={styles.heroCount}>{totalMatches} live matches hosted</span>
        </div>
        <div style={styles.heroRow}>
          {popularSports.map((sport) => {
            const isHot = HOT_SPORTS.includes(sport.name) || sport.name === hottest;
            const count = matchesFor(sport.name);
            return (
              <button
                key={sport.name}
                onClick={() => handleSportFilter(sport.name)}
                style={{
                  ...styles.heroChip,
                  borderColor: isHot ? sport.accent : T.border,
                  boxShadow: isHot ? `0 0 16px ${sport.accent}55` : 'none',
                }}
                title={`${count} matches hosted`}
              >
                {isHot && <span style={{ ...styles.hotDot, background: sport.accent }} />}
                <span style={styles.heroEmoji}>{sport.emoji}</span>
                <span style={styles.heroName}>{sport.name}</span>
                <span style={{ ...styles.heroSub, color: isHot ? sport.accent : T.muted }}>
                  {isHot ? '🔥 MOST HOSTED' : `${count} hosted`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Location Banner */}
      <div style={styles.locationBanner}>
        <span style={styles.locationPin}>📡</span>
        <div style={styles.locationText}>
          <strong style={{ color: T.neon }}>GRID LOCATION:</strong>{' '}
          {placeLabel || (coords ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` : 'Detecting…')}
          {status === 'denied' && (
            <span style={styles.locationHint}> (approximate — allow location for exact distances)</span>
          )}
        </div>
        {status !== 'granted' && (
          <button onClick={requestLocation} style={styles.retryBtn}>
            🔄 Re-scan
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.actionBar}>
        <button onClick={() => navigate('/create-match')} style={{ ...styles.createBtn, ...neonBtn }}>
          + HOST A MATCH
        </button>
        <button onClick={() => navigate('/profile')} style={{ ...styles.profileBtn, ...ghostBtn }}>
          👤 PROFILE
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTab(t.id)}
            style={{ ...styles.tabBtn, ...(tab === t.id ? styles.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sport Filter */}
      <div style={styles.filterContainer}>
        <p style={styles.filterLabel}>FILTER BY SPORT:</p>
        <div style={styles.sportFilter}>
          {ALL_SPORTS.map((sport) => {
            const hot = sport !== 'All' && HOT_SPORTS.includes(sport);
            const active = selectedSport === sport;
            const accent = sport === 'All' ? T.neon : SPORTS.find((s) => s.name === sport)?.accent || T.neon;
            return (
              <button
                key={sport}
                onClick={() => handleSportFilter(sport)}
                style={{
                  ...styles.sportFilterBtn,
                  ...(active
                    ? { background: T.grad, color: '#04101c', boxShadow: `0 0 14px ${accent}66` }
                    : { background: 'rgba(255,255,255,0.04)', color: T.text, border: `1px solid ${T.border}` }),
                  ...(hot && !active ? { borderColor: `${accent}88` } : {}),
                }}
              >
                {hot && !active && <span style={{ ...styles.filterHotDot, background: accent }} />}
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentContainer}>
        {error && <p style={styles.errorMsg}>{error}</p>}

        {loading && (
          <div style={styles.loader}>
            <div style={styles.spinner} />
            <p>
              {tab === 'matches' && 'Scanning nearby matches…'}
              {tab === 'nearby' && 'Locking onto players in your grid…'}
              {tab === 'clubs' && 'Finding sports clubs near you…'}
              {tab === 'players' && 'Ranking popular players…'}
            </p>
          </div>
        )}

        {/* MATCHES */}
        {!loading && tab === 'matches' && matches.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📡</p>
            <p style={styles.emptyText}>No matches found nearby</p>
            <p style={styles.emptySubtext}>Be the first to host one!</p>
            <button onClick={() => navigate('/create-match')} style={{ ...styles.emptyCreateBtn, ...neonBtn }}>
              + HOST THE FIRST MATCH
            </button>
          </div>
        )}
        {!loading && tab === 'matches' &&
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onJoin={handleJoin}
              onViewDetails={(id) => navigate(`/match/${id}`)}
              isJoined={joinedIds.includes(match.id)}
            />
          ))}

        {/* NEARBY PLAYERS */}
        {!loading && tab === 'nearby' && (
          <>
            {coords == null ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>🛰️</p>
                <p style={styles.emptyText}>Location signal needed</p>
                <p style={styles.emptySubtext}>Allow location access to lock onto nearby players</p>
                <button onClick={requestLocation} style={{ ...styles.emptyCreateBtn, ...neonBtn }}>
                  📡 DETECT MY LOCATION
                </button>
              </div>
            ) : nearby.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>🛰️</p>
                <p style={styles.emptyText}>No players in your grid yet</p>
                <p style={styles.emptySubtext}>
                  Players appear here once they join SportsConnect near {placeLabel || 'you'}
                </p>
              </div>
            ) : (
              <>
                <p style={styles.resultCount}>
                  ▚ {nearby.length} PLAYER{nearby.length > 1 ? 'S' : ''} DETECTED WITHIN RANGE
                </p>
                {nearby.map((player) => (
                  <PlayerCard key={player.uid || player.id} player={player} rank={null} distance={player.distance} />
                ))}
              </>
            )}
          </>
        )}

        {/* CLUBS */}
        {!loading && tab === 'clubs' && venues.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏟️</p>
            <p style={styles.emptyText}>No clubs found for this sport</p>
            <p style={styles.emptySubtext}>Try another sport or widen your location</p>
          </div>
        )}
        {!loading && tab === 'clubs' &&
          venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}

        {/* TOP PLAYERS */}
        {!loading && tab === 'players' && players.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏆</p>
            <p style={styles.emptyText}>No players ranked yet</p>
          </div>
        )}
        {!loading && tab === 'players' &&
          players.map((player, idx) => (
            <PlayerCard key={player.uid || player.id} player={player} rank={idx + 1} />
          ))}

        {/* SPORTS — teaser panel linking to the full database */}
        {!loading && tab === 'sports' && (
          <div style={styles.sportsTeaser}>
            <p style={styles.sportsTeaserIcon}>⌬</p>
            <p style={styles.sportsTeaserTitle}>SPORTS DATABASE</p>
            <p style={styles.sportsTeaserText}>
              About every sport, its rules, and the legends who defined it —
              plus {totalMatches} matches already hosted by the community.
            </p>
            <button onClick={() => navigate('/sports')} style={{ ...styles.emptyCreateBtn, ...neonBtn }}>
              ⚡ OPEN THE DATABASE
            </button>
          </div>
        )}
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
      'linear-gradient(90deg, rgba(7,11,24,0.92) 0%, rgba(13,18,38,0.88) 50%, rgba(7,11,24,0.92) 100%)',
    borderBottom: `1px solid ${T.border}`,
    color: T.text,
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  title: {
    margin: '0',
    fontSize: '22px',
    fontFamily: T.fontDisplay,
    letterSpacing: '3px',
    textShadow: T.glow,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '13px',
    color: T.muted,
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  logoutBtn: {
    background: 'rgba(255, 45, 149, 0.08)',
    border: `1px solid ${T.borderPink}`,
    color: T.pink,
    padding: '7px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  heroStrip: {
    ...glass,
    margin: '14px 16px 0 16px',
    padding: '14px 16px',
    borderRadius: '16px',
  },
  heroHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '10px',
  },
  heroLabel: {
    fontFamily: T.fontDisplay,
    fontSize: '11px',
    letterSpacing: '2px',
    color: T.neon,
    textShadow: T.glow,
  },
  heroCount: {
    fontSize: '12px',
    color: T.muted,
    fontWeight: 'bold',
  },
  heroRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  heroChip: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '8px 12px',
    cursor: 'pointer',
    color: T.text,
    position: 'relative',
  },
  hotDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(255, 176, 32, 0.9)',
    animation: 'neonPulse 2s ease-in-out infinite',
  },
  heroEmoji: {
    fontSize: '20px',
  },
  heroName: {
    fontFamily: T.fontDisplay,
    fontSize: '11px',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  heroSub: {
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  locationBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    margin: '12px 16px 0 16px',
    background: 'rgba(0, 245, 255, 0.04)',
    border: `1px solid ${T.border}`,
    borderRadius: '12px',
  },
  locationPin: {
    fontSize: '16px',
  },
  locationText: {
    flex: 1,
    fontSize: '13px',
    color: T.text,
  },
  locationHint: {
    fontSize: '11px',
    color: T.muted,
  },
  retryBtn: {
    ...ghostBtn,
    padding: '6px 12px',
    fontSize: '11px',
  },
  actionBar: {
    display: 'flex',
    gap: '12px',
    padding: '14px 16px 0 16px',
  },
  createBtn: {
    flex: 1,
    padding: '13px',
    fontSize: '13px',
    letterSpacing: '1px',
  },
  profileBtn: {
    flex: 1,
    padding: '13px',
    fontSize: '13px',
    letterSpacing: '1px',
  },
  tabBar: {
    display: 'flex',
    margin: '16px 16px 0 16px',
    background: 'rgba(7, 11, 24, 0.85)',
    border: `1px solid ${T.border}`,
    borderRadius: '12px',
    overflowX: 'auto',
  },
  tabBtn: {
    flex: 1,
    padding: '12px 8px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '0.5px',
    color: T.muted,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: T.neon,
    borderBottom: `2px solid ${T.neon}`,
    textShadow: T.glow,
    background: 'rgba(0, 245, 255, 0.05)',
  },
  filterContainer: {
    padding: '14px 16px 0 16px',
  },
  filterLabel: {
    margin: '0 0 10px 0',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    color: T.muted,
  },
  sportFilter: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sportFilterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: T.fontBody,
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
  },
  filterHotDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 6px rgba(255, 176, 32, 0.8)',
  },
  contentContainer: {
    padding: '16px',
    maxWidth: '640px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  resultCount: {
    fontFamily: T.fontDisplay,
    fontSize: '11px',
    letterSpacing: '2px',
    color: T.neon,
    margin: '4px 0 8px 0',
  },
  errorMsg: {
    background: 'rgba(255, 77, 109, 0.12)',
    border: `1px solid ${T.borderPink}`,
    color: T.red,
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  loader: {
    textAlign: 'center',
    padding: '40px 20px',
    color: T.muted,
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(0, 245, 255, 0.15)',
    borderTop: `3px solid ${T.neon}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 12px auto',
  },
  emptyState: {
    ...glass,
    textAlign: 'center',
    padding: '48px 20px',
  },
  emptyIcon: {
    fontSize: '44px',
    margin: '0',
  },
  emptyText: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: T.text,
    margin: '12px 0 0 0',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
  },
  emptySubtext: {
    fontSize: '13px',
    color: T.muted,
    margin: '8px 0 0 0',
  },
  emptyCreateBtn: {
    marginTop: '16px',
    padding: '11px 20px',
    fontSize: '12px',
    letterSpacing: '1px',
  },
  sportsTeaser: {
    ...glass,
    textAlign: 'center',
    padding: '40px 20px',
  },
  sportsTeaserIcon: {
    fontSize: '40px',
    color: T.neon,
    textShadow: T.glow,
    margin: 0,
  },
  sportsTeaserTitle: {
    fontFamily: T.fontDisplay,
    fontSize: '18px',
    letterSpacing: '3px',
    color: T.text,
    margin: '10px 0 0 0',
  },
  sportsTeaserText: {
    fontSize: '13px',
    color: T.muted,
    margin: '10px 0 0 0',
    lineHeight: 1.6,
  },
};
