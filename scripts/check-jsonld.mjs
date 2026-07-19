#!/usr/bin/env node
// Structured-data guard, run over the built output:
// 1. Every <script type="application/ld+json"> in dist/ parses as JSON and
//    carries an @context and @type.
// 2. On /faq, the FAQPage questions match the visible questions on the page
//    exactly, in the same order (no schema-only or page-only questions).

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');

let failed = false;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failed = true;
};

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(dist);

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

const scriptRe = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

let blockCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(dist, file);
  for (const m of html.matchAll(scriptRe)) {
    blockCount++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      fail(`${rel}: JSON-LD does not parse: ${e.message}`);
      continue;
    }
    if (!data['@context'] || !data['@type']) {
      fail(`${rel}: JSON-LD block missing @context or @type`);
    }
  }
}

// FAQ parity.
const faqPath = path.join(dist, 'faq.html');
if (fs.existsSync(faqPath)) {
  const html = fs.readFileSync(faqPath, 'utf8');
  const visible = [...html.matchAll(/<summary[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(
    (m) => decode(m[1])
  );
  const scriptMatch = [...html.matchAll(scriptRe)]
    .map((m) => JSON.parse(m[1]))
    .find((d) => d['@type'] === 'FAQPage');
  if (!scriptMatch) {
    fail('faq.html has no FAQPage JSON-LD block');
  } else {
    const schemaQs = scriptMatch.mainEntity.map((q) => decode(q.name));
    if (visible.length === 0) fail('faq.html: no visible questions found');
    if (JSON.stringify(visible) !== JSON.stringify(schemaQs)) {
      fail('faq.html: FAQPage questions do not match visible questions 1:1');
      console.error('  visible:', JSON.stringify(visible));
      console.error('  schema :', JSON.stringify(schemaQs));
    } else {
      console.log(`ok: FAQ parity holds (${visible.length} questions)`);
    }
  }
}

if (failed) process.exit(1);
console.log(`ok: ${blockCount} JSON-LD blocks parse across ${htmlFiles.length} pages`);
