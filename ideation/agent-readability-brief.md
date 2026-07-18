# Brief: agent readability — make executorfile.com machine-recommendable

From the executor-file repo session, 17 Jul 2026. Context: an AI-search
readability assessment found the site's *content* strong (static HTML,
honest copy, intent-matching pages) but the machine plumbing missing.
Agents that read the site understand it; agents *searching* or *ranking*
tools can't find or verify it yet. This brief covers the four site-side
fixes. (Already done repo-side: GitHub topics set on TheWayWithin/
executor-file. Handled elsewhere: DNS/launch and the repo homepage field
are in NOTES.md's launch checklist; v0.3.0 tag is gated on UAT.)

Constraints that override everything here: Jamie's voice rules (no
corporate speak, no em-dashes in published prose, British English);
/recover stays commercially silent (structured data is fine there,
trackers are not); nothing may claim what isn't true yet (no
softwareVersion until v0.3.0 exists, no download claims while
DOWNLOAD_ENABLED is false).

## 1. llms.txt (+ llms-full.txt)

Add `public/llms.txt` following the llms.txt convention — and use
LLMTxtMastery to generate/validate it (dogfooding is also a content
story for the blog later). It should carry: one-paragraph description
(reuse the homepage meta description), links with one-line annotations
to: how-it-works, get-started, why-trust-this, faq, recover (and
recover/windows), the learn index, and the GitHub repo. Consider
`llms-full.txt` with the full text of the key pages inlined. Keep it
generated or checked at build time so it can't drift from the page
inventory.

## 2. JSON-LD structured data

- **SoftwareApplication** on the homepage (and get-started):
  name "Executor File", applicationCategory estate/utility, description
  (meta description), operatingSystem "macOS, Linux, Windows (WSL)",
  offers price 0 / priceCurrency USD, license MIT + link,
  url https://executorfile.com, sameAs the GitHub repo URL.
  Add softwareVersion ONLY when the site is re-pinned to v0.3.0 — wire
  it to the same config/pin data as the download flag so it cannot lie.
- **FAQPage** on /faq: every visible Q&A mirrored exactly (no
  extra questions that aren't on the page — parity matters).
- **Article** on each learn/ post: headline, description, author Jamie
  Watters, datePublished/dateModified from frontmatter.
- **HowTo** on /recover (optional but valuable: agents guiding a user
  through recovery can lift the exact steps): the three commands as
  steps, tools age + ssss. Same on recover/windows if cheap.
- Verify all blocks with a schema validator; add a CI check if easy
  (a small script asserting JSON-LD parses and FAQ parity holds).

## 3. Title tags and per-page meta

- Homepage title: "Executor File — everything your executor will need,
  in one encrypted file" (currently just "Executor File").
- Per-page pattern "«what the page answers» — Executor File", e.g.
  "How it works: age encryption and 2-of-3 shares — Executor File";
  "Open an Executor File: executor recovery steps — Executor File".
- Every page gets a distinct meta description written as the answer an
  agent would quote (the homepage one is the quality bar).

## 4. Query-language sweep (learn/ + FAQ)

People ask agents in their own words. Make sure these exact phrasings
appear as a heading or question somewhere honest (one place each, no
stuffing): "What happens to my online accounts when I die?" · "How will
my family find my passwords?" · "digital estate planning" · "digital
legacy". If a learn post doesn't exist for the first two, they are the
two highest-value posts to write next.

## Verification before done

Build clean; llms.txt served and accurate; every JSON-LD block passes a
validator; titles/descriptions unique per page; FAQ schema parity with
visible content; /recover unchanged in tone and still tracker-free;
grep the built dist/ for banned words and em-dashes in published prose.
Add "set GitHub repo homepage field to https://executorfile.com" to
NOTES.md's launch checklist so it happens at DNS time.
