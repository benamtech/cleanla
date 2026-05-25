---
title: California nonprofit legal mechanics for civic tech (2026)
tags: [civic-tech, california, nonprofit, legal, 501c3, fiscal-sponsorship]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../projects/cleanla-snap.md
  - ./la-civic-tech-funding-landscape.md
  - ./clwm-partnership-prep.md
---

The two paths for a CA civic-tech project to be 501(c)(3)-owned: **direct incorporation** (4-7 months, $5-12K Year-1 cost) or **fiscal sponsorship** (4-8 weeks, 9-15% revenue fee). For [[../projects/cleanla-snap|CleanLA]]'s Phase 1.5 attorney conversation, the goal is to walk in informed so the lawyer billing time is spent on judgment calls, not education.

> **NOT legal advice** — this is preparation for licensed-attorney conversation. Full research: `raw/0010-california-nonprofit-legal-mechanics.md`.

## Path comparison

| Path | Timeline | Year-1 cost | Control |
|------|----------|-------------|---------|
| **Direct 501(c)(3)** | 4-7 months (Form 1023) or 2-4 weeks (Form 1023-EZ) | $5,000-12,000 | Full |
| **Fiscal sponsorship** | 4-8 weeks | 9-15% of revenue + setup | Project lead; sponsor governs |

## Critical CA-specific filings

- **IRS:** Form 1023 (full) or 1023-EZ (if under $50K projected revenue) — gets the determination letter
- **CA Secretary of State:** Articles of Incorporation (~$30)
- **CA Attorney General:** Initial Registration (Form CT-1) within 30 days of forming OR accepting first donation
- **CA AG annual:** Form RRF-1 + CT-TR-1 (registry annual report)
- **CA FTB:** Form 3500A (state tax exemption — usually automatic with IRS determination)
- **Statement of Information (SI-100):** within 90 days of incorporation, biennial thereafter

## The 27-month rule (critical)

Form 1023 must be filed within **27 months of incorporation** to get retroactive IRS exemption dating to formation. Miss it and exemption only counts from filing date forward — affects early grant eligibility. Plan filing before month 27 or risk losing the retroactivity.

## Fiscal sponsorship options (for faster start)

| Sponsor | Fee | Notes |
|---------|-----|-------|
| **Community Partners LA** | 9-15% | LA-based, civic-tech-friendly; mentioned in [[./la-civic-tech-funding-landscape]] |
| **Social Good Fund** | similar | National, broad |
| **Players Philanthropy Fund** | similar | National, sports/community |
| **Hack for LA** | varies | LA-specific civic-tech brigade |

Typical 4-8 week approval. Sponsor handles legal/tax; project lead focuses on mission.

## Founder IP assignment — the mechanic

Founder transferring app code to new nonprofit needs a **copyright assignment agreement**. Templates from LawDepot, LegalZoom, Zegal. Key terms: identify parties, describe IP, statement of ownership, transfer language. Potential charitable-contribution tax deduction if a CPA values the code (conservative: $10K-$50K to avoid IRS challenge). No UBIT trigger from transfer itself.

## Board governance — CA-specific traps

CA Corp Code §5233 requires **disinterested board majority** for related-party transactions. Common founder-as-ED traps (per the Casa Ruby collapse, cited in research):

1. Founder-controlled board (violates CA law)
2. Founder as ED + voting board member (conflict of interest)
3. Founder setting own salary (requires disinterested board approval)
4. Skipping conflict-of-interest policy (IRS red flag on Form 1023)

Minimum: 3 directors, disinterested majority.

## Software-as-charitable-asset specifics

- **OSS licensing:** open-source license stays in effect after transfer (GPL stays GPL; transfers don't change license)
- **User data:** **no nonprofit exemption from CCPA** — must comply
- **Revenue / UBIT:** free app = no UBIT. Premium features or data licensing requires CPA review (Unrelated Business Income Tax may apply)
- **Code as donated asset:** conservative valuation ($10K-$50K typical) to avoid IRS challenge
- **Hosting costs** (Vercel, Supabase): legitimate program expense
- **Founder continuing as developer post-transfer:** can be paid (with board-approved comp study) or volunteer

## Realistic Year-1 admin budget ($5-12K)

- CA filing: $30
- IRS Form 1023: $600 (or 1023-EZ: $275)
- Attorney (incorporation + IP transfer): $2,500-4,000
- CA AG initial registration: $50-100
- CPA / bookkeeping: $500-1,500
- D&O + general liability insurance: $600-2,000
- Plus state and federal annual filings ongoing

## Common founder mistakes in the first attorney call

1. Not clarifying 501(c)(3) vs fiscal sponsorship before calling
2. Wanting "control" without understanding fiduciary duty
3. Skipping the conflict-of-interest policy
4. Confusing fiscal sponsorship with full nonprofit status
5. Not knowing the 27-month rule exists

## Recommended attorney conversation agenda (45-60 min)

1. Path decision: direct vs fiscal sponsorship — match to timeline + control needs
2. Timeline + cost reality check for the path picked
3. IP transfer mechanics (founder code → nonprofit)
4. Board structure: who, when, how independent
5. CA-specific filings sequence and deadlines (27-month rule!)
6. Insurance recommendations (D&O, general liability)
7. Grant eligibility timing (matters for [[./la-civic-tech-funding-landscape|LA2050 / Annenberg]] timing)
8. Founder employment after transfer — salary mechanics

## Backlinks

- [[../projects/cleanla-snap]]
- [[./clwm-partnership-prep]]
- [[./la-civic-tech-funding-landscape]]
