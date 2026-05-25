# CleanLA Webapp Status - May 25, 2026, Phase 6 Code-Complete

Phase 6 (Sharing) is implemented, lint and typecheck clean, committed and pushed. Verification requires a Vercel deploy.

This note updates `memory/webapp-status-5-25-2026-11-31am.md`.

---

## What Was Built

Three new files, one config update:

- **`src/app/s/[id]/page.tsx`** — Public spot detail page. Server component, no auth. Uses `createAdminClient()` directly. 404s if spot is hidden or has no approved media. Two layouts: cleanup (before + after side by side, green border on after) and problem-spot (single photo). Generates X Card metadata via `generateMetadata` — `twitter:card: summary_large_image`, title as `"[Category] · [Neighborhood] · CleanLA"`, `og:image` pointing to the OG route.

- **`src/app/api/og/spot/[id]/route.tsx`** — 1200×630 card image via `next/og` (`ImageResponse`, built into Next.js — no separate package). Three-strip layout: navy top bar (CLEANLA wordmark + category), photo middle, empty navy bottom 80px reserved for X's title overlay. Cleanup variant splits frame 50/50 before/after; problem-spot fills full width. 404 on hidden/unapproved. Loads Inter Bold from Google Fonts at request time (Satori can't use system fonts).

- **`src/features/sharing/ShareActions.tsx`** — Client component. POST ON X (`x.com/intent/post?text=...&url=...`), SHARE (Web Share API, feature-detected, mobile only), COPY LINK (clipboard, 2s COPIED! state). All 369-compliant buttons.

- **`webapp/next.config.ts`** — Added `images.remotePatterns` for `*.supabase.co/storage/v1/object/public/**` (required for `next/image` to render Supabase storage URLs).

Latest commit: `1952576` — local and remote in sync.

---

## X Card Behavior (baked into the implementation)

- `twitter:title` renders as an **overlay on the bottom of the card image** — not below it
- `og:description` is set for SEO / Slack / iMessage but X ignores it
- Bottom 80px of OG image is intentionally empty (dark navy) so X's title text is legible
- Intent URL is `https://x.com/intent/post` — not the legacy `twitter.com/intent/tweet`
- Old Card Validator is dead — preview by pasting URL into X compose window

---

## Verification Checklist (requires Vercel deploy)

- [ ] `/s/[id]` renders both layout variants with correct fields
- [ ] `/s/[hidden-id]` returns 404
- [ ] `/api/og/spot/[id]` returns 1200×630 image, both variants
- [ ] Paste live URL into X compose — card image appears with title overlay
- [ ] POST ON X opens `x.com/intent/post` with pre-filled text + URL (external browser)
- [ ] SHARE triggers native share sheet on iOS Safari / Android Chrome
- [ ] COPY LINK works on desktop, shows COPIED! for 2s

---

## Current Stack State

All 7 migrations live. Phases 1–6 code-complete. Phase 7 (Scale + Launch) is next after Phase 6 verification passes on a real deployment.

## Useful Files

- `webapp/src/app/s/[id]/page.tsx` — public spot page
- `webapp/src/app/api/og/spot/[id]/route.tsx` — OG card image
- `webapp/src/features/sharing/ShareActions.tsx` — share buttons
- `webapp/next.config.ts` — Supabase image domain config
- `webapp/src/features/spots/display.ts` — `formatCategory()`, `formatStatus()`, `formatVerification()` used throughout
