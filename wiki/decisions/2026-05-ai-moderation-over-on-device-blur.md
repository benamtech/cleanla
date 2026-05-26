---
title: Server-side AI moderation (Claude Haiku 4.5 vision) replaces on-device blur for the web v1
tags: [decision, privacy, moderation, ai, web, supersedes]
created: 2026-05-25
updated: 2026-05-25
status: active
supersedes:
  - ./2026-05-on-device-face-blur-required.md
related:
  - ../projects/cleanla-snap.md
  - ../concepts/on-device-photo-privacy.md
  - ../concepts/civic-app-legal-considerations.md
  - ./2026-05-web-stack-over-mobile.md
---

## Context

The original [[./2026-05-on-device-face-blur-required]] decision (2026-05-24) made on-device face + license-plate blur a non-negotiable floor: "the raw, unblurred photo never touches Firebase Storage, never crosses the network, and is discarded before the camera session closes." That decision was written when [[../projects/cleanla-snap]] was planned as a React Native mobile app where on-device ML via `react-native-vision-camera` + ML Kit (Android) / Apple Vision (iOS) was first-class.

The actual built artifact is a Next.js web app (per [[./2026-05-web-stack-over-mobile]]). On-device blur in the browser is meaningfully harder than on mobile: no first-party SDK, license plate detection has no good off-the-shelf option, performance on lower-spec laptops is uncertain, and the engineering cost of building it gates shipping.

By 2026-05-25, ben shipped Phase 5 (AI Moderation): every submitted media item passes through Claude Haiku 4.5 vision moderation server-side before it appears in any public surface (`webapp/src/lib/moderation/moderate-media.ts`, `/admin/moderation/` queue, `/api/admin/moderation/[mediaId]`). The raw photo IS uploaded to Supabase Storage; the moderation model classifies it; hidden items never appear publicly.

## Decision

**For web v1, server-side AI moderation via Claude Haiku 4.5 vision replaces the on-device blur requirement.** Specifically:

- Every uploaded image is moderated server-side by `moderate-media.ts` before it becomes publicly visible
- A human-reviewable moderation queue exists at `/admin/moderation/` for items the model flags
- Hidden / awaiting-review items don't render in any public route (`/`, `/s/[id]`, `/api/spots`)
- The raw photo IS stored in Supabase Storage and IS accessible to the moderation system, which is a meaningful trust-posture change from the original decision

This supersedes the implementation requirement of [[./2026-05-on-device-face-blur-required]] but does NOT cancel its underlying intent (protect identifiable people in submitted images). The intent is now enforced by automated moderation + human review, not by on-device redaction.

## Rationale

1. **Engineering velocity.** The on-device blur path required choosing between MediaPipe Tasks Web, face-api.js, onnxruntime-web, or a custom WASM pipeline, then training/bundling a license-plate model with no first-party option. Estimated 2-4 weeks of engineering to ship something fragile on lower-spec devices. Server-side moderation shipped in days using an existing managed model (Claude Haiku 4.5 vision).
2. **Moderation quality.** AI moderation can catch a broader range of harms than pure face/plate blur (graphic content, identifying signage, person-centric framing). A blur pipeline blurs what it detects; a moderation pass refuses items that shouldn't be public regardless of whether faces were detected.
3. **Audit trail.** A moderation queue produces a per-item record (model verdict, reasons, human override) that on-device blur cannot. This matters for legal defensibility under CCPA, BIPA-style claims, and any future subpoena.
4. **Human-in-the-loop.** The `/admin/moderation/` queue lets a reviewer override the model on edge cases. On-device blur has no equivalent — once blurred, lost.
5. **PWA constraint reality.** iOS Safari camera + WebGPU + WASM model loading on a 3-year-old iPhone is a real performance question. The Phase 1.5 validation prototype needs to work for non-technical CLWM volunteers; engineering risk on the device is unacceptable.

## Tradeoffs (the cost of this decision)

The original decision was written precisely to avoid these costs. Naming them explicitly:

- **The raw photo IS on the network and IS stored.** Subpoena risk, breach risk, and "we never collected it" trust posture are all changed. CleanLA can no longer claim raw images are never on infrastructure it controls.
- **Moderation has false negatives.** A face-containing photo could pass the model and appear publicly until a human flags it. The 5-minute soft hold and flag-and-hide system are the safety net, not the floor.
- **Model dependency.** Claude Haiku 4.5 vision is a paid managed API. Outage, pricing change, or model-policy change is a continuity risk. The moderation queue degrades to "all submissions pending human review" if the API is unreachable.
- **CCPA / privacy-policy revision required.** The user-facing privacy claim changes from "your photo is redacted before it leaves your device" to "your photo is uploaded encrypted and reviewed before it appears publicly." Both are true and defensible, but they're different products from a user-trust standpoint. The website privacy page and any marketing copy must reflect the new posture.

## Alternatives considered

- **Full on-device blur via MediaPipe Tasks Web + custom plate model.** Rejected for Phase 1.5 due to engineering cost (2-4 weeks) and uncertain PWA performance. Re-evaluate if the project pivots to native (per [[./2026-05-web-stack-over-mobile]]'s re-evaluation triggers).
- **Server-side blur (apply Gaussian to detected regions before storage).** Rejected because it has the same "raw photo on the network" cost as moderation AND the same engineering cost as on-device blur. No advantage.
- **Manual moderation only (no AI).** Rejected because volume scales beyond any reasonable human reviewer's bandwidth even at modest adoption.
- **Both AI moderation AND on-device blur.** Defer — when on-device web blur becomes a solved off-the-shelf component, layering it BEFORE the moderation pass is the strictly stronger position. Write a follow-on decision then.

## Companion safeguards (still mandatory)

These come forward from the prior decision and are preserved:

- **Body-area submission warning** in the UI: "Photograph the issue, not the people."
- **Honest header copy** on the capture surface that explains what happens to the photo (now: "uploaded and reviewed" not "redacted on your device")
- **Public flag-and-hide moderation** for anything the AI pass missed
- **5-minute soft hold** between submission and public visibility
- **No images of clearly identifiable individuals are public-by-default** — model is tuned to err toward holding rather than approving

## Consequences

- **The original [[./2026-05-on-device-face-blur-required]] decision is functionally superseded.** Backlinks and `superseded_by:` frontmatter point here.
- **Privacy policy + user-facing copy must be revised** before public launch (Phase 7). The "raw photo never leaves your device" language is no longer true and must not appear anywhere.
- **`ANTHROPIC_API_KEY` is now a hard production dependency.** Add to Vercel env, monitor for quota and outage.
- **Moderation queue is a permanent piece of operational overhead.** Someone must triage flagged items. Phase 7 needs a process for this.
- **If the project pivots back to a mobile app or PWA-with-real-on-device-ML**, write a successor decision that re-introduces the device-side floor.

## Re-evaluation triggers

Revisit this decision if any of:

- **MediaPipe Tasks Web or equivalent gains a license-plate model** that runs at acceptable perf on common phones (closes the original engineering gap)
- **Claude Haiku 4.5 vision is deprecated, repriced, or restricted** in a way that breaks the moderation pipeline economics
- **A privacy complaint, lawsuit, or CCPA action targets the "raw photo on infrastructure" posture**
- **Moderation queue volume exceeds human review capacity** at a rate that creates a public-safety backlog
- **The project re-pivots to mobile** (in which case the original on-device decision becomes operative again)

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/on-device-photo-privacy]]
- [[./2026-05-on-device-face-blur-required]]
- [[./2026-05-web-stack-over-mobile]]
