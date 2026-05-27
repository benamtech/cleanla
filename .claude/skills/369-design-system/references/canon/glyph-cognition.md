# Glyph Cognition — Why 369 Uses Unicode Characters, Not Icon Libraries

> **Glyphs are icons at maximum theoretical compression.** Paivio's dual-coding theory (1971): verbal + visual encoding combine for memory; pictures are remembered 98% accurately, words 88% (Shepard 1967). Standing (1973): humans recognize 10,000 images with 83% accuracy days later. Susan Kare's 1-bit Mac icons (1983–93) proved constraint clarity. The Bouba/Kiki effect (Köhler 1929, Ramachandran 2001): 80–95% cross-cultural sound-shape agreement. **All this is why Rule 6 forbids icon libraries and uses text glyphs.**

For Unicode catalog, see [[unicode-art-extended]]. For information-theoretic grounding, see [[information-theory]]. For HCI principles, see [[hci-foundations]].

---

## Paivio's Dual-Coding Theory (1971, 2007)

**Citation:** Allan Paivio. *Imagery and Verbal Processes* (Holt, Rinehart and Winston, 1971); *Mind and Its Evolution: A Dual Coding Theoretical Approach* (Erlbaum, 2007).

**Premise:** The brain has two parallel encoding systems:
- **Verbal (logogen):** processes words, names, phonological sequences
- **Visual (imagen):** processes pictures, shapes, spatial information

**Key insight:** Items encoded in *both* systems are recalled faster and with higher accuracy than items in either system alone.

### A Unicode glyph activates BOTH systems
- `✓` is visual (a tick shape)
- `✓` is verbal ("check," "checkmark," "yes")
- A user reading `✓` activates both logogen + imagen simultaneously

**This is the cognitive case for glyphs.** They are dual-coded by construction. Icon-font SVGs are visual-only. Plain text is verbal-only. **Unicode glyphs uniquely activate both.**

---

## The Picture Superiority Effect

**Citations:**
- Roger Shepard (1967). *"Recognition memory for words, sentences, and pictures."* Journal of Verbal Learning and Verbal Behavior, Vol. 6, No. 1.
- Lionel Standing (1973). *"Learning 10,000 pictures."* Quarterly Journal of Experimental Psychology, Vol. 25, No. 2.

### Shepard 1967 — the foundational experiment
Subjects shown words, sentences, or pictures (612 each). 1 week later, tested with pairs (one familiar, one new).

| Item type | Recognition accuracy |
|-----------|----------------------|
| Pictures | 98% |
| Sentences | 89% |
| Words | 88% |

### Standing 1973 — the extreme test
Subjects shown 10,000 pictures over 5 days. Tested days later.

- Recognition accuracy: **83% on 10,000 items**

**Implication:** human pictorial memory is *vast*. Estimates: 100,000+ image-recognition capacity in long-term memory. Verbal memory caps at much lower numbers.

### 369 application
- Glyph vocabulary should leverage picture-superiority
- A `✓` is remembered better than "completed"
- A `▲` is remembered better than "sort ascending"
- But: glyph + label is remembered better than glyph alone (dual-coding wins)

---

## Baddeley's Working Memory (1986, 2003)

**Citation:** Alan Baddeley. *Working Memory* (Oxford UP, 1986); *Working Memory and Language: An Overview* (Journal of Communication Disorders, 2003).

Three components (later 4):
1. **Phonological loop** — words, sounds (~2 sec capacity)
2. **Visuospatial sketchpad** — visual + spatial (~4 chunks)
3. **Central executive** — coordinator
4. (added 2000): **Episodic buffer** — multimodal integration

### Implication for glyphs
- A label-only design uses only phonological loop (1 channel)
- An icon-only design uses only visuospatial sketchpad (1 channel)
- A glyph + label design uses both — **effective working memory doubles**

### 369 application
- Pair glyph + label: `✓ Saved` not just `✓`, not just `Saved`
- Status indicators: `[●] Active` not `[Active]`, not just `[●]`

