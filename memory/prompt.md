# CleanLA Webapp Orientation Prompt

Use this prompt when you want an AI coding agent to inspect the repo, understand where the `webapp` actually stands, then compare that reality against the wiki and development plan. At this point, the code is the ground truth; the wiki is useful context, but some pages may be speculative or stale.

```text
You are helping on the CleanLA repo.

Your job is to inspect where the webapp currently stands and then compare that against the repo's planning/wiki materials. Do not implement changes unless I explicitly ask you to. Start with read-only inspection of the actual webapp code and folder structure, then use the plan/wiki as context. Give me a plain-English status report that a non-expert collaborator can understand.

Step 1: inspect the actual webapp code and config first:
- `git status --short --branch`
- `webapp/package.json`
- `webapp/.env.example`
- `webapp/src/app/page.tsx`
- `webapp/src/app/layout.tsx`
- `webapp/src/app/api/`
- `webapp/src/features/map/`
- `webapp/src/features/spots/`
- `webapp/src/lib/`
- `webapp/supabase/migrations/`
- `webapp/supabase/seed.sql`
- `webapp/README.md`
- `webapp/PHASE-2-IMPLEMENTATION-PLAN.md`
- `webapp/PHASE-2-HANDOFF.md`
- the newest file in `memory/` that looks like a webapp status note

Step 2: then compare the code reality against the planning materials:
- `CleanLA-development-plan.md`
- `wiki/index.md`
- relevant wiki pages from the index, especially:
  - `wiki/projects/cleanla-snap.md`
  - `wiki/decisions/2026-05-web-stack-over-mobile.md`
  - `wiki/decisions/2026-05-mapbox-over-google-maps.md`
  - `wiki/decisions/2026-05-deep-link-not-direct-submit.md`
  - `wiki/decisions/2026-05-no-candidate-branding.md`
  - `wiki/decisions/2026-05-on-device-face-blur-required.md`

Treat the wiki as strategic context, not automatic truth. If code and wiki disagree, say so clearly and explain whether the mismatch looks like:
- code is ahead of the wiki
- wiki is speculative / future-looking
- implementation may be drifting from an active decision
- unclear and needs a human decision

If useful, run safe checks:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Do not run migrations, push code, edit files, change dependencies, or start implementation unless I specifically ask.

Report back with:

1. Current webapp status
   - What phase the webapp appears to be in.
   - What is already implemented.
   - What the code says is true, independent of the wiki.

2. Wiki alignment
   - Where the webapp agrees with the development plan and wiki decisions.
   - Any obvious mismatch between code, plan, and wiki.
   - Any wiki pages that look stale because the implementation has moved forward.
   - Any wiki ideas that are still future/speculative and should not distract the current webapp work.

3. Current blockers
   - Environment variables that are required.
   - Database migrations or seed steps that appear pending.
   - Any build/type/lint failures if checks were run.

4. What a collaborator should do next
   - Give 1-3 practical next tasks.
   - Say what not to focus on yet.
   - Keep it plain-English and specific.

5. Confidence and caveats
   - Say which files you inspected.
   - Say which checks you ran.
   - Clearly separate facts from guesses.

Tone:
- Be concise.
- Explain technical details in normal language.
- Assume the reader is smart but not a full-time frontend engineer.
- Do not over-focus on future phases unless they affect the immediate webapp work.
```

## Short Version

```text
Inspect the CleanLA repo and tell me where `webapp` actually stands. Start with the real webapp code, folders, migrations, package scripts, and status docs. Then compare that against `CleanLA-development-plan.md` and the wiki, treating the wiki as strategic context that may be speculative or stale. Do not edit files. Give me a plain-English update: what is implemented, what matches or differs from the plan/wiki, what is blocked, and the next 1-3 practical tasks.
```
