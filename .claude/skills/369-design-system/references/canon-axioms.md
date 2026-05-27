# Canon Axioms — Design Rules Inherited from the Canon Library

> **This is the bridge between canon and core.** The `references/canon/` library is reference material loaded on demand. This document promotes specific canon findings into **design-system axioms** — rules that apply to every 369 component, not just on-demand reads. Load this as part of any deep work; the canon files remain on-demand for depth.

For canon entry-point, see `canon/INDEX.md`. For epistemic context, see `canon/knowledge-bounds.md`.

---

## Why these are axioms, not references

The canon documents *what is*. The axioms document *what 369 will do with it*. The canon teaches that:
- Constraints generate style (Reunanen, Botz)
- Same-input-same-output is structural in Elm Architecture (Bubble Tea)
- Half-blocks double color resolution (BBS scene 1990s)
- Synchronized output prevents tearing (mode 2026)
- Kitty keyboard protocol won (2026 emulator support matrix)

These findings became 369 rules. The axioms below are the result.

---

## Axiom 1 — Constraint Aesthetics (from [[canon/tui-academic]] + [[canon/demoscene]])

**Severity of limitation ↔ elegance of solution.** The visible-optimization-work principle.

**Sources:**
- Markku Reunanen — *Times of Change in the Demoscene* (Turku, 2017)
- Daniel Botz — *Kunst, Code und Maschine* (LMU, 2011)
- Commodore 64 demoscene: 64 KB RAM forced procedural generation; less-constrained hardware (Amiga, PC) produced less aesthetically coherent demoscene cultures

**369 application:**
- Rule 1 (spacing ×3) and Rule 5 (8-token palette) are *self-imposed* constraints, not arbitrary
- The aesthetic feels "clever" *because* the limits are visible
- When tempted to add a feature/color/decoration: ask whether the limit is the source of the value
- Never apologize for the constraint; document why it produces good output

**Operative rule:** A 369 component that requires a non-multiple-of-3 spacing, a non-palette color, or a decoration token is not a "limitation"; it is a **violated invariant**. Refactor the component, don't loosen the rule.

---

## Axiom 2 — Same-Input → Same-Output is Structural (from [[canon/tui-design]] + [[canon/tui-frameworks-complete]])

The Elm Architecture (Bubbletea) **structurally enforces** Rule 8 by making the View a pure function of the Model. There is no path to a non-deterministic output.

**369 application:**
- `presentation(data, intent, medium)` MUST be a pure function. No `Date.now()`, no `Math.random()`, no environment reads outside `medium`.
- `resolveAny(component, intent)` MUST be deterministic. The decision trace is part of the contract.
- If you can't run a function twice with the same inputs and get the same output, **the function is broken** — not the test.

**Operative rule:** A 369 engine that emits different HTML on identical inputs is broken. No "minor variation acceptable." Fix the source of nondeterminism.

---

## Axiom 3 — Terminal Is a First-Class Medium (from [[canon/terminal-capabilities]] + [[canon/ascii-composition]] + [[canon/tui-modern-2026]])

Per `arXiv:2603.10664` ("Terminal Is All You Need"): terminal interfaces empirically *outperform* graphical UIs for human-AI collaboration. Three design properties enable this:

1. **Representational compatibility** — agent and interface share semantic/syntactic space
2. **Transparency** — human sees all actions immediately
3. **Low entry barriers** — text streams require no special tools

**369 application:**
- `presentation(data, intent, 'terminal')` is **not a fallback**. It is a peer medium with the same rubric and the same engine guarantees.
- The terminal medium has its own glyph vocabulary (see [[canon/unicode-art-extended]]), color tier (see [[canon/terminal-capabilities]] §Color Systems), and rendering pipeline (see [[canon/ascii-composition]]).
- A 369 component that only renders to `medium: 'desktop'` is **incomplete**. Implement `'terminal'` too.

**Operative rule:** Engine output for `medium: 'terminal'` is a contract, not a nice-to-have. Treat it as you would `medium: 'mobile'`.

