# CleanLA Phase 6.5 License-Plate Blur Plan

Phase 6.5 adds on-device license-plate detection + blur on top of the Phase 5.5 face-blur pipeline. Composes inside the same Web Worker; runs after face detection on the same image. The blurred output continues to flow through Phase 5 Claude Haiku 4.5 moderation as defense in depth.

This phase is the Tier 2 follow-on to Phase 5.5. It assumes 5.5 (face-only) is shipped and stable. License-plate detection is the harder half: no first-party SDK exists; a custom ONNX model is required.

Architecture and tradeoffs: `wiki/decisions/2026-05-on-device-blur-restored.md`. Feasibility study: `raw/0016-web-on-device-blur-feasibility.md`.

## Objective

Bring license plates under the same on-device-redaction guarantee that Phase 5.5 established for faces. Restore the full original on-device-blur principle (faces AND plates redacted before any data leaves the device) for the now-web stack.

## Non-goals (Tier 2)

- Replacing the Phase 5.5 face pipeline (additive only)
- Replacing or removing Phase 5 server-side moderation
- EXIF GPS stripping (Tier 3)
- Body-area >40% rejection (Tier 3)
- Plate text recognition / OCR (we detect bounding boxes; we do not read the plate)

## Inputs from Phase 5.5

Phase 5.5 must already provide:

- Working Web Worker (`webapp/public/workers/blur-worker.js`) with MediaPipe FaceDetector
- Canvas Gaussian blur helper (`webapp/src/lib/blur/blur-canvas.ts`) that can blur arbitrary bounding boxes
- Capability detection (`detect-support.ts`)
- HEIC handler
- Fallback path with `redaction_method: "server_only"` flag
- `spot_media` schema columns: `redaction_method`, `redacted_face_count`, `inference_ms`, `fallback_reason`

This plan EXTENDS those primitives; it does NOT rebuild them.

## Model selection — empirical decision required first

**The model choice is a Phase 6.5 decision, not pre-determined.** Three candidates from `raw/0016`:

### Option A: PaddleOCR plate-detection ONNX export

- License: Apache 2.0
- Trained on Chinese + international plates; ~85-92% accuracy on US plates per published benchmarks
- Model size: 30-60 MB
- Inference latency: 200-500 ms on Android WASM backend, faster with WebGPU
- Pro: off-the-shelf; well-maintained; no training required
- Con: not US-plate-optimized; need to validate on California plates specifically

### Option B: Custom YOLOv8-detection fine-tuned on CA plates

- License terms: whatever we license the output as (Apache 2.0 acceptable if training data is)
- Accuracy on US/CA plates: 88-95% with 500-1000 annotated crops
- Model size: 20-40 MB
- Inference latency: 150-400 ms on Android
- Pro: best accuracy if we put in the work
- Con: 3-5 days of training overhead (data collection, annotation, training, ONNX export)
- Tooling: Roboflow's UI reduces training overhead to 1-2 days

### Option C: Open-LPR (Apache 2.0)

- Uses Qwen3-VL (7B parameter model, designed for server)
- Not web-native — would require significant conversion work
- Likely too large for browser deployment
- **Reject** for this phase

### Decision criteria

Run a benchmark BEFORE committing to a path:

1. Collect 50-100 real California plate images (varied: passenger, commercial, motorcycle, partial, angled, low-light)
2. Run PaddleOCR ONNX on the set; measure precision + recall
3. If PaddleOCR accuracy ≥85% on CA plates → ship Option A (~3 days remaining engineering)
4. If <85% → commit to Option B (custom YOLOv8 + Roboflow fine-tune, ~5 days remaining engineering)

Write a follow-on dated decision (`wiki/decisions/2026-XX-plate-detection-model.md`) once benchmarked. Document the chosen model, its training data, license terms, and the accuracy measurement.

## Dependencies to add

```json
{
  "dependencies": {
    "onnxruntime-web": "^1.x"
  }
}
```

Plus the chosen model file in `webapp/public/models/plate-detector.onnx` (or hosted on a CDN with service-worker caching).

No Anthropic / Supabase changes. No new migration (the existing `redacted_face_count` column gets a companion).

## New constants

