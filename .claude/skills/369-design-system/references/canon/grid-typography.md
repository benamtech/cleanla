# Grid Typography — The Swiss Lineage and the Mathematical Defense of ×3

> **Why ×3, not ×4 or ×8?** Rule 1 of 369 is "multiples of 3 only." This canon page provides the evidence-based defense rooted in 60+ years of typography research: Müller-Brockmann's 12-column Swiss grid (1961, 1981), Tschichold's *New Typography* (1928), Bringhurst's *Elements of Typographic Style* (1992), Tim Brown's *Modular Scale* (2011), and the harmonic-ratio mathematics that explain why ratio-based scales feel better than arithmetic ones.

For the rule itself, see SKILL.md Rule 1. For the operational details, see `visual-rules.md`. For the foundational axiom, see `canon-axioms.md` Axiom 1.

---

## The 12-Column Swiss Grid (Müller-Brockmann 1961, 1981)

**Citation:** Josef Müller-Brockmann. *Grid Systems in Graphic Design / Raster Systeme für die visuelle Gestaltung* (Verlag Niggli, 1961; revised 1981).

### Canonical column counts
- **8-column** — magazines, simple grids
- **12-column** — most common (divides cleanly into 1, 2, 3, 4, 6, 12)
- **20-column** — complex editorial work

**Why 12 won for general use:** divisibility. 12 = 2 × 2 × 3. It splits into halves, thirds, quarters, sixths, twelfths — every common fraction.

### Margins / gutters / columns
Müller-Brockmann's relationships:
- Margin width = baseline grid × some integer
- Gutter (between columns) = often half the margin
- Column width = (page width − margins − gutters) / column count

### The "objective" design movement
Swiss grid was political: rejection of decorative typography. Order, function, and reproducibility were values. **A grid is moral discipline, not aesthetic preference.** This positions 369 squarely in the Swiss-objective tradition.

---

## Tschichold's New Typography (1928)

**Citation:** Jan Tschichold. *Die Neue Typographie* (1928). English: *The New Typography* (UC Press, 1995).

**The manifesto:**
- Reject traditional (centered, ornamented) layout
- Embrace asymmetric grids
- Sans-serif typefaces as default
- Function determines form

Later (*The Form of the Book*, 1991 posthumous): Tschichold returned to traditional book proportions for novels — recognizing that **different media require different grids.** A book ≠ a poster ≠ a TUI ≠ a card. **Match the grid to the medium.**

---

## Bringhurst — Elements of Typographic Style

**Citation:** Robert Bringhurst. *The Elements of Typographic Style* (Hartley & Marks, 1992; 4th ed. 2012).

### Vertical rhythm
Body text leading (line-height) = N × baseline grid. Headings + spacing = M × baseline grid. **The whole document rests on a single rhythmic unit.**

### Type scale ratios (Bringhurst's canon)
Eight harmonic ratios from music theory:
- **1:1** (unison) — same size
- **6:5** (minor third) — 1.2
- **5:4** (major third) — 1.25
- **4:3** (perfect fourth) — 1.333
- **1.414** (augmented fourth / paper proportion / √2)
- **3:2** (perfect fifth) — 1.5
- **1.618** (golden mean / Φ)
- **5:3** (major sixth) — 1.667
- **8:5** (minor sixth) — 1.6
- **2:1** (octave) — 2.0

A type scale chains these ratios: `body × 1.5 = h3`; `h3 × 1.5 = h2`; etc.

### The Renaissance / Modulor heritage
Bringhurst documents the Renaissance grids (Villard's diagram, Van de Graaf canon, Tschichold's geometric construction). Le Corbusier's Modulor (1948) extended this with human-proportion bases.

**Lesson:** Proportion ≠ arbitrary. The grids that survive 500 years aren't ×8 — they're **harmonic-ratio chains.**

---

## Tim Brown — Modular Scale (2011, 2018)

**Citation:** Tim Brown. *Flexible Typesetting* (A Book Apart, 2018); modularscale.com (2011+).

