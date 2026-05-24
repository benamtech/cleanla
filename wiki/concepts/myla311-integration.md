---
title: MyLA311 Integration — Strategy and Tradeoffs
tags: [civic-tech, los-angeles, integration, mobile]
created: 2026-05-24
updated: 2026-05-24
related:
  - myla311-system.md
  - open311-standard.md
  - ../decisions/2026-05-deep-link-not-direct-submit.md
  - ../projects/cleanla-snap.md
---

For the system facts (channels, scale, services), see [[myla311-system]]. This page covers the tactical question: *how does a third-party app submit on the user's behalf?*

## The constraint

LA does not publish a public Open311 GeoReport v2 write endpoint. The backend is Salesforce Service Cloud. There is no documented API for third-party submission. This is consistent with the broader collapse of [[open311-standard]] adoption among large US cities.

## Three available paths

### 1. Deep-link to the official portal (politest, lowest reliability)

Open `https://myla311.lacity.gov` with pre-filled query parameters (service type, lat, lng, description). The user reviews and submits in the official portal.

- **Pros:** Zero ToS exposure. No infrastructure. Survives backend changes.
- **Cons:** The portal may not honor every query param. User abandons the flow if the portal feels broken or duplicative. No way to know whether the submission succeeded.
- **Fallback:** If params aren't honored, open the portal in an in-app WebView with the user's report data shown alongside so they can copy/paste manually.

### 2. Browser-automation agent (Playwright, server-side)

A server-side Playwright agent (running on the developer's own infrastructure) fills the official form on behalf of the user and returns the official Service Request number.

- **Pros:** Closes the submission loop. App can confirm "MyLA311 SR #12345 created."
- **Cons:** Fragile against UI changes on the city's side. Almost certainly disallowed by ToS in some interpretation. Vulnerable to CAPTCHA under load. Creates a "user agency" legal question — when the app submits on the user's behalf, who is the responsible reporter?
- **Operational notes:** Queue submissions to stay polite (no thundering herd). Build in a kill switch for the day the city's terms or CAPTCHA configuration breaks the agent. Treat as a service that may stop working any morning.

### 3. Formal partnership / API access (slow, high-value)

Negotiate a direct relationship with the LA Information Technology Agency for an authenticated submission endpoint. This is what [[seeclickfix-civicplus]] sells cities, but it is theoretically also achievable as a nonprofit-led partnership.

- **Pros:** The only durable solution. Confers institutional legitimacy.
- **Cons:** 12–24 month procurement/security review cycle, per [[civic-app-patterns-and-failure-modes]]. The viral window will have closed by the time access is granted.

## Recommended posture for [[../projects/cleanla-snap]] v1

Ship deep-link only. Treat the official MyLA311 system as a parallel channel the user can choose to invoke, not as the app's submission backend. The app is a transparency layer first; "also submit to MyLA311" is an optional secondary action.

Codified as [[../decisions/2026-05-deep-link-not-direct-submit]].

Pursue the partnership conversation in parallel — even a 24-month timeline is worth starting if the app finds traction.

## What we don't yet know

- Which query parameters (if any) myla311.lacity.gov actually honors on its public form.
- The ToS posture on browser-automation submissions. Needs a lawyer read.
- Whether LA's ITA has a formal proposal process for third-party Open311-style write access. (Action: email 311@lacity.org.)
- Whether [[seeclickfix-civicplus]] has a partnership lane for feeder apps in cities that use their platform.

## Backlinks

- [[../projects/cleanla-snap]]
- [[../decisions/2026-05-deep-link-not-direct-submit]]
- [[myla311-system]]
- [[snapcrap-case-study]]
