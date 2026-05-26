# CleanLA Phase 5.5 On-Device Blur Plan

Phase 5.5 adds an on-device blur pass BEFORE the existing Phase 3 upload + Phase 5 server-side Claude Haiku 4.5 moderation. Tier 1 ships face detection + blur via MediaPipe Tasks Web. Tier 2 (Phase 6 fast-follow) adds license-plate detection via PaddleOCR/YOLOv8 ONNX. Tier 3 (later) adds EXIF GPS stripping + body-area detection + comprehensive fallback telemetry.

This phase is scoped at **Tier 1 only**. Plate detection is its own follow-on doc.

Architecture and tradeoffs: `wiki/decisions/2026-05-on-device-blur-restored.md`. Feasibility study + code patterns: `raw/0016-web-on-device-blur-feasibility.md`.

## Objective

Make "raw photos never leave your device" true on supported browsers (~93% of global traffic, including iOS Safari 16+). Phase 5 Claude Haiku 4.5 moderation stays as defense in depth, running on the blurred image. Unsupported devices fall back to existing server-only moderation with a logged `redaction_method` flag.

## Non-goals (Tier 1)

- License-plate detection (Tier 2 / Phase 6 fast-follow)
- EXIF GPS stripping (Tier 3)
- Body-area >40% rejection (Tier 3)
- A/B testing harness for adoption-delta measurement (Tier 3)
- Replacing or removing Phase 5 server-side moderation (kept as defense in depth)

## Inputs from earlier phases

Phase 3 (Report MVP) provides:
- Authenticated POST `/api/reports` accepting media
- `spot_media` table with `capture_source`, `client_captured_at`, etc.
- Supabase Storage upload pattern

Phase 3.5 (Verification) provides:
- `verification_status` enum on `spot_media`
- Server-side verification algorithm (this phase does not change it)

Phase 5 (AI Moderation) provides:
- `webapp/src/lib/moderation/moderate-media.ts` server-side Claude Haiku 4.5 vision pass
- `/admin/moderation/` queue UI
- Moderation runs on whatever image is uploaded — no change needed for Phase 5.5

## Dependencies to add

```json
{
  "dependencies": {
    "@mediapipe/tasks-vision": "^0.10.x",
    "heic2any": "^0.0.4"
  }
}
```

No Anthropic SDK change. No Supabase change. No migration.

## New constants

- `BLUR_SIGMA_PX = 18` — Gaussian blur radius for redacted regions (canvas `filter: blur(18px)`)
- `BLUR_BBOX_PADDING_PX = 12` — padding around detected face bounding box before blurring (handles hairline / chin)
- `MIN_FACE_CONFIDENCE = 0.5` — MediaPipe detection confidence threshold
- `MAX_INFERENCE_MS = 3000` — if inference exceeds 3s, fall through to server-only path and log
- `MODEL_CDN_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"` — model asset path (pin to specific version in production)

## Data flow

```
User taps "Submit" in ReportSheet
  ↓
Client: File → Image bitmap
  ↓
Client (Web Worker): MediaPipe FaceDetector.detect(imageData)
  ↓ (timeout 3s, fallback below)
Client: Canvas Gaussian-blur detected regions
  ↓
Client: HEIC → JPEG via heic2any if needed
  ↓
Client: Upload BLURRED image to Supabase Storage with metadata:
        - redaction_method: "on_device_face_blur_v1"
        - redacted_face_count: N
        - inference_ms: X
  ↓
POST /api/reports (existing Phase 3 endpoint, no change)
  ↓
Server: Phase 3.5 verification (existing, no change)
  ↓
Server: Phase 5 Claude Haiku 4.5 moderation on blurred image (existing, no change)
  ↓
Moderation queue → publish per existing flow
```

