---
description: Audit the webapp + wiki + dev plan, surface mismatches, refresh memory/LATEST_ALIGNMENT.md so your partner sees the latest state after every git pull.
---

You are running the CleanLA alignment audit. This is the executable version of
`memory/prompt.md` — your job is to produce a fresh `memory/LATEST_ALIGNMENT.md`
that your partner dev will see when they `git pull`.

## Hard constraints

- **Read-only audit.** Do NOT run migrations, push code, edit source files,
  change deps, or start implementation.
- **Safe checks only.** `git status`, `git log`, `npm run lint`, `npm run
  typecheck`, `npm run build`, HTTP probes against a running dev server.
- The data-gathering script (`scripts/align.sh`) handles the routine stuff;
  your job is the synthesis on top.

## Step 1 — run the gather script

```bash
bash scripts/align.sh 2>&1 | tee /tmp/cleanla-align-raw.txt
```

This captures: git state, recent commits, source tree, env contract, package
deps, migrations, lint/typecheck/build results, running services, stale-doc
flags, open questions. Read the output before writing the report.

## Step 2 — verify wiki alignment

For each of the 5 decision logs in `wiki/decisions/`, decide whether the code
currently honors it. Categories:

- **aligned** — code matches the decision
- **ahead of code** — wiki has a decision the code hasn't implemented yet (not
  drift, just a future feature)
- **paused** — decision is dormant because the relevant feature isn't built
  yet; not a violation
- **drifting** — code has moved away from an active decision (this is the
  red-flag case)

Also check `CleanLA-development-plan.md` — is it still describing the current
direction or is it stale? If stale, surface it in the report.

## Step 3 — write the report

Overwrite `memory/LATEST_ALIGNMENT.md` with a fresh report in this exact shape:

```markdown
# CleanLA Alignment Report

**Generated:** <ISO timestamp PT>
**Generator:** `memory/prompt.md` orientation audit, executed by Claude Code
**Branch:** <branch name> (<sync status with origin>)

> Plain-English status of where the webapp actually stands vs. what the
> planning materials say. Run `/align` (or `bash scripts/align.sh`) to refresh.
> Commit it so your partner sees the latest state after each `git pull`.

---

## 1. Current Webapp Status
- What phase the code is in
- What's actually built and verified (table of checks)
- Tech stack actually in package.json
- Env contract

## 2. Wiki Alignment
- Table of each decision log + aligned/ahead/paused/drifting
- Stale-doc flags (CleanLA-development-plan.md etc.)
- Mismatch classification (code-ahead-of-wiki, wiki-speculative, drifting, unclear)

## 3. Current Blockers
- Severity-ranked table of what's blocking real progress
- Distinguish local-blocker from production-blocker

## 4. What To Do Next (1-3 Practical Tasks)
- Concrete, plain-English, named tasks
- Explicit "do NOT focus on yet" list (per Phase 2 scope in memory/webapp-status-*.md)

## 5. Confidence and Caveats
- Files actually inspected
- Checks actually run
- Facts vs. guesses (be honest)

---

## One-Sentence Version
<single sentence a non-engineer can paste into a status update>
```

## Step 4 — commit the report

```bash
git add memory/LATEST_ALIGNMENT.md
git commit -m "align: refresh LATEST_ALIGNMENT.md ($(date -u +%Y-%m-%d))"
git push origin main
```

Per the repo's `feedback_push_no_confirm` memory: this is a commit-and-push
operation on `main`, no separate approval needed.

## Tone

- Plain English a non-frontend-engineer can read
- Be concise; tables beat paragraphs
- Distinguish facts from guesses explicitly
- Don't over-focus on future phases unless they affect immediate work
- Match the project's voice — direct, no preamble, no hype
