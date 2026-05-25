---
title: CleanLA positioning under a "Clean The Streets" mayor scenario
tags: [scenario, b2g, los-angeles, civic-tech, partnerships, hypothetical]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../projects/cleanla-snap.md
  - ./la-city-partnership-mechanics.md
  - ./civic-tech-founder-org-handoff-patterns.md
  - ./cleanlawithme-movement.md
  - ../decisions/2026-05-no-candidate-branding.md
  - ../decisions/2026-05-on-device-face-blur-required.md
---

Hypothetical scenario planning: a future LA mayor (placeholder name **"Pratt"**) wins with a **"Clean The Streets"** platform that mixes visible-impact beautification, 311 modernization, public-private cleanup partnerships, enforcement-first encampment removal, and a coalition framing of "helping people who Love LA and want to Save LA to Clean LA." Pratt is positioned as pro-tech, pro-transparency, pro-data. This page is the playbook for how [[../projects/cleanla-snap|CleanLA]] positions into that administration AFTER [[./cleanlawithme-movement|CLWM]] validates the tool in Phase 1.5.

> **Premise check:** scenario is hypothetical (no confirmed candidate named Pratt in the wiki yet). The framing also generalizes — any pro-tech / pro-enforcement / coalition-activation mayor (Adams-NYC, Bloomberg-NYC, Caruso-2022-LA-platform, Wu-Boston flavor) would respond to a similar pitch. CleanLA's [[../decisions/2026-05-no-candidate-branding|nonpartisan decision]] means this scenario page can be written without binding the project to any candidate.

## CTS plank → CleanLA feature alignment

| CTS plank | CleanLA alignment | Friction |
|-----------|-------------------|----------|
| **Visible-impact beautification** | Tool surfaces every reported issue; before/after photos for each "I cleaned this" cycle; neighborhood-level impact dashboards | None — strong fit |
| **311 modernization** | Feeder layer that augments [[./myla311-system|MyLA311]]; on-device redaction the city doesn't have to build itself; dataset CleanLA can share read-only | API access is closed per `raw/0008-myla311-api-empirical-test.md`; partnership unlocks negotiated Salesforce data path |
| **Public-private cleanup partnerships** | CleanLA + CLWM is *literally this pattern*. Tool + grassroots operation = the pitch | None — strong fit; CLWM is the missing private side most mayors don't have |
| **Enforcement-first encampment removal** | Tool surfaces visible street issues; **does NOT route to enforcement** | **THE friction point.** See navigation strategy below |
| **"Love LA / Save LA / Clean LA" coalition framing** | CleanLA = the coalition's tool. Brand is literally in the slogan | None — coalition surface is CleanLA's distribution thesis |

**Score: 4 of 5 planks naturally align. The 5th is navigable.**

## The alignment surface — what to lead with

When pitching into a CTS-platform admin, lead with what they already want to fund:

1. **The coalition tool.** "We built the data layer for the volunteer movement Pratt's platform names." CleanLA is the infrastructure for "people who Love LA and want to Save LA to Clean LA." Tool + brand alignment is free.
2. **Visible-impact dashboards.** Mayor's offices respond to before/after photos, neighborhood maps, weight-of-trash-removed totals, volunteer-hour-equivalents-saved-by-the-city. CleanLA produces all of these natively. Per `raw/0013-b2g-civic-tech-sales-motion.md`: time-saved is the strongest moveable metric (FTE-hours > processing-time-reduction > volunteer-engagement-multiplier).
3. **MyLA311 feeder positioning.** A pro-tech mayor wants 311 to work. CleanLA is the easiest reporting surface that exists; deep-linking to MyLA311 lifts city-reported volume without the city having to rebuild MyLA311. The city gets credit; CleanLA gets traffic; no API integration required for v1.
4. **Federal/state funding leverage.** Per `raw/0014-federal-state-funding-alignment.md`: CDBG-DR (post-fire), BIL streets/sidewalks ($160M to LA region), CalRecycle, LA28 "Games readiness dashboard" (Q4 2026 RFP window). CleanLA's data is the substrate for the grants the city wants anyway.

## The friction point — enforcement-first encampment removal

CleanLA's [[../decisions/2026-05-on-device-face-blur-required|on-device-blur decision]] is locked: raw photos never leave the device; faces and plates are redacted. A pro-enforcement admin may want unredacted images for code enforcement, encampment ID, or LAPD coordination.

**Navigation strategy:**

- **CleanLA is the reporting surface, not the enforcement surface.** The tool gets the *issue* into the system. What the city does with the issue is the city's decision, not CleanLA's. Privacy-first framing is a PR shield: the city can never be accused of surveillance because the raw photo never existed in any system the city or CleanLA could subpoena.
- **The enforcement-vs-dignity political tension lives elsewhere.** The CleanLA tool is jurisdictionally neutral — it routes data the same way regardless of admin policy. Pratt's encampment policy can be enforcement-heavy; Bass's was housing-first; CleanLA-the-tool doesn't change. This is a *feature* for a nonpartisan-by-decision tool ([[../decisions/2026-05-no-candidate-branding]]).
- **The CLWM-validated story is the political insulation.** CLWM's brand is dignity-first; CLWM's volunteers helped unhoused individuals during cleanups (per `raw/0009-clwm-partnership-prep.md`). If Pratt enforcement-routes a CLWM-collected report aggressively, that's a CLWM/Pratt political question, not a CleanLA technical question. CleanLA stays out of the line of fire by being infrastructure.
- **Do not pitch enforcement features.** "We can identify the person who dumped" is the kind of feature that gets CleanLA banned from app stores and sued under CCPA. Don't go there. The wiki decision is durable for good reason.