### The web-typography modular scale
8 useful ratios (matches Bringhurst):
- Minor second (15:16) — 1.067
- Major second (8:9) — 1.125
- Minor third (5:6) — 1.2
- Major third (4:5) — 1.25
- Perfect fourth (3:4) — 1.333
- Augmented fourth (√2) — 1.414
- Perfect fifth (2:3) — 1.5
- Minor sixth (5:8) — 1.6
- Major sixth (3:5) — 1.667
- Minor seventh (5:9) — 1.778
- Major seventh (8:15) — 1.875
- Octave (1:2) — 2.0
- Major tenth (2:5) — 2.5
- Major eleventh (3:8) — 2.667
- Major twelfth (1:3) — 3.0
- Double octave (1:4) — 4.0

### The argument
**Arithmetic scales (8, 16, 24, 32) feel mechanical.** **Geometric/harmonic scales (12, 16, 21, 28) feel composed.** The ratio is what your perceptual system tunes for; the difference is what your perceptual system sees as a jump.

**For 369:** the type scale `{9, 12, 15, 18, 24, 30, 33, 36}` is mostly arithmetic (+3) but contains harmonic relationships:
- 9 → 12 = 4:3 (perfect fourth)
- 12 → 18 = 3:2 (perfect fifth)
- 18 → 24 = 4:3 (perfect fourth)
- 12 → 24 = 2:1 (octave)
- 12 → 36 = 3:1 (major twelfth)

**This is a hybrid:** arithmetic for compactness, harmonic for perceptual jumps. The "blended" scale matches what designers actually pick when given freedom — they reach for ratios at semantic boundaries (h1 vs body), and increments within homogeneous categories (caption sizes).

---

## Why 8 Won Digital (and Why 369 Chose 3)

### The 8-point grid
**Sources:** Bryn Jackson (2015) *"The 8-Point Grid"* (spec.fm); Material Design (2014); iOS HIG.

The "8-point grid" community standardized on 8 because:
- **Pixel density math:** 8 divides cleanly across 1×, 2×, 3× displays (Retina, high-DPI Android)
- **Round numbers:** 8 is one octave from 4 (the half-tone); 8 / 16 / 24 / 32 / 48 / 64 forms a clean geometric chain
- **Tooling convergence:** Figma defaults, Sketch defaults, Material specs, iOS HIG — all 8-based

### Why 3 wins for 369
- **Finer granularity:** 3 lets you nudge by 1 unit; 8 forces 1 = "too small" or 2 = "too big"
- **Divisibility:** 3, 6, 9, 12, 15, 18, 21, 24 chains. 12 = 2×6 = 3×4 = 4×3 — clean factor across most common counts.
- **Harmonic chains within 3-multiples:**
  - 3 → 6 = 2:1 (octave)
  - 6 → 9 = 3:2 (perfect fifth)
  - 9 → 12 = 4:3 (perfect fourth)
  - 12 → 18 = 3:2 (perfect fifth)
  - 18 → 24 = 4:3 (perfect fourth)
  - 24 → 36 = 3:2 (perfect fifth)
- **Fibonacci-adjacency:** 3, 5, 8, 13, 21 are Fibonacci. The 3 series approaches these.
- **Differentiation:** ×3 is perceptually distinct from ×8 — designers immediately recognize "this is not Material."

**The decisive argument:** ×3 generates the same harmonic ratios as Swiss grid + Bringhurst's canon, but at finer granularity, with cleaner divisibility, and visual differentiation from Material/iOS.

---

## Vertical Rhythm Rules

**Source:** Khoi Vinh (subtraction.com), 24 Ways (24ways.org), A List Apart (alistapart.com) — circa 2007–12.

### Recipe
1. **Choose a baseline grid unit** — 369 = 3px (or 6px / 9px depending on density)
2. **Body type leading** = N × baseline. For 12px body, line-height = 18 (3-multiple, ~1.5× ratio)
3. **Heading sizes** = M × baseline. h3 = 18; h2 = 24; h1 = 30 or 36
4. **Spacing above heading** = leading-of-target. Above h2 (24px): 24px space above
5. **Spacing below heading** = half-leading. Below h2: 12px space below

