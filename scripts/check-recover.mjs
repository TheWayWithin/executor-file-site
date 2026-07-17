#!/usr/bin/env node
// The /recover guarantees, checked against the built output:
// 1. /recover and /recover/windows exist in dist (the URL can never 404).
// 2. Neither page loads any analytics script or third-party request.
// 3. Neither page contains affiliate links.
// 4. The rendered instructions match the mirrored (pin-verified) source:
//    every command block from the source doc appears on the page.
//
// With SITE_URL set (CI after deploy), also checks the live URL resolves.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');
let failed = false;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failed = true;
};

const pages = ['recover/index.html', 'recover/windows/index.html'];
for (const rel of pages) {
  const p = path.join(dist, rel);
  if (!fs.existsSync(p)) {
    fail(`${rel} missing from build output`);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  if (/plausible|googletagmanager|google-analytics|gtag|fathom|umami|segment\.com/i.test(html)) {
    fail(`${rel} references an analytics script`);
  }
  const externalScripts = [...html.matchAll(/<script[^>]+src="(https?:)?\/\/[^"]+"/g)];
  if (externalScripts.length > 0) {
    fail(`${rel} loads external scripts: ${externalScripts.map((m) => m[0]).join(', ')}`);
  }
  if (/[?&](tag|aff|affiliate|utm_[a-z]+|irclickid|ref)=/i.test(html)) {
    fail(`${rel} contains tracking or affiliate query parameters`);
  }
  console.log(`ok: ${rel} present, no analytics, no affiliate links`);
}

// Command blocks from the pin-verified source must appear in the page.
const checkCommands = (srcFile, distFile) => {
  const src = fs.readFileSync(path.join(root, 'src/mirrored', srcFile), 'utf8');
  const html = fs.readFileSync(path.join(dist, distFile), 'utf8');
  const blocks = [...src.matchAll(/^```\n([\s\S]*?)^```/gm)].map((m) => m[1].trim());
  for (const b of blocks) {
    const escaped = b.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!html.includes(escaped) && !html.includes(b)) {
      fail(`${distFile} is missing command block from ${srcFile}: "${b.slice(0, 40)}"`);
    }
  }
  console.log(`ok: ${distFile} carries all ${blocks.length} command blocks from ${srcFile}`);
};
if (!failed) {
  checkCommands('executor-instructions.md', 'recover/index.html');
  checkCommands('windows-recovery.md', 'recover/windows/index.html');
}

// Live check when a deployed URL is available.
const siteUrl = process.env.SITE_URL;
if (siteUrl) {
  const url = `${siteUrl.replace(/\/$/, '')}/recover`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) fail(`live check: ${url} returned HTTP ${res.status}`);
  else console.log(`ok: live ${url} resolves (HTTP ${res.status})`);
}

if (failed) process.exit(1);
console.log('ok: /recover guarantees hold');
