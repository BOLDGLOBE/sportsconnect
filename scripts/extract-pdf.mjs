// Extract readable text from a PDF (handles FlateDecode streams, Tj/TJ text operators)
import fs from 'node:fs';
import zlib from 'node:zlib';

const file = process.argv[2];
const buf = fs.readFileSync(file);
const raw = buf.toString('latin1');

const texts = [];
const streamRe = /stream\r?\n([\s\S]*?)endstream/g;
let m;
while ((m = streamRe.exec(raw)) !== null) {
  const chunk = Buffer.from(m[1], 'latin1');
  let out = null;
  try {
    out = zlib.inflateSync(chunk);
  } catch {
    try {
      out = zlib.inflateRawSync(chunk);
    } catch {
      continue;
    }
  }
  const content = out.toString('latin1');
  const strRe = /\((?:\\.|[^\\()])*\)/g;
  let sm;
  const pageTexts = [];
  while ((sm = strRe.exec(content)) !== null) {
    let s = sm[0].slice(1, -1);
    s = s.replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
    s = s.replace(/\\([()\\])/g, '$1');
    pageTexts.push(s);
  }
  if (pageTexts.length) texts.push(pageTexts.join(''));
}

console.log(texts.map((t, i) => `--- PAGE ${i + 1} ---\n${t}`).join('\n'));
