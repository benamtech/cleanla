---
name: 369-design-system
description: Use for any ADN UI work — writing components, choosing spacing/colors/fonts, placing files in the 3/6/9 architecture, rendering data or entities as 369-native HTML, building or iterating on Card-primitive compositions, designing or critiquing data displays. Single source of truth for the ADN design system; loads deeper references on demand.
---

# 369 Design System

> **369 is a design philosophy that uses all the knowledge it has — the data-visualization world canon (Tufte, Bertin, Munzner, Wainer, Albers), GUI patterns, responsive design, layout theory — to create a fully modular and horizontal design system that can be used for anything. It helps build the best GUIs possible. Strict design and layout protocols ensure every render works on any screen device and shows information the best way possible every time. It helps build ADN; it produces the highest-quality data-visualization renders and layouts.**

The number 3 operates at three scales — visual primitives (3=BASE), program modules (6=PILLARS), UX orchestration (9=ROOF). No ambiguity, no "it depends" — every decision has a deterministic answer.

**Three corollaries that follow from the definition:**

1. **Best GUI for the input — every time.** Not "good UI" or "consistent UI." The engines (`presentation()`, `resolveAny()`) compute the *optimal* presentation under the rubric and the trap gate. Same input → same best output.
2. **Works on any screen device.** Responsive-by-construction. The 999px breakpoint, `repeat(auto-fit, minmax(...))` patterns, and `CARD_RESPONSIVE_COLLAPSE` rules are mechanisms; the principle is platform-universality.
3. **Source material is owned, not borrowed.** Tufte, Bertin, etc. are re-expressed in 369-native form. Don't write "per Tufte's data-ink"; write "the data-ink criterion in the 369 rubric." Rebrand, don't reinvent.

This skill is structured as a thin router plus on-demand references. **Read the 9 non-negotiable rules below for every invocation.** Load a reference from `references/` only when the work needs depth that the router does not provide. Canon references in `references/canon/` are teacher-pages and framework docs — load only when the work is explicitly about theory, history, or TUI/CLI design.

## The 9 non-negotiable rules

1. **Spacing — multiples of 3 ONLY.** Allowed: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48, 54, 60, 72, 84, 96, 120, 150, 180, 210, 240. Forbidden: 4, 5, 7, 8, 10, 14, 16, 20 — any non-multiple of 3 is a bug. Applies to padding, margin, gap, width, height, font-size, letter-spacing. SVG internals (`strokeWidth`, `r`, `cx`, `cy`, coordinates) are exempt.
2. **Border radius — zero, everywhere.** Enforced globally as `* { border-radius: 0 !important; }`. NEVER use `rounded-*` Tailwind classes. The ONE exception: circular SSM annotation pins (`border-radius: 50%`).
3. **Borders — `1px solid #999999` on every container.** No 2px. No thick lines. No colored borders except `success` / `warning`.
4. **Typography — Helvetica Neue eText Pro, 12px body, type scale {9, 12, 15, 18, 24, 30, 33, 36}.** UPPERCASE for all labels, headers, buttons, badges, window bars. Weights 400 (Roman, body) and 500 (Md, headings). No Eurostile, no SteelTongs, no serif anything (except SHOP boutique titles via `font-shop-serif`).
5. **Colors — 8 core tokens + 8 SSM pin colors. NEVER Tailwind defaults.** Core: navy `#001089`, grey `#999999`, white `#FFFFFF`, manila `#f8eac7`, amberSand `#c7a87d`, headerTop `#94a3d6`, headerCurrent `#b8dae8`, success `#228B22`, warning `#a60315`. (`gray-100`, `blue-500`, etc. are bugs.)
6. **Decoration — NONE.** No shadows, no gradients, no blur, no rounded corners, no icon libraries (Lucide, Heroicons). Text glyphs only: `★ ✓ ✕ → ← • [+] [−] [×] i`. SVG: `strokeLinecap="square"`. NO emoji on `/369` (platform fonts ignore design tokens).
7. **Run engines, don't guess.** For data → `presentation(data, intent, medium)` in `src/base/presentation/`. For entities → `resolveAny(component, intent)` in `src/base/resolver.ts`. Hand-picking a chart or hardcoding a component's values defeats the system.
8. **Same input → same output.** The system is deterministic. Run it twice; if the HTML differs, something is wrong. Show the decision trace for data compositions so the verdict is defended, not asserted.
9. **Composition — every screen has a hierarchy: BASE → PILLARS → ROOF.** A screen is not "a list of things in a grid." Decide: **PILLARS** (which 3–6 sections compose the screen — window bar, status strip, hero, body, action footer), **ROOF** (which section is the HERO and visually dominates; which are secondary; which are tertiary), **BASE** (which primitive — button, badge, table row, image — each section uses). Implement: sections separate by `border-b border-[#999999]`, NOT by whitespace gaps. The hero takes a deterministic share of the viewport (aspect ratio or fixed height). Body scrolls; window bar + status strip + footer are sticky via `shrink-0`. **If sections are floating in `grid gap-[N]` and visually competing, the composition has failed.** Empty states use minimum viable footprint (single row or aspect-matched to the slot they replace), never dominate.

## Which reference do I need?

| If the work is… | Load |
|---|---|
| A rules question ("is `padding: 10px` legal?", "what color for warning?") | `references/visual-rules.md` |
| A file-placement question ("where does `JobBoard.tsx` go?") | `references/architecture.md` |
| "I have data or an entity — give me the best 369 HTML" | `references/engines.md` |
| "Build a card with me / iterate on this card / audit this card" | `references/cards.md` (entering an iteration loop) |
| "Design or critique a chart, dashboard, sparkline, table, or any data display" | `references/tufte.md`; for deep canon also `references/tufte-principles.md` and `references/analytical-design.md` |
| "Build a TUI / terminal UI / CLI tool in 369 style" | `references/canon/tui-design.md`; for CLI conventions also `references/canon/unix-cli-principles.md` |
| "Tell me about the theory behind [teacher/concept]" (Tufte, Bauhaus, Rams, Vignelli, Swiss Style, sacred geometry) | `references/canon/<name>.md` |
| "Is this 369-compliant?" (quick check, no deep audit) | The 9 rules above suffice |

