---
title: Civic-App Retention Benchmarks
tags: [civic-tech, metrics, benchmarks, mobile]
created: 2026-05-24
updated: 2026-05-24
related:
  - civic-app-patterns-and-failure-modes.md
  - ../projects/cleanla-snap.md
---

What "good" looks like for a civic reporting app's engagement metrics, distilled from publicly available data (nonprofit transparency reports, vendor case studies, peer-reviewed academic studies, and mobile-app industry benchmarks). Useful for setting realistic success targets for [[../projects/cleanla-snap]] before launch.

## The headline: nobody publishes retention numbers

The most important finding is the absence: **no peer-reviewed study and no vendor marketing has published D7/D30 retention rates, DAU/MAU ratios, or repeat-vs-one-time reporter proportions for civic reporting apps specifically.** Marketing materials emphasize aggregate volume (e.g., SeeClickFix "resolves over 1 million resident requests annually" — [source](https://www.civicplus.com/citizen-request-management/)) and case-study deltas ("Anne Arundel County: +89% engagement" — [source](https://www.civicplus.com/case-studies/crm/how-anne-arundel-county-md-encouraged-an-89-increase-in-resident-engagement/)), neither of which tells a builder what realistic per-user engagement looks like.

Translating from adjacent industry data (general utility apps) gives a usable approximation.

## Realistic targets for an LA civic app at launch

- **MAU as a share of serviceable population:** 2-5% monthly active, with ~35% *ever* active over a multi-year horizon. (LA MyLA311 processes ~1.4M requests/year against ~4M residents — [source](https://xtown.la/2025/01/21/myla311-reports-in-los-angeles-rise-5-2-in-2024-graffiti-removal-bulky-item-pickup/) — implying broad reach but thin monthly cohorts.)
- **DAU/MAU ratio:** 10-20%. Most users report once every 1-2 months, not daily.
- **30-day retention:** 1-3%. Industry benchmark for general utility apps is <2% ([UXCam benchmarks](https://uxcam.com/blog/mobile-app-retention-benchmarks/)). Civic apps fit the same "occasional-use utility" profile.
- **Reports per user:** Highly skewed. Boston 311 (Lee et al., 2021 — [peer-reviewed](https://myeonglee.com/publications/crowdsourcing-behavior-reporting-civic-issues-case-bostons-311-systems)) and Brussels FixMyStreet data suggest 60-80% are one-time reporters, 10-15% file 2-5 reports/year, <5% are power users with monthly+ submissions.

## What the available data does say

### FixMyStreet (mySociety, 2024/25 [impact report](https://research.mysociety.org/html/impact-report-2025/))
- 1.02M neighborhood issues reported globally
- Brussels alone: 150K+ reports in 2023, +55% YoY; ~130K resolved
- SocietyWorks (the commercial arm) has 31 council customers

### SeeClickFix / CivicPlus
- "Over 1M resident requests resolved annually" (aggregate across all customers — vendor-marketing claim)
- Detroit: 97% of ~190K requests fixed
- Lawrence, KS: relaunched 2024 after the original 2019 implementation had to be redesigned — they "put the software before the processes" the first time ([source](https://www.civicplus.com/case-studies/crm/lawrence-resident-engagement-service-seeclickfix-311-crm/))

### Citizen
- Day-7 retention "ranks top 10-20% for iOS/Android news apps" ([press estimate](https://research.contrary.com/company/citizen)) — relative rank only, no absolute number
- Peak ~5M active users June 2020 during nationwide unrest
- Satisfaction declining 2025: 23% negative reviews in Jan → 37% by May

### Nextdoor
- 300K volunteer moderators reviewed 89.75% of reported content; median removal time <6 hours ([2024 transparency report](https://about.nextdoor.com/press-releases/nextdoor-publishes-2024-transparency-report))
- No civic-reporting-specific MAU disclosed

## The "status loop = retention" claim is plausible but unvalidated

The wiki has previously asserted that status notifications drive retention in civic apps (the [[civic-app-patterns-and-failure-modes|patterns synthesis]] page). After deeper research:

- General mobile-app research supports it: push notifications drive [3.5-3.9× engagement lifts in the next 24 hours](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10337295/) for health/behavior-change apps.
- CivicPlus marketing claims it, but no A/B test data is published.
- No peer-reviewed study has isolated the effect for civic apps specifically.

**Plan conservatively:** assume status notifications produce a 2-5% retention lift, not a 2-3× multiplier. Don't bet the launch on this single feature.

## Implications for [[../projects/cleanla-snap]]

- **Stop measuring DAU.** It's the wrong metric — most users report once a month or less, by design. MAU + monthly-report-count distribution is the meaningful pair.
- **Build for the long tail.** 60-80% of users will be one-time reporters. Optimize the one-shot flow ruthlessly; don't sacrifice it for power-user features.
- **Define success as 2-5% of LA monthly active, not 20%.** Anything higher is aspirational unless the app gets a viral inflection.
- **Track the power-user tail explicitly.** The <5% who report monthly+ are the social proof + content engine. They deserve their own retention surface (notifications, leaderboards, badges — carefully, see [[civic-app-patterns-and-failure-modes|"no shaming"]] design rule).

## Verify

- Lee et al. (2021) is from 2021 Boston data; the 60-80% one-time-reporter distribution may have shifted post-COVID
- The "2.5M requests/year" figure for MyLA311 cited at the 2025 relaunch conflicts with xtown.la's "1.4M total service requests in 2024" — scope difference likely, but worth pinning down via [[myla311-system]]'s open data

## Backlinks

- [[../projects/cleanla-snap]]
- [[civic-app-patterns-and-failure-modes]]
- [[swachhata-india]]
- [[colab-brazil]]
