# CleanLA Privacy Policy — DRAFT (Phase 5.5)

> **Status:** DRAFT for licensed-attorney review before shipping. This document is not legal advice. It is a starting point for the attorney conversation referenced in [`wiki/concepts/california-nonprofit-legal-mechanics.md`](../wiki/concepts/california-nonprofit-legal-mechanics.md). Do NOT publish this verbatim to `/privacy` without attorney sign-off.

**Last updated:** [TODO — set when shipping]
**Effective:** [TODO — same as ship date]

---

## What CleanLA is

CleanLA ("we", "us", "the app") is a nonpartisan civic transparency tool for reporting and tracking street issues in Los Angeles. We are designed to be owned by a 501(c)(3) nonprofit; that ownership transfer is pending. Until then, CleanLA is operated by [TODO — current operator name + contact, e.g. "the CleanLA project, contact: hello@cleanla.org"].

We are NOT operated by any political candidate, party, or campaign. We are NOT affiliated with the City of Los Angeles, the Mayor's Office, LAPD, LADWP, or any other government entity. We deep-link to MyLA311 when users choose to forward their reports there; we do not submit on the city's behalf or theirs.

## What you do on CleanLA

- **Browse** the public map and individual spot pages — no account needed
- **Submit** a report (photo + location + optional note) — magic-link email login required
- **Mark a spot cleaned** with a follow-up "after" photo — login required
- **Share** a public spot page on X, copy a link, or use your phone's native share sheet

## What data we collect

### When you browse

- Standard web server logs (IP address, browser type, page accessed, timestamp). Retained 30 days for security purposes.
- No tracking cookies. No analytics SDKs. No ad-tech.

### When you create an account

- **Email address** — used only for magic-link sign-in. Required.
- **Display name** (optional) — shown on your reports.
- **Account creation timestamp**.

### When you submit a report

- **Photo of the street issue.** **What happens to the photo is the most important part of this policy — see "How we handle your photos" below.**
- **GPS coordinates** of the reported location (latitude, longitude). Required for the map.
- **Timestamp** of capture (from your device).
- **Category** of issue (encampment, illegal dumping, graffiti, biohazard, overgrown lot, other).
- **Optional one-line note** you write.
- **Device context** — browser type, OS version, whether your device supported on-device redaction. Used for diagnostics and to monitor our redaction-coverage rate.

### When you mark a spot cleaned

- A second photo (same handling as the report photo) and a timestamp.

### What we DO NOT collect

- Your name, mailing address, phone number, or any government ID.
- Your contacts, calendar, photo library, or any device data outside the specific photo you choose to submit.
- Behavioral tracking across other websites.
- Information about people in your reports beyond what's visible in the (redacted) photo itself.

---

## How we handle your photos

This is the part of the policy that matters most. CleanLA photos may incidentally include people experiencing homelessness, license plates, and other identifying details. We treat this seriously.

### If your browser supports on-device redaction (most modern phones and laptops)

1. Your photo is processed **on your own device** using MediaPipe Tasks Web, an on-device face-detection model from Google.
2. Detected faces are **blurred on your device** using a Gaussian blur applied via your browser's canvas.
3. Only the **already-blurred image** is uploaded to our servers. **Your raw, unredacted photo never leaves your device and never reaches our infrastructure.**
4. The blurred image is then automatically reviewed by Claude Haiku 4.5, an AI moderation model from Anthropic, as a safety net to catch anything the on-device blur missed.

In this path, your raw photo is not shared with any third party, including Anthropic.

### If your browser does NOT support on-device redaction (older browsers, very low memory devices)

If our capability detection determines your browser cannot run the on-device blur pipeline:

1. We will show you a clear notice at the upload step: "Server-side redaction will apply to this photo."
2. Your raw photo is uploaded to our infrastructure (Supabase Storage).
3. **The raw photo is shared with Anthropic** (via their Claude Haiku 4.5 vision API) for AI moderation.
4. After moderation, the moderated photo enters the same publishing pipeline.
5. We log this as a "server-side redaction" submission for our own monitoring purposes.

If you do not want your raw photo shared with Anthropic, do not submit a report from an unsupported browser. We will work to reduce the share of submissions that go through this fallback path.

### What "publicly visible" means

After redaction (either path) and moderation, your spot may appear:
- On the public map at `/`
- On a public spot page at `/s/[id]`
- In API responses at `/api/spots`
- In OG card images at `/api/og/spot/[id]` (used when the spot is shared)

Publicly visible content is, by design, indexable by search engines and readable without an account.

### Photos held for review

If our AI moderation flags a photo for human review, it sits in an internal queue accessible only to designated CleanLA reviewers. It is not publicly visible. We may hold flagged photos for up to 30 days while we decide whether to publish, redact further, or reject. Rejected photos are deleted within 7 days of the rejection decision.

### Deletion

You can request deletion of any of your reports, your account, or your entire submission history at any time by contacting [TODO — email]. We will delete from our active systems within 14 days. Note: photos you previously shared on X or elsewhere are outside our control and persist on those platforms.

---

## Where your data lives

