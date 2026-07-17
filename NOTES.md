# NOTES: launch checklist and open items

State as of 17 July 2026: the site is built and deployed to its netlify.app
subdomain. The v0.3.0 tag does not exist yet in the tool repo, so everything
below that depends on it is deliberately parked.

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
5. **DNS handoff (Jamie's only registrar action).** Per the strategy doc, DNS
   waits for the v0.3.0 tag. When ready:
   - Add both domains to the Netlify site (executorfile.com primary,
     executor-file.com as an alias) and set up Netlify DNS for both.
   - Netlify will show four nameservers (of the form `dns1.p0X.nsone.net`).
   - At Namecheap, for **each** of executorfile.com and executor-file.com:
     Domain List > Manage > Nameservers > Custom DNS > paste the four Netlify
     nameservers.
   - Then poll (do not fail): propagation can take an hour or two. Confirm
     HTTPS certificates issue on both domains and that
     `https://executor-file.com` 301s to `https://executorfile.com`
     (the redirect rules are already in `netlify.toml`).
6. **Set the SITE_URL repository variable** on GitHub
   (`gh variable set SITE_URL --body "https://executorfile.com"` after DNS,
   or the netlify.app URL before it) so the CI live-check job for /recover
   runs on every push.
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
