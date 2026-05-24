---
title: Deep-link to MyLA311, do not direct-submit in v1
tags: [decision, integration, los-angeles]
created: 2026-05-24
updated: 2026-05-24
status: active
related:
  - ../concepts/myla311-integration.md
  - ../concepts/myla311-system.md
  - ../projects/cleanla-snap.md
---

## Context

[[../projects/cleanla-snap]] needs a strategy for getting user reports into LA's official 311 system. Three paths exist (full analysis in [[../concepts/myla311-integration]]):

1. Deep-link to https://myla311.lacity.gov with pre-filled query params
2. Server-side Playwright agent that submits on the user's behalf
3. Formal partnership / API access via LA's IT Agency

LA does not publish a public Open311 write API. The MyLA311 backend is Salesforce Service Cloud. See [[../concepts/myla311-system]] and [[../concepts/open311-standard]].

## Decision

**Ship deep-link only in v1.** Treat MyLA311 as a parallel channel the user can choose to invoke, not as the app's submission backend. The app is a transparency layer first; "also submit to MyLA311" is an optional secondary action.

## Rationale

1. **Lowest legal exposure.** No questions about who the responsible submitter is, no ToS gray area, no agency relationship to construct.
2. **Lowest operational cost.** No server infrastructure to maintain. No CAPTCHA chase. No fragility when the city changes its form.
3. **Decouples the app from the city's reliability.** If MyLA311 is slow, down, or hostile, the app still functions as a transparency layer.
4. **Keeps "we don't submit on your behalf" as an honest claim.** Important for user trust and for any future privacy or legal review.
5. **Preserves optionality.** The Playwright agent path remains available for v2 if the deep-link rate proves to be the bottleneck.

## Alternatives considered

- **Playwright agent (path 2).** Closes the submission loop and confirms an official SR number. Rejected for v1 due to fragility, ToS uncertainty, CAPTCHA exposure, and the user-agency legal question. Re-evaluate for v2 with a lawyer in the loop.
- **Partnership / API access (path 3).** The only durable solution. 12–24 month timeline. Pursue in parallel — do not block v1 on it.

## Implementation

- "Also submit to MyLA311" button in the report detail view
- Constructs a URL to `https://myla311.lacity.gov` with whatever query params their public form honors (service type, lat, lng, description)
- If query params are not honored, opens the portal in an in-app WebView with the user's report data displayed alongside so they can copy/paste manually
- No automation, no agency claim, no "we submitted for you" language

## Consequences

- User has to do a second action to formally file with the city. Conversion rate from app-report to MyLA311-submission will be < 100%.
- The app cannot claim or display the official Service Request number.
- The user-facing language for the share/submit affordances must be precise: "Open in MyLA311" not "Submit to MyLA311."

## Re-evaluation trigger

Revisit this decision if any of:
- The MyLA311 deep-link conversion rate is < 10% and the unmet submission volume is a strategic problem
- LA's ITA grants formal API access (move directly to path 3)
- A legal review concludes the Playwright path is sufficiently safe to operate

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/myla311-integration]]
