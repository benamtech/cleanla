---
title: X-only social sharing for CleanLA web v1
tags: [decision, sharing, social, web, x]
created: 2026-05-25
updated: 2026-05-25
status: active
related:
  - ../projects/cleanla-snap.md
  - ./2026-05-web-stack-over-mobile.md
  - ./2026-05-no-candidate-branding.md
---

## Context

[[../projects/cleanla-snap]] Phase 6 (Sharing) introduced public spot pages at `/s/[id]` with OpenGraph cards (`/api/og/spot/[id]`, 1200×630 image) and three share affordances on the spot page: POST ON X, SHARE (Web Share API), COPY LINK.

The design question: which social platforms to support, in what order, and with what depth.

## Decision

**Phase 6 ships X-only intent-link sharing as the only platform-specific share affordance**, plus a generic Web Share API call and a clipboard COPY LINK.

Specifics (`webapp/src/features/sharing/ShareActions.tsx`):

- **POST ON X** — opens `https://x.com/intent/post?text=...&url=...` in a new tab. No OAuth, no X account linkage. The OG card metadata in `/s/[id]`'s `generateMetadata` produces a `twitter:card: summary_large_image` that X consumes when the URL is pasted.
- **SHARE** — Web Share API (`navigator.share`). Feature-detected; only renders on mobile / browsers that support it. Hands off to the OS share sheet.
- **COPY LINK** — clipboard write + "COPIED!" feedback (2-second state).

No Facebook, no Instagram, no LinkedIn, no Reddit, no TikTok, no Discord-specific affordances. Web Share covers any of those if the user's device has the relevant app installed.

## Rationale

1. **X is the dominant public-square surface for civic/local content in 2026.** Local journalists, council members, and engaged residents are still reachable on X in a way they aren't on other platforms. A public CleanLA report shared on X has the best path to attention from someone who can act on it.
2. **Intent-link UX is the simplest possible integration.** No OAuth, no API key, no X-as-vendor lock-in. If X bans the intent endpoint, fallback is "copy link, paste anywhere."
3. **OG cards work cleanly with X's preview behavior.** `generateMetadata` produces `twitter:card: summary_large_image`; X renders the 1200×630 image with the bottom 80px reserved as dark navy specifically for X's title overlay. The integration is photo-first, which matches the visual nature of cleanup reports.
4. **Multi-platform share menus dilute the action.** A long list of social buttons (Facebook, X, LinkedIn, WhatsApp, etc.) is the default civic-tool pattern and consistently performs worse than focused calls-to-action. The Web Share API handles the long tail.
5. **No corporate-platform commitments beyond X.** This is consistent with [[./2026-05-no-candidate-branding]]'s neutrality principle — CleanLA doesn't pick a platform side beyond the practical "X is where civic conversation happens."

## Tradeoffs

- **Users on platforms without Web Share API (most desktop browsers)** only get POST ON X + COPY LINK. Anyone wanting to share to Facebook on desktop must copy + paste manually. Acceptable for v1.
- **X-only is a bet that X remains the civic-conversation surface.** If that changes (X policy shift, exodus to Bluesky/Threads/etc), CleanLA needs to revisit. Bluesky and Threads do not yet have the local civic-actor density to be primary destinations.
- **No share analytics in v1.** No way to count how many shares result in clicks-back. Add later if needed.

## Alternatives considered

- **Multi-platform share menu (X + Facebook + LinkedIn + WhatsApp + Reddit).** Rejected — dilutes the primary call, increases visual clutter, and most of those platforms produce worse civic-engagement outcomes than X.
- **Native X OAuth + auto-tweet.** Rejected — adds dependency on X API access (which is increasingly gated), creates a "we tweet on your behalf" trust issue, and forfeits the user's editorial control over the tweet text.
- **No social share, copy-link only.** Rejected — civic mobilization depends on shareability; copy-link adds friction in the moment of intent.
- **Generic share sheet only (Web Share API).** Rejected for desktop — Web Share isn't reliable cross-browser; a deterministic POST ON X button is more useful than a "might work" share button.

## Consequences

- **The OG card route (`/api/og/spot/[id]`)** is now a load-bearing piece of UX. Its layout (navy header strip + photo + 80px navy footer for X overlay) is specifically designed for X's preview behavior; redesigning the card requires testing in X compose preview.
- **`/s/[id]` is a public, indexable URL** — must remain accessible without auth, must respect moderation/hidden state, must always have valid OG metadata.
- **Card preview verification requires a live Vercel deploy** — the X Card Validator is dead; only way to verify is paste a real URL into X compose. This gates Phase 7.
- **CLWM (and other partner orgs)** can post CleanLA spot links into their Instagram bios / X accounts. The X-focused infrastructure works for both partners and direct users.

## Re-evaluation triggers

Revisit if:

- **X usage among LA's civic-engaged audience drops materially** (Bluesky or Threads becomes the new center of gravity)
- **X bans or rate-limits the intent URL** (`x.com/intent/post`) — pivot to clipboard-first
- **A partner org (CLWM, BIDs) explicitly needs a different platform** as primary
- **Share-attribution analytics become important** for fundraising or growth proof

## Backlinks

- [[../projects/cleanla-snap]]
