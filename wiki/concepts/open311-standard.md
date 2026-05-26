---
title: Open311 — The Standard and Its Collapse
tags: [civic-tech, standards, 311, api]
created: 2026-05-24
updated: 2026-05-25
related:
  - seeclickfix-civicplus.md
  - fixmystreet-uk.md
  - myla311-system.md
---

Open311, specifically the GeoReport v2 specification (finalized March 11, 2011), is an open read/write API standard for non-emergency civic service requests. Developed by the nonprofit OpenPlans, maintained at https://www.open311.org/. The premise: a citizen's app should work in any city without rewriting integration code for each one.

By 2026 the standard is functionally moribund for write integrations in the United States.

## Cities that implemented it (historically)

Chicago, Toronto, San Francisco, Washington D.C., Boston, NYC, Baltimore. Internationally: Cologne, Turku, Zurich.

## Reference implementations

- **[[fixmystreet-uk]]** — built by mySociety, the prototypical Open311 client. Still active.
- **[[seeclickfix-civicplus]]** — originally SeeClickFix, now CivicPlus 311 CRM. Pivoted to vendor SaaS.

## Current status

Per the r311 R-package maintainers (2024-2026):

> *"It is way past the golden age of open311 APIs and much of development in civic issue tracking has shifted to less open-access and less standardized alternatives. Many former prime examples have abandoned or severely limited their open311 endpoints."*

## Why it died (working hypothesis)

- Vendor SaaS ([[seeclickfix-civicplus]], Salesforce-based systems, custom builds) offered better internal workflow tooling than the open standard required.
- The "open ecosystem" benefit was theoretical for most cities — few third-party citizen apps actually launched, so the cost of maintaining a public write API wasn't justified by external usage.
- Liability, abuse, and moderation concerns around accepting arbitrary external submissions.
- Procurement inertia — once a city signs a vendor, exposing a parallel open API gets deprioritized indefinitely.

## What this means for new civic apps in 2026

Don't plan on Open311 write access existing in your target city. Plan for:

1. Deep-linking to the official portal (see [[myla311-integration]])
2. Partnering with the city directly (12–24 month timeline)
3. Operating purely as a parallel transparency layer that doesn't depend on official ingestion

## What was possible when the API was open: Chicago

When Chicago published an Open311 write API, an ecosystem of third-party apps appeared (per Smart Chicago Collaborative):

- **311 Super Mayor Emanuel** — gamified 8-bit visualization of incoming service requests in real time
- **311 Request System** — submit and view across 14 data types
- Multiple analytics dashboards, neighborhood briefs, civic-engagement micro-apps

A public submit API doesn't enable just one competing app; it enables a whole creative layer that drives engagement. This is the argument to make if pitching an LA-specific endpoint.

## Sources

- Open311 home: https://www.open311.org/ · https://www.open311.org/learn/
- Developer resources: https://www.open311.org/develop/
- Open Civic Data Standards: https://azavea.gitbooks.io/open-data-standards/content/standards/domain_specific_standards/open311.html
- r311 R package: https://ropengov.github.io/r311/
- Chicago ecosystem inventory: https://smartchicagocollaborative.org/incomplete-list-of-apps-using-the-open311-api-in-chicago

## Backlinks

- [[myla311-system]]
- [[myla311-integration]]
- [[seeclickfix-civicplus]]
- [[fixmystreet-uk]]
- [[civic-app-patterns-and-failure-modes]]
- [[../projects/cleanla-snap]]
