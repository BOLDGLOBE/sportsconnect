import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, publicUser } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sportsconnect-dev-secret';
const TOKEN_TTL = '7d';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
}

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, sport, skillLevel } = req.body || {};
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, password and name are required.' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await pool.query('SELECT 1 FROM users WHERE email = $1', [normalizedEmail]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, sport, skill_level)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [normalizedEmail, passwordHash, String(displayName).trim(), sport || 'Cricket', skillLevel || 'Beginner']
    );

    const user = rows[0];
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('signup error:', err.message);
    res.status(500).json({ error: 'Could not create account. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      String(email).toLowerCase().trim(),
    ]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ error: 'Could not log in. Please try again.' });
  }
});
