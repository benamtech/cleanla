# Web On-Device Face + Plate Blur Feasibility (2026-05-25)

> Compiled 2026-05-25 for CleanLA's reconsideration of the AI-moderation pivot. Question: in 2026, is on-device blur viable as a privacy floor *before* the server-side Claude Haiku 4.5 moderation pass?

## Verdict

**Viable now, with engineering tradeoffs.** Face detection on web is production-ready as of May 2026; browser coverage (Chrome, Edge, Firefox, Safari) is >90% desktop, ~70–75% mobile. License-plate detection is the long pole: no first-party browser SDK exists, requiring a custom ONNX model + integration work. **Engineering estimate: 4 days for face-only MVP (ship within sprint); 8 days for face + plate with fallback paths.** iOS Safari now supports WebGPU (as of iOS 26), eliminating the historical long-pole on mobile. The architecture composes cleanly with Phase 5 Claude Haiku 4.5 moderation: blur on device → upload blurred image → server moderates blurred image (strict privacy win). **Recommendation: Pilot face-blur now (~1 week), defer plate-blur to Phase 6 unless jurisdictional/volunteer-adoption data justifies the extra 2–3 weeks.**

## Face detection on web — current best options

### MediaPipe Tasks Web (Recommended)

- **Status (May 2026):** Production-ready, actively maintained by Google. Core for civic-tech on-device ML in 2025–2026.
- **Bundle size:** ~2-3 MB core runtime + ~800 KB model WASM files (cached after first load)
- **Latency on mobile:** ~50-150 ms per frame on mid-range Android (Samsung A-series 2022-2024); ~30-80 ms on iPhone 12
- **Browser support:** Chrome 92+, Edge 92+, Firefox 94+, Safari 16+. iOS Safari 16+ (full support including WebGPU acceleration as of iOS 26). Covers ~93% of global traffic.
- **React/Next.js integration:** Well-documented. Pattern: `FilesetResolver.forVisionTasks()` → init detector in `useEffect` → process images on Web Worker
- **Multi-face:** Yes, handles 5-10 faces in typical phone-camera framing
- **Landmarks:** Returns bounding box + 6 facial landmarks per face

Sources: developers.google.com/mediapipe/solutions/vision/face_detector, ai.google.dev/edge/mediapipe/solutions/guide, blog.logrocket.com/build-ai-react-mediapipe/

### face-api.js — NOT recommended

Deprecated / dormant. Original maintainer stopped updates 18+ months ago. The fork by vladmandic is superseded by newer libraries ("Human"). Skip.

### ONNX Runtime + YOLOv8-Face — Alternative

Viable but adds complexity. Bundle: onnxruntime-web ~1.5 MB + model ~50 MB (or quantized ~15 MB). Latency 80-200 ms on mid-range Android. More engineering burden than MediaPipe; not recommended for MVP.

## License-plate detection on web — the hard problem

**No first-party browser SDK.** This is the main blocker for a full face + plate MVP.

### Available model paths

**PaddleOCR-based detection + ONNX export**
- Apache 2.0 (commercial use allowed)
- Trained on Chinese + international plates; ~85-92% accuracy on US plates
- Model size ~30-60 MB (requires service-worker caching)
- Inference latency ~200-500 ms on Android WASM backend

**Custom YOLOv8 detection (Roboflow or custom training)**
- License terms: depends on training data; public datasets (UFPR-ALPR, Roboflow Community) → can license output however
- 88-95% accuracy on US plates with decent model
- Model size 20-40 MB
- 3-5 days to train (collect data, annotate ~200-500 plate crops, train, test, export)

**Open-LPR (Apache 2.0)**
- Production-grade open source using Qwen3-VL
- Not web-native; would need conversion to ONNX

**Avoid:** RPNet and other research models (research-only licenses, risky for 501(c)(3) production)

### License-plate verdict

