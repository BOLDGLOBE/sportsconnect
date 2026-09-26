import { Router } from 'express';
import { pool, publicUser } from '../db.js';
import { authRequired } from './auth.js';
import { DEMO_PLAYERS, VENUES } from '../seed.js';
import { haversine } from '../geo.js';

const router = Router();

// Get my profile + stats
router.get('/me', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const stats = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE m.creator_id = $1) AS created,
         COUNT(*) FILTER (WHERE m.creator_id <> $1) AS joined
       FROM participants p JOIN matches m ON m.id = p.match_id
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    res.json({
      ...publicUser(user),
      matchesCreated: Number(stats.rows[0]?.created || 0),
      matchesJoined: Number(stats.rows[0]?.joined || 0),
    });
  } catch (err) {
    console.error('me error:', err.message);
    res.status(500).json({ error: 'Could not load profile.' });
  }
});

// Update profile
router.put('/me', authRequired, async (req, res) => {
  try {
    const { displayName, sport, skillLevel, bio, location } = req.body || {};
    const { rows } = await pool.query(
      `UPDATE users SET
         display_name = COALESCE($2, display_name),
         sport        = COALESCE($3, sport),
         skill_level  = COALESCE($4, skill_level),
         bio          = COALESCE($5, bio),
         latitude     = COALESCE($6, latitude),
         longitude    = COALESCE($7, longitude)
       WHERE id = $1 RETURNING *`,
      [
        req.user.id,
        displayName?.trim() || null,
        sport || null,
        skillLevel || null,
        bio != null ? String(bio).slice(0, 300) : null,
        location?.latitude != null ? Number(location.latitude) : null,
        location?.longitude != null ? Number(location.longitude) : null,
      ]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found.' });
    res.json(publicUser(rows[0]));
  } catch (err) {
    console.error('update profile error:', err.message);
    res.status(500).json({ error: 'Could not update profile.' });
  }
});

// Most popular players: everyone ranked by reputation = matches × rating.
router.get('/top', authRequired, async (req, res) => {
  try {
    const { sport } = req.query;

    const { rows } = await pool.query(
      `SELECT id, display_name, sport, skill_level, rating, matches_played, latitude, longitude
       FROM users WHERE is_demo = FALSE`
    );
    const realPlayers = rows.map((r) => ({
      uid: r.id,
      id: r.id,
      name: r.display_name,
      sport: r.sport,
      skill: r.skill_level,
      rating: r.rating || 0,
      matches: r.matches_played || 0,
      location: r.latitude != null ? 'Near you' : null,
      isDemo: false,
    }));

    const demo = DEMO_PLAYERS.map((p) => ({ ...p, isDemo: true }));
    let combined = [...realPlayers, ...demo];
    if (sport && sport !== 'All') {
      combined = combined.filter((p) => p.sport === sport);
    }

    const score = (p) => p.matches * p.rating;
    combined.sort((a, b) => score(b) - score(a));

    res.json(combined.slice(0, 12));
  } catch (err) {
    console.error('top players error:', err.message);
    res.status(500).json({ error: 'Could not load players.' });
  }
});

// Players near the caller, haversine-sorted, real users only.
router.get('/nearby', authRequired, async (req, res) => {
  try {
    const { lat, lng, sport, radiusKm } = req.query;
    const userLat = Number(lat);
    const userLng = Number(lng);
    if (lat == null || lng == null || Number.isNaN(userLat) || Number.isNaN(userLng)) {
      return res.status(400).json({ error: 'lat and lng are required.' });
    }
    const radius = Math.min(Math.max(Number(radiusKm) || 50, 1), 500);

    const { rows } = await pool.query(
      `SELECT id, display_name, sport, skill_level, rating, matches_played, bio, latitude, longitude
       FROM users
       WHERE is_demo = FALSE
         AND id <> $1
         AND latitude IS NOT NULL AND longitude IS NOT NULL`,
      [req.user.id]
    );

    let players = rows
      .map((r) => {
        const distance = haversine(userLat, userLng, Number(r.latitude), Number(r.longitude));
        return {
          uid: r.id,
          id: r.id,
          name: r.display_name,
          sport: r.sport,
          skill: r.skill_level,
          rating: r.rating || 0,
          matches: r.matches_played || 0,
          bio: r.bio || '',
          isDemo: false,
          distance,
        };
      })
      .filter((p) => p.distance <= radius);

    if (sport && sport !== 'All') {
      players = players.filter((p) => p.sport === sport);
    }
    players.sort((a, b) => a.distance - b.distance);

    res.json(players.slice(0, 30));
  } catch (err) {
    console.error('nearby players error:', err.message);
    res.status(500).json({ error: 'Could not load nearby players.' });
  }
});

// Public profile of another user
router.get('/:id', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found.' });
    res.json(publicUser(rows[0]));
  } catch (err) {
    console.error('get user error:', err.message);
    res.status(500).json({ error: 'Could not load user.' });
  }
});

export default router;
