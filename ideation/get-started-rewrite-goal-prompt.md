# T-185 — get-started onboarding rewrite: goal prompt

Prepared 18 Jul 2026 from the executor-file session, grounded in the live
site and the 2026-07-18 UAT walk. For a fresh Claude Code session inside
`/Users/jamiewatters/DevProjects/executor-file-site`, pasted after `/goal`.

**Suitability:** good fit for goal-first — one page, bounded, findings
already logged (EFS-ISS-1..6 in ISSUES.md). Run on the strongest model.

**PREREQUISITE (state clearly, do not skip):** the browser register
editor (`web/editor.html`, `Edit-Executor-File.command`), the
review-in-browser flow, and the README "Get the tool" section all landed
in the tool repo AFTER the `v0.3.0` tag (`c8e0ded`). The site pins to
`v0.3.0`, so it cannot yet mirror or link any of them. Before this task
can link the editor, **`v0.3.1` must be tagged on TheWayWithin/
executor-file** (carrying those commits) **and `pin.json` re-pinned to
it** (`npm run pin:refresh`, review the drift diff, commit). If v0.3.1
does not exist yet, stop and get it cut first — do not hand-copy the
editor into the site to route around the pin (that breaks the no-drift
guarantee).

---

```
Read this whole prompt, then read ISSUES.md (EFS-ISS-1..6), src/pages/get-started.astro, src/components/Mirrored.astro, pin.json, scripts/fetch-mirror.mjs, src/config.ts, and ideation/executorfile-website-strategy.md before changing anything. Your job: rewrite the get-started page of executorfile.com so a non-technical owner with no Unix or Mac command-line experience gets from landing to a filled-in register and a sealed file without hitting a wall. This page is the single funnel for the whole non-technical audience, and a real first-time user (Jamie, 2026-07-18) failed on it six separate times: three platform blocks with no "pick the one for your computer" (EFS-ISS-1), install commands with no "open the Terminal app and type this" and no hint that they are commands at all (EFS-ISS-2), commands not visually distinct or placed (EFS-ISS-3), the install step shown twice in clashing tones because the developer-flavoured README quickstart is mirrored verbatim onto the page (EFS-ISS-4), steps numbered from 0 that render as bold prose not a list (EFS-ISS-5), and no bridge from "I'm reading a webpage" to "I have the tool open in a Terminal in the right folder" (EFS-ISS-6). Excellent looks like this: a nervous, non-technical person reads the page top to bottom and never once thinks "wait, what do I do, or where does this go" — every command is obviously a command, sits on its own, and says exactly where to type it, and there is a genuinely no-terminal way to build the register.

PREREQUISITE, verify first: the browser register editor and the improved README arrived after the v0.3.0 tag. Confirm pin.json is pinned to a tag (v0.3.1 or later) whose tree contains web/editor.html and the "Get the tool" README section. If it is still pinned to v0.3.0, stop: v0.3.1 must be tagged on the tool repo and the site re-pinned (npm run pin:refresh) before the editor can be surfaced. Do not hand-copy the editor to dodge the pin — the no-drift mirror is a hard invariant.

You are working in /Users/jamiewatters/DevProjects/executor-file-site (Astro static site, deployed to Netlify, mirrors pinned tool-repo files at build time via pin.json + fetch-mirror.mjs; DOWNLOAD_ENABLED and RELEASE come from the pinned tag's release assets). Hard constraints, none negotiable: the /recover pages stay commercially silent and tracker-free; the site's claims inherit the tool's honesty bar (no "tested with real executors" until the Windows dry run passes; do not pretend the Terminal isn't involved for sealing); Jamie's voice rules on all published copy (no leverage/seamless/robust/unlock/empower/ecosystem/delve/utilize/navigate-as-metaphor; no em-dashes in published prose, recast with colons or periods; British English); and the local-only promise — if you host the editor on the site, it must run entirely client-side and send nothing anywhere, matching the tool's "nothing leaves your machine" guarantee.

Within that, the HOW is yours and you decide without deferring: whether to stop mirroring the README quickstart verbatim and write site-native, plain-language steps instead (recommended — the mirrored developer quickstart is the source of EFS-ISS-3/4/5); whether to offer the browser editor as a page the site HOSTS at /editor (mirrored from the pinned tool commit so it can't drift) for a zero-install way to build the register, or to instruct owners to open the editor that ships in the downloaded tool (Edit-Executor-File.command / web/editor.html), or both; the page structure and where the two-door pattern from the strategy doc applies; and how to make every command unmistakably a command with its location. Make these calls yourself.

The findings to resolve, each verifiable against ISSUES.md: pick-one-platform must be obvious (show the reader's OS first, others behind a small toggle or clearly secondary); every command block must read as "open the Terminal app, type or paste this, press return", styled so it cannot be mistaken for prose; the install step appears once, in the site's own gentle voice, not duplicated by a mirrored developer quickstart; steps render as a real, correctly numbered list; and there is a continuous, gap-free path from landing to "tool open in a Terminal in the right folder" (or, via the hosted editor, from landing to a downloaded estate.yaml) with no instruction stranded on another page. Surface the browser editor as the no-YAML way to build the register, since hand-editing YAML in a terminal editor was the decisive wall the tool just removed. Keep the executor (/recover) path entirely separate and unchanged in tone.

Before calling it done, prove it: run the site locally and read the rewritten page as a non-technical stranger would, ideally have one actually walk it; build for production clean; confirm each of EFS-ISS-1..6 is genuinely resolved (write one line per issue saying how); check every command is styled and placed and nothing is duplicated; verify the page works on a phone; confirm /recover is untouched and still tracker-free; and grep the built output for the banned words and for em-dashes in published prose. Then re-run the website UAT walk end to end yourself and note any new snag.

Deliverables land on executor-file-site main in reviewable commits with the Netlify deploy green; close EFS-ISS-1..6 in ISSUES.md (move them to Recently closed with the commit), and finish with one paragraph summarising what you changed and every judgement call you made. Goal: a get-started page that carries a non-technical owner from landing to a built, sealed Executor File without a single "wait, what?", the browser editor surfaced as the no-YAML path, every logged onboarding finding closed. Work autonomously — do not ask for anything until it is all done — and parallelise independent work across sub-agents where it helps.
```

**After it runs:** re-do the website UAT walk (the human one) to confirm the walls are gone. Then the jamiewatters.work status flip BETA→LIVE and the agent-readability brief (T-173) are the remaining site-side items.
