import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb, pool } from './db.js';
import authRoutes from './routes/auth.js';
import matchRoutes from './routes/matches.js';
import userRoutes from './routes/users.js';
import venueRoutes from './routes/venues.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', async (req, res) => {
  try {
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

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `No route: ${req.method} ${req.path}` });
});

// Serve the built frontend (production single-service deployment)
const distDir = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SportsConnect API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database init failed:', err.message);
    process.exit(1);
  });
