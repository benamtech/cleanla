# Tufte Visualization — Canon & 369 Cross-Walk

Edward Tufte's principles, applied through the 369 lens. The composition engine in `src/base/presentation/` is **already Tufte-grounded** — its rubric, trap catalog, and beam search compile Tufte's canon into executable form. This file is the source-of-truth reference for *why* the engine decides the way it does, and the diagnostic for any data display that lands in ADN — whether the engine produced it or a human authored it directly.

> **Heritage:** content here is the Tufte canon ([[tufte-data-ink]] in the wiki). Owned, embodied, and re-expressed in the 369 system — not borrowed. Re-brand, don't reinvent.

## Workflow — designing a new visualization

1. **Clarify the data story.**
   - What comparisons matter?
   - What is the key insight to communicate?
   - Who is the audience?

2. **Select the approach** using Tufte's compass:
   - High comparison need → **small multiples**.
   - Dense data → **sparklines** or a data table.
   - Time-series → line chart with a muted grid.
   - Part-to-whole → bar chart or table; **never a pie** beyond 5 slices.

3. **Design with data-ink in mind.**
   - Start minimal; add only what's necessary.
   - Every element must earn its ink.
   - Default to grayscale; reserve colour for encoding or emphasis.

4. **Run the engine** (if data is structured): `presentation(data, intent, medium)` returns up to 3 ranked compositions with their decision trace. The engine has already applied the trap gate, the rubric, and the beam search — its answer is Tufte-grounded by construction. See `engines.md` for the engine API.

5. **Apply the Tufte Test** — see `tufte-principles.md` § Quick Reference (7 questions) or `analytical-design.md` § Extended Test (14 questions, including analytical-design).

## Workflow — critiquing a visualization

1. **Check graphical integrity.**
   - Compute the Lie Factor if proportions seem off (`size in graphic / size in data`; target = 1.0).
   - Verify baselines and scales — especially zero baselines on quantitative axes.
   - Look for 3D distortion (banned outright in 369 — SVG internals exempt, but no 3D chart effects).

2. **Identify chartjunk.**
   - Decoration that does not encode data.
   - Heavy grids that compete with the data.
   - Pseudo-3D / shadows / gradients.
   - Moiré patterns (busy fills, cross-hatching).

3. **Evaluate data-ink ratio.**
   - What can be erased without losing data information? (Erase it.)
   - What is redundant?

4. **Suggest specific before/after improvements.** Tufte's mode is to redraw, not just diagnose.

## Quick checklist — does this display pass?

- [ ] Lie Factor ≈ 1.0 (no visual distortion)
- [ ] Maximum data-ink ratio (no wasted strokes)
- [ ] Zero chartjunk
- [ ] Clear, integrated labelling (words and numbers near the data they describe)
- [ ] Answers *"compared to what?"*
- [ ] Shows causality or mechanism where relevant
- [ ] Multivariate (not over-reduced to a single number)
- [ ] Reveals multiple levels of detail (micro + macro)
- [ ] Layering: primary data dominates, secondary recedes
- [ ] Appropriate data density (the *shrink principle*)

## Deep references (load on demand)

- **`tufte-principles.md`** — the 8-part core canon from *The Visual Display of Quantitative Information*: graphical excellence, graphical integrity (lie factor), data-ink ratio, chartjunk, small multiples, data density, multifunctioning elements, aesthetics & technique. Plus the Tufte Test (7 questions).
- **`analytical-design.md`** — extensions from *Envisioning Information* (1990), *Visual Explanations* (1997), *Beautiful Evidence* (2006): the **6 principles of analytical design**, sparklines, layering & separation, micro/macro, escaping flatland, range-frame / dot-dash plot, confections / parallelism / narrative, cause and effect. Plus the Extended Tufte Test (14 questions). Load when designing dashboards, dense displays, sparklines, or explanatory graphics.

## 369 cross-walk — where Tufte's canon lives in the codebase

Tufte's canon is not advice in ADN — it's the rubric. Every principle here has an executable home:

| Tufte principle | Where it lives |
|---|---|
| **Lie Factor / graphical integrity** | `src/base/presentation/traps.ts` — `truncated-baseline` (forces honest zero on quantitative axes), `chartjunk` (eliminates decoration), `channel-level-mismatch` (Bertin's law gate). Engine refuses to ship a lying chart. |
| **Data-ink ratio** | `src/base/presentation/rubric.ts` — `data-ink` is a top-priority rubric criterion. Candidates with lower data-ink rank lower. |
| **Chartjunk elimination** | The 369 design system itself: zero border-radius (except circular pins), no shadows/gradients/decoration, `1px solid #999` borders only, 8+12 colour token palette. Voice-lint enforces these at the catalogue level. See `visual-rules.md`. |
| **Small multiples** | `renderComposition()` in `src/base/presentation/render.tsx` — when a single chart's cardinality bracket exceeds limits, the engine emits small multiples. See also the [[scaling-fallacy]] wiki concept. |
| **Encoding (visual variables)** | `src/base/presentation/spec.ts` — the encoding block is a 369-native rebrand of Bertin's variables. The `channel-level-mismatch` trap enforces Bertin's law. |
| **Six principles of analytical design** | The composition engine's beam-search rubric is the executable form of these. "Compared to what?" is the comparison intent; "causality" surfaces in the decision trace; "multivariate" is enforced by the trap gate refusing over-reduction; integration of words+numbers+images is the catalogue's spec format. |
| **Sparklines** | `MeterSpec` / `Progress` (linear, no axes) are sparkline-shaped. The composition engine's `mode: 'sparkline'` is the line-chart-without-axes branch. |
| **Layering & separation** | The 369 colour palette is layered by value: navy / manila / grey / white separate by saturation as well as hue. The 1+1=3 trap is canon ([[albers-1-plus-1-equals-3]]). |
| **Micro/macro design** | `/369` itself is the worked example — the section dividers give the macro structure; the specimens give the micro detail. |
| **Range-frame / multifunctioning elements** | The axis-as-data trick lives in the composition engine's render layer; the `multifunction` rubric criterion rewards it. |

## Rules

- **The engine's verdict is canon.** When `presentation(data, intent, medium)` returns a winner, that *is* the Tufte-grounded answer. Do not second-guess by hand unless you can show the engine missed a trap or rubric criterion — and if you can, that's a bug filed against the engine, not a one-off override.
- **No 3D chart effects, ever.** Tufte's strongest sustained position.
- **No pie charts beyond ~5 slices.** Cardinality-bracket exceeded — switch to a sorted horizontal bar.
- **Default to grayscale.** Colour earns its place by encoding or emphasis, not decoration.
- **Show the data, then explain.** Words and numbers integrated with the display, not segregated below it.

## When to load this file vs. other references

- **`tufte.md`** (this file) — anything involving *data*: charts, graphs, dashboards, sparklines, tables, reports. Critique or design.
- **`engines.md`** — when you'll actually run `presentation()` or `resolveAny()` — the API + workflow lives there.
- **`visual-rules.md`** — for the underlying 369 spacing/colour/typography rules every display must obey.
- **`cards.md`** — when the data display is a card surface.
- **`tufte-principles.md` + `analytical-design.md`** — the deep canon; load for source-of-truth critique or when teaching the principles.
