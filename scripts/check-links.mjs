#!/usr/bin/env node
// Internal link check over the built site. Every internal href, src and
// anchor target in dist/ must resolve to a built file (or a fragment that
// exists in the target page). Fails the build on any broken internal link.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.error('FAIL: dist/ not found; run the build first');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(dist);

const idsByFile = new Map();
const collectIds = (file) => {
  if (!idsByFile.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    idsByFile.set(file, ids);
  }
  return idsByFile.get(file);
};

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

let broken = 0;
let checked = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#$)/.test(ref)) continue;
    checked++;
    const [rawPath, fragment] = ref.split('#');
    let target;
    if (rawPath === '') {
      target = file; // same-page fragment
    } else if (rawPath.startsWith('/')) {
      target = resolveTarget(rawPath.slice(1));
    } else {
      target = resolveTarget(
        path.relative(dist, path.resolve(path.dirname(file), rawPath))
      );
    }
    if (!target) {
      console.error(`BROKEN: ${ref} in ${path.relative(dist, file)}`);
      broken++;
      continue;
    }
    if (fragment && target.endsWith('.html') && !collectIds(target).has(fragment)) {
      console.error(`BROKEN FRAGMENT: ${ref} in ${path.relative(dist, file)}`);
      broken++;
    }
  }
}

console.log(`checked ${checked} internal references across ${htmlFiles.length} pages`);
if (broken > 0) {
  console.error(`FAIL: ${broken} broken internal links`);
  process.exit(1);
}
console.log('ok: every internal link resolves');
