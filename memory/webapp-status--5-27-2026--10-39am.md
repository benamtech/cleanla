# CleanLA Webapp Status - May 27, 2026, 10:39 AM

## Plain-English Summary

The app now has a real admin entry point and the review model has been shifted to manual admin review by default.

Admins get a guarded `/admin` dashboard with links to media review, organization review, and deployment health. The map header now shows an `[ADMIN]` button only for signed-in users whose profile has `is_admin = true`.

Report and cleanup media now land in pending review by default. The existing AI moderation code is still in the project, but it is disabled unless `CLEANLA_AI_REVIEW_ENABLED=true` is set.

## What Changed

- Added `/admin` dashboard, guarded by `profiles.is_admin`.
- Added an admin-only `[ADMIN]` button to the map header.
- Guarded `/admin/health` behind the same admin check.
- Added `CLEANLA_AI_REVIEW_ENABLED=false` to `.env.example`.
- Updated `moderateMedia()` so it returns pending/manual review by default and only calls Anthropic when AI review is explicitly enabled.
- Updated report submission UI copy so reports say they are pending admin review, not live.
- Updated cleanup submission behavior so cleanups do not mark a spot cleaned or award points immediately by default.
- Updated admin media approval so approving a verified `after` photo finalizes the cleanup, creates contribution history, and awards cleanup points.

## Verification Status

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Remaining Work

- Apply the Phase 7 migration in the actual database if not already applied.
- Runtime-test admin review with a real admin account.
- Confirm report media stays pending until approved.
- Confirm cleanup after-photo approval changes the spot to cleaned and awards points exactly once.
- Confirm organization review remains admin-only and still starts at `pending_review`.
- Decide whether to add a separate admin UI section for cleanup-specific review context, or keep it inside the existing media review table.

