import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, ensureDb } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = createApp();

// Serve the built frontend (production single-service deployment)
const distDir = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

ensureDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SportsConnect API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database init failed:', err.message);
    process.exit(1);
  });