---

## Axiom 4 — Half-Block Color Doubling (from [[canon/ascii-rendering-algorithms]] + [[canon/ascii-ansi-art]])

The 1990s BBS-scene breakthrough: use `▄` (lower-half block) with distinct fg/bg colors → **2 colored pixels per terminal cell**. The trick that made ANSI art look "not like ASCII art."

**369 application:**
- When `medium: 'terminal'` needs photo/image rendering: half-block doubling is the default algorithm
- For sub-cell precision in bars: use `▏▎▍▌▋▊▉█` (Unicode block elements horizontal eighths)
- For sparklines: use `▁▂▃▄▅▆▇█` (vertical eighths)
- For 2×2 pixel art per cell: use quadrant blocks `▘▝▖▗▙▚▛▜▟▞▌▐▀▄█`
- For ~8× density: use braille patterns `⠀…⣿` (2×4 dots per cell)
- For 2×3 density: use sextant blocks `🬀…🬵` (U+1FB00 range)

**Operative rule:** When rendering data at sub-cell precision in the terminal, **the algorithm is named** (half-block / eighth-block / quadrant / braille / sextant). Don't invent ad-hoc rendering; use the documented algorithm from `canon/ascii-composition.md`.

---

## Axiom 5 — Synchronized Output is Required for Production TUIs (from [[canon/terminal-capabilities]] + [[canon/escape-codes-complete]])

DEC private mode 2026 (`CSI ? 2026 h` / `l`) is the BSU/ESU pair that wraps a frame in atomic rendering. Without it, fast-update TUIs tear.

**Supporting terminals (2026):** tmux 3.4+, Xterm.js, Windows Terminal, Contour, Blink Shell, WezTerm, Kitty, Ghostty, Foot.

**369 application:**
- Every 369 TUI MUST emit BSU/ESU around every frame
- Graceful fallback: unsupported terminals ignore the codes — no harm
- T6 in the TUI rules: "Single write per frame" — codified in [[canon/tui-design]]

**Operative rule:** A 369 TUI without BSU/ESU wrapping is **broken**, not just suboptimal. Modern terminals expect it; tearing is a UX failure.

---

## Axiom 6 — Kitty Keyboard Protocol is the Baseline (from [[canon/terminal-capabilities]] + [[canon/tui-modern-gaps]])

Kitty keyboard protocol won the 2024–26 keyboard-standardization race. Adopted by: Kitty, WezTerm, Ghostty, Alacritty, Foot, iTerm2, VS Code terminal, Warp, Rio. libtermkey is now maintenance-only.

**369 application:**
- A 369 TUI queries `CSI ? u` on startup
- If supported: enable disambiguation (`CSI > 1 u`)
- If not supported: fall back to legacy ESC-parsing with timeout
- Document keyboard surface explicitly (which keys, what modifiers)

**Operative rule:** Don't assume legacy keyboard parsing. Test on a Kitty-protocol-capable emulator first; degrade gracefully.

---

## Axiom 7 — Rule of Silence in Production Output (from [[canon/unix-cli-principles]] + [[canon/final-sweep]] §Julia Evans)

ESR Rule 11: *"When a program has nothing surprising to say, it should say nothing."* Julia Evans' Terminal Rules: successful operations produce no output by default.

**369 application:**
- Successful 369 operations produce **no output** unless `--verbose`
- Progress goes to stderr; data goes to stdout
- Pipeable: a user piping output should not have to filter status messages
- Honor `NO_COLOR` env var; respect `--quiet`

**Operative rule:** A 369 CLI that prints "✓ Done" on success is wrong (unless `--verbose`). Print on errors, print on `--verbose`, otherwise silent.

---

## Axiom 8 — Internationalization is Pre-Display, Not Render-Time (from [[canon/tui-i18n]])

