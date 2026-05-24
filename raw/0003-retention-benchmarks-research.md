# Raw Deposit — Civic-App Retention Benchmarks (Research Findings)

> Source: research agent dispatched on 2026-05-24 to investigate realistic engagement benchmarks for civic reporting apps. Brief asked: does mySociety publish FixMyStreet stats? What do SeeClickFix/CivicPlus marketing claims show? Is the "status loop = retention" claim quantified anywhere?

---

## FixMyStreet (mySociety)

**Confidence: nonprofit transparency report**

mySociety's [2024/25 impact report](https://research.mysociety.org/html/impact-report-2025/) reports FixMyStreet generated **1.02M neighborhood issues reported** across all deployments globally. In Brussels specifically, [over 150,000 reports were filed in 2023](https://www.belganewsagency.eu/more-than-150000-reports-via-the-brussels-app-fixmystreet-in-2023), a 55% increase year-over-year. Brussels resolved nearly 130,000 incidents, a 57% increase from 2022. mySociety's commercial arm (SocietyWorks) now has 31 councils as FixMyStreet Pro customers, generating multi-year revenue contracts.

**Critical gap:** No publicly disclosed MAU, DAU, or DAU/MAU ratio. No retention metrics published.

## SeeClickFix / CivicPlus 311 CRM

**Confidence: vendor marketing claims + aggregate statistics**

SeeClickFix [resolves over 1 million resident requests annually](https://www.civicplus.com/citizen-request-management/) across all jurisdictions. Case study evidence:

- **Detroit:** Fixed [97% of ~190,000 requests](https://www.civicplus.com/case-studies/crm/detroit-mi-fixes-97-of-citizen-requests-with-seeclickfix/) submitted to "Improve Detroit"; expanded service categories from 16 to 29.
- **Anne Arundel County, MD:** [Submissions nearly doubled from 7,750 to 14,600+ requests year-over-year](https://www.civicplus.com/case-studies/crm/how-anne-arundel-county-md-encouraged-an-89-increase-in-resident-engagement/), claimed as +89% engagement increase. Total ~29,000 requests across 40+ categories tracked.
- **City of Lawrence, KS:** [Relaunched in 2024](https://www.civicplus.com/case-studies/crm/lawrence-resident-engagement-service-seeclickfix-311-crm/) with refined workflows post-COVID pause.

**Critical gaps:** No per-user reporting volume, no retention rate, no DAU/MAU splits. Marketing emphasizes active communication and status visibility as engagement drivers, but no A/B test data on status-notification impact.

## Citizen App

**Confidence: app store analytics (press estimates)**

Citizen's [day-7 retention ranks top 10-20% for iOS/Android news apps](https://research.contrary.com/company/citizen), but users show declining satisfaction (23% negative reviews January 2025 → 37% by May; trend unclear if 311-specific or broader). The app peaked with [5M+ active users in June 2020](https://www.similarweb.com/app/google-play/sp0n.citizen/statistics/) during nationwide unrest; user base doubled that year.

**Critical gap:** No disclosed absolute MAU/DAU; retention metric is relative rank only.

## Nextdoor

**Confidence: nonprofit transparency report + academic observation**

[Nextdoor's 2024 transparency report](https://about.nextdoor.com/press-releases/nextdoor-publishes-2024-transparency-report) reports nearly 300,000 volunteer community moderators reviewed 89.75% of reported content, with 46% of removals from volunteer moderators. Median removal time under 6 hours.

NYU research (2024) found that **posts reporting suspicious people/activities received the highest engagement** among all post types. Nextdoor expanded civic participation during 2022 midterms (3x more voter actions vs. 2020).

**Critical gap:** No disclosure of civic-reporting-specific MAU/DAU.

## Los Angeles MyLA311

**Confidence: municipal open data + press reporting**

LA processed [~1.4M total service requests in 2024](https://xtown.la/2025/01/21/myla311-reports-in-los-angeles-rise-5-2-in-2024-graffiti-removal-bulky-item-pickup/), a 5.2% increase from 2023. Top requests: bulky item pickup (47.7%, ~675K), graffiti removal (22.4%, ~317K). Illegal dumping complaints surged 19.4% to 114,268 reports. Phone calls remain the primary channel (>50% of submissions); app/web usage is growing, especially downtown.

**Note:** This conflicts with the "2.5M requests/year" figure cited by Ted Ross at the 2025 relaunch. Likely scope difference (city total across all channels vs. MyLA311 specifically) but worth verifying.

## Academic research on 311 systems

**Confidence: peer-reviewed**

[Lee et al., "Crowdsourcing Behavior in Reporting Civic Issues" (2021)](https://myeonglee.com/publications/crowdsourcing-behavior-reporting-civic-issues-case-bostons-311-systems) analyzed 600,000+ Boston 311 requests. Key findings:

- **Reporting is specialized.** Residents reporting incivilities (graffiti, trash) behave differently from those reporting infrastructure decay. Specialization implies distinct power-user pools.
- **Data bias is severe.** Civic crowdsourcing data skews toward heavy technology users and higher-income neighborhoods, biasing perceived problem distributions.

[Kontokosta et al., "Using small data to interpret big data" (2016)](https://www.sciencedirect.com/science/article/abs/pii/S0049089X16301764) examined 311 contributions as informal social control; did not isolate user retention metrics.

[Recent FixMyStreet Brussels study (2024)](https://www.researchgate.net/publication/386674193_FixMyStreet_Brussels_Socio-Demographic_Inequality_in_Crowdsourced_Civic_Participation) confirms socio-demographic inequality in participation; no retention data disclosed.

**No peer-reviewed study published retention rates, D7/D30 metrics, or repeat-vs-one-time reporter proportions for civic reporting apps.**

## Status notifications and retention: the "status loop" claim

**Confidence: general app research + vendor claims (no civic-app-specific evidence)**

General mobile app research shows [push notifications increase engagement 3.5–3.9x in the next hour/24 hours](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10337295/) (health/behavior-change apps). CivicPlus marketing emphasizes ["active communication" and status visibility](https://www.civicplus.com/citizen-request-management/) as engagement drivers.

**No published A/B test, RCT, or empirical data quantifying whether civic apps with status notifications achieve measurably higher retention than those without.** Claim is plausible (general notification research supports it) but unvalidated for civic reporting specifically.

## App retention industry benchmarks (for context)

**Confidence: mobile app analytics industry data**

General utility apps (government, finance, municipal) show [D30 retention <1% (iOS: 1.6%)](https://uxcam.com/blog/mobile-app-retention-benchmarks/). Civic reporting apps fit the "occasional-use utility" profile:

- D1 retention: ~25–40%
- D7 retention: ~10–20%
- D30 retention: ~1–5%

Consumer apps (social, fintech) achieve 15–20% D30. Civic reporting apps are task-completion tools, not habit-forming platforms.

## Bottom-line numbers a builder could plan against

- **MAU:** Civic reporting apps attract 5–15% of serviceable neighborhood population. LA MyLA311 (1.4M requests/year, ~4M city residents) suggests ~35% *ever* used the channel, but monthly cohorts likely 2–5% active.
- **DAU/MAU ratio:** Expect 10–20% (most users report once every 1–2 months).
- **30-day retention:** Industry benchmark for utility apps <2%; civic apps likely 1–3% realistic.
- **Reports per user per month:** Highly skewed. Boston and Brussels data suggest 60–80% one-time, 10–15% repeat (2–5 reports/year), <5% power users (monthly+).
- **The status-notification hypothesis is untested.** Plan conservatively: assume 2–5% lift on retention, not a 2–3x multiplier.
