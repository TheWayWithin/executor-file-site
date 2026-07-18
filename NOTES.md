# NOTES: launch checklist and open items

State as of 18 July 2026: the site is LIVE at https://executorfile.com
(Jamie's call: going live pre-tag is fine because untagged state is handled
and there is no traffic). Netlify DNS serves both domains, HTTPS is issued,
and executor-file.com (and both www hosts) 301 to executorfile.com; verified
18 July 2026. The v0.3.0 tag does not exist yet in the tool repo, so the
items below that depend on it remain parked.

## Launch checklist (in order)

1. **Tag v0.3.0 in TheWayWithin/executor-file** (the existing release gates
   in that repo). Everything below waits on this.
2. **Re-pin the site to the tag.** The mirror is currently pinned to main
   commit `bfe5b500ebde97e097f4de81fdde9cc4112c9064` because the tag did not
   exist at build time. To re-pin: in `pin.json` set `ref` to the tag's commit
   SHA and `tag` to `"v0.3.0"`, run `npm run pin:refresh`, review the diff,
   commit. CI fails on any file that stopped byte-matching, which is the
   drift protection working.
3. **Flip the download flag.** In `src/config.ts` set `DOWNLOAD_ENABLED = true`.
   The Get started page then shows the tarball button with the SHA-256 note
   instead of the "available with v0.3.0" state.
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
