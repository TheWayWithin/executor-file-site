# executor-file-site — Issue & Project Register

**This is the single source of truth for what is open in this repo.** One row per
issue/project. Detail lives in the linked doc; this file is the index the Mission
Control reconcile (`repo-reconcile.py`) reads and mirrors to the cockpit.

## ID convention (collision-safe)

Mission Control owns the bare `ISS-`/`PRJ-`/`T-` namespaces. **Every executor-file-site ID
carries the `EFS-` prefix** so it can never collide with a Mission-Control-native
ID or another repo's. Raise issues here with `python3 ~/shared/scripts/repo-issue.py`.

---

## Open

| ID | Title | Status | Severity | Detail | MC-SYNC |
|----|-------|--------|----------|--------|---------|
| EFS-ISS-6 | get-started has no bridge from webpage to working terminal: jumps into scripts/doctor.sh etc. with no clear 'download the tool -> unpack -> open Terminal -> cd into the folder' sequence first, so the commands fail for a real first-time user. THE core onboarding gap. | Open | critical | — | pending |
| EFS-ISS-5 | get-started quickstart steps: numbered from 0 but render as bold prose not a real list; 'one command per step / several are interactive' framing confuses (user expected a single command). Fix list formatting + framing. | Open | medium | — | pending |
| EFS-ISS-4 | get-started duplicates the install step: gentle 'What you need first' box AND a mirrored-README 'Quickstart (you, the owner)' section both say install age+ssss, in clashing tones — the developer-flavoured README quickstart shouldn't render verbatim on the non-technical owner page | Open | high | — | pending |
| EFS-ISS-3 | get-started commands need unmistakable styling + placement: user can't tell 'brew install age ssss' is a command to type or where (needs distinct monospace/code presentation and an explicit 'open Terminal and type this') | Open | high | — | pending |
| EFS-ISS-2 | get-started install step assumes terminal literacy: 'brew install age ssss' with no 'open the Terminal app and type this', no explanation of what a command/brew is — blocks the non-technical owner the site is meant to serve | Open | high | — | pending |
| EFS-ISS-1 | get-started 'What you need first': three platform blocks (Mac/Ubuntu/Windows) don't signal 'pick the one for your computer' — reads as if all three are required | Open | high | — | pending |

## Recently closed

| ID | Title | Status | Commit | Detail |
|----|-------|--------|--------|--------|
