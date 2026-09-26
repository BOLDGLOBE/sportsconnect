import { Router } from 'express';
import { pool, publicUser } from '../db.js';
import { authRequired } from './auth.js';
import { haversine } from '../geo.js';

const router = Router();

async function matchWithParticipants(row) {
  const { rows: parts } = await pool.query(
    `SELECT u.* FROM participants p JOIN users u ON u.id = p.user_id WHERE p.match_id = $1 ORDER BY p.joined_at`,
    [row.id]
  );
  const { rows: creators } = await pool.query('SELECT display_name FROM users WHERE id = $1', [row.creator_id]);
  return {
    id: row.id,
    creatorId: row.creator_id,
    sport: row.sport,
    date: row.date,
    time: row.time,
    duration: row.duration,
    location: { name: row.location_name, latitude: row.latitude, longitude: row.longitude },
    playersNeeded: row.players_needed,
    skillLevel: row.skill_level,
    description: row.description || '',
    status: row.status,
    createdAt: row.created_at,
    participants: parts.map(publicUser),
    creatorName: creators[0]?.display_name || 'Unknown',
  };
}

// List open matches, optionally filtered by sport and distance-sorted
router.get('/', authRequired, async (req, res) => {
  try {
    const { sport, lat, lng } = req.query;
    const where = ['status = $1'];
    const params = ['open'];
    if (sport && sport !== 'All') {
      params.push(sport);
      where.push(`sport = $${params.length}`);
    }
    const sql = `SELECT * FROM matches WHERE ${where.join(' AND ')} ORDER BY created_at DESC`;
    const { rows } = await pool.query(sql, params);

    const userLat = lat != null ? Number(lat) : null;
    const userLng = lng != null ? Number(lng) : null;

    let matches = await Promise.all(rows.map(matchWithParticipants));
    if (userLat != null && userLng != null) {
      matches = matches
        .map((m) =>
          m.location.latitude != null
            ? { ...m, distance: haversine(userLat, userLng, m.location.latitude, m.location.longitude) }
            : m
        )
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    res.json(matches);
  } catch (err) {
    console.error('list matches error:', err.message);
    res.status(500).json({ error: 'Could not load matches.' });
  }
});

// Single match
router.get('/:id', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM matches WHERE id = $1', [Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ error: 'Match not found.' });
    res.json(await matchWithParticipants(rows[0]));
  } catch (err) {
    console.error('get match error:', err.message);
    res.status(500).json({ error: 'Could not load match.' });
  }
});

// Create match
router.post('/', authRequired, async (req, res) => {
  try {
    const { sport, date, time, duration, locationName, latitude, longitude, playersNeeded, skillLevel, description } =
      req.body || {};

    const errors = [];
    if (!sport) errors.push('sport');
    if (!date) errors.push('date');
    if (!time) errors.push('time');
    if (!locationName) errors.push('locationName');
    if (!playersNeeded || Number(playersNeeded) < 2) errors.push('playersNeeded');
    if (errors.length) {
      return res.status(400).json({ error: `Missing or invalid: ${errors.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO matches
         (creator_id, sport, date, time, duration, location_name, latitude, longitude, players_needed, skill_level, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        req.user.id, sport, date, time,
        Number(duration) || 2,
        locationName,
        latitude != null ? Number(latitude) : null,
        longitude != null ? Number(longitude) : null,
        Number(playersNeeded),
        skillLevel || 'Beginner',
        description || '',
      ]
    );

    // Creator automatically joins their own match
    await pool.query('INSERT INTO participants (match_id, user_id) VALUES ($1, $2)', [rows[0].id, req.user.id]);

    res.status(201).json(await matchWithParticipants(rows[0]));
  } catch (err) {
    console.error('create match error:', err.message);
    res.status(500).json({ error: 'Could not create match.' });
  }
});

// Join a match
router.post('/:id/join', authRequired, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    const match = rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found.' });
    if (match.status !== 'open') return res.status(409).json({ error: 'This match is no longer open.' });
    if (match.creator_id === req.user.id) return res.status(409).json({ error: 'You created this match.' });

    const { rows: parts } = await pool.query('SELECT user_id FROM participants WHERE match_id = $1', [id]);
    if (parts.some((p) => p.user_id === req.user.id)) {
      return res.status(409).json({ error: 'You already joined this match.' });
    }
    if (parts.length >= match.players_needed) {
      return res.status(409).json({ error: 'This match is full.' });
    }

    await pool.query('INSERT INTO participants (match_id, user_id) VALUES ($1, $2)', [id, req.user.id]);
    if (parts.length + 1 >= match.players_needed) {
      await pool.query("UPDATE matches SET status = 'closed' WHERE id = $1", [id]);
    }
    // Count participation for the leaderboard
    await pool.query('UPDATE users SET matches_played = matches_played + 1 WHERE id = $1', [req.user.id]);

    const { rows: updated } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    res.json(await matchWithParticipants(updated[0]));
  } catch (err) {
    console.error('join match error:', err.message);
    res.status(500).json({ error: 'Could not join match.' });
  }
});

// Leave a match
router.post('/:id/leave', authRequired, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    const match = rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found.' });
    if (match.creator_id === req.user.id) {
      return res.status(409).json({ error: 'Creators cannot leave their own match. Delete it instead.' });
    }

    const del = await pool.query('DELETE FROM participants WHERE match_id = $1 AND user_id = $2', [id, req.user.id]);
    if (del.rowCount > 0) {
      await pool.query('UPDATE users SET matches_played = GREATEST(matches_played - 1, 0) WHERE id = $1', [req.user.id]);
      if (match.status === 'closed') {
        await pool.query("UPDATE matches SET status = 'open' WHERE id = $1", [id]);
      }
    }

    const { rows: updated } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    res.json(await matchWithParticipants(updated[0]));
  } catch (err) {
    console.error('leave match error:', err.message);
    res.status(500).json({ error: 'Could not leave match.' });
  }
});

// Delete match (creator only)
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT creator_id FROM matches WHERE id = $1', [Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ error: 'Match not found.' });
    if (rows[0].creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can delete this match.' });
    }
    await pool.query('DELETE FROM matches WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) {
    console.error('delete match error:', err.message);
    res.status(500).json({ error: 'Could not delete match.' });
  }
});

export default router;
