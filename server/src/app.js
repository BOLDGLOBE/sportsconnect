import express from 'express';
import cors from 'cors';
import { initDb, pool } from './db.js';
import authRoutes from './routes/auth.js';
import matchRoutes from './routes/matches.js';
import userRoutes from './routes/users.js';
import venueRoutes from './routes/venues.js';
import sportRoutes from './routes/sports.js';

let initPromise = null;

// Run schema migration once per process (no-op if tables already exist).
export function ensureDb() {
  if (!initPromise) initPromise = initDb();
  return initPromise;
}

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Simple request logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });

  app.get('/api/health', async (req, res) => {
    try {
      await ensureDb();
      await pool.query('SELECT 1');
      res.json({ ok: true, service: 'SportsConnect API', db: 'connected', time: new Date().toISOString() });
    } catch (err) {
      res.status(500).json({ ok: false, service: 'SportsConnect API', db: 'error', error: err.message });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/venues', venueRoutes);
  app.use('/api/sports', sportRoutes);

  // 404 for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: `No route: ${req.method} ${req.path}` });
  });

  return app;
}