The terminal cannot reorder text. Complex scripts (Devanagari, Khmer, Thai) require shaping; Arabic/Hebrew require BiDi reordering. These cannot be done by the terminal — they must happen **before** the bytes are emitted.

**369 application:**
- Run BiDi text through fribidi / HarfBuzz **before** emit
- Normalize to NFC (not NFD) — some terminals drop combining marks in NFD
- For complex scripts where pure terminal rendering fails: fall back to the **image plane** (Sixel / Kitty graphics) — see [[canon/terminal-capabilities]]
- Use utf8proc or fish-shell-style wcwidth, not glibc's (see [[canon/tui-i18n]] §Implementation divergence)

**Operative rule:** A 369 component handling multilingual text MUST normalize (NFC) and pre-shape (fribidi/HarfBuzz) before reaching the engine. The engine does not BiDi.

---

## Axiom 9 — Domain-Specific Abstraction Beats Generic Tools (from [[canon/historical-tuis]])

The pattern survives 40+ years: tools that **encode domain knowledge** outcompete generic tools.
- k9s isn't a generic browser — it models Kubernetes
- lazygit isn't a generic command runner — it models git
- Emacs isn't an editor — it's a Lisp machine
- VisiCalc isn't a grid — it's a financial-model substrate

**369 application:**
- A 369 component for `[CLIENT]` work models the client domain, not "a form with fields"
- A 369 SSM card models the spec-sheet domain, not "a generic detail view"
- When designing a new component: ask "what domain knowledge does this encode?" — if the answer is "none," the component is generic and probably wrong

**Operative rule:** Generic abstractions are red flags. A 369 PILLAR's name should disclose its domain (`<SSMCard>` not `<DetailView>`).

---

## Axiom 11 — Perceptual Accuracy Beats Aesthetic Preference (from [[canon/cleveland-mcgill]])

Cleveland & McGill (1984) measured perceptual error rates per channel: position ~2.5%, length ~5%, area ~15%, color saturation ~30%. **A chart encoding the primary quantity in color when position was available has accepted 10× the error rate.** This is measurable inferiority, not "aesthetic choice."

**369 application:**
- `presentation()` MUST weight channel selection by Cleveland-McGill ranks
- Position is always preferred for quantitative data
- Color saturation alone is forbidden for primary encoding
- Decision trace shows C-M weights ("position got 1.0; color saturation 0.08")

**Operative rule:** A 369 chart that encodes magnitude in color hue when position was viable is broken, not stylized.

---

## Axiom 12 — Patterns Form Languages, Not Catalogs (from [[canon/pattern-language]])

Alexander's *Pattern Language* (1977): patterns link in a graph, with each pattern declaring which larger patterns it completes and which smaller patterns complete it. The 1,800+ inter-pattern relationships form the *language*. GoF (1994), POSA (1996), Atomic Design (2013), Material Design — all inherit this.

**369 application:**
- Each 369 component / card / layout declares its position in the language
- Pattern format: name, context, problem, forces, solution, related patterns
- The 15 properties of living structure form the audit rubric for visual coherence
- "Quality Without A Name" (QWAN) is the emergent property of correct composition

**Operative rule:** A 369 component that doesn't link up + down the pattern hierarchy is a generic abstraction — Axiom 9 red flag.

---

## Axiom 13 — Three-Level Emotional Design (from [[canon/hci-foundations]])

Don Norman (2005): every interaction is processed at three levels — Visceral (first impression), Behavioral (fluency in use), Reflective (meaning + identity). A 369 surface succeeds at all three or fails entirely.

**369 application:**
- Visceral: clean ×3 grid + sparse palette = immediate "I trust this"
- Behavioral: single-keystroke ops + sub-100ms feedback = "this is fast"
- Reflective: TUI heritage + power-user lineage = "I am the user who uses tools like this"

**Operative rule:** A 369 component that wins visceral + behavioral but fails reflective will be abandoned despite functional success.

---

## Axiom 14 — Bridge Both Gulfs (from [[canon/hci-foundations]])

