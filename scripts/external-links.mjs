#!/usr/bin/env node
// Post-build: external links open in a new tab. Applied to the built HTML so
// it covers both site-authored pages and content rendered from the mirrored
// tool-repo markdown, without touching the mirrored sources.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');

const internalHosts = new Set(['executorfile.com', 'www.executorfile.com']);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) files.push(p);
  }
};
walk(dist);

let changed = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const out = html.replace(/<a ([^>]*)>/g, (m, attrs) => {
    const href = attrs.match(/href="(https?:\/\/[^"]+)"/);
    if (!href) return m;
    if (internalHosts.has(new URL(href[1]).hostname)) return m;
    if (/\btarget=/.test(attrs)) return m;
    return `<a ${attrs} target="_blank" rel="noopener">`;
  });
  if (out !== html) {
    fs.writeFileSync(file, out);
    changed++;
  }
}
console.log(`external links set to open in a new tab on ${changed} pages`);
