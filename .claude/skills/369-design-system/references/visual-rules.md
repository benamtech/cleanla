# 369 Visual Rules — Full Reference

Canonical 3/6/9 visual rule set. The router `SKILL.md` states the 8 non-negotiables; this file expands each rule with the full tables, exceptions, and rationale.

## Spacing

Every `px` value — padding, margin, gap, width, height, font-size, letter-spacing — must be a multiple of 3.

**Allowed:** 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48, 54, 60, 72, 84, 96, 120, 150, 180, 210, 240

**Forbidden:** 4, 5, 7, 8, 10, 14, 16, 20 — any non-multiple of 3 is a bug.

**SVG exemption:** Internal SVG attributes (`strokeWidth`, `r`, `cx`, `cy`, coordinate values) are exempt — they describe diagram geometry, not UI spacing.

**Padding modes (Card primitive):** `tight: 3`, `normal: 6` (default), `loose: 9`. See `CARD_PADDING_MODES` in `src/base/spec.ts`.

## Colors

### C1 — Structure (4 colors)

| Color | Hex | Tailwind/CSS | Usage |
|-------|-----|-------------|-------|
| Navy | `#001089` | `text-navy`, `bg-[#001089]` | Primary text, buttons, active headers |
| Grey | `#999999` | `border-grey`, `text-[#999999]` | ALL borders, muted text |
| White | `#FFFFFF` | `bg-white` | Backgrounds, content areas |
| Manila | `#f8eac7` | `bg-manila`, `bg-[#f8eac7]` | Cards, hover, selected, focus |

### C2 — Surface (3 colors)

| Color | Hex | Tailwind/CSS | Usage |
|-------|-----|-------------|-------|
| Amber Sand | `#c7a87d` | `bg-manila-dark` | Separators, dividers, muted hover, avatar bg |
| Header Top | `#94a3d6` | `bg-header-top` | Minimized headers, persistent bars |
| Header Current | `#b8dae8` | `bg-header-current` | Breadcrumbs, inactive buttons |

### C3 — Semantic (2 colors)

| Color | Hex | Usage |
|-------|-----|-------|
| Success | `#228B22` | Approved, verified |
| Warning | `#a60315` | Errors, cancel |

### C4 — Annotation Pins (8 colors, SSM workspace only)

These cycle in order for spec pins. **Never use for UI chrome.**

| Pin | Hex | Text |
|-----|-----|------|
| Pin 1 | `#BF0A30` | `#fff` |
| Pin 2 | `#1A2F8F` | `#b8dae8` |
| Pin 3 | `#008080` | `#b2ffff` |
| Pin 4 | `#7B2D8E` | `#d4a5e0` |
| Pin 5 | `#FF6600` | `#fff` |
| Pin 6 | `#228B22` | `#fff` |
| Pin 7 | `#8B4513` | `#fff` |
| Pin 8 | `#DC143C` | `#fff` |

**Never use** Tailwind's default scales (`gray-100`, `blue-500`, etc.).

### Card tones (9 — for `<Card tone="...">`)

`CARD_TONE_TO_COLOR` in `src/base/spec.ts`:

| Tone | Hex | Use case |
|---|---|---|
| `manila` | `#f8eac7` | Default cards; neutral surfaces |
| `navy` | `#001089` | Program-identity chrome (Wall, SSM, modal hero) — use sparingly |
| `stickyGold` | `#c9a94e` | Warm secondary chrome |
| `antiqueGold` | `#8b7327` | Warm tertiary chrome |
| `headerTop` | `#94a3d6` | Persistent bars, summary headers |
| `headerCurrent` | `#b8dae8` | Breadcrumbs, inactive selectors |
| `success` | `#228B22` | Verified, approved, positive |
| `warning` | `#a60315` | Errors, cancellation, negative |
| `program` | (per-pillar) | Active program chrome (auto-resolves from `PROGRAM_IDENTITY`) |

### Program-identity palette (`PROGRAM_IDENTITY` in `src/base/spec.ts`)

🔒 **LOCKED 2026-04-27, Round 11.** Do NOT modify without explicit user approval and a new round documented in `docs/memory/color-theory-marketplace-research.md`.