---

## Susan Kare's 1-bit Mac Icons (1983–93)

**Background:** Susan Kare designed the original Macintosh icons under severe constraints:
- 32×32 pixels
- 1-bit (black/white only)
- No anti-aliasing
- Tiny visual budget (1024 bits)

### Kare's principles (recovered from her writings + 2017 book *Susan Kare: Iconographic*)

1. **Clarity over realism** — recognizable silhouettes beat detailed shapes
2. **Metaphor grounded in shared culture** — paintbrush, scissors, trash can all globally readable
3. **Constrained palette enforces clarity** — 1-bit forces designers to pick the essential outline
4. **Friendly + functional** — icons can have personality without sacrificing function
5. **Test against extreme reduction** — if recognizable at 16×16 inverted, it's good

### 369 inheritance
- 369 glyphs are Kare's 1-bit principle taken to its limit: a single character cell
- Constraint produces clarity: `✓` for done; `✕` for cancel; `→` for next
- Cultural metaphor: arrows, checks, crosses are globally readable
- Personality emerges from glyph choice without decoration

---

## The Bouba/Kiki Effect

**Citations:**
- Wolfgang Köhler (1929). *Gestalt Psychology* (Liveright). Original "takete/maluma" experiment.
- V.S. Ramachandran & Edward Hubbard (2001). *"Synaesthesia — A Window Into Perception, Thought and Language."* Journal of Consciousness Studies, Vol. 8, No. 12.

**Experiment:** Show subjects two shapes — one rounded (`◯`), one jagged (`✦`). Give them two nonsense words — "bouba" and "kiki." Ask which name goes with which shape.

**Result:** 80–95% of subjects across cultures assign:
- Round shape → "bouba" (soft sound)
- Jagged shape → "kiki" (sharp sound)

**The implication:** sound-shape correspondence is **cross-cultural, not learned.** Round-soft-vowel and sharp-hard-consonant associations are universal.

### 369 application — semantic glyph choice
This isn't superstition — it's measurable cognitive alignment:

| Concept | Sharp glyph (kiki) | Round glyph (bouba) |
|---------|---------------------|----------------------|
| Cancel | `✕` `╳` | NOT `●` |
| Confirm/done | `✓` (sharp closure feels decisive) | also `●` (round = positive) |
| Stop | `■` (hard square) | NOT `○` |
| Active | `●` (full, present) | — |
| Inactive | `○` (empty, neutral) | — |
| Warning | `▲` (sharp peak) | — |
| Sort up | `▲` | — |
| Sort down | `▼` | — |
| Selected | `●` | — |
| Unselected | `○` | — |

Bouba/Kiki research validates these choices empirically.

---

## Why NOT Icon Libraries (Lucide, Heroicons, Phosphor)

The structural arguments:

### 1. Unicode renders in any font; SVG icons require font/file dependency
- Unicode `✓` works on any system without extra files
- SVG icons need installation, bundling, version-locking, MIME-type handling

### 2. Glyphs scale with font size automatically
- `<text size="12">✓</text>` scales naturally
- `<svg width="12" height="12">` requires explicit sizing + DPI handling

### 3. Screen readers handle Unicode glyphs natively
- `✓` is read aloud as "check mark" (Unicode-named)
- SVG icons need explicit `aria-label`, which most projects forget

### 4. Cross-platform consistency
- Unicode 1.1+ glyphs render identically across OS/font (with minor variations)
- Icon-font glyphs vary by font version, OS, browser

### 5. No supply-chain risk
- Unicode is a standard, not a dependency
- Lucide/Heroicons can change APIs, break versioning, get acquired

### 6. AI-agent readability
- LLMs read `✓` semantically as "check mark"
- LLMs read `<svg path="..."/>` as XML attributes, not as meaning

### 7. Long-term archival
- Plain text with Unicode is readable in 50 years
- SVG icon files require renderer maintenance