- `PLATE_BLUR_SIGMA_PX = 18` — same Gaussian radius as faces, for visual consistency
- `PLATE_BBOX_PADDING_PX = 8` — slightly smaller than face padding (plates have hard edges, less context)
- `MIN_PLATE_CONFIDENCE = 0.45` — detection threshold (slightly lower than faces because false positives blur something harmless, false negatives leak identity)
- `MAX_PLATE_INFERENCE_MS = 2000` — separate budget from face detection (total budget is now 5s end-to-end face + plate)

## Migration

```sql
-- webapp/supabase/migrations/20260XXXxxxxxx_phase6_5_plate_metadata.sql

ALTER TABLE spot_media
  ADD COLUMN redacted_plate_count INT,
  ADD COLUMN plate_inference_ms INT;

-- Update redaction_method check constraint to allow new value
ALTER TABLE spot_media
  DROP CONSTRAINT IF EXISTS spot_media_redaction_method_check;

ALTER TABLE spot_media
  ADD CONSTRAINT spot_media_redaction_method_check
  CHECK (redaction_method IN (
    'on_device_face_blur_v1',
    'on_device_face_and_plate_blur_v1',
    'server_only'
  ));

-- Backfill existing 'on_device_face_blur_v1' rows: they stay on v1 (face-only)
-- New submissions after Phase 6.5 ship use 'on_device_face_and_plate_blur_v1'
```

## Data flow

Same shape as Phase 5.5, with plate detection added after face detection:

```
File → ImageBitmap
  ↓
Worker: MediaPipe FaceDetector.detect()  [Phase 5.5, unchanged]
  ↓
Worker: onnxruntime-web PlateDetector.detect()  [Phase 6.5 NEW]
  ↓
Worker: merge bounding boxes; pad each appropriately
  ↓
Main thread: canvas Gaussian blur all detected regions
  ↓
HEIC handler [unchanged]
  ↓
Upload blurred image with metadata:
  - redaction_method: "on_device_face_and_plate_blur_v1"
  - redacted_face_count: N
  - redacted_plate_count: M
  - inference_ms: face_ms (existing)
  - plate_inference_ms: plate_ms (NEW)
```

Fallback semantics are unchanged from Phase 5.5:

- If face detection works but plate detection fails → mark `redaction_method: "on_device_face_blur_v1"` (downgrade to Phase 5.5 behavior); upload face-blurred image
- If face detection fails entirely → existing Phase 5.5 fallback (server-only)
- If both work → "on_device_face_and_plate_blur_v1"

This means: Phase 6.5 NEVER degrades the user experience below Phase 5.5. Worst case is silent downgrade to face-only; the face guarantee is preserved.

## New files

```
webapp/src/lib/blur/
  detect-plates.ts                # onnxruntime-web inference wrapper
  merge-bboxes.ts                 # combines face + plate boxes for canvas blur
  plate-benchmark.ts              # runs accuracy test on CA plate fixtures (dev tool)

webapp/public/workers/
  blur-worker.js                  # MODIFY: load plate model alongside face model;
                                   #          detect both in sequence

webapp/public/models/
  plate-detector.onnx             # the chosen model file (or hosted on CDN)

webapp/test/fixtures/ca-plates/   # 50-100 real CA plate test images (anonymized)
  plate-001.jpg
  ...
  plate-XXX.jpg
  ground-truth.json               # bounding-box annotations for accuracy testing
```

## Files to modify

```
webapp/src/lib/blur/blur-faces.ts
  - Rename to webapp/src/lib/blur/blur-media.ts (or keep + add blur-plates.ts wrapper)
  - Compose face + plate detection results before blurring
  - Update return type to include both face + plate metadata

webapp/src/lib/blur/types.ts
  - Add PlateDetection, BlurResult.redactedPlateCount, etc.

webapp/src/lib/blur/types.ts (already exists per Phase 5.5)
  - Extend BlurResult interface

webapp/src/features/reports/ReportSheet.tsx
  - Update "Processing image..." copy to reflect dual detection
  - Surface plate count alongside face count in any submit-time UI

webapp/src/features/reports/constants.ts
  - Add PLATE_BLUR_SIGMA_PX, PLATE_BBOX_PADDING_PX, MIN_PLATE_CONFIDENCE,
    MAX_PLATE_INFERENCE_MS

webapp/src/app/api/reports/route.ts
  - Accept redacted_plate_count + plate_inference_ms in multipart body
  - Pass through to spot_media insert

webapp/src/features/spots/types.ts
  - Add redactedPlateCount, plateInferenceMs to SpotMedia type
```

