#!/usr/bin/env node
// Generates the site-wide OG image (1200x630) from an inline SVG.
// Paper-and-ink, same tokens as the site. Kept deliberately font-tolerant:
// generic sans-serif so it renders identically on macOS and CI.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const outDir = path.join(root, 'public', 'og');
fs.mkdirSync(outDir, { recursive: true });

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#faf7f1"/>
  <rect x="80" y="96" width="72" height="8" fill="#2e5d4b"/>
  <text x="80" y="200" font-family="sans-serif" font-size="64" font-weight="700" fill="#211d18">Everything your executor will need,</text>
  <text x="80" y="280" font-family="sans-serif" font-size="64" font-weight="700" fill="#211d18">in one encrypted file.</text>
  <text x="80" y="370" font-family="sans-serif" font-size="34" fill="#5c554b">A file your family keeps.</text>
  <text x="80" y="418" font-family="sans-serif" font-size="34" fill="#5c554b">Not a service that can die.</text>
  <text x="80" y="540" font-family="sans-serif" font-size="30" font-weight="600" fill="#2e5d4b">executorfile.com</text>
  <rect x="0" y="622" width="1200" height="8" fill="#2e5d4b"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'default.png'));
console.log('wrote public/og/default.png');
