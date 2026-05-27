---
name: 369-design-system
description: Use for any ADN UI work — writing components, choosing spacing/colors/fonts, placing files in the 3/6/9 architecture, rendering data or entities as 369-native HTML, building or iterating on Card-primitive compositions, designing or critiquing data displays. Single source of truth for the ADN design system; loads deeper references on demand.
---

# 369 Design System

> **369 is a design philosophy that uses all the knowledge it has — the data-visualization world canon (Tufte, Bertin, Munzner, Wainer, Albers), GUI patterns, responsive design, layout theory — to create a fully modular and horizontal design system that can be used for anything. It helps build the best GUIs possible. Strict design and layout protocols ensure every render works on any screen device and shows information the best way possible every time. It helps build ADN; it produces the highest-quality data-visualization renders and layouts.**

The number 3 operates at three scales — visual primitives (3=BASE), program modules (6=PILLARS), UX orchestration (9=ROOF). No ambiguity, no "it depends" — every decision has a deterministic answer.

**Three corollaries that follow from the definition:**

1. **Best GUI for the input — every time.** Not "good UI" or "consistent UI." The engines (`presentation()`, `resolveAny()`) compute the *optimal* presentation under the rubric and the trap gate. Same input → same best output.
2. **Works on any screen device.** Responsive-by-construction. The 999px breakpoint, `repeat(auto-fit, minmax(...))` patterns, and `CARD_RESPONSIVE_COLLAPSE` rules are mechanisms; the principle is platform-universality. **Terminal is a first-class medium** alongside desktop/mobile — see Axiom 3 in `references/canon-axioms.md`.
3. **Source material is owned, not borrowed.** Tufte, Bertin, etc. are re-expressed in 369-native form. Don't write "per Tufte's data-ink"; write "the data-ink criterion in the 369 rubric." Rebrand, don't reinvent.

**Plus three canon-derived corollaries** (full treatment in `references/canon-axioms.md`):

4. **Constraints generate style.** Reunanen + Botz: severity of limitation ↔ elegance of solution. The 369 rules are *self-imposed* — they make ingenuity visible. A non-multiple-of-3 spacing is a violated invariant, not a "limitation."
5. **Same-input → same-output is structural.** Elm Architecture (Bubbletea MVU) enforces it; `presentation()` and `resolveAny()` MUST be pure functions. No `Date.now()`, no `Math.random()`, no env reads outside `medium`. If you can't run twice and get the same output, the function is broken.
6. **Domain-specific abstraction beats generic tools.** k9s models Kubernetes; lazygit models git; Emacs is a Lisp machine. A 369 PILLAR's name should disclose its domain (`<SSMCard>` not `<DetailView>`).

This skill is structured as a thin router plus on-demand references. **Read the 9 non-negotiable rules below for every invocation.** **Always-loaded:** the rules + corollaries above + `references/canon-axioms.md` (10 axioms derived from canon). **On-demand:** `references/visual-rules.md`, `engines.md`, `cards.md`, etc., plus `references/canon/` teacher-pages for theory/history/TUI depth.

## The 13 non-negotiable rules

Rules 1–9 are universal across all 369 work. Rules 10–13 apply when the medium is `terminal`. All 13 are derived (rules 1–9 from the original design philosophy; rules 10–13 from canon — see `references/canon-axioms.md` for full derivation).

