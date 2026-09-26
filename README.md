# SportsConnect — Full-Stack Sports Matchmaking App

> FresHers Innovation Challenge 2026 · Problem INN046: *Finding Local Sports Players and Teams*
> Team Hakers — k.Roshan, Koushik, CH Bharth, B. Praveen Kumar

Find nearby players, discover sports clubs around you, browse a Top Players leaderboard, create matches, and join games — React frontend + Node/Express API on Vercel, Postgres on Neon.

## 🌐 Live app

**https://sportsconnect-teamhakers.vercel.app**

- Frontend: static Vite build served by Vercel's CDN
- API: `/api/*` serverless functions (`api/index.js` wraps the Express app)
- Database: Neon Postgres (`DATABASE_URL` env var, schema auto-created on first request)
- Auth: bcrypt password hashing + 7-day JWT sessions (`JWT_SECRET` env var)

Demo account: `demo@sportsconnect.app` / `demo1234`

## Features

| Feature | Where |
|---|---|
| **Futuristic Arena UI** | Dark space theme with neon cyan/magenta glow, glassmorphism cards, Orbitron + Rajdhani typography. |
| **Sports Database** | About every sport: description, key rules, all-time legends (GOAT tier), plus the community leaderboard for that sport. Popular sports get 🔥 HOT and ★ MOST HOSTED badges. |
| **Nearby Players** | Real players around you, haversine-sorted by distance with sport filtering — powered by GPS or the city fallback. |
| **Popular Sports Highlighting** | Trending strip on Discover ranks all 8 sports; the most hosted ones glow with live hosted-match counts from the DB. |
| **My Location** | Auto-detects via GPS, shows a friendly area name (OpenStreetMap reverse geocoding). Falls back to Chennai + manual coordinates if location is denied. |
| **Clubs Near Me** | Sports venues ranked by distance with rating, open/closed status, price level, phone and a direct Google Maps link. |
| **Top Players** | Leaderboard scored by `matches × rating`. New users start at zero and climb as they play; seeded community legends anchor the board. |
| **Matches** | Create, discover (distance-sorted), join, leave, delete — with sport filters across 8 sports. |
| **Auth** | Email/password signup & login, bcrypt-hashed, JWT sessions. |

## Running locally

```bash
# Terminal 1 — Backend API (http://localhost:3001)
cd server
npm install
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd ..
npm install
npm run dev
```

- Create `server/.env` with `DATABASE_URL=postgres://...` (Neon) and `JWT_SECRET=...`
- The Vite dev server proxies `/api/*` to the backend.
- A portable Node runtime is in `node-portable/` for machines without Node installed (delete it if you have Node).

## Pages

| Route | Description |
|---|---|
| `/login` `/signup` | Sign in / create account |
| `/discover` | **Tabs: Matches · Nearby Players · Clubs · Top Players · Sports** + trending sports strip + My Location banner + sport filters |
| `/sports` | **Sports Database** — about/rules/legends per sport + community players |
| `/create-match` | Host a match (GPS or manual coordinates) |
| `/match/:id` | Participants, join/leave/delete |
| `/profile` | Edit profile, see stats |

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check (returns `db: connected`) |
| POST | `/api/auth/signup` `/api/auth/login` | JWT auth |
| GET/PUT | `/api/users/me` | Profile + stats |
| GET | `/api/users/top?sport=` | Player leaderboard |
| GET | `/api/users/nearby?lat=&lng=&sport=&radiusKm=` | Real players sorted by distance |
| GET | `/api/sports/stats` | Hosted-match and player counts per sport |
| GET | `/api/venues?sport=&lat=&lng=&radiusKm=` | Sports clubs by distance |
| GET/POST | `/api/matches` | List (distance-sorted) / create |
| GET | `/api/matches/:id` | Details |
| POST | `/api/matches/:id/join` `/leave` | Join / leave |
| DELETE | `/api/matches/:id` | Delete (creator only) |

## Deployment (Vercel + Neon)

1. GitHub repo `BOLDGLOBE/sportsconnect` is imported as a Vercel project (`teamhakers/sportsconnect`); every push to `main` auto-deploys.
2. `vercel.json` builds the frontend with Vite, routes `/api/(.*)` to the serverless function in `api/`, and rewrites everything else to `index.html` for the SPA.
3. Environment variables (set in Vercel → Project → Settings → Environment Variables):
   - `DATABASE_URL` — Neon Postgres connection string
   - `JWT_SECRET` — signing secret for auth tokens
4. Database tables (`users`, `matches`, `participants`) are created automatically by `initDb()` on the first API call.

## Demo Tip

For judges: open **⌬ Sports** to show the sports database with 🔥 HOT badges, click **📡 Nearby Players** for the distance-sorted radar, **🏟️ Clubs** for distance-ranked venues, **🏆 Top Players** for the leaderboard, then create a match and join it from a second browser profile to show the live participants list. The trending strip at the top highlights the most hosted sports with live counts. The app gracefully degrades when location permission is denied — everything still works with approximate distances.