References cross-link to each other rather than restate — e.g., `cards.md` defers to `visual-rules.md` for spacing rules.

## Quick-reference patterns (no reference needed)

The six compositions used most often. Copy-paste into source.

**Window bar (program header):**
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

**Manila card (default tone):**
```tsx
className="bg-[#f8eac7] border border-[#999999] p-[9px]"
// hover: bg-[#b8dae8]
```

**Stacked-pillars portrait modal (the canonical card composition for detail views):**
```tsx
<aside className="flex h-[calc(100vh-36px)] w-full max-w-[420px] flex-col overflow-hidden border border-[#999999] bg-white">
  {/* 1. WINDOW BAR */}
  <div className="flex h-[27px] shrink-0 ...">...</div>
  {/* 2. STATUS STRIP — segmented, NOT floating chips */}
  <div className="flex h-[27px] shrink-0 items-stretch border-b border-[#999999]">...</div>
  {/* 3. HERO — aspect ratio anchors visual weight */}
  <div className="shrink-0 border-b border-[#999999]">
    <img className="block aspect-[3/4] w-full object-cover" />
  </div>
  {/* 4. BODY — scrolls; inner sections separate by border, not gap */}
  <div className="flex-1 overflow-auto">
    <div className="border-b border-[#999999] px-[9px] py-[9px]">...</div>
    <table className="w-full border-collapse">...</table>
  </div>
  {/* 5. ACTION FOOTER — sticky bottom */}
  <button className="shrink-0 border-t border-[#999999] ...">...</button>
</aside>
```

## Red flags — Stop and Fix

| Violation | Fix |
|-----------|-----|
| Any `px` value not divisible by 3 | Replace with nearest multiple of 3 |
| `rounded-*` Tailwind class | Remove — global reset enforces 0 |
| Tailwind default color (`gray-100`, `blue-500`, etc.) | Replace with a core token |
| Border wider than 1px or colored (except success/warning) | Use `1px solid #999999` |
| Drop shadow, gradient, or blur | Remove entirely |
| Icon library import (Lucide, Heroicons) | Use text glyphs |
| File in `src/components/` or `src/lib/` | Move to the correct layer (`src/base/`, `src/pillars/`, `src/roof/`) |
| Font size not a multiple of 3 | Use a scale value: 9, 12, 15, 18, 24, 30, 33, 36 |
| `letter-spacing` not a multiple of 3 | Use 0 or 3-em multiples (`tracking-[0.03em]`, NOT `tracking-wide`) |
| Emoji codepoint on `/369` (🔍 📝 etc.) | Replace with text glyph or append U+FE0E |
| Inline `gridTemplateColumns: 'repeat(N, 1fr)'` with N ≥ 2 | Use `repeat(auto-fit, minmax(<min>, 1fr))` so the grid collapses on mobile |
| Hand-picked chart type for structured data | Run `presentation(data, intent, 'desktop')` and use the winner |
| `<Card.Body columns={N}>` or `<Card.Body density="...">` | Hoist both props to `<Card>` root (compile error otherwise) |
| `[C]` / `[P]` shorthand in user-visible UI | Use full words: `[CLIENT]`, `[PRODUCER]` |
| `grid flex-1 gap-[N]` (grid with flex-grow and no `content-start`) | Default `align-content: normal` distributes rows to fill height → dead whitespace. Add `content-start` OR replace `grid` with sequential `<div>` stack separated by `border-b` |
| Empty-state placeholder with `p-[18px]` or larger padding | Empty states use minimum footprint (`h-[48px]` single row, or aspect-ratio that matches the slot it replaces); never dominate |
| `flex flex-wrap gap-[6px]` for badges + status that should be a single segmented bar | Use a single horizontal flex strip `h-[27px] items-stretch` with `border-l` between segments. Floating chips don't visually relate |
| Data table with `flex justify-between gap-[12px]` per row | Use a real `<table class="border-collapse">` with `<tr class="border-b border-[#999999]">`. Native tables hold dense layouts; flex sprawls |

## Six programs + bracket notation

| ID | Name | Route | Category |
|----|------|-------|----------|
| `home` | HOME | `/home` | core |
| `start` | START | `/start` | core |
| `ssm` | SPEC SHEET MANAGER | `/ssm` | tool |
| `jbs` | JOB BIDDING SYSTEM | `/jbs` | tool |
| `sps` | SECURE PAYMENT SYSTEM | `/sps` | system |
| `pow` | PROOF OF WORK | `/pow` | system |
| `shop` | SHOP | `/shop` | marketplace |

User-visible bracket notation: `[HOME] [START] [SSM] [JBS] [SPS] [POW] [SHOP] [CLIENT] [PRODUCER]`. Code/types/DB columns may use `[CLIENT]` / `[PRODUCER]` shorthand; user-visible UI must use the full words.

## Retirement notice

On **2026-05-24** this skill replaced four older skills:

- `369-design-philosophy`
- `369-input-output`
- `369-card-creator`
- `369-tufte-viz`

Their content is preserved in `references/` (split by job, no longer duplicated). If any tool, doc, or memory file still references the old names, update it to `369-design-system`. A rollback snapshot of the old skills lives at `~/.claude/skills/.retired-2026-05-24/` for one week.
