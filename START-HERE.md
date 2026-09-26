# 🚀 SportsConnect — LIVE

## 🌐 Permanent public URL (no tunnels, no "server must stay on")

**https://sportsconnect-teamhakers.vercel.app**

The app is deployed on Vercel (frontend + API) with a Neon Postgres cloud database.
It stays up 24/7 — judges and teammates can open the link from anywhere, even when
your PC is off. Every push to GitHub `main` auto-redeploys.

## Demo account (for judging)

| Email | Password |
|---|---|
| demo@sportsconnect.app | demo1234 |

Or sign up fresh with any email — no verification needed.

## What to show

1. **🏟️ Clubs Near Me** — distance-ranked sports venues around your location
2. **🏆 Top Players** — leaderboard scored by `matches × rating`
3. **Create a match** → open the link in a second browser / phone → **Join it** → watch the participants list update live

## Local development (optional)

```bash
# 1. Backend (terminal 1) — http://localhost:3001
cd server
npm run dev

# 2. Frontend (terminal 2) — http://localhost:5173
npm run dev
```

- The frontend proxies `/api/*` to the backend in dev.
- Backend reads `DATABASE_URL` from `server/.env` (Neon connection string).
- Local machine note: some campus/hotel networks block Postgres's TLS handshake,
  so the backend may fail to start locally even though the same URL works from
  Vercel. The deployed site is unaffected.

## Sharing an old tunnel (no longer needed)

`node share.js` used to expose the local server via tunnelmole and wrote the link
to `public-url.txt`. With the permanent URL above this is obsolete — kept only for
offline demos.

## Team / Project Info

- **FresHers Innovation Challenge 2026** — Problem INN046: *Finding Local Sports Players and Teams*
- Team Hakers: k.Roshan, Koushik, CH Bharth, B. Praveen Kumar
- Repo: https://github.com/BOLDGLOBE/sportsconnect
