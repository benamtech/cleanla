---
title: LA civic-tech competitive landscape (2026)
tags: [civic-tech, los-angeles, competitive-analysis, partnerships]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../projects/cleanla-snap.md
  - ./myla311-system.md
  - ./seeclickfix-civicplus.md
  - ./cleanlawithme-movement.md
  - ./la-city-partnership-mechanics.md
---

The LA street-issue civic-tech space in 2026 is less crowded than feared. The dominant input channel is the city's own [[./myla311-system|MyLA311]], revamped March 2025 with 96 service types and 243-language support. [[./seeclickfix-civicplus|SeeClickFix]] is the only adjacent 311 alternative actively operating in LA. Beyond those two, the space fragments into single-issue trackers (encampments, homelessness), transparency dashboards (DataLA, GeoHub, ControllerLA), and grassroots mutual-aid networks. **No direct competitor to [[../projects/cleanla-snap|CleanLA]]'s specific shape (citizen-reporter web app with on-device redaction, feeds MyLA311, public transparency layer) has emerged.**

Full research: `raw/0007-la-civic-tech-competitive-landscape.md`.

## The actually-adjacent players

- **MyLA311** (incumbent) — controls the primary input channel. CleanLA's positioning must be community-verification + transparency layer, not feeder. The empirical test in `raw/0008-myla311-api-empirical-test.md` confirmed there is **no public Open311 / push API** (all endpoints return 401; LA not in Open311 server registry). Integration requires a negotiated agreement.
- **SeeClickFix** — second-track 311 alt, active in LA County. Less integrated with city systems. Potential validation channel; not a direct competitor to CleanLA's web-app form factor with on-device privacy.
- **[[./cleanlawithme-movement|Clean LA With Me]]** — NOT a competitor. Strongest partnership opportunity. Ground-truth cleanup operation with ~69K Instagram followers.

## Out-of-scope (different problem, same audience)

- **Mutual Aid LA Network** — volunteer coordination; complementary, not competitive
- **Street Watch LA** (DSA-LA + LA CAN) — encampment-sweep tracking, rights advocacy
- **Vision Zero LA, ShadeLA, LADWP Water Quality Dashboard** — different problems
- **UA Homeless Encampment Dashboard, LA-HOP** — encampment-specific government tools

## Named candidates that came back NOT FOUND

`STMRP`, `FixIt`-brand satellite city apps (Beverly Hills / Santa Monica / WeHo / Long Beach), UCLA CITRIS civic-tech output, formal Reddit-to-311 escalation tools. Each city has its own portal, not a unified "FixIt" brand.

## Implications for the [[../projects/cleanla-snap|CleanLA]] partnership pitch

- "We're not duplicating X" — easy story. Nothing closely overlaps.
- "We complement [MyLA311]" — feeder + community-verification layer, contingent on the API question being answered.
- "We amplify Clean LA With Me" — the partnership conversation in Phase 1.5 is the right move because there is genuine white space here, not a crowded field.

## Open questions raised by this research

- ~~Does MyLA311 expose Open311 GeoReport v2 or any other third-party push API?~~ **CLOSED 2026-05-24 — empirical test (`raw/0008-myla311-api-empirical-test.md`) confirms NO public API. All Open311 endpoints return 401; LA not in Open311 server registry.**
- Is there a unified encampment-tracking API across LA city + county jurisdictions, or does CleanLA face a multi-jurisdiction routing problem?
- Does the LA Open Data catalog (data.lacity.org) host a read-only 311 dataset under a non-obvious resource ID? The empirical test couldn't find one at expected paths; manual catalog search would close this.

## Backlinks

- [[../projects/cleanla-snap]]
- [[./la-city-partnership-mechanics]]