1. **Spacing — multiples of 3 ONLY.** Allowed: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48, 54, 60, 72, 84, 96, 120, 150, 180, 210, 240. Forbidden: 4, 5, 7, 8, 10, 14, 16, 20 — any non-multiple of 3 is a bug. Applies to padding, margin, gap, width, height, font-size, letter-spacing. SVG internals (`strokeWidth`, `r`, `cx`, `cy`, coordinates) are exempt.
2. **Border radius — zero, everywhere.** Enforced globally as `* { border-radius: 0 !important; }`. NEVER use `rounded-*` Tailwind classes. The ONE exception: circular SSM annotation pins (`border-radius: 50%`).
3. **Borders — `1px solid #999999` on every container.** No 2px. No thick lines. No colored borders except `success` / `warning`.
4. **Typography — Helvetica Neue eText Pro, 12px body, type scale {9, 12, 15, 18, 24, 30, 33, 36}.** UPPERCASE for all labels, headers, buttons, badges, window bars. Weights 400 (Roman, body) and 500 (Md, headings). No Eurostile, no SteelTongs, no serif anything (except SHOP boutique titles via `font-shop-serif`).
5. **Colors — 8 core tokens + 8 SSM pin colors. NEVER Tailwind defaults.** Core: navy `#001089`, grey `#999999`, white `#FFFFFF`, manila `#f8eac7`, amberSand `#c7a87d`, headerTop `#94a3d6`, headerCurrent `#b8dae8`, success `#228B22`, warning `#a60315`. (`gray-100`, `blue-500`, etc. are bugs.)
6. **Decoration — NONE.** No shadows, no gradients, no blur, no rounded corners, no icon libraries (Lucide, Heroicons). Text glyphs only: `★ ✓ ✕ → ← • [+] [−] [×] i`. SVG: `strokeLinecap="square"`. NO emoji on `/369` (platform fonts ignore design tokens). **Sub-cell precision when needed:** for terminal medium, use the named algorithms — half-blocks `▀▄▌▐` (color doubling), eighth-blocks `▁▂▃▄▅▆▇█` / `▏▎▍▌▋▊▉█` (sub-cell bars), quadrants `▘▝▖▗▙▚▛▜▟▞` (2×2 pixel art), braille `⠀…⣿` (2×4 dots), sextants `🬀…🬵` (2×3 blocks). See canon-axioms.md Axiom 4 and `references/canon/unicode-art-extended.md`.
7. **Run engines, don't guess.** For data → `presentation(data, intent, medium)` in `src/base/presentation/`. For entities → `resolveAny(component, intent)` in `src/base/resolver.ts`. Hand-picking a chart or hardcoding a component's values defeats the system. **`medium: 'terminal'` is a peer, not a fallback** — every component should support it (Axiom 3). The terminal path emits BSU/ESU (`CSI ? 2026 h` / `l`) around every frame for sync output (Axiom 5).
8. **Same input → same output.** The system is deterministic. Run it twice; if the HTML differs, something is wrong. Show the decision trace for data compositions so the verdict is defended, not asserted. **Structural enforcement:** engines are pure functions of `(data, intent, medium)`. No `Date.now()`, no `Math.random()`, no env reads outside `medium`. The Elm Architecture proves this is achievable (Axiom 2).
9. **Composition — every screen has a hierarchy: BASE → PILLARS → ROOF.** A screen is not "a list of things in a grid." Decide: **PILLARS** (which 3–6 sections compose the screen — window bar, status strip, hero, body, action footer), **ROOF** (which section is the HERO and visually dominates; which are secondary; which are tertiary), **BASE** (which primitive — button, badge, table row, image — each section uses). Implement: sections separate by `border-b border-[#999999]`, NOT by whitespace gaps. The hero takes a deterministic share of the viewport (aspect ratio or fixed height). Body scrolls; window bar + status strip + footer are sticky via `shrink-0`. **If sections are floating in `grid gap-[N]` and visually competing, the composition has failed.** Empty states use minimum viable footprint (single row or aspect-matched to the slot they replace), never dominate.

**Rules 10–13 — TUI-specific (from `references/canon/tui-design.md` T1–T7, distilled):**

10. **Terminal protocol baseline.** A 369 TUI assumes: truecolor (24-bit), Kitty keyboard protocol (`CSI > 1 u` on startup, `CSI ? u` to query), synchronized output (mode 2026), focus reporting (mode 1004), bracketed paste (mode 2004). Detect + degrade gracefully. Honor `NO_COLOR`. Restore terminal on exit (`?1049l ?25h SGR-0`) — **mandatory** in signal handlers (SIGINT, SIGTERM, SIGHUP).
11. **Internationalization is pre-display, not render-time** (Axiom 8). Normalize text to NFC. Run BiDi through fribidi or HarfBuzz **before** emit. Use utf8proc or fish-shell-style wcwidth, not glibc's. For complex scripts where pure terminal rendering fails, fall back to the image plane (Sixel / Kitty graphics).
12. **Rule of Silence in production output** (Axiom 7, ESR Rule 11). Successful operations produce no output unless `--verbose`. Progress to stderr; data to stdout. Pipeable. Honor `NO_COLOR`. Honor `DO_NOT_TRACK=1` for any optional telemetry.
13. **Modular composability, not monolithic state** (Axiom 9, Plan 9 Rio). Separate concerns: text I/O, graphics I/O, input streams — independent layers. Don't model "terminal state" as a single monolith; treat each surface (window bar, body, footer) as its own composable PILLAR.

## Canon master index

