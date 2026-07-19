#!/usr/bin/env node
// llms.txt guard, run over the built output:
// 1. public/llms.txt is copied to dist/llms.txt (it must actually be served).
// 2. Every executorfile.com link in it resolves to a built page in dist/
//    (so the file can never point at a page that no longer exists).
// 3. The GitHub source link matches the pinned repo, so it cannot drift.
// 4. Every core page that should be advertised to agents is present.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');
const pin = JSON.parse(fs.readFileSync(path.join(root, 'pin.json'), 'utf8'));
const expectedRepo = `https://github.com/${pin.repo}`;

let failed = false;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failed = true;
};

const distLlms = path.join(dist, 'llms.txt');
if (!fs.existsSync(distLlms)) {
  fail('llms.txt is not present in dist/ (not served)');
  process.exit(1);
}

// llms-full.txt (the same pages with full text inlined) must also be served.
if (!fs.existsSync(path.join(dist, 'llms-full.txt'))) {
  fail('llms-full.txt is not present in dist/ (not served)');
}

const txt = fs.readFileSync(distLlms, 'utf8');
const links = [...txt.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);

const resolveTarget = (urlPath) => {
  const clean = decodeURIComponent(urlPath.replace(/\/$/, ''));
  const candidates =
    clean === ''
      ? [path.join(dist, 'index.html')]
      : [
          path.join(dist, clean, 'index.html'),
          path.join(dist, clean),
          path.join(dist, `${clean}.html`),
        ];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
};

for (const url of links) {
  if (url.startsWith('https://executorfile.com')) {
    const p = new URL(url).pathname;
    if (!resolveTarget(p.replace(/^\//, ''))) {
      fail(`llms.txt links ${url}, but no such page exists in dist/`);
    }
  }
}

if (!links.includes(expectedRepo)) {
  fail(`llms.txt must link the pinned repo ${expectedRepo}`);
}

const required = [
  '/how-it-works',
  '/get-started',
  '/why-trust-this',
  '/faq',
  '/recover',
  '/recover/windows',
  '/learn',
];
for (const rel of required) {
  if (!links.some((u) => u === `https://executorfile.com${rel}`)) {
    fail(`llms.txt is missing the ${rel} link`);
  }
}

if (failed) process.exit(1);
console.log(`ok: llms.txt served, ${links.length} links, all internal links resolve`);