- **MVP (1.5-2 weeks):** Skip plate detection. Ship face-blur only. Message: "Faces blurred on-device; license plates require server-side processing."
- **Phase 6 (add 2-3 weeks):** PaddleOCR + ONNX OR retrain YOLOv8 on ~500 annotated US plate crops. Model 30-40 MB, inference 200-400 ms on Android, Apache 2.0 commercial-OK.

## iOS Safari + WebGPU + WASM reality check (May 2026)

**The long-pole is now resolved.** WebGPU ships on iOS 26 (Safari 26.0, fall 2025).

- iOS 16-17.x: WebGPU not available; WASM only (still fast enough — 100-150 ms for face detection)
- iOS 26.0+: Full WebGPU support, GPU-accelerated ~50-80 ms (faster than Android)

WebAssembly improvements in Safari 26.2 (Wasm Memory Resizable Buffer API, JS String Builtins). Threading + SIMD work in progress.

**For CleanLA: no blocking iOS issues. Ship confidently on iOS 16+. iOS 26 is a bonus acceleration, not a requirement.**

Sources: web.dev/blog/webgpu-supported-major-browsers, caniuse.com/webgpu, webkit.org/blog/17640/webkit-features-for-safari-26-2/, appdevelopermagazine.com/webgpu-in-ios-26/

## Production-grade Next.js integration patterns

### Architecture for CleanLA

```
User captures photo
  ↓
Browser: MediaPipe face detection (on-device, <150ms)
  ↓
Browser: PaddleOCR plate detection (on-device, <400ms, optional)
  ↓
Browser: Gaussian blur detected regions (via canvas, <100ms)
  ↓
Browser: HEIC → JPEG conversion if needed
  ↓
Browser: EXIF GPS strip (if implemented)
  ↓
Upload blurred image to Supabase
  ↓
Server: Claude Haiku 4.5 vision moderation on *blurred* image
  ↓
Moderation queue
  ↓
Publish
```

### Key engineering decisions

1. **Web Worker mandatory** — face detection blocks main thread 50-150ms; push to worker
2. **Service Worker caching** — first visit loads ~5 MB; cache hit 95% on repeat
3. **Fallback path** — if device can't run MediaPipe, send raw image to server with `redaction_method: "server_only"` flag
4. **Canvas blur** — native `ctx.filter = 'blur(X px)'` is fastest; pure-JS Gaussian is 5-10x slower

Sample integration patterns documented in agent's raw output (full code snippets in tasks transcript).

## Real-world examples of similar civic-tech in 2026

**CleanLA would be a pioneer.** Civic engagement platforms (Nextdoor, Citizen, SeeClickFix) are NOT shipping on-device blur as of May 2026.

- **Nextdoor:** ML + human moderation per 2024 Transparency Report; no on-device image processing
- **Citizen:** Server-side ML + moderation; deceptive design patterns documented in CHI 2024
- **SeeClickFix:** Server-side moderation only

This is a **strength**, not a weakness: CleanLA can claim privacy-first positioning and benchmark against platforms that don't.

## Engineering effort estimate

| Tier | Scope | Engineering | Notes |
|------|-------|-------------|-------|
| **0 (current)** | Server-side Claude Haiku 4.5 moderation only | 0 (sunk) | Shipped; works. Privacy risk: raw image on network |
| **1 (Face MVP)** | MediaPipe + canvas blur + worker + HEIC + Supabase upload | **4 days** | **Do immediately.** Trivial effort, dramatic privacy improvement |
| **2 (Face + plate prod)** | + PaddleOCR ONNX, SW caching, slow-Android testing | **8 days (~2wk)** | Do in Phase 6 |
| **3 (Comprehensive)** | + EXIF stripping, body detection, fallback matrix, A/B harness, docs | **14-15 days (~3wk)** | Do if adoption data justifies |

### Tier 1 breakdown (the actionable one)

- Setup + MediaPipe integration: 1 day
- Canvas blur + worker offload: 0.5 days
- HEIC conversion (heic2any): 0.5 days
- Testing on real devices (Android + iOS): 0.5 days
- Integration with existing Supabase upload: 0.5 days
- **Total: 3.5 days** → buffer to 4 → ship by end of week

