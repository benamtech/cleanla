---
title: No candidate, party, or campaign branding in CleanLA Snap
tags: [decision, legal, branding]
created: 2026-05-24
updated: 2026-05-24
status: active
related:
  - ../concepts/civic-app-legal-considerations.md
  - ../projects/cleanla-snap.md
---

## Context

The developer of [[../projects/cleanla-snap]] has organic political affiliations. The temptation to brand or position the app alongside political content is real and recurring.

A civic transparency app that explicitly aligns with a candidate or party is a different product with a different legal posture: campaign-finance exposure, narrower nonprofit options, and a smaller addressable audience (the app loses its claim to civic neutrality the moment it endorses).

## Decision

**The app is and will remain brand-neutral.** No reference to any political candidate, party, campaign, or political organization anywhere in:

- The codebase (no naming, no comments, no asset filenames)
- The UI (no logos, copy, color associations, or content moderation policies that favor any candidate or party)
- The marketing surface (website, App Store description, social media)
- The share affordances (the share button opens the OS share sheet with just a URL — the app does not compose suggested captions, does not auto-tag accounts, does not pre-populate any political language)

## Rationale

1. **Campaign-finance exposure.** A politically branded tool can be characterized as an in-kind contribution if the developer is associated with a campaign. The compliance overhead is severe.
2. **Audience.** Civic tools that take political sides forfeit the nonpartisan center, which is the largest pool of likely users.
3. **Institutional optionality.** Remaining nonpartisan keeps 501(c)(3) sponsorship available. A politically branded app is restricted to 501(c)(4) or PAC structures, which raises operational cost dramatically.
4. **Durability.** Candidates and campaigns end. Civic infrastructure outlasts them. The app should be designed to live past any election cycle.

## Alternatives considered

- **Explicit candidate branding.** Rejected per the rationale above.
- **Implicit alignment (logo color matching a campaign, naming that evokes a slogan).** Rejected — implicit alignment carries most of the same risks as explicit branding plus the additional problem of being recognizable to opponents and unrecognizable as a feature to supporters.

## Consequences

- The app's marketing must be carved out from any political content the developer publishes elsewhere. Two distinct surface areas, no cross-pollination.
- If the developer launches a campaign-aligned product in parallel, it must use a separate name, separate codebase, separate accounts, and separate operational ownership.
- This decision is durable. Reversing it would require a new dated decision (`decisions/YYYY-MM-revert-no-candidate-branding.md`) and a full legal re-review.

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/civic-app-legal-considerations]]
