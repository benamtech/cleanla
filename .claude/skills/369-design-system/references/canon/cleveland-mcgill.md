# Cleveland-McGill Perceptual Accuracy Ladder

> **The mathematical floor under 369's `presentation()` engine.** Cleveland & McGill (1984) ran controlled experiments measuring human accuracy in extracting quantitative values from different visual encodings. The result: a ranked ladder of channels with measured error rates. Mackinlay (1986) operationalized it into automatic chart selection (APT). Wilkinson (1999, 2005) formalized it as compositional grammar. Wickham extended it to ggplot2. Heer & Bostock (2010) validated it at scale via crowdsourcing. **Together this is the empirical foundation for choosing position over color, length over area, every time.**

For the rubric this informs, see `engines.md`. For data-visualization theory, see [[tufte]]. For the broader academic context, see [[tui-academic]].

---

## The Ladder (Cleveland & McGill 1984)

**Citation:** William S. Cleveland & Robert McGill. *"Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods."* JASA Vol. 79, No. 387 (Sept 1984), pp. 531–554.

**Experimental method:** Subjects shown paired visual elements, asked to judge "lesser/greater" ratios. Error rates measured.

### The 6-tier ranking

| Rank | Channel | Mean error | Multiplier vs baseline |
|------|---------|------------|------------------------|
| 1 | **Position along common scale** | ~2.5% | 1.0× (baseline) |
| 2 | **Position along non-aligned scales** | ~4.0% | 1.6× |
| 3 | **Length / direction / angle** (tied) | ~5.2–6.5% | 2.0–2.6× |
| 4 | **Area** | ~12–15% | 5–6× |
| 5 | **Volume / curvature** | ~18–25% | 7–10× |
| 6 | **Shading / color saturation** | ~25–40% | 10–16× |

**Critical numerical findings:**
- Bar charts (position) → ~3% mean error
- Pie charts (angle) → ~5% error
- **Area is systematically underestimated** — perceived ∝ actual^0.6 (power law)
- Weber fraction σ/μ ≈ 0.22 for area discrimination
- Color saturation accuracy varies 25–40% depending on context (simultaneous contrast)
- ~8% of males have red-green color vision deficiency; another ~0.4% of females

**369 implication:** A chart that encodes the primary quantity in color when position was available has knowingly accepted **10× the error rate.** This is not "aesthetic choice." This is measurable inferiority.

---

## Bertin's Foundation (1967)

**Citation:** Jacques Bertin. *Sémiologie Graphique* (1967); English: *Semiology of Graphics* (1983).

**The 7 retinal variables** (what visual properties can encode data):
1. Position (x, y)
2. Size (magnitude)
3. Texture (grain, pattern)
4. Color (hue)
5. Saturation (intensity)
6. Orientation (angle)
7. Shape (mark type)

**Bertin codified what can vary.** Cleveland-McGill measured how well humans perceive variation. **Mackinlay used both to automate selection.**

---

## Mackinlay's APT (1986) — Automated Chart Selection

**Citation:** Jock D. Mackinlay. *"Automating the Design of Graphical Presentations of Relational Information."* ACM TOG Vol. 5, No. 2 (April 1986), pp. 110–141.

### The two criteria

**Expressiveness:** A visualization is expressive iff:
- All intended data relations are encoded
- **No unintended data relations are encoded**

Type-correctness filter:
| Data type | Allowed channels |
|-----------|------------------|
| **Quantitative** | Position, length, area, angle (NOT shape/texture alone) |
| **Ordinal** | Color saturation, size hierarchy, position |
| **Nominal** | Shape, color hue, texture |

A nominal variable on a continuous axis fails expressiveness — implies ordering that doesn't exist.

**Effectiveness:** Among expressive candidates, rank by C-M accuracy.

### The algorithm
```
1. Profile the data (quantitative / ordinal / nominal per variable)
2. Generate candidate encodings (channel assignments)
3. Filter by expressiveness (kill type-violating encodings)
4. Rank by effectiveness (C-M ladder weight)
5. Emit top-N ranked candidates
```

**369 application:** `presentation()` should mirror this exactly. Profile data → enumerate candidates → expressiveness gate → C-M effectiveness rank → return ranked list with decision trace.

---

## Wilkinson's Grammar of Graphics (1999, 2005)

**Citation:** Leland Wilkinson. *The Grammar of Graphics* (Springer, 1999; 2nd ed. 2005).

### Seven compositional layers

1. **Variables** — raw data fields
2. **Algebra** — operations on variables (×, +, /)
3. **Scales** — value mappings (linear, log, categorical)
4. **Statistics** — transformations (bin, smooth, count)
5. **Geometry** — visual marks (point, line, bar, area)
6. **Coordinates** — Cartesian, polar, projected
7. **Aesthetics** — Bertin's channels (position, color, size, shape)

### Why the grammar wins

A chart is **decomposable** into these 7 layers. Each layer has clear semantics. **Composition is principled, not opinion.** This grammar:
- Generates ggplot2 (Hadley Wickham, 2010+)
- Generates Vega / Vega-Lite (Wongsuphasawat et al., 2017+)
- Generates Plotly, D3 ecosystems
- Underpins automatic chart recommendation systems

**369 implication:** The `presentation()` engine should *be* a grammar — input data + intent → ranked compositions per the seven layers + C-M effectiveness.

---

## Wickham's Layered Grammar (2010)

**Citation:** Hadley Wickham. *"A Layered Grammar of Graphics."* Journal of Computational and Graphical Statistics, Vol. 19, No. 1, pp. 3–28.