Norman's Gulf of Execution (user goal → action) + Gulf of Evaluation (system state → user perception). Design that fails closes neither. Design that succeeds bridges both.

**369 application:**
- Affordances + signifiers + constraints bridge Execution gulf
- Feedback + status line + mental-model alignment bridge Evaluation gulf
- Every 369 surface must do both. Not just signal "click here" — also signal "X happened because you clicked there."

**Operative rule:** A 369 component without status feedback fails Axiom 14, regardless of other qualities.

---

## Axiom 15 — ×3 Is Mathematically Defensible (from [[canon/grid-typography]])

Rule 1 is not arbitrary. ×3 chains generate the same harmonic ratios (perfect fourth, perfect fifth, octave) as Bringhurst's typographic canon + Müller-Brockmann's 12-column Swiss grid, at finer granularity than Material's ×8, with cleaner divisibility (3 divides 12 cleanly; 8 does not), and visual differentiation from Material/iOS.

**369 application:**
- When a designer asks "why ×3 not ×8?", cite this axiom + the canon page
- All spacing chains contain harmonic ratios at semantic boundaries
- Type scale `{9, 12, 15, 18, 24, 30, 33, 36}` is hybrid arithmetic/harmonic

**Operative rule:** Rule 1 is defensible to skeptics, citable in design reviews, derivable from first principles.

---

## Axiom 16 — Accessibility Is Innovation, Not Compliance (from [[canon/inclusive-design]])

Mismatch theory (Holmes 2018): disability is in the interaction, not the person. Curb-cut effect: features designed for permanent disability create wins for the much larger situational-disability population. Designing for one extends to many.

**369 application:**
- "Accessibility tier IS the 369 baseline." No separate mode.
- Permanent / temporary / situational matrix used in design reviews
- Universal Design's 7 principles applied as defaults
- WCAG POUR (Perceivable, Operable, Understandable, Robust) as audit rubric

**Operative rule:** A 369 feature reframed as compliance-only is positioned wrong. The same feature reframed as innovation source is design-positive.

---

## Axiom 17 — Information Has Math (from [[canon/information-theory]])

Shannon entropy, Hick-Hyman log₂(N), Miller's 7±2 / Cowan's 4±1, Sweller's cognitive load, Fitts's bits-per-second, Kahneman's System 1/2. Density rules have **measurable cost**, not just "feels right."

**369 application:**
- Sidebar items ≤ 7 (Miller) or ≤ 4 (Cowan) — depending on whether grouping is possible
- Dropdown N > 16 switches to fuzzy-find (Hick-Hyman threshold)
- Form fields per screen ≤ 5
- One System-2 pattern wastes ~5000 hours/year per 1000 users — measurable economic argument
- Animations are extraneous load unless they convey state

**Operative rule:** When density tradeoffs come up in review, compute the bits + cite the law. Replace opinion with math.

---

## Axiom 18 — Survive Aesthetic Cycles via Token-First (from [[canon/design-system-history]])

Apple HIG (39 years), Material (12 years through 3 regenerations), Bauhaus principles (100+ years) all survived because tokens + grid + principles outlive specific aesthetic choices. Microsoft Metro (7 years), Apple Aqua (14 years), Skeuomorphism died when their aesthetic dated.

**369 application:**
- Ship tokens (×3, palette, type scale) first; components second
- Version aggressively, name it evolution (369 → 369.2 → 369.3)
- Never fork-and-replace (avoid "369 → newname" trap)
- Keep 369 as token + grid system + axioms; not "the manila aesthetic"
- If aesthetic dates, swap colors but keep structure

**Operative rule:** A 369 decision that bets on a specific aesthetic detail (e.g., a culturally-locked metaphor) carries a 10-year expiration. Decisions on tokens + grid + principles do not expire.

---

## Axiom 19 — Design for the 10,000th User (from [[canon/habit-formation]])