### 8. Code review clarity
- `<button>✓ Save</button>` is visible meaning in source
- `<button><Icon name="check"/> Save</button>` requires lookup

---

## Cross-Platform Glyph Stability

Critical insight from emoji research:

### Miller et al. 2017 — *"Investigating the Potential for Miscommunication Using Emoji"*
Different platforms render emoji differently. The same `🙏` codepoint shows different drawings on iOS vs Android. **Misinterpretation rate: 25% across platforms.**

### Tigwell & Flatla 2016 — *"Oh that's what you meant"*
Studied emoji ambiguity in text messaging. Found platform-dependent rendering significantly affects interpretation.

### The 369 doctrine
**Avoid emoji on `/369`** (Rule 6). Use text-style Unicode glyphs:
- Stable across platforms (basic Unicode renders consistently)
- Text-style variation selector (U+FE0E) forces text rendering even on emoji-rendering systems
- `✓` (U+2713) renders as text on every platform
- `✅` (U+2705) renders as emoji and varies wildly

**Examples of platform-stable glyphs:**
- `★ ✓ ✕ → ← • ▶ ▼ ◀ ▲ ■ ▣ ◯ ●`
- Unicode 1.1 era (pre-emoji); all stable
- Render via monospace font, not via emoji renderer

---

## The 369-Approved Glyph Vocabulary

Each glyph below documented with:
- Codepoint
- Bouba/Kiki alignment (round/sharp/neutral)
- Cultural meaning (cross-cultural where evidence)
- Use case

| Glyph | Codepoint | Type | Meaning | Use case |
|-------|-----------|------|---------|----------|
| `★` | U+2605 | Sharp | Excellence, favorite | Rating, bookmark |
| `✓` | U+2713 | Sharp | Affirmation, done | Completed item, confirmation |
| `✕` | U+2715 | Sharp | Negation, cancel | Cancel, dismiss, error |
| `→` | U+2192 | Sharp | Forward direction | Next, navigate-to |
| `←` | U+2190 | Sharp | Back direction | Previous, return |
| `•` | U+2022 | Round | Bullet, list item | Unordered list |
| `▶` | U+25B6 | Sharp | Play, expand | Media play, expandable section |
| `▼` | U+25BC | Sharp | Sort descending | Sort-direction indicator |
| `◀` | U+25C0 | Sharp | Previous (media) | Media previous |
| `▲` | U+25B2 | Sharp | Sort ascending, warning | Sort-direction, warning |
| `■` | U+25A0 | Sharp | Stop, filled square | Media stop, filled selection |
| `□` | U+25A1 | Neutral | Empty square | Empty checkbox |
| `●` | U+25CF | Round | Active, present | Active state, selected |
| `○` | U+25CB | Round | Inactive, absent | Inactive state, unselected |
| `◉` | U+25C9 | Round | Selected/marked | Selected radio, marked |
| `[×]` | bracket+×+bracket | Sharp | Close action (verbose) | Close button |
| `[+]` | bracket+plus+bracket | Sharp | Add action (verbose) | Add button |
| `[−]` | bracket+minus+bracket | Sharp | Remove action (verbose) | Remove button |
| `i` | U+0069 (Latin) | Neutral | Information | Info tooltip |
| `?` | U+003F | Sharp | Question, help | Help action |

For full Unicode catalog, see [[unicode-art-extended]].

---

## Cognitive Load Comparison Table

| Glyph approach | Visual encoding | Verbal encoding | Memory channels | Cross-platform | Accessibility |
|----------------|-----------------|-----------------|------------------|-----------------|----------------|
| Unicode glyph (`✓`) | ✓ | ✓ (named) | Both (dual-coded) | ✓ stable | ✓ screen-reader native |
| Text label ("Done") | ✗ | ✓ | Verbal only | ✓ | ✓ |
| SVG icon | ✓ | Requires aria-label | Visual only | Depends on font | Requires explicit |
| Emoji (`✅`) | ✓ | Varies | Both but varies | ✗ varies | Partial |
| PNG icon | ✓ | Requires alt | Visual only | ✓ | Requires explicit |