**Innovation:** Make the grammar *additive*. A plot is a base + layers, each layer with data + mapping + stat + geom.

```r
ggplot(data, aes(x, y)) +
  geom_point() +
  geom_smooth(method = "lm") +
  facet_wrap(~ group)
```

**Properties this gives:**
- Incremental composition (add complexity step-by-step)
- Reusable layers across charts
- Deterministic output for the same code

**369 implication:** Composition operates as `base + layers + facets`, not monolithic specs. The renderer adds layers one at a time, each with its own scale + mapping + statistic.

---

## Heer & Bostock (2010) — Crowdsourced Validation

**Citation:** Jeffrey Heer & Michael Bostock. *"Crowdsourcing Graphical Perception: Using Mechanical Turk to Assess Visualization Design."* CHI '10.

**What they did:** Replicated Cleveland-McGill experiments on Mechanical Turk with thousands of subjects.

**Result:** The C-M ladder ranking **held up at scale.** Position > Length > Area > Color. Some refinements:
- The position-vs-length gap was smaller than C-M reported (~1.5× rather than 2×)
- Color saturation accuracy depends heavily on bin count (3 bins ~ok; 9 bins ~unusable)
- Stacked bars (position-via-length, mixed) intermediate between position and length

**Modern status:** The C-M ladder is the most-replicated finding in data-viz cognitive research. It is *the* perceptual-accuracy reference.

---

## Vega-Lite — Modern Implementation

**Citation:** Wongsuphasawat, Moritz, Anand, Mackinlay, Howe, Heer. *"Voyager: Exploratory Analysis via Faceted Browsing of Visualization Recommendations."* IEEE TVCG, 2016+.

**Vega-Lite** (vega.github.io/vega-lite) is the spec descendant of Wilkinson's grammar. It auto-recommends charts via:
1. CompassQL — query language for chart candidates
2. Effectiveness ranking — Cleveland-McGill direct
3. Expressiveness filter — Mackinlay direct

A 2026 chart-recommendation system **is** the C-M ladder + Wilkinson grammar.

---

## The Practical Scoring Rubric

For `presentation(data, intent, medium)` to be principled:

### Step 1 — Profile data
For each field: type (quantitative / ordinal / nominal), cardinality, distribution.

### Step 2 — Match intent to candidate compositions
| Intent | Candidate geoms |
|--------|-----------------|
| comparison | bar, dot, lollipop |
| ranking | sorted bar, slope chart |
| trend | line, area, sparkline |
| distribution | histogram, density, box-violin, jittered dot |
| correlation | scatter, hex-bin, contour |
| part-to-whole | stacked bar, donut, treemap, mosaic |

### Step 3 — Score each candidate

For each candidate composition, score each variable's channel:

```
score(candidate) = Σ effectiveness_weight(channel_for_var) for each var
```

**effectiveness_weight** (from C-M ladder):
| Channel | Weight |
|---------|--------|
| Position-common-scale | 1.0 |
| Position-non-aligned | 0.625 (1/1.6) |
| Length | 0.5 (1/2) |
| Angle | 0.4 (1/2.5) |
| Area | 0.2 (1/5) |
| Color saturation | 0.08 (1/12) |
| Color hue (categorical only) | 0.5 if ≤5 categories |
| Shape (categorical only) | 0.4 if ≤7 categories |

### Step 4 — Apply expressiveness filter
- Quantitative variable on shape-only channel → KILL
- Nominal variable on position scale → KILL
- More than 7 categories on color hue → KILL

### Step 5 — Return top 3 ranked

The trap gate also runs (chartjunk, baseline lies, category-overload, channel-level mismatch).

---

## 369 Engine Integration

This research formalizes what `presentation()` does intuitively. Concrete actions:

1. **Document the weights** in `src/base/presentation/scoring.ts`
2. **Add expressiveness filter** as a pre-rank gate
3. **Show C-M weights** in the decision trace ("position got 1.0; you proposed color saturation at 0.08")
4. **For `medium: 'terminal'` specifically:** the same ladder applies. Position via row/column is rank 1; sub-cell-precision bars (eighth-blocks) are rank 3 (length); color in terminals is rank 6.

**The lesson 369 inherits:** Choosing channels by aesthetic preference is statistically inferior. The C-M ladder is the principled choice.

---

## See Also

- [[tufte]] — Tufte's analytical-design canon (data-ink, rubric, trap gate)
- [[tufte-principles]] — deeper analytical-design principles
- `engines.md` — `presentation()` engine documentation
- [[tui-academic]] — the broader academic data-viz canon (overlap with Cleveland-McGill)
- [[ascii-composition]] — how the ladder maps to terminal output specifically

---

## Sources

- Cleveland & McGill 1984 — doi.org/10.1080/01621459.1984.10478080
- Cleveland 1985 — *The Elements of Graphing Data* (Wadsworth)
- Bertin 1967, 1983 EN — *Semiology of Graphics* (University of Wisconsin Press)
- Mackinlay 1986 — doi.org/10.1145/22949.22950
- Wilkinson 1999, 2005 — *The Grammar of Graphics* (Springer)
- Wickham 2010 — *"A Layered Grammar of Graphics"* JCGS
- Heer & Bostock 2010 — CHI'10 doi.org/10.1145/1753326.1753357
- Vega-Lite — vega.github.io/vega-lite
- Wongsuphasawat et al. 2016 — Voyager IEEE TVCG