Vim users practice for years and commit; most apps churn at week 2. The difference is *which user the design optimizes for*. 369 optimizes for the 10,000th use, not the first. This is a structural design choice with consequences.

**369 application:**
- Hotkeys are habit-loop scaffolds (Cue → Routine → Reward)
- 66-day commitment curve is real — design for failure-tolerance days 1–14, speed-reward days 45+
- Flow state preserved over feature density
- No dopamine hijacking — no streaks, badges, gamification, notifications
- Custom configurability is investment that raises switching cost ethically
- Stable conventions reinforce System 1 — never reassign canonical keys

**Operative rule:** A 369 feature that optimizes for first-use ease at the cost of 10,000th-use velocity is a strategic mistake.

---

## Axiom 20 — Glyphs Are Icons at Maximum Compression (from [[canon/glyph-cognition]])

Paivio's dual-coding (1971): verbal + visual encoding combine for memory. Picture-superiority effect (Shepard 1967): 98% picture recognition vs 88% words. Susan Kare's 1-bit Mac icons proved constraint clarity. Bouba/Kiki (Köhler/Ramachandran): 80–95% cross-cultural sound-shape agreement.

**369 application:**
- Unicode glyphs are dual-coded (visual + verbal); icon-font SVGs are visual-only; text labels are verbal-only
- Pair glyph + label whenever both fit
- Choose glyphs by Bouba/Kiki alignment (sharp for sharp concepts, round for round)
- No icon libraries (Lucide, Heroicons, Phosphor) — cross-platform stability, accessibility, AI-readability all fail
- No emoji on `/369` (variation selectors, platform inconsistency)
- 22-glyph canonical 369 set; additions require justification

**Operative rule:** Rule 6 (text glyphs only) is not aesthetic — it's the cognitively optimal icon choice.

---

## Axiom 21 — Format Is Interface (from [[canon/format-as-interface]])

The longest-lasting UI in computing is not an app — it's a file format. README.md, .NFO files, dotfiles, JSON, CSV, Markdown. In the LLM-agent era (2024+), files-as-interface is the substrate both humans AND AI agents consume.

**369 application:**
- Markdown-first documentation (CommonMark-compliant)
- TOML for user-facing config; JSON for machine-generated; Cuelang for schema
- Every PILLAR has README.md following documented structure
- AGENTS.md or equivalent at every 369 project root
- Data export = data interface (JSONL preferred; CSV for spreadsheet compat)
- Durability over platform: no Notion, no Figma as canonical state
- Man-page format for complex 369 CLI tools

**Operative rule:** A 369 component that doesn't expose its state through a human-readable, agent-readable file format is incomplete.

---

## Axiom 10 — Knowledge is Append-Only with Corrections (from [[canon/knowledge-bounds]])

The canon documents what's known *as of 2026-05-27*. New knowledge appears continuously: new framework releases, new academic papers, new artists active 2027+, new escape codes ratified.

**369 application:**
- Canon files are append-only — never delete documented knowledge
- Inline corrections preferred over rewrites (`(corrected 2026-06-01: this changed)`)
- New knowledge slots into existing canon files per [[canon/INDEX.md]] §How to Extend
- Confidence levels are explicit (see [[canon/knowledge-bounds]] §Statement of Confidence Levels)

**Operative rule:** When 369 contributors find new information: add it inline to the relevant canon file with a date stamp. Never silently rewrite history.

---

## Mapping — Canon Findings → 369 Rules

This table makes the integration explicit:

