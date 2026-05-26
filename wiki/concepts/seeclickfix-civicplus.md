---
title: SeeClickFix → CivicPlus 311 CRM
tags: [civic-tech, vendor, b2g, 311]
created: 2026-05-24
updated: 2026-05-25
related:
  - open311-standard.md
  - fixmystreet-uk.md
---

Originally SeeClickFix, an independent platform launched to let residents file 311 issues via app/web with photos and GPS. Acquired by and rebranded as **CivicPlus 311 CRM**. The dominant B2G vendor in the US 311 space as of 2026.

## Business model

B2G SaaS. Cities license the platform; CivicPlus provides:

- Resident-facing mobile app + web portal
- Internal CRM for city staff to triage, route, and respond
- Workflow automation, departmental routing
- Two-way communication threads with residents
- Reporting/analytics for city leadership

## Notable case studies (per CivicPlus marketing)

- **City of Lawrence (KS)** — relaunched the system in 2024 after a 2019 implementation. Key insight from the relaunch: *"we put the software before the processes"* the first time, had to redesign internal workflows before the software could deliver value.
- **City of New Haven (CT)** — earliest documented case study; integrated with Cityworks for asset management.
- **City of Newnan (GA)** — frequently cited in reviews.

## Strengths cited by city customers

- Replaces ad-hoc complaint management (email, phone trees) with a single funnel
- Transparency loop — residents see status updates, which reduces follow-up call volume
- Helps cities triage during storm events / EOC activations

## Weaknesses

- Heavy dependency on city staff actually working tickets. Without process change, the software alone doesn't help. (The Lawrence case study makes this explicit.)
- Reporting/export capabilities have been criticized — one reviewer noted that previously useful submission-source breakdowns are no longer available in current report formats.
- Vendor lock-in concerns.

## Strategic implication for [[../projects/cleanla-snap]]

CivicPlus is the obvious B2G acquirer or partner for a successful citizen-facing reporting app. They've already done the city-procurement legwork; a viral consumer app that demonstrates demand could be a strong upstream feeder.

LA does not appear to use CivicPlus (LA runs Salesforce Service Cloud — see [[myla311-system]]), so this is a non-LA growth path. Cities that *do* use CivicPlus could potentially be served by a single feeder app that pipes high-confidence reports into their CRM via the vendor's API, if such an API exists.

## Relationship to [[open311-standard]]

SeeClickFix predates and partially overlapped with the Open311 era — it was one of the original consumer-facing implementations. The pivot to a closed B2G vendor model is emblematic of the broader collapse of open civic-data APIs in the US.

## Open question

Does CivicPlus offer a partnership lane for third-party feeder apps that drive volume into their CRM? Worth a discovery call if [[../projects/cleanla-snap]] expands beyond LA.

## Sources

- CivicPlus 311 CRM: https://www.civicplus.com/seeclickfix-311-crm/
- SeeClickFix landing: https://seeclickfix.com/
- New Haven case study PDF: https://seeclickfix.com/media/seeslickfix_case_study.pdf
- Lawrence case study: https://www.civicplus.com/case-studies/crm/lawrence-resident-engagement-service-seeclickfix-311-crm/
- Capterra reviews: https://www.capterra.com/p/202342/SeeClickFix/reviews/

## Backlinks

- [[open311-standard]]
- [[fixmystreet-uk]]
- [[civic-app-patterns-and-failure-modes]]
- [[./civic-tech-founder-org-handoff-patterns]]
- [[./la-civic-tech-competitive-landscape]]
- [[./la-city-partnership-mechanics]]
- [[../projects/cleanla-snap]]
