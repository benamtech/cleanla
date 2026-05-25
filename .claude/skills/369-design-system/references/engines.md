# 369 Engines — Information In, 369-Native HTML Out

ADN's design system is generative. The same input always yields the same output — no taste, no "it depends." Two engines do the work:

- **Composition engine** — tabular data + intent → the best chart or table.
- **Component engine** — entity + intent → the one legal component render.

This file is the front door: classify the input, route it through the correct engine, render the output. Apply 369 rules per `visual-rules.md` — this file does NOT restate them.

## The pipeline

```
information → PROFILE → ROUTE → RESOLVE → RENDER → 369-native HTML
```

## Step 1 — PROFILE the input

Classify the information before anything else:

| Input shape | Examples | Routes to |
|---|---|---|
| **Tabular data** — rows of records with fields | sales by region; jobs with budgets; producers with ratings | composition engine |
| **A single metric** | "142 active jobs"; a count; a percentage | component engine — a stat tile / badge |
| **One entity with attributes** | a producer; a job; a milestone; a review | component engine — a card |
| **A list of entities** | several producers; a notification feed | component engine — repeated cards |
| **Prose / freeform content** | a paragraph, an explanation | the 369 type scale directly; no engine |

## Step 2 — ROUTE

### Tabular data → the composition engine

Name the **communicative intent** — a closed enum of six:

| Intent | The user wants to… | Data shape |
|---|---|---|
| `comparison` | compare magnitudes across categories | categorical + quantitative |
| `ranking` | see order — who is first | categorical + quantitative |
| `trend` | see change over time | temporal + quantitative |
| `distribution` | see the shape/spread of one measure | one quantitative field |
| `correlation` | see whether two measures move together | two quantitative fields |
| `part-to-whole` | see shares of a total | categorical + quantitative |

If the intent is stated, use it. If not, infer it from the data shape and the question being asked. Then run the engine — do not hand-pick a chart:

```ts
import { presentation } from '@/base/presentation';
import { renderComposition } from '@/base/presentation/render';

const specs = presentation(data, intent, 'desktop'); // up to 3, ranked
const html  = renderComposition(specs[0], data);     // the winner, drawn
```

The engine profiles the data, runs the 9→6→3 beam search under the lexicographic rubric, clears the trap gate (chartjunk, category-overload, baseline lies, channel-level mismatch), and `renderComposition()` draws the survivor. Deterministic and tested — trust it.

When the work is a data display (chart / dashboard / sparkline / table), ALSO load `tufte.md` — Tufte's canon is what the rubric and trap catalogue compile from.

### An entity / component → the component engine

```ts
import { resolveAny } from '@/base/resolver';

const resolved = resolveAny('Button', { variant: 'primary', tier: 'normal' });
// resolved holds every render value — height, padding, colour, border, font…
```

`resolveAny` resolves every component ADN ships — atoms, molecules, organisms, the eight Card templates, and the Card primitive itself. The markup reads the resolved values; it never hand-picks them.

For composing a specific Card surface interactively (with user feedback), use the iteration loop in `cards.md` — it produces the same 369-compliant output via a different path (hand-composition vs. engine-resolution). The recipes encode the same tone / tier / density logic the hand-composition path applies — keep them consistent.

### Prose / a single value → structure by the rules

No engine — apply the 3/6/9 rules directly (the type scale, 3/6/9 spacing, the colour tokens). See `visual-rules.md`.

## Step 3 — RENDER the output

Always produce **369-native HTML** — inline styles, no build step, viewable in any browser. Constraints come from `visual-rules.md`; the short version:

- Every px value is `0`, `1` (the border), or a multiple of 3.
- Colours come from the ADN tokens; no Tailwind defaults.
- `border: 1px solid #999999`; `border-radius: 0` (circular avatars/pins are the one exception).
- Helvetica Neue; UPPERCASE labels/headers/buttons; type scale 9 / 12 / 15 / 18 / 24 / 30 / 33 / 36.
- No drop shadows, gradients, blur, rounded corners, or icon libraries.

When the output is a data composition, include its **decision trace** — the intent chosen, the rubric criteria passed, the traps cleared, the beam widths. The output is then defended, not asserted.

## Step 4 — VALIDATE

Before returning, check every value: a spacing number that is not 0/1/multiple-of-3 is a bug; a colour that is not a token is a bug. `scripts/voice-lint.mjs` enforces exactly this on the `/369` catalog — hold the output to the same bar.

## Worked example — tabular data

**Input:** `[{region:'West',revenue:142},{region:'South',revenue:167},{region:'Midwest',revenue:121}]`; goal "compare the regions."

- **PROFILE** → tabular: categorical `region` + quantitative `revenue`.
- **ROUTE** → composition engine, intent `comparison`.
- **RESOLVE** → `presentation(data,'comparison','desktop')[0]` → `mode: chart · chartType: bar · sorted: true`.
- **RENDER** → `renderComposition(spec, data)` → a sorted bar chart, SVG, 369-native.
- **Output** the HTML plus the trace: `comparison · bar/sorted · BEAM 4→4→3 · ✓ comparison-on-common-scale · ✓ data-ink · ✓ sorted-for-comparison`.

## Worked example — an entity

**Input:** a producer — `{name:'Stitch & Stone', verified:true, rating:4.9, jobs:42}`.

- **PROFILE** → one entity with attributes.
- **ROUTE** → component engine — a `ProducerCard`.
- **RESOLVE** → `resolveAny('ProducerCard', { tiers: 'normal' })` → the card's design values.
- **RENDER** → the ProducerCard HTML: avatar, name + verified pill, rating, jobs — every value from the resolver, none hand-typed.

## Engines reference

| Engine | Entry point | Source |
|---|---|---|
| Composition engine | `presentation(data, intent, medium)` | `src/base/presentation/` |
| Renderer | `renderComposition(spec, data)` | `src/base/presentation/render.tsx` |
| Component engine | `resolveAny(component, intent)` | `src/base/resolver.ts` + `src/base/recipes/` |
| Relational spacing | `SPACING_SCALE`, `pairwiseGap`, `nestedSpacing`, … | `src/base/spacing.ts` |
| Integrity | `voice-lint` — hex / px / spec-count | `scripts/voice-lint.mjs` |

Live demonstrations sit in `/369` — the **Engine** section: *Generated Composition* (six intents), *Generated Component* (the resolver parameterized), *Data-Display Gallery* (the trap gate, the ranked set, the rubric).

## Engine rules

- **Run the engines; don't guess.** The verdict is deterministic — `presentation()` and `resolveAny()` produce it. Hand-picking a chart or hardcoding a component's values defeats the whole system.
- **Same input → same output.** Run it twice; if the HTML differs, something is wrong.
- **Show the reasoning.** A data composition ships with its decision trace — that is what makes it defended.
- **369 or it's a bug.** Every spacing value 3/6/9; every colour a token; 1px borders; 0 radius. See `visual-rules.md` for the full set.

## Known recipe defects (2026-05-24)

`resolveAny` currently resolves all 83 component recipes, but returns wrong values for collision and structural-part recipes. Regenerating `/369` from the engine is blocked on fixing these. If you hit a wrong value, file against the recipe in `src/base/recipes/`, not the engine.

## Engine wins (regeneration policy)

When a specimen on `/369` drifts from a well-formed recipe, the recipe wins. The specimen is corrected, not the recipe.