## The 100-day activation sequence (hypothetical)

Assuming Pratt takes office (Jan or Dec depending on the election calendar) and CLWM has already been using CleanLA for 3-6 months by then:

| Day range | Move |
|-----------|------|
| **Days 0-14 (transition)** | Reach out to Pratt's transition team via the council district where CLWM operates (Ysabel Jurado, CD14, per `raw/0012-bass-office-civic-tech-posture.md`). Don't pitch — offer to brief the team on "the volunteer coalition tool you've been hearing about." |
| **Days 15-30 (first contact)** | Single-page brief: CTS-plank-to-CleanLA-feature map; CLWM impact numbers (volunteers, neighborhoods, cleanups, weight). NO pitch deck. Goal is a 15-min meeting with Pratt's incoming Deputy Chief of Staff for City Services (whoever replaces Brashier). |
| **Days 31-60 (first meeting)** | Demo with Naula in the room. Per `raw/0011-civic-tech-founder-org-handoff-cases.md` co-pitch dynamics: CLWM leads ("we proved it works"); founder follows ("here's how to scale"). Ask: would Mayor Pratt do a State-of-the-City mention or a one-day public endorsement at a CLWM cleanup event? |
| **Days 61-90 (second meeting)** | This is where pitches die per `raw/0013-b2g-civic-tech-sales-motion.md`. Bring: risk-mitigation pack (source code escrow, data export guarantee, CCPA compliance doc, API spec), the "smallest winnable" pilot proposal ($25-75K, 6-12 months, 1-2 neighborhoods, 1 issue vertical — recommend illegal dumping), and a draft MOU. |
| **Days 91-120 (formalize)** | Get the MOU signed or the endorsement letter issued. Either is a Phase 3 win. Avoid asking for a vendor contract / RFP path; LA RFPs are 18-24 months and will kill the project (per `raw/0006-la-city-partnership-mechanics.md`). |

## Cross-admin durability

CleanLA's positioning is durable across admin types because [[../decisions/2026-05-no-candidate-branding|nonpartisan branding]] and [[../decisions/2026-05-on-device-face-blur-required|on-device privacy]] are stack-agnostic:

| Admin flavor | CleanLA fits via |
|--------------|------------------|
| **Bass (current, Inside Safe / dignity-first)** | Aligns with Inside Safe's "dignity in service delivery" framing; CLWM volunteer model echoes [[../concepts/cleanlawithme-movement|Shine LA]] (Bass's monthly beautification program); Brashier office is the receiving point |
| **Pratt-style Clean Streets (hypothetical)** | Aligns with 4-of-5 CTS planks; coalition framing is literal brand fit; enforcement-friction navigable via "infrastructure, not policy" framing |
| **A hostile / tech-skeptical admin** | CleanLA continues to operate as a 501(c)(3)-owned independent tool ([[./california-nonprofit-legal-mechanics|legal structure]]); CLWM partnership doesn't depend on city endorsement; community proof points still hold |

The non-binding-to-any-admin design is the project's institutional resilience.

## What to bring to the conversation (artifact list)

By the time the post-CLWM-validation Mayor's-office meeting happens, CleanLA should have in hand:

- **CLWM proof:** 3-6 months of cleanup data, volunteer hours, neighborhood coverage, weight totals, before/after photos
- **Cost translation:** CLWM volunteer hours × $X/hour (per AmeriCorps standard ~$30/hr) = "$N value of city services CleanLA-coordinated CLWM volunteers replaced this quarter"
- **CTS plank-to-feature map** (the table at top of this page)
- **Risk-mitigation pack:** source code escrow agreement, monthly data export guarantee, CCPA compliance doc, API spec for handoff to any successor vendor
- **MOU draft** (do not require a contract; do not ask for money in the first meeting)
- **Council District endorsement letter** (ideally from CD14 since CLWM operates there)
- **Press hits** in hand (CLWM has WaPo / ABC7 / NBC / FOX11 / iHeart — bring printouts)

## What NOT to do under any admin

- Don't ask for enforcement integration (LAPD, code enforcement). CleanLA's reputation depends on not being a surveillance tool.
- Don't bypass CLWM. The grassroots validation IS the political capital. If you go around CLWM to the city, you lose the moat.
- Don't accept a contract before a pilot. Contracts come last per [[./la-city-partnership-mechanics]].
- Don't take a partisan endorsement. The [[../decisions/2026-05-no-candidate-branding]] decision is durable across admins; breaking it for one mayor blows up under the next one.
- Don't promise more than CleanLA can sustain post-handoff. The Snapcrap failure (per [[./snapcrap-case-study]]) was *no endpoint* — promise only what the volunteer + city + tool triangle can actually deliver.

## Open questions

- Is "Pratt" a specific candidate the project has visibility into, or fully hypothetical? If specific, his actual platform and transition team would replace the generic CTS framing here.
- Which Council District will be the natural champion if not CD14? (Depends on where CLWM's cleanups concentrate; CD13, CD9, CD1 are also possible.)
- Does Pratt's enforcement-first encampment plank create a CLWM partnership risk? (CLWM is dignity-first; if Pratt's policy pulls CLWM's reputation into a political fight, the partnership could fracture.)
- The post-CLWM-validation Mayor's-office activation sequence assumes CLWM ADOPTS the tool. If CLWM declines (per the Phase 1.5 conversation), this scenario page becomes moot until a replacement grassroots partner emerges.

## Backlinks

- [[../projects/cleanla-snap]]
- [[./la-city-partnership-mechanics]]
- [[./civic-tech-founder-org-handoff-patterns]]
- [[./clwm-partnership-prep]]
