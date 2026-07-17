#!/usr/bin/env node
// Voice lint for site prose, per the strategy doc's rules (§4):
// - "died"/"death" in instructional content; never "passed away" or similar
// - no em-dashes in published prose
// - banned-word list
// - no urgency mechanics or exclamation marks in content
//
// Scope: site-authored prose only. Content mirrored from the tool repo
// (src/mirrored/) is exempt: it must byte-match its pin and is not site prose.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);

const proseDirs = ['src/pages', 'src/components', 'src/layouts', 'src/content'];
const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(astro|md|mdx)$/.test(entry.name)) files.push(p);
  }
};
proseDirs.forEach((d) => walk(path.join(root, d)));

const bannedWords = [
  'leverage', 'delve', 'utilize', 'utilise', 'robust', 'seamless',
  'unlock', 'empower', 'ecosystem',
];
const euphemisms = ['passed away', 'passed on', 'the departed', 'loved one'];
const urgency = ['act now', 'start now', 'limited time', "don't wait", 'hurry'];

let problems = 0;
const report = (file, line, msg) => {
  console.error(`${path.relative(root, file)}:${line}: ${msg}`);
  problems++;
};

for (const file of files) {
  const isMarkdown = file.endsWith('.md') || file.endsWith('.mdx');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((text, i) => {
    const n = i + 1;
    if (text.includes('—')) report(file, n, 'em-dash in prose');
    for (const w of bannedWords) {
      if (new RegExp(`\\b${w}\\b`, 'i').test(text)) report(file, n, `banned word: "${w}"`);
    }
    for (const e of euphemisms) {
      if (new RegExp(e, 'i').test(text)) report(file, n, `euphemism: "${e}" (say "died")`);
    }
    for (const u of urgency) {
      if (new RegExp(u, 'i').test(text)) report(file, n, `urgency mechanic: "${u}"`);
    }
    // Exclamation marks: checked in markdown prose only (astro files contain
    // code where "!" is syntax). Markdown image syntax ![ is allowed.
    if (isMarkdown && /[^!\[]![^\[=]/.test(` ${text} `) && /\w!/.test(text)) {
      report(file, n, 'exclamation mark in prose');
    }
  });
}

console.log(`voice-checked ${files.length} files`);
if (problems > 0) {
  console.error(`FAIL: ${problems} voice violations`);
  process.exit(1);
}
console.log('ok: voice rules hold');
