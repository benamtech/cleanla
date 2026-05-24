---
title: MyLA311 — LA's Official 311 System
tags: [civic-tech, los-angeles, 311, government]
created: 2026-05-24
updated: 2026-05-24
related:
  - myla311-integration.md
  - open311-standard.md
  - seeclickfix-civicplus.md
---

Los Angeles's official non-emergency service request system. Any LA-focused civic app must coexist with it. This page documents the system itself; for the strategic question of *how* a third-party app integrates, see [[myla311-integration]].

## Channels

- Phone: dial 311 (or +1-213-473-3231)
- Web: https://myla311.lacity.gov
- Mobile apps: iOS (App Store ID 6740093512) and Android

## Scale

Roughly 2.5 million requests per year (per Ted Ross, LA City IT Agency General Manager, at the 2025 MyLA311 relaunch).

## Service catalog

Covers 1,500+ city services. The post-2025 relaunch normalized the public submission form to 96 service request types — 15 net new, 25 consolidated from prior versions.

Most-used categories: graffiti removal, pothole repair, bulky-item pickup, illegal dumping.

## 2025 relaunch — what changed

- New iOS app shipped (App Store ID 6740093512)
- "Drop a pin" for locations without addresses (LA River, alleys, obscure spots)
- Estimated service completion time shown after submission
- User-tracked request status
- Optional user registration (anonymous submission still allowed)
- Mixed user reception — App Store reviews critique the new version as benefiting the city's backend more than residents

## Open data

Annual service request datasets are published on https://data.lacity.org via Tyler Data & Insights / Socrata, e.g. "MyLA311 Service Request Data 2024" and prior years. **Read-only.** Public dashboards (e.g. neighborhood-level call rates) exist.

Notable signal in the open data: illegal dumping reports were up **36% in the first two months of 2025** versus the same period in 2024 (cited by Naula, see [[cleanlawithme-movement]]).

## Write API status

LA does **not** currently publish an active public Open311 GeoReport v2 write endpoint. The backend appears to be Salesforce Service Cloud (consistent with the form structure on myla311.lacity.gov), which puts LA in line with the broader vendor-driven trend documented in [[open311-standard]] and [[seeclickfix-civicplus]].

Practical implication for third-party apps: see [[myla311-integration]] for the three available paths (deep-link, agent, partnership) and their tradeoffs.

## Sources

- City landing page: https://lacity.gov/myla311
- Relaunch announcement: https://lacity.gov/news/request-city-services-report-problems-new-myla311-app-site
- CBS LA on the new system: https://www.cbsnews.com/amp/losangeles/news/los-angeles-city-service-myla311-app-311-requests
- Open data portal: https://data.lacity.org/ (search "MyLA311 Service Request Data")
- App Store: https://apps.apple.com/us/app/myla-3-1-1/id6740093512
- Academic context on 311 systems: https://la.myneighborhooddata.org/2024/02/311-service-requests/

## Backlinks

- [[myla311-integration]]
- [[../projects/cleanla-snap]]
- [[cleanlawithme-movement]]