## Step-by-step implementation order

1. **Run the CA plate benchmark** (Days 1-2)
   - Collect 50-100 real CA plate images (volunteer-sourced, fully anonymized, manually annotated)
   - Wire up `plate-benchmark.ts` as a Node-side script (not browser, just for measurement)
   - Test PaddleOCR ONNX → measure precision/recall on the set
   - **If ≥85%: commit to Option A. Skip to step 3.**
   - If <85%: proceed to step 2.

2. **Train custom YOLOv8 plate detector via Roboflow** (Days 3-5; only if Option B)
   - Upload labeled CA-plate dataset to Roboflow
   - Use Roboflow's YOLOv8 training template
   - Export to ONNX
   - Re-run benchmark; target ≥88% accuracy
   - Document the training run + dataset in `wiki/decisions/2026-XX-plate-detection-model.md`

3. **Build onnxruntime-web inference wrapper** (Day after model is ready, 1 day)
   - `detect-plates.ts` wraps onnxruntime-web
   - Accepts ImageData → returns `{ boxes, confidences, inference_ms }`
   - Includes WebGPU/WASM backend feature detection (reuse `detect-support.ts`)
   - Caches loaded model in memory for repeated detections

4. **Extend the Web Worker** (0.5 days)
   - Add new message types: `{ action: 'init_plates' }`, `{ action: 'detect_plates', imageData }`
   - Run BOTH face and plate detection in sequence on the same imageData
   - Return combined results in a single message back to main thread

5. **Update canvas blur for combined regions** (`merge-bboxes.ts`, 0.5 days)
   - Pad face and plate boxes with their respective padding constants
   - Sort/merge overlapping boxes (e.g., if a face is close to a plate)
   - Pass merged list to existing `blur-canvas.ts`

6. **Update main entry** (`blur-media.ts`, 0.5 days)
   - Wrap face + plate flow with proper fallback semantics
   - If plate detection times out (>2s) → continue with face-only result, downgrade `redaction_method` to `on_device_face_blur_v1`
   - If plate detection errors → same downgrade
   - Log `plate_fallback_reason` separately so we can distinguish "plate failed" from "everything failed"

7. **Migration + API + types** (0.5 days)
   - Apply Phase 6.5 migration locally; verify schema
   - Update `/api/reports` to accept new fields
   - Update TypeScript types

8. **Service Worker caching for plate model** (0.25 days)
   - Add plate model file to SW precache list
   - On install: fetch + cache (one-time 30-60 MB hit)
   - Cache-first strategy

9. **Update ReportSheet** (0.25 days)
   - "Processing image..." remains
   - Optional: brief copy update to mention plates ("Blurring faces and license plates...")

10. **Real-device testing** (1 day)
    - Re-run Phase 5.5 testing checklist with the extended pipeline
    - Add: photos with visible CA plates (5-10 angles, lighting conditions)
    - Add: photos with both faces AND plates (verify both get blurred)
    - Add: photos with neither (verify metadata `redacted_plate_count: 0`)
    - Verify Phase 5 Claude moderation still works on the doubly-blurred image
    - Measure end-to-end latency on Galaxy A-series

## Testing checklist

- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] Unit tests for `merge-bboxes.ts` (overlap, padding, empty cases)
- [ ] Plate benchmark on fixture set ≥ chosen accuracy threshold
- [ ] Manual: photo with one plate, no faces → 1 box blurred, metadata correct
- [ ] Manual: photo with one face + one plate → 2 boxes blurred, metadata correct
- [ ] Manual: photo with neither → no boxes blurred, `redaction_method: "on_device_face_and_plate_blur_v1"`, both counts 0
- [ ] Manual: photo with a motorcycle plate (smaller, harder) → detected ideally
- [ ] Manual: photo with a partial/angled plate → graceful (low confidence → no false positive, or detected if confident)
- [ ] Manual: plate model times out → silent downgrade to `on_device_face_blur_v1`; report still submits
- [ ] Manual: Galaxy A-series end-to-end latency under 5s
- [ ] Manual: iPhone 12 end-to-end latency under 4s
- [ ] Manual: Phase 5 moderation queue accepts doubly-blurred submissions normally
- [ ] KPI: `redaction_method` distribution after first 100 submissions matches expectations

