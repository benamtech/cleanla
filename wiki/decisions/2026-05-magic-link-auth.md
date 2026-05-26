---
title: Supabase magic-link auth for CleanLA web v1
tags: [decision, auth, web, supabase]
created: 2026-05-25
updated: 2026-05-25
status: active
related:
  - ../projects/cleanla-snap.md
  - ./2026-05-web-stack-over-mobile.md
---

## Context

[[../projects/cleanla-snap]] Phase 3 (Report MVP) added authenticated report submission. Three auth choices were on the table:

1. **Magic-link** via Supabase Auth — email → click link → session
2. **OAuth** (Google / Apple / X) — third-party identity provider
3. **Email + password** — traditional credential management

The product context: civic-utility tool, single-use volunteer reports common, "I just want to report this trash, not create an account" is the modal user mindset.

## Decision

**Supabase magic-link auth, email only.** Routes:

- `webapp/src/app/auth/callback/route.ts` — handles the link click
- `webapp/src/app/api/profile/route.ts` — creates user profile on first login
- Anonymous browsing of `/`, `/s/[id]`, and `/api/spots` continues without auth
- Authentication is required only for submission endpoints (`/api/reports`, `/api/cleanup`)

OAuth providers and password auth are not enabled in v1.

## Rationale

1. **No password management.** Lowest engineering surface area for v1. No reset flow, no breach exposure, no password-strength meter.
2. **One-tap UX after first login.** Magic-link in inbox → click → authenticated session. Comparable to OAuth without the third-party-trust dialogue.
3. **Anonymous-friendly upgrade path.** Users browse without auth (the public-by-default principle survives); auth materializes only at the submit step. This is the right friction placement for a civic tool.
4. **Supabase-native.** `supabase-js` + `@supabase/ssr` provide first-class magic-link support; no extra dependency or service.
5. **Privacy posture.** No third-party identity provider sees the user's CleanLA activity. OAuth pre-discloses participation to Google/Apple/X before the user has done anything.

## Alternatives considered

- **OAuth (Google / Apple / X).** Faster first-login UX but introduces third-party trust dependency, locks the project to platforms that may policy-restrict civic content, and discloses user participation to the OAuth provider. Rejected for v1; revisit when adoption signals require lower-friction first-login.
- **Email + password.** Rejected — pure overhead (reset flows, breach risk, password-strength UI, support load) with no UX win over magic-link.
- **Anonymous-only (no auth at all).** Rejected for the submission path because moderation, flag accountability, and "I cleaned this" attribution all require a stable user identity. Browsing remains anonymous.

## Consequences

- **Email is now a required submission credential.** Users without easy email access (some homeless or under-resourced populations) can't submit. Tradeoff is acknowledged; mitigated by the volunteer-coordination model where partner orgs (e.g., [[../concepts/cleanlawithme-movement|CLWM]]) submit on behalf of community members.
- **Magic-link delivery depends on email provider deliverability.** Supabase handles SMTP; corporate spam filters can drop links. Provide a "resend" affordance and document the issue in support.
- **Session length and cookie behavior are Supabase defaults.** No custom session policy in v1.
- **OAuth migration path is open** — Supabase Auth can add OAuth providers without breaking existing magic-link users.

## Re-evaluation triggers

Revisit if any of:

- **Submission-flow abandonment rate is high** at the magic-link step (indicates friction is too high)
- **Partner orgs (CLWM and similar) ask for OAuth** to match their internal team-login pattern
- **A specific OAuth provider becomes strategically important** (e.g., X integration deepens beyond sharing)

## Backlinks

- [[../projects/cleanla-snap]]