| Canon source | 369 rule it informs |
|--------------|----------------------|
| [[canon/tui-academic]] Reunanen/Botz constraint aesthetics | Axiom 1 + Rule 1 spacing + Rule 5 palette |
| [[canon/tui-design]] Elm Architecture | Axiom 2 + Rule 8 same-input-same-output |
| [[canon/tui-frameworks-complete]] Bubbletea MVU | Axiom 2 + engine purity |
| [[canon/terminal-capabilities]] | Axioms 3 + 5 + 6 |
| [[canon/escape-codes-complete]] | Axiom 5 (BSU/ESU) + Axiom 6 (Kitty kbd) |
| [[canon/ascii-composition]] | Axiom 4 sub-cell precision |
| [[canon/unicode-art-extended]] | Axiom 4 glyph vocabulary |
| [[canon/ascii-rendering-algorithms]] | Axiom 4 named algorithms |
| [[canon/ascii-ansi-art]] | Axiom 1 (constraint history) + Axiom 4 (half-block heritage) |
| [[canon/unix-cli-principles]] | Axiom 7 Rule of Silence + ESR's 17 rules |
| [[canon/tui-i18n]] | Axiom 8 pre-display normalization |
| [[canon/historical-tuis]] | Axiom 9 domain abstraction |
| [[canon/knowledge-bounds]] | Axiom 10 append-only canon |
| [[canon/tui-patterns]] | Interaction defaults (modal/modeless, command palette, focus mgmt) |
| [[canon/tui-modern-gaps]] | Accessibility/i18n/keyboard-protocol baselines |
| [[canon/final-sweep]] §Julia Evans | Axiom 7 + 7 unwritten terminal conventions |
| [[canon/final-sweep]] §Brandur Leach | Axiom 3 + composability framing |
| [[canon/cleveland-mcgill]] | **Axiom 11** — perceptual accuracy ladder |
| [[canon/pattern-language]] | **Axiom 12** — patterns form languages |
| [[canon/hci-foundations]] | **Axioms 13 + 14** — three-level design + bridge both gulfs |
| [[canon/grid-typography]] | **Axiom 15** — ×3 mathematical defense |
| [[canon/inclusive-design]] | **Axiom 16** — accessibility as innovation |
| [[canon/information-theory]] | **Axiom 17** — information has math |
| [[canon/design-system-history]] | **Axiom 18** — token-first survives aesthetic cycles |
| [[canon/habit-formation]] | **Axiom 19** — design for the 10,000th user |
| [[canon/glyph-cognition]] | **Axiom 20** — glyphs are icons at max compression |
| [[canon/format-as-interface]] | **Axiom 21** — format IS interface |

---

## How to Use This Document

**During design:** Read this file before writing a new 369 component. The axioms are guardrails — if a component design conflicts with an axiom, the design needs rework.

**During audit:** Read this file when auditing existing code. Each axiom is a checkpoint. If the code violates an axiom without justification, it's a bug.

**During extension:** When new canon knowledge surfaces, ask whether it warrants a new axiom. If yes, add it here AND update the canon file. The two files should be coherent.

**Relationship to the 9 non-negotiable rules** (in SKILL.md):
- The 9 rules are concrete: "padding must be a multiple of 3."
- The 10 axioms are foundational: "constraints generate style — that's why padding must be a multiple of 3."
- A new contributor reads the 9 rules first. A senior contributor reads the axioms to understand why the rules exist.

---

## See Also

- `../SKILL.md` — The 9 non-negotiable rules + router
- `canon/INDEX.md` — Master canon navigation
- `canon/knowledge-bounds.md` — Confidence + epistemic limits
- `visual-rules.md` — Concrete spacing/color/typography rules
- `engines.md` — `presentation()` + `resolveAny()` engine docs
- `architecture.md` — BASE/PILLARS/ROOF file placement

---

## Statement of Integration

This document represents the practical integration of 31 canon files (~624KB) into the 369 design system as concrete design rules. The canon remains on-demand reference; the axioms here are always-applied. Together they form the complete 369 knowledge surface:

- **In SKILL.md:** the 9 non-negotiable rules + router
- **In references/canon-axioms.md (this file):** the 10 axioms derived from canon
- **In references/visual-rules.md, engines.md, etc.:** concrete operational details
- **In references/canon/:** depth on demand

A user invoking the 369 skill reads the 9 rules. A user designing a new component reads the axioms. A user solving a specific problem loads the relevant canon file. **Each layer is sufficient for its scope.**