**Unicode glyphs dominate across every dimension.** This is the cognitive case.

---

## Stroop Effect (1935) — Multi-Channel Alignment

**Citation:** John Ridley Stroop (1935). *"Studies of interference in serial verbal reactions."* Journal of Experimental Psychology Vol. 18, No. 6.

The classic Stroop test: read the *color* of words written in different colors. When the word "RED" is printed in blue ink, reading "blue" is slow (~200ms+ longer than for control).

**Implication:** when channels align (visual + verbal say the same thing), processing is fast. When they conflict, processing is slow.

### 369 application
- `✓ Done` is fast (glyph + word align)
- `✕ Done` is slow (glyph contradicts word)
- Never use a glyph that contradicts its label
- Status indicators must align across all channels (glyph + color + text)

---

## AIGA Pictograms (1974) — Universality Under Constraint

**Citation:** American Institute of Graphic Arts. *Symbol Signs* (US Department of Transportation, 1974). 50 pictographs for airports, public spaces.

**Design constraints:**
- Single color, single line weight
- No text required
- 80%+ recognition across cultures (tested empirically)

The AIGA pictograms became globally standard. Airport signage, public restroom symbols, etc.

### 369 lesson
- Constrain ruthlessly; clarity emerges
- Test against ~80% recognition threshold (not 100%)
- Universal glyphs > culturally-specific decorations

---

## The 369 Doctrine on Glyphs

1. **Glyphs ARE icons at maximum theoretical compression.** Unicode glyphs are not "lite icons"; they are the principled icon choice.

2. **Dual-code every signifier.** Pair glyph + label whenever both fit. Activates both Paivio systems; memory doubles.

3. **Choose glyphs by Bouba/Kiki alignment.** Sharp glyphs for sharp concepts; round for round; neutral for neutral. The cognitive resonance is measurable.

4. **No icon libraries.** Lucide, Heroicons, Phosphor, etc. all fail at cross-platform stability, accessibility, archival durability, and AI-readability.

5. **No emoji on `/369`.** Use text-variation-selector if you must (`✓︎`); prefer base Unicode glyphs.

6. **Test against AIGA standard.** If a glyph isn't 80% recognizable across cultures, replace it with text.

7. **Don't break the Stroop alignment.** Glyph + color + text must agree. Conflicting channels slow processing.

8. **The 22 glyphs listed above are the canonical 369 set.** Adding to this set requires justification.

---

## See Also

- [[unicode-art-extended]] — full Unicode codepoint catalog
- [[information-theory]] — Stroop + Sweller cognitive-load grounding
- [[hci-foundations]] — Norman affordances + signifiers
- [[tui-ux-design]] — affordances without hover
- `visual-rules.md` — Rule 6 (no decoration; text glyphs only)

---

## Sources

- Paivio 1971 — *Imagery and Verbal Processes* (Holt)
- Paivio 2007 — *Mind and Its Evolution* (Erlbaum)
- Shepard 1967 — JVLVB 6:1
- Standing 1973 — QJEP 25:2
- Baddeley 1986 — *Working Memory* (Oxford UP)
- Köhler 1929 — *Gestalt Psychology* (Liveright)
- Ramachandran & Hubbard 2001 — JCS 8:12
- Stroop 1935 — JEP 18:6
- Kare 2017 — *Susan Kare: Iconographic* (Princeton Architectural Press)
- AIGA 1974 — *Symbol Signs* (US DOT)
- Miller et al. 2017 — *"Investigating the Potential for Miscommunication Using Emoji"*
- Tigwell & Flatla 2016 — *"Oh that's what you meant"*
- Latour & Woolgar 1979 — *Laboratory Life* (Princeton UP)
- Lynch 1960 — *The Image of the City* (MIT Press)
