---
title: FixMyStreet (UK) — The Durable Nonprofit Alternative
tags: [civic-tech, nonprofit, uk, open-source]
created: 2026-05-24
updated: 2026-05-24
related:
  - open311-standard.md
  - seeclickfix-civicplus.md
  - civic-app-patterns-and-failure-modes.md
---

Built and maintained by [mySociety](https://www.mysociety.org/), a UK civic-tech nonprofit. Open-source codebase. Lets UK residents report potholes, broken streetlights, graffiti, etc. and routes the report to the appropriate council. Uses [[open311-standard]] where available, falls back to email-based council integrations otherwise.

Has persisted where US equivalents have faded.

## Why it persists

- **Nonprofit operating model** removes the need for B2G sales cycles — a single national footprint replaces 100+ per-city contracts.
- **Single national footprint** dramatically reduces the per-city integration cost. Adding a new council is a config change plus an email address, not a procurement process.
- **Open-source codebase** has been forked and adapted internationally (Norway, Germany, others).
- **No founder dependency** — institutional sponsorship outlasts individual attention spans, which is the failure mode that killed [[snapcrap-case-study]].

## Pattern lesson for [[../projects/cleanla-snap]]

A nonprofit-operated, single-region civic app can outlast both:

- **Viral consumer launches** (which fade when the founder loses interest — see [[snapcrap-case-study]]'s post-2018 trajectory)
- **B2G SaaS** (which dies when a city procurement changes vendors)

**The institutional form matters more than the tech.** A 501(c)(3) sponsor, fiscal host, or formal nonprofit ownership should be designed in from day one. [[cleanlawithme-movement]] is the obvious candidate in the LA case.

## Could FixMyStreet's code be the backend?

Open question: is forking the FixMyStreet codebase a cheaper path to MVP than building greenfield on Firebase + Mapbox? Tradeoffs:

- **Pro fork:** battle-tested moderation, routing, email-based council integration, internationalization, accessibility
- **Pro greenfield:** modern mobile-first stack, on-device privacy pipeline (see [[on-device-photo-privacy]]), tighter UX, no Perl/Catalyst legacy
- **The wedge case:** if the goal is a *mobile-first transparency layer* (current direction for [[../projects/cleanla-snap]]), greenfield wins on UX. If the goal is *durable council integration across many municipalities*, fork wins.

## Sources

- mySociety: https://www.mysociety.org/
- Open311 reference: https://www.open311.org/learn/
- Open Civic Data Standards: https://azavea.gitbooks.io/open-data-standards/content/standards/domain_specific_standards/open311.html

## Updated scale (2026-05-24 research pass)

Per mySociety's [2024/25 impact report](https://research.mysociety.org/html/impact-report-2025/): **1.02M neighborhood issues reported globally** to date across all FixMyStreet deployments. Brussels alone filed **150,000+ reports in 2023** (+55% YoY), with ~130,000 resolved (+57%). SocietyWorks (the commercial arm) now has 31 council customers on the Pro tier. The Brussels number in particular is a useful data point — a city of ~1.2M people processed 150K reports/year, implying ~0.125 reports per capita per year. Higher than the UK national average (~0.018) and worth understanding *why* before assuming LA can hit similar density.

## Backlinks

- [[open311-standard]]
- [[civic-app-patterns-and-failure-modes]]
- [[international-civic-app-patterns]]
- [[civic-app-retention-benchmarks]]
- [[../projects/cleanla-snap]]