Fallback path (device doesn't support MediaPipe / inference timeout / explicit user opt-out):

```
Upload RAW image to Supabase with metadata:
  - redaction_method: "server_only"
  - inference_ms: null
  - fallback_reason: "unsupported_browser" | "inference_timeout" | "user_optout"
  ↓
Phase 5 moderation runs as today (it's the only redaction layer for this submission)
```

## New files

```
webapp/public/workers/blur-worker.js          # Web Worker; loads MediaPipe WASM, runs detection
webapp/src/lib/blur/
  blur-faces.ts                                # Main entry: file → blurred file
  blur-canvas.ts                               # Canvas Gaussian blur helper
  heic-convert.ts                              # heic2any wrapper with feature detection
  detect-support.ts                            # browser + WebGPU/WASM capability detection
  types.ts                                     # BlurResult, FallbackReason, etc.
webapp/public/service-worker.js                # OR extend existing SW: cache MediaPipe WASM + model
webapp/src/features/reports/BlurPreview.tsx    # OPTIONAL: show user the blurred preview before submit
```

## Files to modify

```
webapp/src/features/reports/ReportSheet.tsx
  - Hook blur pass into submit flow (before existing upload)
  - Show "Processing image..." state during inference
  - Surface fallback message if device unsupported: "Server-side redaction will apply"

webapp/src/features/reports/constants.ts
  - Add BLUR_SIGMA_PX, BLUR_BBOX_PADDING_PX, MIN_FACE_CONFIDENCE, MAX_INFERENCE_MS

webapp/src/app/api/reports/route.ts
  - Accept new metadata fields: redaction_method, redacted_face_count, inference_ms, fallback_reason
  - Pass-through to spot_media insert (no validation logic change in Tier 1)

webapp/supabase/migrations/20260525xxxxxx_phase5_5_blur_metadata.sql
  - ALTER TABLE spot_media:
      ADD COLUMN redaction_method TEXT
        CHECK (redaction_method IN ('on_device_face_blur_v1', 'server_only'))
        NOT NULL DEFAULT 'server_only';
      ADD COLUMN redacted_face_count INT;
      ADD COLUMN inference_ms INT;
      ADD COLUMN fallback_reason TEXT;
  - Backfill existing rows with redaction_method = 'server_only' (everything pre-5.5)

webapp/next.config.ts
  - Confirm next/og or worker bundling allows .wasm loads from public/ or CDN

webapp/src/features/spots/types.ts
  - Add Tier 1 metadata fields to SpotMedia type
```

## Step-by-step implementation order

1. **Add deps + migration first** (smallest surface area, easy to revert)
   - `npm install @mediapipe/tasks-vision heic2any`
   - Write + apply Phase 5.5 migration locally
   - Verify schema + types regenerate

2. **Build capability detection** (`detect-support.ts`)
   - Check `navigator.gpu` (WebGPU)
   - Check `WebAssembly.Memory.prototype.toResizableBuffer` (Safari 26.2+ feature)
   - Check `crossOriginIsolated` (required for SharedArrayBuffer / WASM threads)
   - Return `{ supported: boolean, backend: 'webgpu' | 'wasm' | 'none', reason?: string }`
   - Unit test: 4-5 simulated environments

3. **Build the Web Worker** (`public/workers/blur-worker.js`)
   - Vanilla JS (not bundled by Next.js)
   - importScripts MediaPipe Tasks Web from CDN
   - Two message types: `{ action: 'init' }`, `{ action: 'detect', imageData, requestId }`
   - On init: resolve FilesetResolver, create FaceDetector with `runningMode: 'IMAGE'`, `minDetectionConfidence: MIN_FACE_CONFIDENCE`
   - On detect: run `detect()`, post back `{ requestId, detections: [{ boundingBox, score, ... }], inference_ms }`
   - Handle errors → post `{ requestId, error: 'load_failed' | 'detection_failed' }`

4. **Build canvas blur helper** (`blur-canvas.ts`)
   - Input: ImageBitmap + array of bounding boxes
   - Output: Blob (JPEG, quality 0.85)
   - Implementation:
     ```ts
     const canvas = new OffscreenCanvas(width, height);
     const ctx = canvas.getContext('2d')!;
     ctx.drawImage(bitmap, 0, 0);
     for (const box of paddedBoxes) {
       // crop region → blur → paste back
       ctx.filter = `blur(${BLUR_SIGMA_PX}px)`;
       ctx.drawImage(canvas, box.x, box.y, box.w, box.h, box.x, box.y, box.w, box.h);
     }
     return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
     ```
   - Padding: expand each bbox by `BLUR_BBOX_PADDING_PX` clamped to image bounds

5. **Build HEIC handler** (`heic-convert.ts`)
   - Feature-detect: if file MIME is `image/heic` or `image/heif`, convert via heic2any to JPEG first
   - Wrap in try/catch; if conversion fails, return original file + log fallback reason `heic_conversion_failed`
   - Mobile Safari iOS may also flag HEIC via filename extension — check both MIME and extension

6. **Build main entry** (`blur-faces.ts`)
   - Public API: `async function blurFacesInFile(file: File): Promise<BlurResult>`
   - Returns: `{ blob, faceCount, inferenceMs, redactionMethod }` OR `{ blob: file, fallbackReason }`
   - Initialize worker singleton on first call
   - Steps:
     1. Convert HEIC if needed
     2. Decode to ImageBitmap
     3. Post to worker with 3s timeout (`Promise.race` with timeout that returns fallback)
     4. If detections returned: blur on canvas, return blurred blob
     5. If no faces detected: still return original blob with `redactionMethod: "on_device_face_blur_v1"` and `faceCount: 0` (the pass ran; nothing to blur)
     6. If error: return file unchanged with fallback reason

7. **Wire into ReportSheet** (`ReportSheet.tsx`)
   - Insert blur step BEFORE existing Supabase upload call
   - Show inline "Processing image..." spinner state
   - On success: continue submit with blurred blob + metadata
   - On fallback: continue submit with raw file + fallback metadata; show small notice "Server-side redaction applied"

8. **Optional: BlurPreview component** (skip in Tier 1 if it adds friction; revisit Tier 3)
   - If shipped: render the blurred preview after detection, before submit
   - Adds a "Retake" affordance per the original on-device-blur decision's mandatory UX

9. **Service Worker caching** (or extend existing SW if Phase 6 added one)
   - Cache `cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@*/wasm/*` on install
   - Cache the model files on first detection (cache-first strategy)
   - Bust on Phase 6 SW version bump

10. **Add metadata to `/api/reports`** (`route.ts`)
    - Accept new fields in the multipart body
    - Pass-through to `spot_media` insert (the migration allows nullable + default)
    - No validation in Tier 1; Tier 3 may add sanity checks

11. **Update types** (`spots/types.ts`)
    - Add the four new fields to `SpotMedia`

## Testing checklist

Local + staged checks before pushing:

- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] Unit tests for `detect-support.ts` (5 simulated env cases)
- [ ] Unit tests for `blur-canvas.ts` (deterministic blur of known bbox)
- [ ] Manual: Chrome desktop — upload a photo with one face → verify blurred output uploads with `redacted_face_count: 1`
- [ ] Manual: Chrome desktop — upload a photo with zero faces → verify metadata `redaction_method: "on_device_face_blur_v1"`, `redacted_face_count: 0`, raw pixels untouched
- [ ] Manual: Chrome desktop — upload a HEIC file → verify converted to JPEG and blurred
- [ ] Manual: iOS Safari 16+ on a real iPhone — verify the full flow (camera capture → blur → upload)
- [ ] Manual: Android Chrome on Galaxy A-series (oldest realistic) — measure inference latency; if >3s consistently, surface the loading state more prominently
- [ ] Manual: Firefox desktop — verify fallback path triggers cleanly (Firefox may have older MediaPipe support)
- [ ] Manual: Old browser simulation (block `navigator.gpu`) — verify `redaction_method: "server_only"` upload path works
- [ ] Manual: 3s timeout — artificially throttle CPU; verify fallback kicks in and report still submits
- [ ] Manual: Phase 5 moderation queue at `/admin/moderation` — verify a blurred submission still gets a moderation verdict (not blocked by the blur)

