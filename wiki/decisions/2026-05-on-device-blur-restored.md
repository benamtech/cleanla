---
title: On-device blur restored — MediaPipe Tasks Web + Claude Haiku as defense in depth
tags: [decision, privacy, moderation, mediapipe, web, supersedes]
created: 2026-05-25
updated: 2026-05-25
status: active
supersedes:
  - ./2026-05-ai-moderation-over-on-device-blur.md
related:
  - ../projects/cleanla-snap.md
  - ../concepts/on-device-photo-privacy.md
  - ../concepts/civic-app-legal-considerations.md
  - ./2026-05-web-stack-over-mobile.md
  - ./2026-05-on-device-face-blur-required.md
---

## Context

The earlier [[./2026-05-ai-moderation-over-on-device-blur]] decision (2026-05-25 morning) replaced the on-device blur requirement with server-side Claude Haiku 4.5 vision moderation. That decision rested on two empirical claims: (1) on-device blur in the browser was 2-4 weeks of fragile engineering with uncertain phone performance, and (2) iOS Safari did not yet support WebGPU, making on-device ML on iPhones a hard sell.

**Both empirical claims are now wrong.** Empirical feasibility research (`raw/0016-web-on-device-blur-feasibility.md`, 2026-05-25 afternoon) found:

- **MediaPipe Tasks Web is production-ready** for face detection: ~50-150 ms latency on mid-range Android, ~30-80 ms on iPhone 12, ~93% of global traffic covered, well-documented Next.js integration. Engineering effort for face-blur MVP is **4 days, not 2-4 weeks**.
- **iOS Safari 26 (Fall 2025) ships WebGPU** with full enable-by-default. The long-pole that anchored the earlier decision is gone.
- **License-plate detection is still the hard half** (no first-party SDK), but a custom PaddleOCR or YOLOv8 ONNX model with Apache 2.0 licensing ships the face+plate version in **8 days total** — still well within a single sprint.
- **CleanLA would be the first civic-tech in this space** shipping on-device blur. Nextdoor, Citizen, SeeClickFix all server-moderate only. Privacy-first positioning is genuinely differentiated.

The principle from the original [[./2026-05-on-device-face-blur-required]] decision (raw photo never leaves the device) was always right; the only reason to abandon it was engineering cost, and that cost no longer applies.

## Decision

**Restore on-device blur as the required floor. Layer Claude Haiku 4.5 moderation BEHIND it as defense in depth.** Architecture:

```
device capture
  → MediaPipe Tasks Web face detection (on-device, <150ms)
  → PaddleOCR / custom YOLOv8 plate detection (on-device, <400ms; Tier 2)
  → canvas Gaussian blur of detected regions
  → HEIC → JPEG conversion if needed
  → EXIF GPS strip (Tier 3)
  → upload blurred image to Supabase
  → Claude Haiku 4.5 vision moderation on the blurred image (existing Phase 5)
  → moderation queue (`/admin/moderation`)
  → publish to public surfaces after 5-min soft hold
```

**Both layers are mandatory.** Neither alone is sufficient. The on-device pass is the deterministic privacy floor; the server-side moderation is the broad-coverage safety net (catches what blur missed plus person-centric framing, identifying signage, graphic content, etc.).

**Tier rollout:**

| Tier | Scope | Eng days | When |
|------|-------|----------|------|
| **1 — Face-blur MVP** | MediaPipe + canvas blur + worker + HEIC + Supabase upload + fallback flag | **4 days** | **Ship Phase 5.5 this week** |
| **2 — Face + plate prod** | + PaddleOCR ONNX or custom YOLOv8 (~500 annotated CA plate crops), SW caching, slow-Android testing | **8 days (~2 wk)** | Phase 6 fast-follow |
| **3 — Comprehensive** | + EXIF GPS stripping, body detection (>40% frame area), fallback matrix, A/B telemetry, docs | **14-15 days (~3 wk)** | When adoption justifies |

**Fallback for unsupported devices** (old browsers, low memory, explicit opt-out):

```javascript
if (mediapipeDetectionSupported) {
  upload(await blurFacesAndPlates(imageData));
} else {
  upload(rawImage, { redaction_method: "server_only" });
  // Phase 5 moderation still applies; flagged as fallback
}
```

Log fallback rate as a KPI; alert if it exceeds 10% of submissions.

## Rationale

1. **Engineering cost flipped.** The earlier decision was correct *given* a 2-4 week estimate. The empirical research found 4 days for face-only Tier 1. The math is different now.
2. **iOS Safari is no longer the long-pole.** WebGPU on iOS 26 + WASM-backend fallback on iOS 16-17 both work. CleanLA can target iOS 16+ confidently.
3. **"Raw photo never leaves the device" is a moat.** No competitor in LA civic-tech ships this. The privacy claim is materially stronger than any server-side moderation framing. For a 501(c)(3) civic tool that aggregates photos of vulnerable people, this is the strongest possible posture.
4. **Defense in depth beats either layer alone.** On-device blur catches what it can deterministically (faces, plates); server moderation catches the rest (broader harms, model misses). Same code already shipped for Phase 5; layering blur in front is additive, not a rewrite.
5. **Composability with Phase 5.** Claude Haiku 4.5 moderation works on blurred images (broad training distribution). Blurred regions actually become a *useful signal* to the moderator: "this submitter had reason to blur here."
6. **Restored privacy-policy language.** The on-device-blur claim can return: "Your raw photos are processed on your device. Only redacted images leave your phone." This is materially stronger than the AI-moderation-only claim and removes the privacy-policy revision burden that the earlier decision created for Phase 7.