- **Postgres database (Supabase):** spot data, account data, moderation records. Hosted in [TODO — confirm Supabase region].
- **Storage (Supabase):** redacted photos. Same region.
- **Anthropic Claude Haiku 4.5 (moderation):** for the fallback path only, photos are sent to Anthropic's API for AI moderation and are not used by Anthropic for training (per Anthropic's commercial terms). Anthropic's data retention policy applies; see [https://www.anthropic.com/legal/privacy](https://www.anthropic.com/legal/privacy).
- **Vercel (hosting):** our Next.js app runs on Vercel infrastructure. Vercel sees standard request metadata.

We do not transfer your data to any other third party. We do not sell your data. We do not share your data with advertisers.

---

## Your California rights (CCPA / CPRA)

If you are a California resident, you have the right to:

- **Know** what personal information we have collected about you and how we use it
- **Delete** your personal information
- **Correct** inaccurate personal information
- **Opt-out of sale or sharing** — we do not sell or share your personal information for cross-context behavioral advertising; this right does not require action on our part
- **Limit use** of sensitive personal information — we do not use photos or location data for any purpose other than the report itself
- **Non-discrimination** — we will not refuse service or charge different prices for exercising these rights

To exercise these rights, contact [TODO — email]. We will respond within 45 days as required by CCPA.

We do not have actual knowledge of selling or sharing the personal information of consumers under 16 years old.

---

## Children's privacy

CleanLA is intended for users 16 and older. We do not knowingly collect data from children under 13. If you believe a child has submitted data, please contact us and we will delete it.

---

## Security

- Database and storage are encrypted at rest by Supabase.
- All communication uses HTTPS.
- Magic-link authentication is handled by Supabase Auth.
- Photos accessed via signed URLs with limited time-to-live for the moderation queue; public-facing photos via standard Supabase Storage public URLs.
- We do not store passwords (we do not use passwords).

No system is perfectly secure. We will notify affected users of any data breach as required by California law.

---

## Cookies

We use only essential cookies for authentication (session cookies set by Supabase Auth). We do not use tracking, advertising, or analytics cookies.

---

## Changes to this policy

We will update this policy as we add features, change vendors, or as required by law. Material changes will be noted at the top of this page with a new "Effective" date. We will also note major changes in the CleanLA GitHub repository changelog at [github.com/benamtech/cleanla](https://github.com/benamtech/cleanla).

---

## Contact

[TODO — email address]
[TODO — physical mailing address once 501(c)(3) is established]

---

## What's in this draft that the attorney needs to review

This is a draft. Real legal review should focus on:

1. **CCPA / CPRA compliance for the Anthropic data-sharing path.** Specifically: is server-side AI moderation a "sale" or "sharing" of personal information under CCPA? Does the fallback path need explicit consent (an opt-in checkbox) at the upload step, or is the in-line disclosure sufficient?
2. **BIPA-style biometric privacy.** California does not have a BIPA equivalent at the state level (as of attorney review date), but on-device face detection arguably collects biometric identifiers transiently. Is the on-device-only handling sufficient, or do we need additional disclosure / consent for the detection step itself?
3. **Encampment / unhoused-population specific risks.** CleanLA reports may include people experiencing homelessness. Are there CA-specific protections (e.g., AB 1572, anti-doxxing statutes, Penal Code §422 considerations) that require additional safeguards or disclosures?
4. **Data subject rights for "subjects" of reports (not just submitters).** A person depicted in a CleanLA photo is not a CleanLA user but is a "data subject" under CCPA. Do they have CCPA rights with respect to their image in our system, and how do they exercise those rights when they cannot identify themselves?
5. **501(c)(3) nonprofit status and CCPA applicability.** CCPA applies to for-profit businesses meeting threshold criteria. Nonprofits are NOT subject to CCPA. Once CleanLA is 501(c)(3)-owned, the CCPA section can be revised / removed. Until then, the operator's for-profit status (or lack thereof) determines applicability.
6. **Children's privacy threshold.** "Intended for users 16 and older" — does this require COPPA-style verification mechanisms, or is a self-declaration sufficient given the app's nature?
7. **Anthropic's terms of service** — confirm "no training on our data" guarantee with specific contractual language ben can rely on (Anthropic offers this in their commercial tier).
8. **Vercel + Supabase DPAs (Data Processing Agreements)** — do we need to execute these, or are the standard terms-of-service sufficient given our data sensitivity?
9. **International users.** The app is LA-focused but accessible globally. Do we need a GDPR notice for any EU visitors? (Probably not, given non-targeting, but confirm.)
10. **Photo retention policy for un-published reports.** Currently: 30-day hold + 7-day post-rejection deletion. Confirm these align with CA records-retention requirements for any government-adjacent reporting and with Supabase's deletion guarantees.

## What's INTENTIONALLY conservative in this draft

- The fallback-path Anthropic sharing is described in detail. We could simplify to "we use third-party services for moderation" — that's the industry standard. We chose the detailed version because civic-tech credibility depends on transparency, even at the cost of policy length.
- We do not include an analytics section because we genuinely do not use analytics. If we add Plausible / Vercel Analytics / similar in the future, this section needs to be added before that change ships.
- Photo retention is 30 days (hold) + 7 days (post-rejection). We could go shorter to reduce risk; we chose 30 because moderation queue volume may require it. Confirm with attorney.
- We do not currently have a Data Protection Officer or formal Privacy Officer role. As a small project, this is acceptable. Once 501(c)(3) is established and staffed, designate a privacy contact.
