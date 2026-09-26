// Keeps a public shareable link to the app alive using Tunnelmole.
// The frontend is exposed; /api requests flow through Vite's proxy to the
// Express backend, so one tunnel covers the whole app.
//
// Usage:  node share.js        (then open the printed URL on any device)
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const PORT = process.env.APP_PORT || 5173;

console.log(`Opening public tunnel to http://localhost:${PORT} ...`);

const tm = spawn('node', ['node_modules/tunnelmole/dist/bin/tunnelmole.js', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let url = null;
tm.stdout.on('data', (d) => {
  const line = d.toString();
  process.stdout.write(line);
  const m = line.match(/https:\/\/[a-z0-9-]+\.tunnelmole\.net/);
  if (m && !url) {
    url = m[0];
    console.log('\n==================================================');
    console.log('  SHARE THIS LINK:', url);
    console.log('==================================================\n');
    fs.writeFileSync('public-url.txt', url + '\n');
  }
});
tm.stderr.on('data', (d) => process.stderr.write(d));
tm.on('exit', (code) => {
  console.log(`Tunnelmole exited (${code}). Re-run: node share.js`);
});