## KPI logging additions

Surface in `/admin/moderation`:

- `redacted_plate_count` distribution (sanity check: very high counts indicate bad input)
- `plate_inference_ms` p50 / p95 (alert if p95 > 3s)
- Plate fallback rate (% of submissions that successfully blurred face but failed plate)
- Combined `face_and_plate_blur_v1` % vs `face_blur_v1` % vs `server_only` %

If `face_and_plate_blur_v1` is consistently <80% of submissions, investigate device-diversity issues or model size.

## Privacy-policy delta

Update `webapp/PRIVACY-POLICY-DRAFT.md` (or the live `/privacy` page) to reflect that the on-device redaction path now covers both faces AND license plates:

- "Detected faces are blurred on your device" → "Detected faces and license plates are blurred on your device"
- Add a note about plate detection: "We detect license plate locations but do not read or store plate numbers."
- Update the fallback-path description: if both face and plate detection fail, server-side moderation runs as Phase 5.5 fallback already documents. If only plate fails (face works), the photo is still substantially redacted on-device — the user-facing copy can downplay this distinction.

## Out of scope for Phase 6.5

- Plate OCR / text recognition (we detect bounding boxes only)
- International plate detection beyond what the chosen model already covers
- Detection of plate decals, parking permits, registration stickers (out of scope; treat as part of the plate region)
- EXIF GPS stripping (Tier 3)
- Body-area rejection (Tier 3)
- Detection of other identifying objects (mailbox numbers, vehicle decals with names, etc.) — Phase 5 server-side moderation handles broader identification risks

## Rollout

1. Run benchmark → commit to model
2. Ship to local + dev environment
3. Run testing checklist
4. Deploy to staging Vercel
5. Test on real devices with plate-containing photos
6. Merge to main + production
7. Monitor KPIs for first 2 weeks
8. If plate-detection fallback rate consistently >15%, investigate model swap

## Estimated engineering time

| Step | Time | Notes |
|------|------|-------|
| 1. CA plate benchmark | 2 days | Includes collecting 50-100 plate images |
| 2. Train YOLOv8 (Option B only) | 3 days | Skip if Option A passes accuracy |
| 3. onnxruntime-web wrapper | 1 day | |
| 4. Extend Web Worker | 0.5 days | |
| 5. Merge bboxes helper | 0.5 days | |
| 6. Update main entry | 0.5 days | |
| 7. Migration + API + types | 0.5 days | |
| 8. SW caching | 0.25 days | |
| 9. ReportSheet copy | 0.25 days | |
| 10. Real-device testing | 1 day | |
| **Total — Option A (PaddleOCR)** | **~6.5 days** | |
| **Total — Option B (custom YOLOv8)** | **~8 days** | |

Realistic finish: 1.5-2 weeks from Phase 5.5 ship date, depending on which model wins the benchmark. Founder + AI coding partner cadence.

## Dependencies on other work

- **Phase 5.5 (on-device face blur) must be shipped and stable.** Phase 6.5 is additive on top.
- **CA plate test fixtures must be collected and annotated** before benchmark runs. ~2-4 hours of human work to collect; can be done in parallel with Phase 5.5 development.
- **A new dated decision** (`wiki/decisions/2026-XX-plate-detection-model.md`) must be written documenting the model choice + accuracy measurement, before declaring 6.5 shipped.

## Privacy claim restored

When Phase 6.5 ships and is the default path for supported browsers, the full original on-device-blur principle (from the 2026-05-24 [`on-device-face-blur-required`](../wiki/decisions/2026-05-on-device-face-blur-required.md) decision) is operationally true on the web stack: **raw photos with identifiable faces AND identifiable license plates never leave the user's device**.

This is the strongest possible privacy claim for a civic-tech photo tool. No US civic-tech competitor (Nextdoor, Citizen, SeeClickFix) ships this in 2026.