| Program | engaged / next-engaged / next / sleeping |
|---|---|
| HOME | `#001089` / `#94a3d6` / `#b8dae8` / `#f8eac7` (system tokens — HOME IS the system anchor) |
| START | `#A01818` / `#CC8170` / `#f8eac7` / `#FFFFFF` |
| SSM | `#F5DFA8` / `#F8EAC7` / `#FBF2DD` / `#FFFFFF` (warm manila substrate) |
| JBS | `#0F3D8C` / `#6C82A4` / `#B2B6B5` / `#f8eac7` |
| SPS | `#006B6B` / `#70A494` / `#AEC4AA` / `#f8eac7` |
| POW | `#2A2A2D` / `#7C776B` / `#BAB29A` / `#f8eac7` (monochrome exception) |
| SHOP | `#FFFFFF` / `#E5DFD3` / `#F4F0E5` / `#FFFFFF` (bleached gallery substrate) |

## Border radius

`* { border-radius: 0 !important; }` — global, enforced with `!important`. No `rounded-*` classes. Ever.

**The ONE exception:** circular SSM annotation pins (`border-radius: 50%`) — functional markers, not decorative. `Card.Avatar` (circular initials) also takes this exception.

## Borders

Every container has `border: 1px solid #999999`. No 2px. No thick lines. No colored borders except `success` / `warning` chrome.

## Typography

**Aesthetic reference:** McMaster-Carr — utilitarian Helvetica Neue with tight spacing, 12px body, no decoration. ADN adapts this to the 3/6/9 grid.

### Type scale

| Scale | Size | Common usage |
|-------|------|-------------|
| Secondary label | 9px | Badges, timestamps, sublabels |
| Body (default) | 12px | Text, buttons, inputs |
| Window bar title | 15px | Headers, card titles |
| Section header | 18px | Amounts, sections |
| Large title | 24px | Card titles |
| Hero | 30-33px | Page titles |
| Date display | 36px | DateTimeWindow |

### Fonts (1 family only)

| Font | Weight | Role |
|------|--------|------|
| HelveticaNeueeTextPro-Roman | 400 | Body text, inputs, labels, links, sublabels, metadata |
| HelveticaNeueeTextPro-Md | 500 | Headings, emphasized labels, window bars, buttons, CTA, logo wordmark |

**Fallback stack:** `HelveticaNeueeTextPro-Roman, Arial, Helvetica, sans-serif` (body) / `HelveticaNeueeTextPro-Md, Arial, Helvetica, sans-serif` (headings)

**Transform:** UPPERCASE for all labels, headers, buttons, badges, window bars.

**Info icon:** Georgia italic, 12px bold, navy — unboxed (no border/background).

**Letter-spacing:** 0 or 3-em multiples (`tracking-[0.03em]`). NEVER `tracking-wide` (Tailwind default 0.025em).

**No Eurostile, no SteelTongs.** Previously considered, removed. All typography is Helvetica Neue Text Pro — including the ADN wordmark.

**SHOP exception:** boutique titles use `font-shop-serif` (italic lowercase). Limited to artwork/product titles in the SHOP storefront.

## Layout constants

| Constant | Value | Notes |
|----------|-------|-------|
| Window bar height | 27px | All states (active, open, minimized) |
| Main header | 48px normal / 18px collapsed | AppShell top bar (halved from 99/33 — 369 rule) |
| Logo | 48×48px | Both desktop and mobile (halved from 99) |
| Sidebar (desktop) | 270px | Fixed |
| Sidebar (mobile) | 300px | Overlay |
| Content padding | 18px | Inner content |
| Outer padding/gap | 9px | AppShell |
| Mobile breakpoint | 999px | Tailwind `md:` overridden to 999px |
| Card header | 27px | ALL card headers — never 15px compact |
| Card grid default | 3 columns | Rule of thirds — never 4-col with headers |

**Responsive collapse (Card primitive — deterministic):** at <999px, grids collapse 3-col→1-col, 2-col→1-col, 6-col→3-col; padding collapses `loose`→`normal` (`tight` stays `tight`). Hard-coded in `CARD_RESPONSIVE_COLLAPSE`.

## Icons

No icon libraries (Lucide, Heroicons, Feather, etc.). Use text glyphs only:

```
★ ✓ ✕ → ← • [+] [−] [×] i
```

**Corner indicator vocabulary (strict):** `[x]` close (top-right only), `[−]` collapse / `[+]` expand (paired), `★` pin (top-left only), `i` info (top-left only), `⋮` overflow menu (top-right only). No invention.

