import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from './auth.js';

const router = Router();

// Live sports catalog: static catalog + real activity from the DB.
// `matches` = hosted matches in DB, `players` = users whose primary sport matches.
// The frontend uses `matches` count to highlight the most hosted sports.
router.get('/stats', authRequired, async (req, res) => {
  try {
    const matchCounts = await pool.query(
      `SELECT sport, COUNT(*)::int AS matches,
              COALESCE(SUM(players_needed), 0)::int AS slots
       FROM matches GROUP BY sport`
    );
    const playerCounts = await pool.query(
      `SELECT sport, COUNT(*)::int AS players FROM users WHERE is_demo = FALSE GROUP BY sport`
    );

    const matchMap = new Map(matchCounts.rows.map((r) => [r.sport, r]));
    const playerMap = new Map(playerCounts.rows.map((r) => [r.sport, r]));

    const sports = [
      'Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis',
      'Volleyball', 'Kabaddi', 'Hockey',
    ].map((sport) => ({
      name: sport,
      matches: matchMap.get(sport)?.matches || 0,
      slots: matchMap.get(sport)?.slots || 0,
      players: playerMap.get(sport)?.players || 0,
    }));

    res.json({ sports });
  } catch (err) {
    console.error('sports stats error:', err.message);
    res.status(500).json({ error: 'Could not load sports stats.' });
  }
});

export default router;
