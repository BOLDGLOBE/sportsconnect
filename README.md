# SportsConnect — Full-Stack Sports Matchmaking App

> FresHers Innovation Challenge 2026 · Problem INN046: *Finding Local Sports Players and Teams*
> Team Hakers — k.Roshan, Koushik, CH Bharth, B. Praveen Kumar

Find nearby players, discover sports clubs around you, browse a Top Players leaderboard, create matches, and join games — React frontend + Node/Express backend, all local, no cloud services.

## Features

| Feature | Where |
|---|---|
| **My Location** | Auto-detects via GPS, shows a friendly area name (OpenStreetMap reverse geocoding). Falls back to Chennai + manual coordinates if location is denied. |
| **Clubs Near Me** | Sports venues ranked by distance with rating, open/closed status, price level, phone and a direct Google Maps link. |
| **Top Players** | Leaderboard scored by `matches × rating`. New users start at zero and climb as they play; seeded community legends anchor the board. |
| **Matches** | Create, discover (distance-sorted), join, leave, delete — with sport filters. |
| **Auth** | Email/password signup & login, bcrypt-hashed, JWT sessions. |

## Running the App

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

The Vite dev server proxies `/api/*` to the backend. A portable Node runtime is in `node-portable/` for machines without Node installed (delete it if you have Node).

## Pages

| Route | Description |
|---|---|
| `/login` `/signup` | Sign in / create account |
| `/discover` | **Tabs: Matches · Clubs Near Me · Top Players** + My Location banner + sport filters |
| `/create-match` | Host a match (GPS or manual coordinates) |
| `/match/:id` | Participants, join/leave/delete |
| `/profile` | Edit profile, see stats |

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` `/api/auth/login` | JWT auth |
| GET/PUT | `/api/users/me` | Profile + stats |
| GET | `/api/users/top?sport=` | Player leaderboard |
| GET | `/api/venues?sport=&lat=&lng=&radiusKm=` | Sports clubs by distance |
| GET/POST | `/api/matches` | List (distance-sorted) / create |
| GET | `/api/matches/:id` | Details |
| POST | `/api/matches/:id/join` `/leave` | Join / leave |
| DELETE | `/api/matches/:id` | Delete (creator only) |

## Data

- `server/data/db.json` — users & matches (delete to reset)
- `server/src/seed.js` — 8 seeded sports venues + 8 demo top players (marked "community legend")

## Demo Tip

For judges: click **🏟️ Clubs Near Me** to show distance-ranked venues, **🏆 Top Players** for the leaderboard, then create a match and join it from a second browser profile to show the live participants list. The app gracefully degrades when location permission is denied — everything still works with approximate distances.