## Tradeoffs (still honest)

- **Tier 1 ships face-only.** Plates remain server-only for a window. User-facing copy must reflect this honestly: "Faces blurred on-device; license plates and other identifying details reviewed server-side." Don't over-claim.
- **License-plate accuracy on CA plates is unbenchmarked.** PaddleOCR is trained on Chinese + international data. The first Tier 2 task is testing on 50-100 real CA-plate crops; custom fine-tune via Roboflow if accuracy <85%.
- **Web Worker is mandatory.** Face detection is 50-150 ms blocking work; must be offloaded to keep the upload UI responsive. Adds one engineering pattern but well-established.
- **First-visit cost is ~5 MB.** PWA + service-worker caching makes this a one-time hit; repeat visits are ~0 extra MB. Communicate to volunteers via a clear loading state on first capture.
- **Volunteer-device diversity is still a real question.** Need to test on the oldest realistic device (Galaxy A12, ~$150) before declaring "shipped." If latency >3s on that floor, processing-UI affordance is required.
- **Moderation model perf on blurred images is unverified.** Test batch of 50 ground-truth-labeled images through Phase 5 post-blur; if recall drops materially, may need threshold tuning.

## Alternatives considered (and re-rejected)

- **Stay on AI moderation only (Phase 5 as-is).** Rejected — the engineering cost that justified this position has dropped from 2-4 weeks to 4 days. No remaining argument to defer.
- **Server-side blur instead of on-device.** Rejected for the same reasons as the original 2026-05-on-device-face-blur-required decision: raw photo on the network, no "we never collected it" trust posture, no audit advantage over the existing moderation pipeline.
- **On-device blur only, drop Phase 5 moderation.** Rejected — moderation catches things blur can't (person-centric framing, identifying signage, graphic content, model misses on partial faces). Defense in depth wins.
- **Ship plate detection in Tier 1.** Rejected — plates add 4-5 days of engineering AND require empirical accuracy validation on CA plates. Tier 1 is the privacy-floor win; plates are the optimization.

## Companion safeguards (preserved from the original on-device decision)

These come forward unchanged:

- **Body-area submission warning** in the capture UI: "Photograph the issue, not the people."
- **Honest header copy** explaining what happens to the photo
- **Public flag-and-hide moderation** for anything that gets through
- **5-minute soft hold** between submission and public visibility
- **No images of clearly identifiable individuals public-by-default** — both blur and moderation tuned to err toward hiding

## Consequences

- **[[./2026-05-ai-moderation-over-on-device-blur]] is now superseded.** Its analysis remains accurate context for "why we briefly went moderation-only," but the architecture it describes is no longer current.
- **Privacy policy / user-facing copy must be REVISED AGAIN** before Phase 7 launch — but now in the *stronger* direction. The on-device-blur claim returns; the "raw photo encrypted and reviewed" language can be replaced with "raw photo never leaves your device."
- **Phase 5.5 (face-blur MVP) becomes the next engineering milestone**, ahead of any further Phase 6+ work that depends on the privacy story. Suggested 4-day sprint to ship.
- **A new MediaPipe Tasks Web dependency** is added to `webapp/package.json`. Bundle size grows by ~3 MB + ~800 KB model file (cached after first visit).
- **`ANTHROPIC_API_KEY` remains a hard production dep** — Phase 5 moderation continues as defense in depth, not removed.
- **`react-native-vision-camera` / ML Kit / Apple Vision references** in older wiki concepts (e.g., [[../concepts/on-device-photo-privacy]]) are historical context; the new web stack uses MediaPipe Tasks Web instead. The principle is preserved; the libraries differ.
- **Trust-posture marketing surface is restored** — "we never collect your raw photos" returns as a claim CleanLA can defensibly make. This is a real partnership-pitch and grant-application asset.

## Re-evaluation triggers

Revisit this decision if any of:

- **MediaPipe Tasks Web is deprecated or significantly regressed** in a future Google release (closes the engineering cost case)
- **iOS Safari rolls back WebGPU** or WASM support (unlikely but would shrink coverage)
- **Plate-blur accuracy on real CA plates falls below 80%** after Tier 2 fine-tuning (would need different model approach)
- **Volunteer fallback rate exceeds 10%** (device-diversity reality check; may need second engineering pass on older-device support)
- **Moderation false-negative rate on blurred images is materially worse than on raw images** (model behavior changes the architecture math)

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/on-device-photo-privacy]]
- [[./2026-05-on-device-face-blur-required]]
- [[./2026-05-ai-moderation-over-on-device-blur]]
- [[./2026-05-web-stack-over-mobile]]
