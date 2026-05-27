# CleanLA Points and Local Rewards

Phase 7 adds a backend-first incentive system. Users earn points when a cleanup they submit is verified on site. Local organizations can publish rewards after admin approval, and users can redeem points through claim codes.

## Point Rules

Points are awarded only by trusted server logic after a verified after-photo marks a spot cleaned.

MVP point matrix:

- `trash`: 5 points
- `graffiti`: 10 points
- `overgrowth`: 15 points
- `encampment_debris`: 25 points
- `illegal_dumping`: 35 points
- `biohazard`: 50 points

The point ledger is the source of truth. Balances are derived from ledger entries, not written directly by clients.

## Organizations

Businesses sign up with basic contact and location details. New organizations start as `pending_review`; an admin must approve them before they can publish active rewards or receive redeemed points.

Approved organization owners can create rewards with:

- title
- description
- points required
- optional redemption instructions
- active/inactive state

Active rewards must require at least 200 points.

## Redemptions

Users claim an active reward from an approved organization. Claiming creates a pending redemption code, reserves the user's points through the ledger, and expires after 7 days.

Organization owners confirm claim codes in their dashboard. Confirmation transfers the redeemed point amount to the organization's ledger balance.

Canceled or expired pending redemptions refund the reserved points to the user.

## Limitations

Points are an incentive/rebate accounting signal only. They are not cash, stored value, or user-to-user transferable credit.

Actual rebate calculation, payout operations, accounting exports, and tax/compliance workflows are deferred to a later phase.
