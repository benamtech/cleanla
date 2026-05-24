---
title: On-Device Photo Privacy Pipeline
tags: [mobile, privacy, ml, computer-vision]
created: 2026-05-24
updated: 2026-05-24
related:
  - civic-app-legal-considerations.md
  - ../projects/cleanla-snap.md
  - ../decisions/2026-05-on-device-face-blur-required.md
---

A pattern for any mobile app that captures photos of public space: detect identifying features (faces, license plates) on-device, blur them locally, and upload only the redacted result. The raw, unblurred photo never leaves the device.

This is the floor for any civic app that aggregates citizen photos. Without it, the app creates real-world harm and unbounded legal exposure.

## When this pattern applies

- Civic reporting apps (the [[../projects/cleanla-snap]] case)
- Real-estate / inspection apps that may incidentally capture bystanders
- Any user-generated content app where the user is photographing public space rather than their own friends
- Apps operating under GDPR, CCPA, or similar privacy regimes that treat biometric identifiers as protected

For an app that explicitly captures consenting subjects (Snapchat, Instagram, dating apps), this pattern is the *wrong* default — the friction would destroy the product.

## Pipeline (mobile reference implementation)

1. Capture frame via `react-native-vision-camera`'s frame processor (runs on the camera worklet thread, not the JS bridge)
2. Run **face detection** — Google ML Kit on Android, Apple Vision framework on iOS. Both are first-party, on-device, free.
3. Run **license plate detection** — ML Kit object detection with a license-plate-trained model, or a custom TensorFlow Lite model bundled with the app
4. For each detected bounding box, apply Gaussian blur via `expo-image-manipulator` (or a frame-processor plugin)
5. Hand the blurred result back to the JS layer for preview and submission
6. **The unblurred frame is discarded before the camera session closes.** It is never written to disk, never uploaded.

## UX rules that go with the pipeline

- **Honest header copy.** *"Photograph the issue, not the people. Faces and plates are auto-blurred — review before submitting."*
- **Always show the blurred preview** full-screen with explicit Retake and Submit buttons. Never auto-submit.
- **Block person-centric photos at the source.** If >40% of frame area is detected as human bodies (not just faces), block submission: *"This looks like a photo of people. Please reframe to focus on the issue."*

The body-area check matters because face blurring alone doesn't redact identity — body shape, clothing, posture, and context can still identify someone, particularly in encampment photos.

## Why on-device matters

- **No raw image ever touches the network.** No subpoena, breach, or rogue employee can recover the unblurred photo because it doesn't exist outside the device.
- **Performance.** ML Kit and Vision are tuned for real-time use. Server-side blurring would require uploading the raw photo, which is exactly what this pattern prevents.
- **Trust posture.** "We don't have your raw photos" is a stronger claim than "we blur them server-side."
- **Compliance.** Treating biometric features as never-collected (rather than collected-then-redacted) sidesteps several GDPR and CCPA obligations entirely.

## Failure modes

- **Missed detections.** Models miss small or angled faces. Mitigations: tight body-area check, public flag-and-hide moderation (see [[../projects/cleanla-snap]]), human review queue for flagged content.
- **Performance on older devices.** Frame processors can drop frames or overheat. Test on lowest-spec target devices.
- **Model drift.** New car designs, accessory styles, or face coverings break trained models over time. Plan for periodic model updates.

## Codified

This pipeline is mandatory for [[../projects/cleanla-snap]] v1 per [[../decisions/2026-05-on-device-face-blur-required]].

## Backlinks

- [[../projects/cleanla-snap]]
- [[../decisions/2026-05-on-device-face-blur-required]]
- [[civic-app-legal-considerations]]
- [[civic-app-patterns-and-failure-modes]]
