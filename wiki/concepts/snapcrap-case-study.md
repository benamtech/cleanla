---
title: Snapcrap (San Francisco, 2018) — Case Study
tags: [civic-tech, case-study, mobile, 311]
created: 2026-05-24
updated: 2026-05-24
related:
  - civic-app-patterns-and-failure-modes.md
  - cleanlawithme-movement.md
  - ../projects/cleanla-snap.md
---

The closest direct precedent for [[../projects/cleanla-snap]]: a citizen-built mobile app that bypassed an official 311 system's UX friction by reducing reporting to two taps. Launched October 2018 by Sean Miller (then 24, recently relocated to SF from Vermont) and went viral within days.

## What it did

Opens directly to camera. One tap captures the photo, one more submits with auto-attached GPS to SF Public Works for cleanup dispatch. No mandatory comment field. No category dropdowns. The official SF311 app required several screens of metadata; Snapcrap collapsed that to two taps. That delta in friction was the entire product.

Submission was not via a direct Open311 write; Miller acted as the intermediary, forwarding photos to Public Works. See [[open311-standard]] for why the API-first approach didn't pan out in practice.

## Launch trajectory

- Released over a weekend for iOS, October 2018
- First few hundred downloads
- Miller bootstrapped visibility by creating a Snapcrap Twitter account and following SF311's existing 15K followers
- Within 24 hours: local media interview request
- NBC Bay Area evening news → cascade coverage in LA Times, NY Times, Vice, Fox News, NY Post

## Friction encountered

- **Trademark pressure from Snap Inc.** Outside counsel demanded changes. Miller compromised on color and logo but kept the name; Snap continued demanding a rename anyway. Lesson: brand collision with major consumer apps is day-one legal exposure.
- **App Store moderation.** The original cartoon-poop icon was rejected; he replaced it with a pixelated version.
- **Agency ambivalence.** Direct Miller quote: *"I don't think the people at Public Works are super psyched. It's creating quite a few more tickets for them."* Lowering reporting friction increases agency queue volume without giving them more resources.
- **Forced workarounds for SF311 requirements.** SF311's mandatory comment field was handled with canned templates ("I see poop", "Help. I can't hold my breath much longer").

## Scale context

SF had 24,300+ human waste cleanup requests in 2017. SF Public Works had a dedicated six-person "poop patrol." Snapcrap measurably amplified an already-large queue.

## Why it stagnated

Coverage cooled within a year. No institutional sponsor took it over. Solo-developer civic apps die without a nonprofit, city partnership, or foundation grant to outlast the founder's attention span. This is one of the durable failure modes catalogued in [[civic-app-patterns-and-failure-modes]].

## Takeaways for CleanLA Snap

- The two-tap UX *is* the product. Any extra step is a 50%+ adoption tax.
- Bootstrap virality by piggybacking the existing official channel's audience (in LA's case, [[cleanlawithme-movement]]'s ~69K followers + [[myla311-system]]'s organic reach).
- Plan the institutional form on day one (nonprofit, partnership, fiscal sponsor). Solo founders burn out and the app dies with them.
- Avoid brand collisions with major consumer apps — the lawyer letter arrives in week one.
- Design the agency-facing side too, even if just a CSV export. Lowering submission friction without addressing queue volume creates an enemy in the agency.

## Sources

- AP/CBS: https://www.cbsnews.com/sanfrancisco/news/san-francisco-snapcrap-app-used-to-report-poop-on-city-streets
- Vice: https://www.vice.com/en/article/snapcrap-app-san-francisco-report-poop-to-311-vgtrn/
- Miller's retrospective: https://medium.com/@miller.stowe/snapcrap-why-i-built-an-app-to-report-poop-on-the-streets-of-san-francisco-aac12382a7ce
- NBC Bay Area walkthrough: https://www.nbcbayarea.com/news/local/walking-san-franciscos-dirtiest-block-with-snapcrap-app-creator/204130/
- GovTech: https://www.govtech.com/civic/snapcrap-creator-provides-visual-tool-to-help-sf-clean-up-its-sidewalks.html

## Backlinks

- [[civic-app-patterns-and-failure-modes]]
- [[../projects/cleanla-snap]]
- [[myla311-integration]]