The complete canon library (30 files, ~612KB) lives under `references/canon/`. For a topical map of all entries plus task-based and provenance navigation, load `references/canon/INDEX.md`. For meta-context about confidence levels and epistemic limits, load `references/canon/knowledge-bounds.md`.

## Which reference do I need?

| If the work is… | Load |
|---|---|
| "Why does 369 work this way? What's the foundational reasoning?" | `references/canon-axioms.md` — 10 axioms inherited from canon (constraint aesthetics, structural determinism, terminal-as-peer, etc.) |
| A rules question ("is `padding: 10px` legal?", "what color for warning?") | `references/visual-rules.md` |
| A file-placement question ("where does `JobBoard.tsx` go?") | `references/architecture.md` |
| "I have data or an entity — give me the best 369 HTML" | `references/engines.md` |
| "Build a card with me / iterate on this card / audit this card" | `references/cards.md` (entering an iteration loop) |
| "Design or critique a chart, dashboard, sparkline, table, or any data display" | `references/tufte.md`; for deep canon also `references/tufte-principles.md` and `references/analytical-design.md` |
| "Build a TUI / terminal UI / CLI tool in 369 style" | `references/canon/tui-design.md`; for CLI conventions also `references/canon/unix-cli-principles.md` |
| "Draw an ASCII chart / terminal data display / pick the right Unicode glyph" | `references/canon/ascii-composition.md` — full glyph vocabulary + exact bar/sparkline/histogram/scatter algorithms + layout templates |
| "Which TUI framework should I pick? Textual vs Ratatui vs Bubbletea vs Ink vs …" | `references/canon/tui-frameworks-complete.md` — 18 frameworks across 7 languages with selection guide |
| "What ANSI escape code / mouse mode / Sixel / Kitty protocol does this terminal support?" | `references/canon/terminal-capabilities.md` — full protocol reference (CSI/OSC/DCS, color tiers, sync output, graphics) |
| "What command-line tool exists for ASCII banners / image→terminal / terminal recording?" | `references/canon/ascii-tools.md` — 21 tools indexed (figlet, chafa, jp2a, asciinema, etc.) |
| "What's the codepoint for [glyph]? Which Unicode block holds [thing]?" | `references/canon/unicode-art-extended.md` — 11 Unicode blocks, 1500+ codepoints catalogued |
| "Tell me about the history / culture of ANSI / ASCII / BBS art" | `references/canon/ascii-ansi-art.md` — full history, art groups, techniques, archives |
| "How does an image→ASCII algorithm actually work? (luminance, dithering, shape vectors)" | `references/canon/ascii-rendering-algorithms.md` — 8 algorithms with implementation snippets |
| "What's the historical lineage of TUIs?" | `references/canon/tui-history.md` — RTTY → smart terminal → curses → ANSI/BBS → renaissance |
| "What TUI interaction / layout / accessibility patterns should I follow?" | `references/canon/tui-patterns.md` — modal vs modeless, command palette, focus mgmt, accessibility, animation, live-coding |
| "Why do good TUIs feel good? Nielsen heuristics, cognitive ergonomics, information design, affordances without hover, error UX, onboarding, time-perception, contrast?" | `references/canon/tui-ux-design.md` — the TUI ↔ design ↔ UX intersection. Strategic design-principles layer. |
| "How do I handle CJK / RTL / emoji / complex scripts in a terminal?" | `references/canon/tui-i18n.md` — wcwidth, BiDi (TR9), East Asian Width (TR11), emoji ZWJ, IME, font matrix |
| "Tell me about the demoscene / cracktros / 64K intros / demoparties" | `references/canon/demoscene.md` — groups (Future Crew, Farbrausch), parties (Assembly, Revision, Lovebyte), size-coding, trackers |
| "How did WordStar / VisiCalc / WordPerfect / Norton Commander / lazygit / btop / etc. shape TUI conventions?" | `references/canon/historical-tuis.md` — 20 landmark TUIs with patterns invented + verdicts |
| "Cite an academic source on demoscene / TUI / ASCII art (Reunanen, Botz, Tasajärvi, UNESCO)" | `references/canon/tui-academic.md` — peer-reviewed scholarship + BibTeX citations |
| "Where can I find [ANSI artpack / BBS artifact / specific group's archives]?" | `references/canon/archives-deep.md` — 26+ archives, 50+ named artists, parallel traditions |
| "What did Bill Joy / Knuth / Kernighan / McGugan say about TUI design? Museum catalog refs?" | `references/canon/museums-oral-history.md` — CHM, YUCoM, Bletchley, Smithsonian, Bitsavers + pull-quotes |
| "What changed in TUI ecosystem 2024-2026? (Bubble Tea v2, Ratatui no-std, Toad, Ghostty)" | `references/canon/tui-modern-2026.md` — current versions, active maintainers, validations |
| "What about NAPLPS / RIPscrip / PRESTEL / Minitel / Mode 7 / MouseText / Plan 9 Rio?" | `references/canon/niche-text-traditions.md` — 17 parallel text-art traditions |
| "What does this canon NOT know? Where are the epistemic limits?" | `references/canon/knowledge-bounds.md` — meta-document: confidence levels, gaps, what only direct outreach could close |
| "Accessibility / mobile / WASM / analytics / keybinding / AI-TUI patterns 2024–26 status" | `references/canon/tui-modern-gaps.md` — the 6 gaps from tui-modern-2026.md, filled |
| "Cite MIT / CMU / Stanford / UCSC / ProQuest / JSTOR / IEEE TUI research" | `references/canon/academic-extended.md` — extended database survey + access-barrier notes |
| "Who do I contact to clarify [demoscene history / framework roadmap / artist intent]?" | `references/canon/practitioner-network.md` — verified-active 2024–26 practitioners + contact paths |
| "Who won the ANSI/ASCII compo at [demoparty + year]?" | `references/canon/demoparty-results.md` — Assembly / Revision / Evoke / Lovebyte / Demosplash chronological results |
| "What's the exact escape code for [obscure operation]?" | `references/canon/escape-codes-complete.md` — exhaustive CSI/OSC/DCS/APC + Kitty/Sixel/iTerm2 extensions |
| "What FIGlet font / banner generator should I use?" | `references/canon/banner-fonts.md` — 3,000+ fonts across 8 systems with 369 recommendations |
| "Who is [ANSI artist handle]? Which group / era / works?" | `references/canon/artist-roster.md` — 150+ chronologically indexed practitioners 1989–2026 |
| "Polish / Hungarian / Russian / Czech demoscene? Hugi / Imphobia / PAiN diskmags?" | `references/canon/regional-scenes-diskmags.md` — Eastern European scenes + scene-magazine archives |
| "Pre-1990 BBS art? Razor 1911 / THG / cDc / Phrack / Apple II ANSI?" | `references/canon/pre-1995-archives.md` — pre-organizational era, hacker zines, warez group lineage |
| "Brandur Leach / Julia Evans / WordGrinder / aerc / yazi / Dwarf Fortress interviews?" | `references/canon/final-sweep.md` — open-access academic + practitioner blogs + niche tool catalog |
| "Tell me about the theory behind [teacher/concept]" (Tufte, Bauhaus, Rams, Vignelli, Swiss Style, sacred geometry) | `references/canon/<name>.md` |
| "Is this 369-compliant?" (quick check, no deep audit) | The 13 rules above suffice (1–9 universal, 10–13 terminal-medium) |

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
| **TUI emits successful-operation message without `--verbose`** | Rule of Silence (Axiom 7). Print on errors only; silent on success |
| **TUI frame without BSU/ESU wrapping** | Wrap each frame in `CSI ? 2026 h` / `CSI ? 2026 l` for synchronized output (mode 2026). Tearing is a UX failure |
| **TUI doesn't restore terminal on exit** | Add `?1049l ?25h \e[0m` in SIGINT/SIGTERM/SIGHUP handlers. Mandatory |
| **Engine reads `Date.now()` or `Math.random()`** | Engines are pure functions of `(data, intent, medium)`. Inject the clock/RNG; do not read inside the engine (Axiom 2) |
| **Hand-coded image-to-terminal rendering** | Use a named algorithm (half-block / eighth-block / quadrant / braille / sextant) from `references/canon/ascii-composition.md`. Don't reinvent |
| **BiDi text rendered directly to terminal** | Pre-shape via fribidi / HarfBuzz **before** emit (Axiom 8). Normalize to NFC. Terminal cannot reorder |
| **glibc `wcwidth()` used for column math** | Use utf8proc or fish-shell-style wcwidth instead. glibc lags Unicode + breaks on emoji ZWJ |
| **Component name discloses no domain (`<DetailView>`, `<FormGrid>`)** | Generic abstraction — Axiom 9 red flag. Rename to model the domain (`<SSMCard>`, `<JobBidForm>`) |

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
