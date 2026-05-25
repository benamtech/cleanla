---
title: Civic-tech founder → community-org handoff patterns
tags: [civic-tech, partnerships, founder-patterns, governance]
created: 2026-05-24
updated: 2026-05-25
related:
  - ../projects/cleanla-snap.md
  - ./clwm-partnership-prep.md
  - ./snapcrap-case-study.md
  - ./seeclickfix-civicplus.md
  - ./fixmystreet-uk.md
  - ./civic-app-patterns-and-failure-modes.md
---

Cross-case patterns from civic-tech founders who handed off / co-built tools with community organizations. The strongest signal across successful cases is **listening first, building second** — solving the founder's own problem before asking others to adopt the tool. The fatal pattern in failures is **founder-centric ideation**: building what the technologist thinks the problem needs, then looking for users.

Full research: `raw/0011-civic-tech-founder-org-handoff-cases.md`.

## Successful precedents

- **[[./seeclickfix-civicplus|SeeClickFix]]** (Ben Berkowitz, New Haven, 2007-2019): solved his own problem (graffiti on State Street); organic adoption first, city integration second; pitch was "residents love this, how do we make it official?"
- **[[./fixmystreet-uk|FixMyStreet / mySociety]]** (Tom Steinberg, UK, 2007-present): built as UK charity from day one; councils integrated because the tool made their workflow easier; founder stepped down 2015 with org "in good shape" — succession, not sale
- **mRelief** (Rose Afriyie + Genevieve Nielsen, Chicago, 2014-present): founded *with* community insight; both founders personally affected by the welfare-access problem; connected 1M+ households to SNAP
- **Litterati** (Jeff Kirschner, 2014-present): data-collection infrastructure that *amplifies* cleanup orgs without trying to organize them — the closest direct analog to CleanLA's situation
- **Snap Send Solve** (Australia, 2015-present): bottom-up adoption (councils saw value, requested integration); 850+ Solvers, 4.5M+ reports in 2024
- **Decidim** (Barcelona, 2016-present): commons-governed open source; partnership policy with sliding contribution % (3% companies, 1.5% nonprofits, 0% year-one)

## Failed precedents

- **[[./snapcrap-case-study|Snapcrap]]** (Sean Miller, SF, 2018): viral 2-click 311 wrapper; **no improvement on the streets**. No partnership conversation with Public Works; the real problem was housing/sanitation, not app friction; no endpoint capacity to handle accelerated intake. Direct precedent for CleanLA.
- **Joshua Tauberer's GovTrack-adjacent projects** (2005-2013): GovTrack Insider, Videos, Real Congress, ANCFinder, Semantic Web Database — all failed building *for* the community instead of *with* them. Information access ≠ engagement; founder enthusiasm ≠ market demand.
- **Code for America Brigade sunset** (2023): 60 chapters had no independent legal status, no IP, no capital — when CfA shifted strategy they had 12 months to reinvent or disappear. Lesson: early ownership transfer beats sudden divestment.

## The first conversation — what works

**Framings that land:**
- "Residents love reporting to this tool; how do we make it official?" (SeeClickFix)
- "I know this problem personally — can we solve it together?" (mRelief)
- "Volunteers want to track cleanup. Can we help you understand where your litter comes from?" (Litterati)

**Framings that die:**
- "I noticed your problem. Here's a faster way to handle it." (Snapcrap)
- "I built a thing. Want to try it?" (Tauberer)
- "We built a platform for [community-purpose]." (built first, users imagined after)

**The critical question** (per Laurenellen McCann's community-driven civic tech work): listen first. The first call should be: *"What's your biggest bottleneck? If you could change one thing, what?"* Then the decisive question: **"Do you want to *own* this tool, or use a tool I've built?"** His answer determines the entire partnership structure.

## Common deal structures (trade-off matrix)

| Structure | IP | Founder role | When |
|-----------|-----|--------------|------|
| Outright donation | Org owns | Exits | Org has tech capacity |
| Founder-employed | Org owns | CTO | Mission-driven, org has funding |
| Co-ownership w/ sunset | Joint → org | Planned exit | Both willing to invest 2-3y |
| License-only | Founder retains | Maintains | Founder licenses to multiple orgs |
| Fiscal sponsorship spinoff | Sponsor holds | Project lead | Neither party incorporated |

The right structure depends on what the org wants, not what the founder wants.

## Patterns to watch for in the [[./clwm-partnership-prep|CLWM conversation]]

**Red flags:** "Our volunteers aren't tech-savvy" / "Build it for us and hand it off" / "I'll think about it" / silence.

**Green flags:** "This is exactly the problem" / "Can we modify it to also track X?" / "Can you train our team?" / "I want to own it so we can fork it" / "Can I introduce you to other cleanup orgs?"

## Specifically for CleanLA + Clean LA With Me

Litterati is the closest precedent: data infrastructure that amplifies cleanup orgs without trying to organize them. The split:

- **Boots on ground** (Naula's role): can't be replaced
- **Data in the cloud** (CleanLA's role): captures, counts, visualizes, exports

The conversation should be: "I can't organize volunteers or do cleanups. But I can give you visibility into impact so you can tell the story better."

## Backlinks

- [[../projects/cleanla-snap]]
- [[./clwm-partnership-prep]]
- [[./snapcrap-case-study]]
- [[./cleanla-clean-streets-mayor-scenario]]
