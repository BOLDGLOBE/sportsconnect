import { createApp, ensureDb } from '../server/src/app.js';

const app = createApp();

export default async function handler(req, res) {
  try {
    // Ensure schema exists on cold start (idempotent CREATE TABLE IF NOT EXISTS).
    await ensureDb();
  } catch (err) {
    console.error('Database init failed:', err.message);
  }
  return app(req, res);
}
