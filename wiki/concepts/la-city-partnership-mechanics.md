---
title: LA city partnership mechanics for civic tech (2026)
tags: [civic-tech, los-angeles, government, partnerships, procurement]
created: 2026-05-24
updated: 2026-05-25
related:
  - ../projects/cleanla-snap.md
  - ./myla311-system.md
  - ./myla311-integration.md
  - ./open311-standard.md
  - ./la-civic-tech-competitive-landscape.md
---

The path to a formal partnership with the City of Los Angeles for a civic-tech app is **unclear in 2026** because the city is mid-reorganization. Mayor Bass eliminated the Innovation & Performance Commission (LA's fast-track pilot vehicle, 2016-2025, ~$1M/year, 40+ projects approved) in the FY 2025-2026 budget. No replacement has been named. Civic-tech partnerships now route through three parallel channels with no single "innovation office" front door.

Full research: `raw/0006-la-city-partnership-mechanics.md`.

## The three channels (2026)

| Channel | What it's for | Lead |
|---------|---------------|------|
| **ITA** (Information Technology Agency) | Technical integration, MyLA311 API access, data feeds | **Ted Ross**, CIO (since 2015); ita.lacity.gov |
| **Mayor's Office of City Services** | Political cover, departmental buy-in, pilot framing | **Rachel Brashier**, Deputy Chief of Staff (appointed Jan 2026) |
| **RAMPLA** (Regional Alliance Marketplace for Procurement) | Vendor registration, RFP responses | rampla.org (self-serve) |

For [[../projects/cleanla-snap|CleanLA]]'s Phase 3, the most productive sequence is: **ITA first** (confirm technical feasibility) → **Mayor's office** (political cover and pilot framing) → **RAMPLA** (formal procurement only if Project survives the first two).

## Agreement types in actual use

- **MOU** (6-12 months) — non-binding pilot agreement, the typical LA pattern
- **Data-Use Agreement** (3-6 months) — required for restricted MyLA311 fields or write-back
- **Innovation Pilot Agreement** — *was* the fastest path under the now-eliminated Commission; replacement TBD
- **Vendor contract via RFP** (18-24 months) — standard procurement; kills startup viability
- **Open311 GeoReport v2** — published standard, no formal agreement needed; [[./seeclickfix-civicplus|SeeClickFix]] reportedly uses this in LA

## MyLA311 third-party access posture (empirically tested 2026-05-24)

Per `raw/0008-myla311-api-empirical-test.md`:

- **No public API of any kind.** All Open311 GeoReport v2 endpoint patterns return HTTP 401 (auth required). LA is **not listed** in the Open311 server registry or status monitor.
- **No discoverable read-only Socrata 311 dataset** at expected resource paths (`data.lacity.org/resource/311-reports` returns 404). May exist under a non-obvious resource ID — manual catalog search would close this.
- **The form itself can't be reverse-engineered** — `myla311.lacity.gov/web_request/create` requires auth even to inspect. Query-parameter deep-linking does not work.
- **Backend is Salesforce Service Cloud** + a proprietary SANSTAR system for field-crew tracking. See [[./myla311-system]].
- **Practical implication:** Even Phase 3 partnership cannot rely on "hidden endpoint" discovery. A formal data-sharing SLA or custom Salesforce API provisioning is required.

## Common founder mistakes (cited by the research)

1. Pitching before product stability (city is risk-averse; bring 6-12 months of operational data)
2. Generic pitch decks (customize to each stakeholder: ITA wants infrastructure priorities, StreetsLA wants workload reduction)
3. No risk-mitigation plan (uptime, security, what-if-app-shuts-down)
4. Ignoring the Mayor's office as political gatekeeper (ITA can say yes; if Mayor's office doesn't align, it dies in infighting)

## Borrowable pilot models (LA hasn't adopted but could)

- **Boston's New Urban Mechanics** — 5-person external office, 3-6 month pilots, rapid ideation
- **San Francisco's Mayor's Office of Innovation** — funded via city budget, runs 3-4 pilot cohorts at once

## Implications for [[../projects/cleanla-snap|CleanLA]]

- **Phase 3 starts with reconnaissance, not pitching.** First action is finding out what the post-Commission pilot vehicle actually is.
- **Standard RFP (18-24 months) is incompatible with the project's tempo.** The realistic paths are pilot MOU or data-access agreement.
- **The MyLA311 Open311 v2 question is closed** — empirically NO public API. CleanLA stays a separate-track transparency layer per [[../decisions/2026-05-deep-link-not-direct-submit]] indefinitely, unless/until a partnership unlocks custom Salesforce API provisioning.

## Recommended 3-step Phase 3 playbook (from research)

- **Months 1-2:** Assess ITA's post-Commission pilot vehicle. Confirm whether MyLA311 exposes Open311 GeoReport v2. Register on RAMPLA.
- **Months 2-4:** Scope a 6-month pilot with 1-2 departments (StreetsLA recommended for pothole/street vertical). Get a Council District champion.
- **Months 4-12:** Formalize MOU OR prepare for standard 18-24 month RFP if pilot dies.

## Backlinks

- [[../projects/cleanla-snap]]
- [[./la-civic-tech-competitive-landscape]]
- [[./cleanla-clean-streets-mayor-scenario]]
