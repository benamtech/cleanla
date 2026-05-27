# Phase 7.5 Verification Checklist

Use this before calling points, rewards, and organization flows launch-ready. Do not apply these steps to remote production without an explicit operator decision.

## Migration And Seed

- Apply `supabase/migrations/20260527090000_phase7_points_rewards.sql`.
- Apply `supabase/seed.sql` if local seed organizations and rewards are desired.
- Confirm SQL-created Phase 7 tables are exposed to the Data API where needed. Supabase changed defaults in 2026, so verify grants/exposure instead of assuming public schema tables are reachable.
- Confirm all exposed tables have RLS enabled.
- Confirm `user_point_balances` and `organization_point_balances` use `security_invoker = true`.

## Role Setup

- Create or choose one normal authenticated user.
- Create or choose one admin user by setting `profiles.is_admin = true`.
- Create or choose one organization owner through `organization_members`.
- Keep one anonymous browser/session for public reward checks.

## RLS And Access Checks

- Anonymous can read approved active rewards only.
- Anonymous cannot claim rewards, create organizations, read point ledger rows, or access admin pages.
- Authenticated users can read only their own point ledger and redemptions.
- Authenticated users cannot mutate point ledger rows directly.
- Organization owners can manage only their own organization rewards and redemptions.
- Organization owners cannot approve organizations or media.
- Admin users can approve/reject media and organizations.
- Balance views do not leak other users' or organizations' ledger data.

## Product Flow Checks

- New report media lands in pending admin review.
- Admin approval publishes report media.
- Cleanup submission with location-verified after-photo stays pending admin review.
- Admin approval of a verified after-photo marks the spot cleaned and awards the correct category points once.
- Admin approval of a non-verified after-photo does not award points.
- Duplicate approval or retry does not duplicate cleanup points.
- Signed-out users can see reward motivation but cannot claim.
- Signed-in users see point balance and affordability state.
- Insufficient-balance reward claim fails clearly.
- Sufficient-balance reward claim creates a pending code and reserves points.
- Organization owner confirms a valid code and organization balance increases.
- Canceling a pending code refunds points to the user.
- Pending or rejected organizations cannot publish active rewards or confirm redemptions.

## Static Checks

- `npm run typecheck`
- `npm run lint`
- `npm run build`

