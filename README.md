# executor-file-site

The website for [Executor File](https://github.com/TheWayWithin/executor-file):
executorfile.com. Static Astro, vanilla CSS design tokens, no database, no
auth, deployed to Netlify.

## The one rule

The tool repo is the single source of truth. Every technical claim on the
site is pulled from or computed against `TheWayWithin/executor-file` at build
time, pinned to the commit in `pin.json`. `scripts/fetch-mirror.mjs` downloads
the pinned tree, verifies each mirrored file byte-matches its pinned SHA-256,
and fails the build otherwise. Nothing is hand-copied.

## Commands

```bash
npm ci             # install
npm run dev        # fetch mirror + dev server
npm run build      # fetch mirror + OG image + static build to dist/
npm run verify     # build + link check + voice lint + /recover guarantees
npm run pin:refresh  # after changing pin.json ref: refresh hashes, review diff
```

## Layout

- `pin.json` — the tool-repo pin (commit + per-file SHA-256)
- `scripts/fetch-mirror.mjs` — fetch, verify, derive sections, compute stats
- `scripts/check-links.mjs` — every internal link resolves in dist/
- `scripts/check-voice.mjs` — voice rules (British English register, no
  em-dashes, banned words, no urgency mechanics) on site prose
- `scripts/check-recover.mjs` — /recover guarantees: present, analytics-free,
  affiliate-free, command blocks match the pin-verified source
- `src/mirrored/` — generated at build time, never committed
- `src/styles/tokens.css` — the whole design system in one file
- `NOTES.md` — launch checklist (re-pin to v0.3.0, download flag, Plausible
  registration, DNS handoff)

## Licence

Site code is MIT (see LICENSE). Article content under `src/content/` is
© Jamie Watters, all rights reserved.