### 369-specific recipe
- Baseline = 3
- Body = 12 (×4 baseline)
- Body line-height = 18 (×6 baseline = 1.5× body)
- h3 = 18; h2 = 24; h1 = 30 or 36
- Spacing units = 3, 6, 9, 12, 18, 24, 36, 48 (×3 chain)
- All spacing values are also multiples of body leading (18)

The result: every text + space combination lands on the rhythmic grid. **This is the structural reason 369 feels coherent.**

---

## Page Proportion Canon (When 369 Pages Need It)

For situations where 369 surfaces have an aspect ratio choice:

| Ratio | Name | Use |
|-------|------|-----|
| 1:1 | Square | Profile, icon-region |
| 5:4 | Major third | Compact thumbnail |
| 4:3 | Perfect fourth | Traditional book/screen |
| 1:√2 | A-series paper | Documents, posters |
| 3:2 | Perfect fifth | Photo standard, business card |
| 16:10 | Cinema | Wide monitor |
| 16:9 | Widescreen | TV / modern monitor |
| Φ (1.618) | Golden | "Universal" elegant |
| 2:1 | Octave | Wide banner / hero |

**369 default for cards/modals:** **3:4** (1.333, perfect fourth) — Stacked Pillars portrait modal uses this. It's wider than golden, narrower than 16:9, optimal for vertical scrolling content with image hero.

---

## The Mathematical Defense of ×3

Putting it all together — when a designer asks "why ×3 not ×8?":

1. **Swiss grid heritage:** Müller-Brockmann's 12-column is the 6-grid era. ×3 is the modern compression of that.
2. **Bringhurst canon:** ×3 chains generate perfect-fifth + perfect-fourth ratios — the same ratios from music theory used in Western typography since Renaissance.
3. **Modular scale:** ×3 chain is harmonic, not arithmetic. Tim Brown shows harmonic > arithmetic for perceptual quality.
4. **Divisibility:** 3 = the smallest non-trivial divisor of 12 (the standard column count). Material's 8 doesn't divide 12 cleanly; ×3 does.
5. **Granularity vs precision tradeoff:** ×3 gives 33% finer adjustment than ×8 while preserving harmonic relationships.
6. **Differentiation:** Cannot be confused with Material/iOS systems. 369 announces itself by its grid.
7. **Practical chains:**
   - Spacing: 3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 48, 60, 72
   - Type: 9, 12, 15, 18, 24, 30, 33, 36
   - Both chains contain harmonic ratios (2:1, 3:2, 4:3) at semantic boundaries

**Rule 1 is not arbitrary.** It is the synthesis of Swiss grid + Bringhurst's harmonic canon + Tim Brown's modular scale + the divisibility math + the visual-differentiation goal. Defensible to skeptics, citable in design reviews, derivable from first principles.

---

## See Also

- `visual-rules.md` — Rule 1 operational details
- [[cleveland-mcgill]] — analogous: principled design over opinion
- [[hci-foundations]] — Norman/Krug/Gestalt foundations
- `canon-axioms.md` — Axiom 1 (constraint generates style)

---

## Sources

- Müller-Brockmann 1961, 1981 — *Grid Systems in Graphic Design* (Niggli)
- Tschichold 1928, 1995 EN — *Die Neue Typographie* / *The New Typography* (UC Press)
- Tschichold 1991 posthumous — *The Form of the Book*
- Gerstner 1964 — *Designing Programmes*
- Bringhurst 1992, 2012 — *The Elements of Typographic Style* (4th ed., Hartley & Marks)
- Brown 2011 — modularscale.com
- Brown 2018 — *Flexible Typesetting* (A Book Apart)
- Vignelli 1996 — *The Vignelli Canon*
- Le Corbusier 1948 — *Modulor*
- Bootstrap, Material Design, iOS HIG — current public specs
- Jackson 2015 — spec.fm/specifics/8-pt-grid
- Livio 2002 — *The Golden Ratio: The Story of Phi* (Broadway Books)
- Bynens dotfiles — github.com/mathiasbynens/dotfiles
