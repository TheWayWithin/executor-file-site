#!/usr/bin/env node
// Fetches the executor-file tool repo at the commit pinned in pin.json,
// verifies every mirrored file byte-matches its pinned SHA-256, then writes
// render-ready copies and computed stats into src/mirrored/.
//
// The tool repo is the single source of truth. The site renders these files;
// it never hand-copies them. If a pulled file is missing or does not match
// the pin, this script exits non-zero and the build fails.
//
// Rendering transform (applied only to the copies in src/mirrored/, never to
// the verified originals): relative markdown links are rewritten to GitHub
// blob URLs at the pinned ref, so they resolve from the site.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const pin = JSON.parse(fs.readFileSync(path.join(root, 'pin.json'), 'utf8'));
const mirrorDir = path.join(root, '.mirror');
const outDir = path.join(root, 'src', 'mirrored');
const tarball = path.join(mirrorDir, 'source.tar.gz');
const treeDir = path.join(mirrorDir, 'tree');

const refresh = process.argv.includes('--refresh-hashes');

fs.rmSync(treeDir, { recursive: true, force: true });
fs.mkdirSync(treeDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

// 1. Download the tarball at the pinned ref (immutable for a commit SHA).
const url = `https://codeload.github.com/${pin.repo}/tar.gz/${pin.ref}`;
console.log(`fetching ${url}`);
const res = await fetch(url);
if (!res.ok) {
  console.error(`FAIL: could not fetch ${pin.repo}@${pin.ref} (HTTP ${res.status})`);
  process.exit(1);
}
fs.writeFileSync(tarball, Buffer.from(await res.arrayBuffer()));
execFileSync('tar', ['-xzf', tarball, '-C', treeDir, '--strip-components=1']);

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

// 2. Verify (or refresh) the byte-match pin for every mirrored file.
let failed = false;
for (const [rel, expected] of Object.entries(pin.files)) {
  const p = path.join(treeDir, rel);
  if (!fs.existsSync(p)) {
    console.error(`FAIL: pinned file missing from ${pin.repo}@${pin.ref}: ${rel}`);
    failed = true;
    continue;
  }
  const actual = sha256(fs.readFileSync(p));
  if (refresh) {
    pin.files[rel] = actual;
  } else if (actual !== expected) {
    console.error(`FAIL: ${rel} does not byte-match the pin`);
    console.error(`  pinned: ${expected}`);
    console.error(`  actual: ${actual}`);
    failed = true;
  } else {
    console.log(`ok: ${rel}`);
  }
}
if (failed) process.exit(1);
if (refresh) {
  fs.writeFileSync(path.join(root, 'pin.json'), JSON.stringify(pin, null, 2) + '\n');
  console.log('pin.json hashes refreshed; review the diff before committing.');
}

// 3. Render-ready copies: rewrite relative markdown links to the pinned tree.
const blobBase = `https://github.com/${pin.repo}/blob/${pin.ref}/`;
const rewriteLinks = (md) =>
  md.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, `](${blobBase}$1)`);

const copyOut = (rel, outName) => {
  const md = fs.readFileSync(path.join(treeDir, rel), 'utf8');
  fs.writeFileSync(path.join(outDir, outName), rewriteLinks(md));
};
copyOut('templates/EXECUTOR-INSTRUCTIONS.md', 'executor-instructions.md');
copyOut('docs/WINDOWS-RECOVERY.md', 'windows-recovery.md');
copyOut('SECURITY.md', 'security.md');
copyOut('README.md', 'readme.md');
copyOut('docs/discovery-checklist.md', 'discovery-checklist.md');

// 4. Extract README sections rendered on their own (deterministic slices of
//    the verified file, not hand copies).
const readme = fs.readFileSync(path.join(treeDir, 'README.md'), 'utf8');
const section = (heading) => {
  const start = readme.indexOf(`\n## ${heading}`);
  if (start === -1) {
    console.error(`FAIL: README section not found at pin: "${heading}"`);
    process.exit(1);
  }
  const rest = readme.slice(start + 1);
  const end = rest.indexOf('\n## ', 1);
  return rewriteLinks(end === -1 ? rest : rest.slice(0, end)).trim() + '\n';
};
fs.writeFileSync(path.join(outDir, 'quickstart.md'), section('Quickstart (you, the owner)'));
fs.writeFileSync(path.join(outDir, 'threat-model.md'), section('Threat model'));
fs.writeFileSync(path.join(outDir, 'out-of-scope.md'), section('Deliberately out of scope'));
fs.writeFileSync(path.join(outDir, 'how-diagram.md'), section('How it works'));
fs.writeFileSync(path.join(outDir, 'platform-legacy.md'), section('Platform legacy tools come first'));

// 5. Sample artefacts, generated from the pinned tree at build time: the
//    example (dummy-data) register and the triage report the tool's own
//    render.sh produces from it. Never hand-copied.
execFileSync('sh', ['scripts/render.sh', 'examples/estate.example.yaml'], { cwd: treeDir });
fs.copyFileSync(path.join(treeDir, 'examples/estate.example.yaml'), path.join(outDir, 'estate.example.yaml'));
fs.copyFileSync(path.join(treeDir, 'examples/executor-report.md'), path.join(outDir, 'sample-report.md'));

// 6. Stats computed from the pinned tree. Nothing here is typed by hand;
//    anything that cannot be computed from the tree is omitted from the site.
const scriptsDir = path.join(treeDir, 'scripts');
const scriptFiles = fs.readdirSync(scriptsDir).filter((f) => /\.(sh|py)$/.test(f)).sort();
const lineCount = (p) => fs.readFileSync(p, 'utf8').split('\n').filter((l, i, a) => i < a.length - 1 || l !== '').length;
const scripts = scriptFiles.map((f) => ({ name: f, lines: lineCount(path.join(scriptsDir, f)) }));

const license = fs.readFileSync(path.join(treeDir, 'LICENSE'), 'utf8').split('\n')[0].trim();
const schema = JSON.parse(fs.readFileSync(path.join(treeDir, 'schema', 'estate.schema.json'), 'utf8'));
const ci = fs.readFileSync(path.join(treeDir, '.github', 'workflows', 'ci.yml'), 'utf8');
const osMatch = ci.match(/os:\s*\[([^\]]+)\]/);
const ciOses = osMatch ? osMatch[1].split(',').map((s) => s.trim().replace(/-latest$/, '')) : [];

const recoveryDoc = fs.readFileSync(path.join(treeDir, 'templates/EXECUTOR-INSTRUCTIONS.md'), 'utf8');
const recoveryCommands = (recoveryDoc.match(/^```$/gm) || []).length / 2;

const stats = {
  repo: pin.repo,
  ref: pin.ref,
  tag: pin.tag,
  fetchedFrom: url,
  license,
  schemaDialect: schema.$schema,
  ciOses,
  scripts,
  scriptTotalLines: scripts.reduce((n, s) => n + s.lines, 0),
  recoveryCommandBlocks: recoveryCommands,
};
fs.writeFileSync(path.join(outDir, 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
console.log(`mirrored ${Object.keys(pin.files).length} pinned files + 3 derived sections + stats.json`);
