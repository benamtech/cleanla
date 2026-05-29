# CleanLA touch-target minimum — 45 px vs 48 px (decision pending)

## Context

The 369 design system's render-time audit (`webapp/scripts/audit-overlays.mjs`, also bundled via `scripts/audit-369/audit.sh`) flags every interactive element rendered below **48 × 48 px** as a `TOUCH_TARGET` failure. The threshold is hard-coded in the audit at `MIN_TOUCH_TARGET_PX = 48`.

CleanLA's local code, by deliberate prior choice, treats **45 px** as the touch-target floor. This shows up in two places:

- `webapp/src/app/globals.css` — the `.tap-45` utility class extends a control's hit area to `min-width: 45px; min-height: 45px` via `::after`, and the `.nav-row` class sets `min-height: 45px` on row children.
- Many inline `min-h-[45px]` / `min-w-[45px]` Tailwind classes across `webapp/src/features/{reports,spots,map}/*.tsx`.

The 45-px choice is rooted in CleanLA's CLAUDE.md Rule 9 (the local pre-369-system version): **45 = 3 × 15, the smallest 3-multiple that clears the iOS HIG 44 pt minimum.** Internally consistent, satisfies HIG, and respects the 369 spacing grid.

But it falls 3 px short of Material Design's 48 dp minimum and the WCAG 2.5.5 AAA threshold (which is 44 px in CSS; AAA prefers 48 px on Android). The 369 audit chose 48 px as the cross-platform safe value (`max(iOS HIG 44, Material 48) = 48`).

## What the audit caught (2026-05-29 run against americanmarketing.technology)

- Header nav buttons render 45 × 45 to 129 × 45 — `min-h-[45px]` is the cap.
- Map zoom controls render 45 × 45 — Mapbox default + CleanLA's `.tap-45` confirms 45.
- Footer-ish small links render 14–23 px tall in some sheets — these are genuinely below even CleanLA's own 45 floor and are real bugs worth fixing regardless of which threshold wins.

## Three resolution paths

### A. Bump CleanLA to 48 (align with 369 audit)

Update every `45` → `48` in:
- `globals.css` `.tap-45` (rename → `.tap-48`) and `.nav-row min-height: 45px` → `48px`.
- Every inline `min-h-[45px]` / `min-w-[45px]` in `features/reports/ReportSheet.tsx`, `features/spots/CleanupSheet.tsx`, `features/map/CleanLAMap.tsx`.

Pros: passes the 369 audit cleanly; safer for Android users; passes WCAG 2.5.5 AAA on Android.
Cons: visible chrome grows 3 px taller in dense rows; the `45 = 3×15` rationale is lost (48 is also a 3-multiple — 3×16 — but it's not the "first multiple above HIG 44" hook).

### B. Lower the 369 audit threshold to 45 (align 369 with CleanLA)

Edit `MIN_TOUCH_TARGET_PX` in `node_modules/@adn/369-design-system/references/audit-overlays.mjs` from `48` to `45`. Document the choice in the manifest.

Pros: no CleanLA code changes; preserves the 45 = 3 × 15 rationale.
Cons: drops the cross-platform safety margin on Android; weakens the audit's value for other 369 consumers; the change would have to be ratified upstream in `navruhtra/369-design-system` or maintained as a CleanLA fork.

### C. Make 48 the audit default but allow per-manifest override

Update the 369 audit to read `touchTargetMin` from the manifest (it already supports `viewportOverrides[name].touchTargetMin` per-viewport; promote it to a top-level default too). CleanLA's manifest sets it to 45 globally. The 369 audit stays at 48 by default for other consumers.

Pros: respects CleanLA's local choice without forking the upstream audit; preserves the 369 audit's cross-platform default for everyone else.
Cons: a new manifest field needs schema + audit-script updates upstream.

## Recommendation

**Path A or Path C.** Path B weakens a render-time gate without strong reason — the 3-px cost is small, the Android safety gain is real, and any future audit consumer benefits from a tight default.

If the team's preference is to keep the visible chrome unchanged, Path C is the right next move and would land as a v0.3 of `@adn/369-design-system` (manifest-level `touchTargetMin`, default 48, override 45). I can prepare that PR in 369 if you want.

## What this PR ships in the meantime

- **Focus-ring fix** in `globals.css` — unambiguous bug fix; restores keyboard focus visibility per WCAG 2.4.7 + 2.4.11. Navy outline at 2 px / 2 px offset, AAA contrast on white.
- **Audit integration** — runner + manifest + docs + parked CI YAML.
- **No 45-vs-48 change** — left for the team to decide.

Re-running the audit after this PR merges should now show the 45-px findings only (focus-ring + the tiny-footer-link cases), not the focus-ring failures. That narrows the next decision to one question instead of two.