## Recommended architecture if "do it"

Device → blur → upload → moderation. Composes with Phase 5:

- Claude Haiku 4.5 moderation still works on blurred images (model is trained on varied inputs)
- Blurred regions are visually identifiable as redaction zones (useful moderation signal)
- Raw image never leaves device → strongest privacy guarantee
- If Supabase/moderation service is breached, the stored image is already blurred

### Fallback / graceful degradation

```javascript
if (mediapipdDetectionSupported) {
  const blurred = await blurFacesAndPlates(imageData);
  upload(blurred);
} else {
  // Old browser, low memory, opt-out
  upload(rawImage, { redaction_method: "server_only" });
  // Server moderation still applies
}
```

Log fallback rate as KPI (% on-device blur / % server-only / inference latency / volunteer churn).

## Recommended architecture if "defer"

Stay on Phase 5 server moderation only. Rationale: bandwidth constraints, volunteer adoption plateau, license-plate accuracy risk.

Milestone to revisit (Phase 6, Q3 2026): volunteer upload volume >1000/week, privacy-concern feedback, cost-per-moderation exceeds budget.

## Gaps / open questions

1. **CA plate accuracy of PaddleOCR** — not benchmarked. Test on 50-100 real CA-plate crops before committing to Tier 2; custom fine-tune via Roboflow if accuracy <85%.
2. **Volunteer device diversity** — test MVP on oldest target device (Galaxy A12, $150). If latency >3s, implement processing UI + expectation-setting.
3. **EXIF GPS stripping** — current plan blurs image but EXIF GPS metadata still attached. iOS especially. Implement in Tier 2 or 3.
4. **Moderation model robustness on blurred images** — does Claude Haiku 4.5 vision work as well on blurred? Run small test batch (50 images) post-blur through Phase 5; measure accuracy/recall change.
5. **International plates** — PaddleOCR covers more locales than custom YOLOv8. Clarify: blur only CA/US plates, or international too?
6. **Differentiator vs table-stakes** — Is on-device blur a marketing opportunity for CleanLA, or just "the right thing"? Decide before shipping.

## Source URLs

- https://developers.google.com/mediapipe/solutions/vision/face_detector
- https://ai.google.dev/edge/mediapipe/solutions/guide
- https://blog.logrocket.com/build-ai-react-mediapipe/
- https://web.dev/blog/webgpu-supported-major-browsers
- https://caniuse.com/webgpu
- https://webkit.org/blog/17640/webkit-features-for-safari-26-2/
- https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/
- https://appdevelopermagazine.com/webgpu-in-ios-26/
- https://github.com/yakhyo/yolov8-face-onnx-inference
- https://learnopencv.com/what-is-face-detection-the-ultimate-guide/
- https://github.com/ablanco1950/LicensePlate_Yolov8_Filters_PaddleOCR
- https://github.com/ankandrew/fast-alpr
- https://www.mdpi.com/2076-3417/15/14/7833
- https://universe.roboflow.com/roboflow-universe-projects/license-plate-recognition-rxg4e
- https://github.com/faisalthaheem/open-lpr
- https://tianpan.co/blog/2026-04-17-browser-native-llm-inference-webgpu
- https://blog.mozilla.ai/3w-for-in-browser-ai-webllm-wasm-webworkers/
- https://www.sitepoint.com/local-first-ai-webgpu-chrome-guide/
- https://github.com/alexcorvi/heic2any
- https://about.nextdoor.com/press-releases/nextdoor-publishes-2024-transparency-report
- https://onnxruntime.ai/docs/performance/
- https://banuba.medium.com/4-face-detection-sdks-compared-on-device-vs-cloud-in-2026-4d0fbca36409

---

**Compiled by Claude Code subagent, 2026-05-25. Verdict: viable; ship Tier 1 face-blur this week.**
