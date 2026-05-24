---
name: 369-design-system
description: Use this skill whenever you generate UI, write CSS, render data, build a chart, design a component, choose a colour, pick a font size, place a border, or visualise information. It encodes ADN's 369 design system — every UI decision routes through the rules below; every chart routes through the canon-driven decision tree. Triggers on any frontend, design, visualisation, or "make it look good" task. Output must pass the SELF-CHECK at the bottom before shipping.
---

# 369 — A Distributable Design System

This file is a portable rule book. Drop it into any project's `.claude/skills/369-design-system/SKILL.md` (or paste the contents at the bottom of `CLAUDE.md`) and every Claude agent working in that project will follow these rules when building UI or rendering data.

The 369 system descends from a sixty-year visualisation grammar canon — Bertin (1967), Tufte (1983), Wilkinson (1999), Cleveland & McGill (1984), Mackinlay (1986), Wickham (2010), Bostock & Heer (2011), Satyanarayan (2017), Munzner (2014) — bound to a closed design substrate (Bauhaus / Swiss Style / Rams / Vignelli). It is **deterministic**: same input → same output. It is **defensible**: every decision traces to a named principle. It is **enforceable**: violations are bugs, not preferences.

---

## How to install in your project

1. Save this file as `.claude/skills/369-design-system/SKILL.md` in your repo.
2. Add one line to your `CLAUDE.md` (or `README.md` if you don't have CLAUDE.md):

   ```markdown
   ## Design system
   This project uses the 369 design system. Before any UI, design, or data work,
   invoke `369-design-system`. Output that violates the rules in that skill is
   a bug.
   ```

3. That's it. Any Claude agent in this repo will now use 369 by default.

---

## The TEN RULES — every UI decision routes through these

### Rule 1 — Spacing is 0, 1, or a multiple of 3
Every padding, margin, gap, width, height, position offset, letter-spacing, line-height is **0, 1 (for borders only), or a multiple of 3** (3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 45, 54, 72, 99, 144).

```css
/* ✓ */  padding: 9px;    gap: 6px;    margin-top: 27px;
/* ✗ */  padding: 8px;    gap: 5px;    margin-top: 25px;
```

### Rule 2 — Borders are 1px solid grey, always
Every border is `1px solid #999999`. Never thicker, never another colour, never dashed, never doubled. The only `1px` value in the system is this border.

```css
/* ✓ */  border: 1px solid #999999;
/* ✗ */  border: 2px solid black;    border-bottom: 0;    border-radius: 4px;
```

### Rule 3 — Zero border-radius (with one exception)
`border-radius: 0` everywhere. The only exception is a circular avatar or pin — `border-radius: 50%` for circular elements only.

### Rule 4 — Colour is tokens, never raw hex
```css
ADN_COLORS = {
  navy:          '#001089',   /* primary, brand, text */
  manila:        '#f8eac7',   /* warm substrate, header backgrounds */
  manilaDark:    '#c9a94e',   /* Sticky Gold — separators, hover */
  manilaDeep:    '#8b7327',   /* Antique Gold — emphasis */
  headerTop:     '#94a3d6',   /* cool header gradient */
  headerCurrent: '#b8dae8',   /* current section accent */
  grey:          '#999999',   /* borders, muted text */
  greyLight:     '#cccccc',   /* subtle separators */
  white:         '#FFFFFF',
  black:         '#000000',   /* print only */
  success:       '#228B22',
  caution:       '#D4A017',
  warning:       '#a60315',
}
```

These ten tokens are the **entire** palette. No CSS variables outside this set. No off-brand colours. No tailwind defaults. Use the token name, not the hex.

### Rule 5 — Typography is Helvetica Neue, scale 9/12/15/18/24/30/33/36
```
9px   — micro labels, captions, secondary metadata
12px  — body text, table cells
15px  — emphasised body, card titles
18px  — section headers
24px  — page subheaders
30px  — page titles
33px  — hero subheads
36px  — hero titles (largest)
```

Font family: `Helvetica Neue, Helvetica, Arial, sans-serif`. Labels and headers are **UPPERCASE with `letterSpacing: 1.5` or `letterSpacing: 3`**. Body text is sentence case.

### Rule 6 — No shadows, gradients, blur, glassmorphism, neumorphism
Visual hierarchy comes from **position, value (lightness), and the 1px border**. Never from `box-shadow`, `filter: blur()`, `backdrop-filter`, gradients, or 3D effects. Tufte: data-ink only.

### Rule 7 — No emoji codepoints
Platform emoji fonts (Apple / Google) render emoji in colour, ignoring design tokens. **Banned**: 🔍 📝 ★ ✓ ✕ ⚠ ▶ ▼ ▾ ⌘ ♪ ℹ © and any `\p{Extended_Pictographic}` character without `U+FE0E` (variation selector-15, forces text rendering).

Replace with:
- ★ → `★︎` (force text)
- ✓ → `✓︎`
- ⚠ → `⚠︎`
- ✕ → `×` (U+00D7 — pure math sign)
- 🔍 📝 📐 🎨 🔗 📋 → **remove** (rely on placeholder text or surrounding affordance)

### Rule 8 — Multi-column inline grids must be responsive
Inline `gridTemplateColumns: 'repeat(N, 1fr)'` with N ≥ 2 cannot collapse on mobile because inline styles can't carry `@media` queries.

```css
/* ✓ */  grid-template-columns: repeat(auto-fit, minmax(282px, 1fr));
/* ✗ */  grid-template-columns: repeat(3, 1fr);  /* breaks on mobile */
```

### Rule 9 — Notes and captions ≤ 14 words
Spec notes, captions, helper text — keep to **14 words or fewer** per chunk. If you need more, split into multiple chunks. Density is the goal; verbosity is the enemy.

### Rule 10 — The catalog is the spec
Every component, every chart, every layout — if it's not described in this file or in a project's `/369` catalog (when present), it doesn't ship. Don't invent visual vocabulary.

---

## DATA → VISUALISATION decision tree

When you have data and need to visualise it, **do not pick a chart by taste**. Route through this tree. The decision is deterministic.

### Step 1 — Profile the data

| Shape | Detection | Routes to |
|---|---|---|
| **Single value** | one number, one date, one identifier | stat tile or value display |
| **One categorical × one quantitative** | regions × revenue | bar (sorted) |
| **Two quantitatives** | spend × signups | scatter |
| **One quantitative** | ages, prices | histogram |
| **Temporal × quantitative** | day × users | line |
| **Categorical sums to whole** | category × share | sorted bar (**never pie beyond 5 slices**) |
| **Hierarchical** (parent / child rows OR nested objects) | dept → team → person | treemap or sunburst |
| **Network** (nodes + edges) | who collaborates with whom | force-directed if density < 5, else adjacency-matrix |
| **Field** (continuous scalar over a domain) | temperature grid, density | heatmap or contour |
| **Geographic** (lat/lon or state codes) | sales by US state | choropleth (use **equal-area** projection, never Mercator for choropleth) |

### Step 2 — Name the intent

Pick from this closed enum. If you can't tell which, the default is `exploratory` (return three ranked options).

| Intent | When |
|---|---|
| `comparison` | "how do these compare?" |
| `ranking` | "who's #1?" |
| `trend` | "what's changed over time?" |
| `distribution` | "what's the shape of this measure?" |
| `correlation` | "do these two move together?" |
| `part-to-whole` | "what shares add up to the total?" |
| `diagnostic` | "is this signal real?" (residuals, Q-Q, error bars) |
| `decision` | "which option is best?" (sorted + annotated + threshold) |
| `narrative` | "tell the story" (annotated sequence) |
| `exploratory` | "show me what's here" (top 3 ranked) |

### Step 3 — Pick the encoding by Cleveland's ranking

Cleveland & McGill 1984 measured perceptual accuracy by experiment. **Always assign the most important dimension to the highest-ranked channel.**

```
1.00  position on common scale        ← bar height, line y, scatter x/y
0.95  position on aligned scales
0.85  length                          ← bar width
0.70  angle / slope
0.40  area                            ← bubble size, treemap leaf
0.30  volume
0.20  colour hue / saturation         ← bottom for quantitative; TOP for categorical
```

So: bars beat pies (position beats angle). Choropleth uses colour value (lightness) not hue. Bubble charts are last resort.

### Step 4 — Apply Wilkinson's grammar (the spec)

Every chart decomposes into seven layers:

```
variables  — typed data references (name, role: dimension | measure | identifier)
algebra    — how variables combine: * (cross) + (blend) / (nest) | (condition)
mark       — point | line | area | rect | arc | text | treemap | sunburst |
             node-link | adjacency-matrix | choropleth | heatmap | contour | …
encoding   — channel ← variable mappings (x, y, size, color, shape, opacity, angle, radius)
scale      — per channel: linear | log | sqrt | ordinal | time | time-cyclic | geographic
projection — cartesian | polar | geographic (with sub-types: mercator | equal-earth | …)
facet      — small multiples (row, col, wrap)
stat       — identity | bin | count | smooth | density
```

A bar chart is `{mark: 'rect', encoding: {x: cat, y: val}, scale: {y: linear}, projection: cartesian}`. A treemap is `{mark: 'treemap', encoding: {size: value, color: category}, algebra: {variables: [hierarchy], operator: '/'}}`. A music spiral would be `{mark: 'point', encoding: {angle: time-mod-phrase, radius: pitch, size: volume, color: timbre}, projection: polar}`.

---

## The TRAP CATALOG — what you must refuse

These are Wainer + Tufte + Cleveland + Mackinlay failure modes. **A chart that violates any of these is broken**, not stylistically poor — refuse to render it.

| Trap | Description | Fix |
|---|---|---|
| `truncated-baseline` | bar chart Y-axis doesn't start at 0 | start at 0 |
| `lie-factor` | size-in-graphic / size-in-data > 1.05 | rescale honestly |
| `pie-overload` | pie chart with > 5 slices | sorted horizontal bar |
| `3d-effects` | any 3D chart, pseudo-3D, isometric | flat, 2D only |
| `chartjunk` | decoration that doesn't encode data | remove |
| `channel-level-mismatch` | quantitative on hue, categorical on size | reassign per Cleveland ranking |
| `cyclic-on-linear` | hours/days/months on a linear axis | use polar + time-cyclic scale |
| `mercator-area-lie` | area comparison on Mercator projection | use equal-earth or Albers equal-area |
| `channel-collision` | same channel encoding two variables | split or drop one |
| `treemap-leaf-too-small` | hierarchical leaf < 1px² | aggregate or change view |
| `force-directed-clutter` | graph density > 5 with force-directed | switch to adjacency-matrix |
| `domain-mismatch` | negative on size, log of zero | reassign or filter |

---

## SELF-CHECK before shipping

Before you write, render, or commit any UI / chart / component, run this self-check:

1. **Spacing.** Every padding/margin/gap is 0, 1px, or a multiple of 3?
2. **Borders.** Every border is `1px solid ADN_COLORS.grey`? Zero border-radius (except circular avatars)?
3. **Colour.** Every colour comes from `ADN_COLORS`? No raw hex, no Tailwind defaults?
4. **Typography.** Helvetica Neue? Sizes from `9 / 12 / 15 / 18 / 24 / 30 / 33 / 36`?
5. **Effects.** No shadows, gradients, blur, glassmorphism?
6. **Emoji.** No emoji codepoints? (Or `︎` appended to text-style glyphs?)
7. **Grid.** No fixed `repeat(N, 1fr)` with N ≥ 2? Used `auto-fit + minmax` instead?
8. **Notes.** Every helper / caption ≤ 14 words?
9. **Data.** If rendering data, did you route through the decision tree?
10. **Traps.** None of the 12 traps fired?

If any check fails, **fix it before shipping**. The system says: deviation is structurally impossible. Honour that.

---

## Worked examples

### 1. "Show me revenue by region (US)"

Data: `[{region: 'West', revenue: 142}, {region: 'South', revenue: 167}, …]`
Shape: 1 categorical × 1 quantitative.
Intent: `comparison`.
Cleveland: position-on-common-scale beats every other channel for quantitative.
Spec: `{mark: 'rect', encoding: {x: 'region', y: 'revenue'}, scale: {y: 'linear'}, projection: 'cartesian'}`.
Result: **horizontal bar chart**, sorted by revenue descending, 9px gap between bars, 1px navy bars on white, region labels in 12px Helvetica Neue, no axis chrome, no decoration.

### 2. "Visualise our org structure (departments → teams)"

Data: `[{name: 'Engineering', parent: null, headcount: 45}, {name: 'Frontend', parent: 'Engineering', headcount: 12}, …]`
Shape: hierarchical (rows with `parent` field).
Intent: `part-to-whole`.
Spec: `{mark: 'treemap', encoding: {size: 'headcount', color: 'depth'}, algebra: {variables: ['name', 'parent'], operator: '/'}}`.
Result: **treemap**, squarified, leaves sized by headcount, colour-coded by depth, 1px white borders between cells, names in 9px white on darker fills (12px on lighter).

### 3. "Customer ages — what's the distribution?"

Data: `[{age: 32}, {age: 28}, …]` (200 rows).
Shape: 1 quantitative.
Intent: `distribution`.
Cleveland: position-on-common-scale, length as count.
Spec: `{mark: 'rect', encoding: {x: 'age', y: '__count__'}, stat: 'bin', projection: 'cartesian'}`.
Result: **histogram**, 9px gap between bars, bin width derived from data range, navy bars on white, no chartjunk.

### 4. "Daily active users for the last 90 days"

Data: `[{date: '...', users: 12483}, …]`.
Shape: temporal × 1 quantitative.
Intent: `trend`.
Spec: `{mark: 'line', encoding: {x: 'date', y: 'users'}, scale: {x: 'time', y: 'linear'}, projection: 'cartesian'}`.
Result: **line chart**, 1px navy line, no markers (data-ink), x-axis labels weekly, y-axis labels at sensible round numbers.

### 5. "Compare 4 regions × 3 products simultaneously"

Data: `[{region, product, revenue}, …]` (12 rows).
Shape: 2 categorical × 1 quantitative.
Intent: `comparison`.
Algebra: `region * product` (cross).
Spec: `{mark: 'rect', encoding: {x: 'region', y: 'revenue'}, facet: {col: 'product'}, projection: 'cartesian'}`.
Result: **small multiples** — 3 bar-chart panels side by side, one per product, with identical y-axis range so the visual comparison reads true. Tufte's small multiples principle.

---

## The canon — what each rule traces to

| Rule | Source |
|---|---|
| 3/6/9 spacing | Sacred geometry; Bauhaus + Swiss Style grid discipline |
| 1px borders | Tschichold; brutalist honest construction |
| 0 border-radius | Rams (As Little Design As Possible) |
| Colour tokens | Imhof (colour rules); Albers (perceptual constraint) |
| Helvetica Neue + scale | Vignelli (typographic discipline); Bringhurst (type canon) |
| No shadows / decoration | Tufte (data-ink ratio); Rams (unobtrusive) |
| No emoji | Platform-independence; design-system enforcement |
| Responsive grids | Mobile-safe construction |
| Decision tree | Mackinlay 1986 (APT); Munzner 2014 (What/Why/How) |
| Cleveland ranking | Cleveland & McGill 1984 (JASA) |
| Wilkinson grammar | Wilkinson 1999 (The Grammar of Graphics) |
| Trap catalog | Wainer 1984 (How to Display Data Badly); Tufte (graphical integrity) |
| Tidy data precondition | Wickham 2014 |
| Atomic vocabulary | Brad Frost (atomic design) |

---

## Rules of engagement (for the agent reading this)

1. **Run the engine; don't guess.** The decision tree above is deterministic. Hand-picking a chart because it "looks better" defeats the system.
2. **Same input → same output.** If you visualise the same data twice and get different charts, something is wrong.
3. **Show the reasoning.** When you ship a chart, name the canon principle that earned the rank (e.g. "Cleveland 1984 — position on common scale ranks 1.00").
4. **369 or it's a bug.** Every spacing 0/1/multiple-of-3; every colour a token; 1px borders; 0 radius; no emoji; no chartjunk.
5. **Defer to the canon, not to taste.** When in doubt, cite Tufte, Cleveland, Wainer, or Mackinlay — not "I think it looks cleaner."
6. **Rebrand; don't reinvent.** Every design principle here traces to a named teacher in the canon. The 369 system is the synthesis, not the invention.

---

## When this skill applies

Invoke (or implicitly follow) `369-design-system` for any of:

- Generating UI markup (HTML, JSX, Vue, Svelte, …)
- Writing CSS or inline styles
- Building a chart, dashboard, table, or data display
- Choosing a colour, font, spacing, border
- Sketching a layout
- Reviewing UI for compliance
- Answering "what's the best way to show X?"
- Critiquing visualisations (the trap catalog is the rubric)

**If the task involves visible output, this skill applies.**

---

## Attribution

This file is distilled from ADN's full 369 design system, which is itself distilled from a sixty-year canon: Jacques Bertin (*Semiology of Graphics*, 1967) · John Tukey (EDA, 1977) · Edward Tufte (*The Visual Display of Quantitative Information*, 1983 + *Envisioning Information*, 1990) · William Cleveland & Robert McGill (*Graphical Perception*, JASA 1984) · Howard Wainer (*How to Display Data Badly*, 1984) · Jock Mackinlay (*APT*, Stanford PhD 1986) · Stuart Card / Jock Mackinlay / Ben Shneiderman (*Readings in Information Visualization*, 1999) · Leland Wilkinson (*The Grammar of Graphics*, 1999) · Hadley Wickham (*A Layered Grammar of Graphics*, JCGS 2010 + *Tidy Data*, 2014) · Mike Bostock + Jeffrey Heer (D3.js, 2011) · Arvind Satyanarayan + UW IDL (Vega-Lite, 2017) · Tamara Munzner (*Visualization Analysis and Design*, 2014). Plus the design-system substrate: Bauhaus, Swiss Style, Eduard Imhof, Josef Albers, Josef Müller-Brockmann, Massimo Vignelli, Robert Bringhurst, Jan Tschichold, Dieter Rams, Brad Frost.

The full wiki for any of these names lives at `knowledge/wiki/concepts/<slug>.md` in the ADN repo.

---

## License & redistribution

Free to use, modify, redistribute. If you fork this skill, the only ask is: **don't dilute the canon.** Either honour the rules above or rename your fork.