## Fallback strategy

Three fallback paths, all converge on "still submit; log reason":

1. **`unsupported_browser`** — `detect-support.ts` returns `supported: false`. Skip worker init; upload raw with metadata `redaction_method: "server_only"`, `fallback_reason: "unsupported_browser"`.
2. **`inference_timeout`** — Worker doesn't respond in 3s. Cancel; upload raw with `fallback_reason: "inference_timeout"`. (Tier 3 may add retry-with-smaller-image.)
3. **`detection_failed`** — Worker error (model load fail, decode fail). Upload raw with `fallback_reason: "detection_failed"` and the error string.
4. **`heic_conversion_failed`** — HEIC file couldn't be converted. Upload raw (the original HEIC); server-side moderation may still process it depending on Phase 5 input handling. Log reason.

In all fallback cases, Phase 5 moderation still runs server-side; the report still appears in the moderation queue. The user-visible UX is identical except for a small notice ("Server-side redaction applied").

## KPI logging

Add to `spot_media` (per migration above) and surface in `/admin/moderation` for ongoing monitoring:

- `redaction_method` distribution (`on_device_face_blur_v1` % vs `server_only` %)
- `redacted_face_count` distribution (sanity check; very high counts may indicate bad input)
- `inference_ms` p50 / p95 (alert if p95 > 5s, indicates device-diversity problem)
- `fallback_reason` distribution (alert if `unsupported_browser` > 10% of submissions; may indicate need for older-browser support)