**SVG:** `strokeLinecap="square"` (not round).

**NO emoji on `/369`** — platform fonts ignore design tokens. Append U+FE0E to force text presentation if absolutely necessary.

## Transitions

All hover/active: `0.1s ease`. No exceptions except progress bars (`0.3s`).

## No decorative elements

No drop shadows. No gradients. No blur. No rounded corners. The aesthetic is **utilitarian software** — McMaster-Carr, Windows 95, Photoshop, CAD tools. Dense, information-first, zero ornamentation.

## Common patterns (full reference)

The five most-used patterns also appear inline in the router `SKILL.md`. The full set:

**Window bar:**
```tsx
className="h-[27px] flex items-center px-[9px] bg-[#94a3d6]"
// text: text-[15px] text-white font-bold uppercase
```

**Button:**
```tsx
className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#001089]"
// hover: bg-[#f8eac7]
```

**Input:**
```tsx
className="w-full bg-white border border-[#999999] px-[6px] py-[6px] text-[12px] text-[#001089] focus:outline-none focus:border-[#001089] focus:bg-[#f8eac7]"
```

**Label:**
```tsx
className="block text-[12px] font-bold text-[#001089] uppercase mb-[6px]"
```

**Badge:**
```tsx
className="px-[6px] py-[3px] text-[9px] font-bold uppercase"
```

**Manila card:**
```tsx
className="bg-[#f8eac7] border border-[#999999] p-[9px]"
// hover: bg-[#b8dae8]
```

**Micro label (UPPERCASE, 9px):**
```tsx
className="text-[9px] uppercase tracking-[0.03em] text-navy/60"
```

**Stat value (24px bold):**
```tsx
className="text-[24px] font-bold text-navy"
```

## Triple-source sync rule

Colors, spacing, and layout constants exist in THREE files:

1. `src/base/tokens.ts` — **canonical source**
2. `tailwind.config.ts` — Tailwind theme
3. `src/app/globals.css` — CSS custom properties

**Change one = change all three.** Build will NOT catch mismatches.

## Rules sync hook

A PostToolUse hook in `.claude/settings.json` catches rule drift before it compounds. On any Edit/Write to a rule-recording file, `.claude/hooks/rules-sync-check.sh` scans the diff and checks each rule against `src/base/spec.ts`.

**Scoped files (Phase 1):**

- `tasks/lessons.md`
- `CLAUDE.md` (root)
- `src/**/*.memory.md`
- `docs/memory/DESIGN-RULES.md`

**Extraction patterns:**

- H3 headings containing MUST / NEVER / ALWAYS / ONLY / EVERY / ALL
- `**Rule:**` blocks
- Bold-prefixed bullets with strong modal verbs

**Classifier output:**

| Status | Meaning |
|--------|---------|
| CONFLICT | Contradicts `spec.ts` — matches a known supersession pattern, declares a rounded border-radius, or uses a non-369 px value in spacing context |
| ALIGNED | References a live `spec.ts` constant (`CARD_MODES`, `SCALE_PROTOCOL`, `ILLEGAL`, `CARD_HEADER_COLORS`, …) or matches an existing DESIGN-RULES.md section |
| NEW | Rule isn't in `spec.ts` yet — candidate for Phase 2 codification |

The hook prints a box-formatted summary to the transcript, details CONFLICT/ALIGNED inline, and tallies NEW as a count. Every CONFLICT suggests `/reconcile-rules` to spawn an agent.

**Supersession catalog** lives in `.claude/hooks/rules-sync-check.mjs` — the `SUPERSESSIONS` array pairs an old-rule regex with the canonical replacement and a `spec.ts` reference. Add to it when a rule gets replaced; the hook will then flag anywhere the old form reappears.

**Phase 1 limits:** grep-based, warn only, no auto-writes. Phase 2 will generate `docs/memory/DESIGN-RULES.md` from `spec.ts`, bi-directional sync, and extend scope to this skill file.

## Voice-lint enforcement

`scripts/voice-lint.mjs` enforces these rules on the `/369` catalog — no bare hex, every px `1` or a multiple of 3, the specimen count self-checking against the file count. Rule 7 forbids emoji codepoints; Rule 8 enforces responsive grid patterns.
