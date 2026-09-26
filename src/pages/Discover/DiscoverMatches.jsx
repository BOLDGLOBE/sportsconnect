import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import { getMatches, joinMatch, getVenues, getTopPlayers } from '../../api';
import MatchCard from '../../components/MatchCard';
import VenueCard from '../../components/VenueCard';
import PlayerCard from '../../components/PlayerCard';

export default function DiscoverMatches() {
  const { currentUser, logout } = useAuth();
  const { coords, placeLabel, status, requestLocation } = useLocationContext();
  const navigate = useNavigate();

  const [tab, setTab] = useState('matches'); // matches | clubs | players
  const [matches, setMatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [players, setPlayers] = useState([]);
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
      } else if (activeTab === 'clubs') {
        const list = await getVenues({ sport, lat, lng });
        setVenues(list);
      } else {
        const list = await getTopPlayers(sport);
        setPlayers(list);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload matches whenever coords become available (distance sort)
  useEffect(() => {
    if (coords && tab === 'matches') {
      loadTab('matches', selectedSport, coords.latitude, coords.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  // Initial load
  useEffect(() => {
    loadTab('matches', selectedSport, null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTab(newTab) {
    setTab(newTab);
    if (newTab === 'matches') {
      loadTab('matches', selectedSport, coords?.latitude, coords?.longitude);
    } else if (newTab === 'clubs') {
      loadTab('clubs', selectedSport, coords?.latitude, coords?.longitude);
    } else {
      loadTab('players', selectedSport);
    }
  }

  function handleSportFilter(sport) {
    setSelectedSport(sport);
    loadTab(tab, sport, coords?.latitude, coords?.longitude);
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

  const sports = ['All', 'Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚽ SportsConnect</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>
            Hi, {currentUser?.displayName || currentUser?.email?.split('@')[0]}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* My Location Banner */}
      <div style={styles.locationBanner}>
        <span style={styles.locationPin}>📍</span>
        <div style={styles.locationText}>
          <strong>My Location:</strong>{' '}
          {placeLabel || (coords ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` : 'Detecting…')}
          {status === 'denied' && (
            <span style={styles.locationHint}> (approximate — allow location for exact distances)</span>
          )}
        </div>
        {status !== 'granted' && (
          <button onClick={requestLocation} style={styles.retryBtn}>
            🔄 Detect again
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.actionBar}>
        <button onClick={() => navigate('/create-match')} style={styles.createBtn}>
          + Create a Match
        </button>
        <button onClick={() => navigate('/profile')} style={styles.profileBtn}>
          👤 My Profile
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          onClick={() => handleTab('matches')}
          style={{ ...styles.tabBtn, ...(tab === 'matches' ? styles.tabActive : {}) }}
        >
          ⚽ Matches
        </button>
        <button
          onClick={() => handleTab('clubs')}
          style={{ ...styles.tabBtn, ...(tab === 'clubs' ? styles.tabActive : {}) }}
        >
          🏟️ Clubs Near Me
        </button>
        <button
          onClick={() => handleTab('players')}
          style={{ ...styles.tabBtn, ...(tab === 'players' ? styles.tabActive : {}) }}
        >
          🏆 Top Players
        </button>
      </div>

      {/* Sport Filter */}
      <div style={styles.filterContainer}>
        <p style={styles.filterLabel}>Filter by Sport:</p>
        <div style={styles.sportFilter}>
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => handleSportFilter(sport)}
              style={{
                ...styles.sportFilterBtn,
                background:
                  selectedSport === sport
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f0f0f0',
                color: selectedSport === sport ? 'white' : '#333',
              }}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentContainer}>
        {error && <p style={styles.errorMsg}>{error}</p>}

        {loading && (
          <div style={styles.loader}>
            <div style={styles.spinner} />
            <p>
              {tab === 'matches' && 'Loading nearby matches...'}
              {tab === 'clubs' && 'Finding sports clubs near you...'}
              {tab === 'players' && 'Ranking popular players...'}
            </p>
          </div>
        )}

        {!loading && tab === 'matches' && matches.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📍</p>
            <p style={styles.emptyText}>No matches found nearby</p>
            <p style={styles.emptySubtext}>Try creating one!</p>
            <button onClick={() => navigate('/create-match')} style={styles.emptyCreateBtn}>
              + Create the first match
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

        {!loading && tab === 'clubs' && venues.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏟️</p>
            <p style={styles.emptyText}>No clubs found for this sport</p>
            <p style={styles.emptySubtext}>Try another sport or widen your location</p>
          </div>
        )}

        {!loading && tab === 'clubs' &&
          venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}

        {!loading && tab === 'players' && players.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏆</p>
            <p style={styles.emptyText}>No players ranked yet</p>
          </div>
        )}

        {!loading && tab === 'players' &&
          players.map((player, idx) => <PlayerCard key={player.uid || player.id} player={player} rank={idx + 1} />)}
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
  title: {
    margin: '0',
    fontSize: '28px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '14px',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.5)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  locationBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    background: 'white',
    borderBottom: '1px solid #eee',
  },
  locationPin: {
    fontSize: '18px',
  },
  locationText: {
    flex: 1,
    fontSize: '14px',
    color: '#333',
  },
  locationHint: {
    fontSize: '11px',
    color: '#999',
  },
  retryBtn: {
    background: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  actionBar: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    background: 'white',
    borderBottom: '1px solid #eee',
  },
  createBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  profileBtn: {
    flex: 1,
    padding: '12px',
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    background: 'white',
    borderBottom: '2px solid #eee',
  },
  tabBtn: {
    flex: 1,
    padding: '14px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#888',
    cursor: 'pointer',
  },
  tabActive: {
    color: '#667eea',
    borderBottom: '3px solid #667eea',
  },
  filterContainer: {
    background: 'white',
    padding: '16px 20px',
    borderBottom: '1px solid #eee',
  },
  filterLabel: {
    margin: '0 0 12px 0',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#555',
  },
  sportFilter: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sportFilterBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  contentContainer: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  errorMsg: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  loader: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '4px solid #e0e0f5',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 12px auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '12px 0 0 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0 0 0',
  },
  emptyCreateBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
