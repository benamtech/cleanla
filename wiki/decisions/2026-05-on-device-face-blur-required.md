---
title: On-device face + plate blur is mandatory for CleanLA Snap
tags: [decision, privacy, mobile]
created: 2026-05-24
updated: 2026-05-25
status: active
superseded_by:
  - ./2026-05-web-stack-over-mobile.md  # principle survives in full (raw never uploaded, on-device redaction); RN-specific implementation (vision-camera + ML Kit/Vision) no longer applies — web pipeline implementation to be locked in a follow-on decision
  - ./2026-05-ai-moderation-over-on-device-blur.md  # 2026-05-25 morning: Phase 5 server-side Claude Haiku 4.5 vision moderation as substitute; ITSELF superseded 2026-05-25 afternoon — see below
  - ./2026-05-on-device-blur-restored.md  # 2026-05-25 afternoon: PRINCIPLE RESTORED via MediaPipe Tasks Web (this decision's intent is preserved with a different stack); Claude Haiku 4.5 moderation kept as defense in depth
related:
  - ../concepts/on-device-photo-privacy.md
  - ../concepts/civic-app-legal-considerations.md
  - ../projects/cleanla-snap.md
  - ./2026-05-web-stack-over-mobile.md
---

## Context

[[../projects/cleanla-snap]] aggregates citizen photos of public space. Faces and license plates inevitably appear in those photos. Without redaction, the app:

- Doxxes unhoused people in encampment reports
- Surfaces license plates that can be re-identified through DMV lookups, parking tickets, and other linked data sources
- Creates a permanent, shareable record of identifiable people in compromising contexts
- Exposes the developer to biometric privacy law (BIPA-style claims, CCPA biometric data obligations)

This is the single largest reputational and legal risk for the app, identified in [[../concepts/civic-app-legal-considerations]] and [[../concepts/civic-app-patterns-and-failure-modes]].

## Decision

**Every captured photo must pass through the on-device blur pipeline before it leaves the device.** Faces and license plates are detected and Gaussian-blurred locally. The raw, unblurred photo never touches Firebase Storage, never crosses the network, and is discarded before the camera session closes.

This is non-negotiable. It is not a feature flag, not an opt-in setting, not a paid tier. It is the floor.

Full pipeline specification: [[../concepts/on-device-photo-privacy]].

## Rationale

1. **The harm is real and immediate.** A single unblurred encampment photo can directly enable harassment or violence against the person depicted.
2. **"We never collected it" beats "we collected and deleted it."** On-device redaction means there is no raw image to subpoena, breach, or leak.
3. **Trust posture.** The marketing claim "your photos are redacted before they leave your phone" is verifiable by inspecting the network traffic. Server-side blurring is not similarly verifiable.
4. **Compliance.** Treating biometric features as never-collected sidesteps several GDPR/CCPA obligations entirely.
5. **The cost is acceptable.** ML Kit (Android) and Vision (iOS) are first-party, on-device, free, and performant. The pipeline adds <500ms to the capture flow on modern devices.

## Alternatives considered

- **Server-side blurring.** Rejected — requires the raw photo to traverse the network and persist (at least transiently) on the server. Loses the "we don't have it" trust posture.
- **User-controlled blur opt-in.** Rejected — most users will not opt in if it's optional. Default behavior is the only behavior that protects vulnerable people who didn't consent to being photographed.
- **No blur, rely on moderation.** Rejected as facially indefensible.

## Companion safeguards (also mandatory)

These are part of the same decision, not separate:

- **Body-area check.** If >40% of frame area is detected as human bodies (not just faces), block submission with: *"This looks like a photo of people. Please reframe to focus on the issue."* Face blur alone does not redact identity when the photo is fundamentally about a person.
- **Honest header copy** on the submission screen: *"Photograph the issue, not the people. Faces and plates are auto-blurred — review before submitting."*
- **Public flag-and-hide moderation** for any photo the model missed.

## Consequences

- The MVP cannot ship without a working blur pipeline. This raises the bar to launch.
- The app requires native modules (`react-native-vision-camera` frame processors, ML Kit / Vision SDKs), forcing an EAS dev client build. (Already required for [[../decisions/2026-05-mapbox-over-google-maps]], so no incremental pain.)
- Older or low-spec devices may drop frames or run hot. Test on the lowest-spec target device explicitly.
- The license plate detector requires either ML Kit's general object detection with a trained model or a bundled TF Lite model — bundle size grows.

## What would change this decision

This decision is durable. Reversing it would require either:
- A new privacy regime that makes the pipeline legally unnecessary (extremely unlikely), or
- A demonstrated path to equivalent user protection without on-device processing

In either case, a new dated decision must supersede this one. The pipeline is not removed without an explicit, documented replacement.

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/on-device-photo-privacy]]
- [[../concepts/civic-app-legal-considerations]]
- [[./2026-05-web-stack-over-mobile]]
- [[../concepts/cleanla-clean-streets-mayor-scenario]]
- [[./2026-05-ai-moderation-over-on-device-blur]]
- [[./2026-05-on-device-blur-restored]]