## Privacy-policy / user-facing copy updates

Coordinate with Phase 7 launch prep. Once Phase 5.5 is shipping to production:

- Privacy policy can claim: "Your raw photos are processed on your device. Only redacted images leave your phone, except in cases where your browser doesn't support on-device processing — in which case we apply server-side redaction before publishing."
- Capture surface copy: "Faces are blurred on your device before upload. Server-side AI reviews every submission as a safety net."
- Distinguish supported vs fallback in onboarding if relevant.

## Out of scope for Phase 5.5 (Tier 1)

- License plate detection (Tier 2 — write a follow-on decision when PaddleOCR/YOLOv8 path is picked, after CA-plate accuracy benchmarking)
- EXIF GPS stripping (Tier 3 — separate concern but should bundle with Tier 2)
- Body-area >40% rejection (Tier 3 — adds MediaPipe Pose detection)
- A/B testing harness (Tier 3 — measure adoption delta)
- Older-browser ML polyfill (out of scope; fallback to server-only is acceptable)

## Rollout

1. Ship to local + dev environment
2. Run testing checklist
3. Deploy to staging Vercel (`benamtech/cleanla` preview deploy)
4. Test on real iOS + Android devices (real phones, not emulators — webcam emulators don't expose the WebGPU behavior we need)
5. Merge to main + production Vercel deploy
6. Monitor KPIs in `/admin/moderation` for first week
7. If fallback rate >10%, file a Tier 3 follow-up to add older-browser support
8. Update privacy policy + user-facing copy as part of Phase 7 launch prep

## Estimated engineering time

| Step | Time |
|------|------|
| 1. Deps + migration | 0.5 days |
| 2. Capability detection + tests | 0.5 days |
| 3. Web Worker | 0.5 days |
| 4. Canvas blur helper + tests | 0.5 days |
| 5. HEIC handler | 0.5 days |
| 6. Main entry (blur-faces.ts) | 0.5 days |
| 7. Wire into ReportSheet | 0.5 days |
| 8. Service Worker caching | 0.5 days |
| 9. API metadata + types | 0.25 days |
| 10. Real-device testing (iOS + Android) | 0.5 days |
| **Total** | **~4.25 days** |

Realistic finish: end of a 4-day sprint with buffer. Founder + AI coding partner cadence.
