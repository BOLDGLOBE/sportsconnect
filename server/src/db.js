import fs from 'node:fs';
import pg from 'pg';

// On Render/Neon the connection string comes from an env var.
// Locally, fall back to the same URL stored in server/.env (dev convenience).
const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  (() => {
    try {
      const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
      const line = env.split('\n').find((l) => l.startsWith('DATABASE_URL='));
      return line ? line.split('=').slice(1).join('=').trim().replace(/^"|"$/g, '') : null;
    } catch {
      return null;
    }
  })();

if (!CONNECTION_STRING) {
  console.error('DATABASE_URL is not set. Create server/.env with DATABASE_URL=postgres://...');
  process.exit(1);
}

export const pool = new pg.Pool({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name  TEXT NOT NULL,
      sport         TEXT DEFAULT 'Cricket',
      skill_level   TEXT DEFAULT 'Beginner',
      bio           TEXT DEFAULT '',
      rating        REAL DEFAULT 0,
      rating_count  INTEGER DEFAULT 0,
      matches_played INTEGER DEFAULT 0,
      verified      BOOLEAN DEFAULT FALSE,
      is_demo       BOOLEAN DEFAULT FALSE,
      latitude      REAL,
      longitude     REAL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS matches (
      id             SERIAL PRIMARY KEY,
      creator_id     INTEGER NOT NULL REFERENCES users(id),
      sport          TEXT NOT NULL,
      date           TEXT NOT NULL,
      time           TEXT NOT NULL,
      duration       REAL DEFAULT 2,
      location_name  TEXT NOT NULL,
      latitude       REAL,
      longitude      REAL,
      players_needed INTEGER NOT NULL,
      skill_level    TEXT DEFAULT 'Beginner',
      description    TEXT DEFAULT '',
      status         TEXT DEFAULT 'open',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS participants (
      match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
      user_id  INTEGER NOT NULL REFERENCES users(id),
      joined_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (match_id, user_id)
    );
  `);
}

export function publicUser(row) {
  if (!row) return null;
  const {
    id, email, display_name, sport, skill_level, bio,
    rating, rating_count, matches_played, verified, latitude, longitude, created_at,
  } = row;
  return {
    id,
    email,
    displayName: display_name,
    sport,
    skillLevel: skill_level,
    bio: bio || '',
    rating: rating || 0,
    ratingCount: rating_count || 0,
    matchesPlayed: matches_played || 0,
    verified,
    location: { latitude, longitude },
    createdAt: created_at,
  };
}
