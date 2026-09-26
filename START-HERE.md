# 🚀 Quick Start

## Open the website (on this PC)

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api/health

## Share it with anyone on the internet

```bash
node share.js
```

It prints a **SHARE THIS LINK** like `https://xxxx.tunnelmole.net` and saves it to
`public-url.txt`. Anyone can open that link — it reaches this app running on your PC.

> The link changes each time you re-run the command (that's normal for free tunnels).
> Keep the window open while people are using the link.

## Start everything from scratch (after a PC restart)

```bash
# 1. Backend (terminal 1)
cd server
npm run dev

# 2. Frontend (terminal 2)
npm run dev

# 3. Public link (terminal 3, optional)
node share.js
```

## Demo accounts

| Email | Password |
|---|---|
| test@example.com | test123456 |
| player2@example.com | test123456 |

Or sign up fresh with any email — no verification needed.

## Team / Project Info

- **FresHers Innovation Challenge 2026** — Problem INN046: *Finding Local Sports Players and Teams*
- Team Hakers: k.Roshan, Koushik, CH Bharth, B. Praveen Kumar
