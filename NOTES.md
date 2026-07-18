# NOTES: launch checklist and open items

State as of 18 July 2026: the site is LIVE at https://executorfile.com
(Jamie's call: going live pre-tag is fine because untagged state is handled
and there is no traffic). Netlify DNS serves both domains, HTTPS is issued,
and executor-file.com (and both www hosts) 301 to executorfile.com; verified
18 July 2026. Later that day v0.3.0 was tagged and released, the site was
re-pinned to it, and the download button went live.

## Launch checklist (in order)

1. ~~Tag v0.3.0~~ **Done 18 July 2026** (release "v0.3.0 — the Executor
   Release" published with tarball + .sha256 assets).
2. ~~Re-pin the site to the tag~~ **Done 18 July 2026**: pinned to tag commit
   `c8e0ded4`; all five mirrored files byte-identical to the previous pin.
   Future bumps: update `ref`/`tag` in `pin.json`, `npm run pin:refresh`,
   review the diff.
3. ~~Flip the download flag~~ **Done 18 July 2026**: the download now enables
   itself whenever the pin is a tagged release; the button links the release
   tarball asset and shows its SHA-256, both read from the release assets at
   build time (tarball hash verified against the sidecar independently).
4. **Register executorfile.com in Plausible.** Jamie has deliberately not yet
   added the site to his Plausible account. The snippet already ships in the
   base layout (excluded from /recover at the layout level), so until
   registration happens the dashboard simply has no data. Missing analytics
   data before this step is expected, not an error.
5. ~~DNS handoff~~ **Done 18 July 2026.** Both domains on Netlify DNS
   (executorfile.com primary; executor-file.com and both www hosts 301 to
   it), Let's Encrypt certificate issued, verified. Task T-170 closed.
6. ~~Set the SITE_URL repository variable~~ **Done**: set to
   `https://executorfile.com`; the CI live-check job for /recover runs on
   every push.
7. **Jamie writes /story.** The page ships as a layout-only placeholder; the
   copy is his, in his voice (jamie-voice skill), not SEO-optimised.
8. **Review and publish the three Learn drafts.** They live in
   `src/content/learn/` with `draft: true` and are not built. Before flipping
   any to `draft: false`: verify every product claim, and swap the plain
   vendor links in the password-manager article for affiliate URLs once the
   programmes are signed up (1Password via Impact; disclosure line renders
   automatically from the `affiliate` frontmatter flag).
9. **After launch:** add executorfile.com to the jamiewatters.work product
   row, and consider committing to printing `executorfile.com/recover` on the
   printed guide's next revision (the CI test that the URL resolves already
   ships).

## Standing decisions recorded here

- Stats on Why-trust-this are computed from the pinned repo at build time.
  The tool's test count is dynamic (the suite reports its own pass count at
  run time), so it cannot be computed statically and is **omitted** rather
  than typed by hand; the page links to the CI workflow and `run-tests.sh`
  instead.
- The Built to last graveyard table deliberately carries no prices or
  figures; each line is factual, sourced, and acquisition lines are stated
  as ownership changes, not failures.
- No display ads ever, stated as policy on /money.
- /recover and /recover/windows: no analytics, no affiliate links, no
  marketing, print stylesheet; enforced by `scripts/check-recover.mjs` in CI.
