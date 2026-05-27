# CleanLA Webapp Status - May 27, 2026, 10:21 AM

## Plain-English Summary

Phase 7 backend-first points and local rewards work is now implemented in the codebase. The app has the schema, server APIs, minimal manual UI, seed data, and docs needed to start testing the points economy once the new migration is applied to the database.

Users can earn points from verified cleanup submissions, browse rewards, claim a reward code, and see point ledger activity on their profile. Organizations can sign up, admins can approve/reject organizations, approved organizations can create rewards, and org owners can confirm claim codes.

## What Changed

- Added Phase 7 migration:
  - `point_ledger`
  - `organizations`
  - `organization_members`
  - `organization_rewards`
  - `reward_redemptions`
  - balance views and RPCs for user/org balances, cleanup awards, reward claims, confirmations, cancellations, and expiry.
- Wired `/api/cleanup` so a verified cleanup awards points once, using the fixed matrix:
  - trash 5
  - graffiti 10
  - overgrowth 15
  - encampment debris 25
  - illegal dumping 35
  - biohazard 50
- Added APIs for:
  - rewards listing and claiming
  - profile points
  - organization signup/profile
  - organization reward creation/update
  - organization claim-code confirmation
  - admin organization approval/rejection
- Added minimal manual UI:
  - `/rewards`
  - `/organizations`
  - `/organizations/[orgId]`
  - `/admin/organizations`
  - point balance and recent ledger rows on `/profile`
- Added seed organizations/rewards and `webapp/docs/points-and-rewards.md`.

## Verification Status

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Not yet done:

- The Phase 7 migration has not been applied to the database from this run.
- Runtime DB/RLS testing still needs to be done after applying `webapp/supabase/migrations/20260527090000_phase7_points_rewards.sql`.
- Manual flows still need browser testing with real signed-in user/admin/org-owner accounts.

## Remaining Work

1. Apply the Phase 7 database migration and seed data.
2. Test cleanup-to-points end to end for each category.
3. Test duplicate cleanup award prevention.
4. Test reward claim, claim-code confirmation, cancellation/expiry, and balance changes.
5. Test RLS as anonymous, normal user, organization owner, and admin.
6. Polish the map/home reward affordances in a later UI pass.

## Next Important Policy Change

The next run should change review behavior so reports, cleanups, and new organization accounts default to manual admin review.

Desired direction:

- New report media should land in a pending/manual-review state by default.
- Cleanup submissions should also require admin review before final public acceptance and/or point awarding.
- New organization accounts already start as `pending_review`; keep that behavior and make admin approval the required path.
- Keep the existing AI moderation/review code in the project, but disable it by default behind an environment flag or internal setting.
- AI review should be optional future assistive tooling, not the default decision-maker.

This means the next implementation should preserve the current AI moderation code path, but gate it so local/dev/prod defaults use manual admin review unless explicitly enabled.

