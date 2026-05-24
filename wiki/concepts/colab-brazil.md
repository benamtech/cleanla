---
title: Colab.re (Brazil)
tags: [civic-tech, case-study, international, latin-america, commercial]
created: 2026-05-24
updated: 2026-05-24
related:
  - international-civic-app-patterns.md
  - seeclickfix-civicplus.md
  - ../projects/cleanla-snap.md
---

Brazilian commercial civic-engagement platform launched circa 2013, venture-backed via Unreasonable Group. Still actively operating (Feb-July 2025 campaigns visible). Notable for two design choices: a two-sided proposal model (citizens suggest solutions, not just report problems) and a freemium B2G business model that proves civic-tech sustainability without municipal subsidy at the user level.

## Scale

500K+ users across 150+ municipalities. 200K+ problems "solved." 100+ official partnerships with city halls including Curitiba, Porto Alegre, Recife, Salvador. ([colab.com.br](https://www.colab.com.br/en/))

## Business model

Freemium and B2G. Free to citizens. Municipalities pay for integration, customization, and analytics. This is structurally similar to [[seeclickfix-civicplus]] in the US, but Colab's go-to-market emphasizes the consumer side first (build the citizen network → sell the city integration), while CivicPlus is closer to enterprise-down (sell the city → deliver the citizen tool as part of the package).

## Mechanically distinctive

- **Two-sided marketplace.** Citizens not only report issues but propose solutions — road crossings, bike parking, railings. City halls respond and prioritize in public. ([CUSP analysis](https://medium.com/cusp-civic-analytics-urban-intelligence/social-network-for-citizen-engagement-in-brazil-colab-re-5bb165026085))
- **"Journeys" onboarding funnels.** Tailored activity sequences move users from reporters to civic participants. Directly addresses the cold-start problem and the [[civic-app-retention-benchmarks|<5% power-user tail]] common in civic apps.
- **Social / gamification layer.** Problems are visible, voteable, and commentable — borrowing mechanics from social networks (Nextdoor, Twitter) into the civic domain.

## What translates to [[../projects/cleanla-snap]]

- **The two-sided proposal model** could differentiate CleanLA Snap from FixMyStreet-style passive reporting. Not just "report a pothole" but "propose a permanent fix" (e.g., a new trash receptacle station — directly aligned with [[cleanlawithme-movement|Naula's Boyle Heights receptacle station ambition]]).
- **Journey-based onboarding** is a proven civic-app retention lever and worth incorporating early rather than as a v2 polish item.
- **The "civic tech can be a commercial business" precedent** — Colab disproves the assumption that civic tools must be either government-owned or nonprofit-owned. A third path exists.

## What doesn't translate

Colab's growth has been through city-hall partnerships, not viral consumer adoption. Brazilian city halls have stronger motivation to adopt (budget pressure + EU-style modernization mandates) than US cities do — particularly LA, where any third-party SaaS contract enters a 12-24 month procurement cycle ([[civic-app-patterns-and-failure-modes]]).

There's also a political-optics risk: in the US, a city being seen as "outsourcing citizen reporting to a private company" carries reputational baggage that Brazilian municipalities seem to tolerate better.

## Sources

- Official: https://www.colab.com.br/en/
- CUSP analysis: https://medium.com/cusp-civic-analytics-urban-intelligence/social-network-for-citizen-engagement-in-brazil-colab-re-5bb165026085

## Backlinks

- [[international-civic-app-patterns]]
- [[../projects/cleanla-snap]]
- [[seeclickfix-civicplus]]
