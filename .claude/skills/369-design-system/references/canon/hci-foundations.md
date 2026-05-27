# HCI Foundations — Norman + Krug + Gestalt + the Foundational Laws

> **The HCI canon that 369 has been informally referencing.** Don Norman's *Design of Everyday Things* (1988/2013) gave us affordances, signifiers, the 7 stages of action. Steve Krug's *Don't Make Me Think* (2000) gave us the 3 web-usability laws. The Gestalt psychologists (Wertheimer/Köhler/Koffka, 1910s–30s) gave us proximity, similarity, closure, continuity, figure-ground, common fate. Fitts (1954), Hick-Hyman (1952–53), Tesler (1985), Card-Moran-Newell GOMS (1983), Shneiderman's 8 rules, Tognazzini's 16 — all of these are the substrate. **369 owns them in 369-native form, following the "rebrand, don't reinvent" doctrine.**

For data-viz canon, see [[tufte]] + [[cleveland-mcgill]]. For TUI-specific UX, see [[tui-ux-design]]. For information-theory grounding, see [[information-theory]].

---

## Don Norman — The Design of Everyday Things

**Citation:** Donald A. Norman. *The Design of Everyday Things* (Basic Books, 1988; revised 2013).

### The 7 Fundamental Principles of Design (revised 2013)

1. **Discoverability** — User can figure out what actions are possible, current state, alternatives
2. **Feedback** — Every action communicates result back to user
3. **Conceptual Model** — User's mental model matches system behavior
4. **Affordances** — Possibilities for action ("affordance" originally from Gibson 1979; Norman modified to "perceived affordance")
5. **Signifiers** — Perceptible cues that signal where action can occur (replaced "affordance" in many 2013 contexts)
6. **Mappings** — Relationship between controls and their effects (intuitive mapping = light switch position matches lamp location)
7. **Constraints** — Physical / semantic / cultural / logical limits guide users away from errors

### The 7 Stages of Action

```
GOAL (what do I want?)
  ↓
PLAN (what should I do?)
  ↓
SPECIFY (how do I do it?)
  ↓
PERFORM (do it)
  ↓
PERCEIVE (what happened?)
  ↓
INTERPRET (what does it mean?)
  ↓
COMPARE (did it meet my goal?)
```

### The Two Gulfs

- **Gulf of Execution** — distance between user's goal and the means to act. Bridged by: affordances, signifiers, constraints, mappings.
- **Gulf of Evaluation** — distance between the system's state and the user's perception. Bridged by: feedback, conceptual model.

**Design that fails closes neither gulf.** Design that succeeds bridges both.

### Emotional Design — 3 Levels

**Citation:** Norman. *Emotional Design* (Basic Books, 2005).

- **Visceral** — first impression, reflexive aesthetic response
- **Behavioral** — pleasure of use, fluency, learnability
- **Reflective** — meaning, identity, status, the long-term self-narrative

A 369 surface must be designed at all three levels. Visceral failure = users won't try it. Behavioral failure = users abandon. Reflective failure = users don't recommend.

---

## Steve Krug — Don't Make Me Think

**Citation:** Steve Krug. *Don't Make Me Think: A Common Sense Approach to Web Usability* (3rd ed., New Riders, 2014).

### The 3 Laws

1. **Don't make me think.** Every screen has one obvious primary action; users shouldn't have to puzzle over what to do.
2. **It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice.** Click depth is not the problem; click *ambiguity* is.
3. **Get rid of half the words on each page. Then get rid of half of what's left.** Brevity is discipline. Most prose is filler.

### Other Krug principles
- **Scanning, not reading** — users F-pattern scan; design for it (left column, top row, scannable headers)
- **The Trunk Test** — without focus, mute, distraction-free: can the user identify the page's purpose in 3 seconds? Site/section/your-location.
- **Usability testing on a budget** — 3 users find 80% of problems; expensive testing not required

### 369 application
- Every 369 screen must have ONE obvious primary action (not three)
- Pruning words: status-line messages should be the *terminal* state of editing, not the first draft
- Every screen passes the Trunk Test: purpose visible in 3 seconds

---

## Gestalt Psychology (1910s–30s)

**Sources:** Max Wertheimer (1923) *"Untersuchungen zur Lehre von der Gestalt"*; Kurt Koffka (1935) *Principles of Gestalt Psychology*; Wolfgang Köhler (1947) *Gestalt Psychology*.

**Premise:** The mind perceives WHOLE patterns ("Gestalten") that are more than the sum of their parts. These principles describe how humans group visual elements without conscious effort.

### The Principles (6 core, 7 with Common Fate)

1. **Proximity** — elements close together are perceived as a group
   - 369 application: row spacing within a card vs gap between cards
2. **Similarity** — elements that look alike are grouped
   - 369 application: same-color labels group as one category
3. **Closure** — mind completes incomplete shapes
   - 369 application: dotted-border focus indicator still reads as enclosure
4. **Continuity** — eye follows smooth lines/paths
   - 369 application: aligned columns; lines through repeated text positions
5. **Figure-Ground** — distinguishing object from background
   - 369 application: high-contrast palette (navy on white, white on navy)
6. **Common Fate** — elements moving in same direction perceived as group
   - 369 application: scroll-locked sections move together; sticky vs scrolling differentiates
7. **Symmetry / Prägnanz** — simplest interpretation preferred
   - 369 application: minimal palette + grid forces simple interpretation

### 369 implication
Most "design problems" are Gestalt violations:
- Items that should group don't (proximity failure)
- Items that look alike but aren't related (similarity false-positive)
- Decoration that breaks figure-ground (Rule 6 — no shadows, ensures it)

A 369 audit checks every layout against all 7 Gestalt principles. The 9th non-negotiable rule (composition with `border-b` separators, not whitespace) IS the proximity rule operationalized.

---

## The Foundational HCI Laws

### Fitts's Law (1954)

**Citation:** Paul M. Fitts. *"The information capacity of the human motor system in controlling the amplitude of movement."* Journal of Experimental Psychology Vol. 47, No. 6.

**Formula:** `T = a + b · log₂(2D/W)`

Where T = time to acquire target, D = distance, W = target width.

**Implications:**
- Larger targets are faster
- Closer targets are faster
- Target acquisition time grows logarithmically (doubling distance adds constant time, not linear)
- **In TUIs:** keystroke distance = number of keys pressed; same logarithmic curve applies

### Hick-Hyman Law (1952–53)

**Citation:** W. E. Hick (1952) + R. Hyman (1953). Decision time = `a + b · log₂(N)` for choice from N options.

**Implications:**
- Decision time grows logarithmically with options
- Doubling options adds constant time, not double
- **Optimal menu shape:** broad and shallow > narrow and deep (up to a limit)
- **In 369:** command palettes (broad search) outperform deep submenus

### Tesler's Law (1985)

**Citation:** Larry Tesler. *"Conservation of Complexity."*

**Premise:** Complexity is conserved between user and system. If you make the system simpler, the user has to do more. If you make the system smarter, the user does less.

**369 application:** When choosing between "let user configure X" and "system decides X," prefer system-decides UNLESS the user has domain knowledge the system can't have.

### GOMS (Card, Moran, Newell 1983)

**Citation:** Stuart Card, Thomas P. Moran, Allen Newell. *The Psychology of Human-Computer Interaction* (Lawrence Erlbaum, 1983).

**Model:** Decompose tasks into:
- **G**oals (what user wants)
- **O**perators (basic actions: keystroke ~280ms, mouse click ~200ms, eye-shift ~230ms, mental operation ~1350ms)
- **M**ethods (sequences of operators)
- **S**election rules (when to use which method)

**Predicts** task completion time before any UI is built. Used in defense + air traffic + clinical-systems design.

**369 application:** When auditing a workflow, count operators. Lower operator count = faster task. Vim's `dd` (2 operators) vs "select line + click delete" (3 operators + mouse-shift) is provably faster.

---

## Nielsen's 10 Usability Heuristics

**Citation:** Jakob Nielsen (1990, refined 1994). nngroup.com/articles/ten-usability-heuristics

Already detailed in [[tui-ux-design]] — repeated here for reference:

1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

**5-user rule:** 5 usability test users find ~80% of problems. Don't over-recruit; iterate faster.

---

## Tognazzini's 16 First Principles

**Citation:** Bruce Tognazzini (1992, asktog.com). *First Principles of Interaction Design.*

Selected ones relevant to 369:

- **Anticipation** — design predicts user need (autocomplete; smart defaults)
- **Autonomy** — keep users in control (no forced workflows)
- **Color blindness** — never rely on color alone (color-blind accessibility)
- **Consistency** — same input → same output (369 Rule 8)
- **Defaults** — sensible defaults that match 80% of cases
- **Efficiency of the user** — optimize user time, not computer time
- **Forgiveness** — easy undo; reversibility default
- **Latency reduction** — perceived response < actual response
- **Learnability** — easy to learn, easy to remember
- **Metaphors** — use sparingly; humans don't need them as much as designers think
- **Protect users' work** — autosave; never lose state
- **Readability** — typography matters
- **Track state** — remember where the user was

---

## The 369-Native Synthesis — 10 Axioms Derived

This canon page promotes the foundational HCI canon into 369-native axioms. Each is now part of the design vocabulary.

1. **Bridge both gulfs.** A 369 surface must close the Gulf of Execution (affordances + signifiers + mappings) and the Gulf of Evaluation (feedback + conceptual model). Both gulfs, every time.

2. **Three levels: visceral + behavioral + reflective.** Every 369 surface succeeds at all three.

3. **One primary action per screen.** Krug's Law 1 in 369-native form. If a screen has 3 primary actions, it should be 3 screens.

4. **Cut words by 75%.** Krug's Law 3 doubled. The 369 voice is dense; the 369 word count is sparse.

5. **All 7 Gestalt principles operate every layout.** Proximity, similarity, closure, continuity, figure-ground, common fate, Prägnanz. A 369 audit checks each.

6. **Operators count, not features.** GOMS-grounded analysis. Lower operator count = better. Count keystrokes when choosing between two designs.

7. **Log₂(N) on every choice point.** Hick-Hyman applies. Either constrain N (≤5 options) or use logarithmic-fast access (fuzzy search).

8. **Sensible defaults match 80%.** Tognazzini's principle. Configuration is opt-in.

9. **Forgiveness is default.** Every destructive operation is undoable. Every user action is reversible. Never lose work.

10. **No color-only meaning.** Tognazzini's "color blindness" rule. Color + glyph + label. Always.

---

## See Also

- [[tui-ux-design]] — TUI-specific UX layer building on these foundations
- [[cleveland-mcgill]] — perceptual accuracy ladder (complementary axis)
- [[pattern-language]] — Alexander's architecture of patterns
- [[information-theory]] — Hick-Hyman, Miller, Fitts in information-theoretic form
- `canon-axioms.md` — how these foundations integrate into always-applied 369 rules
- `visual-rules.md` — concrete operational details

---

## Sources

- Norman 1988, 2013 — *The Design of Everyday Things* (Basic Books)
- Norman 2005 — *Emotional Design* (Basic Books)
- Norman + Draper 1986 — *User-Centered System Design*
- Krug 2000, 2014 — *Don't Make Me Think* (New Riders)
- Wertheimer 1923 — *"Untersuchungen zur Lehre von der Gestalt"* (Psychologische Forschung)
- Koffka 1935 — *Principles of Gestalt Psychology* (Harcourt)
- Köhler 1947 — *Gestalt Psychology* (Liveright)
- Nielsen 1994 — *10 Usability Heuristics* (nngroup.com)
- Fitts 1954 — *"The information capacity of the human motor system"* (Journal of Experimental Psychology)
- Hick 1952 — *"On the rate of gain of information"* (Quarterly Journal of Experimental Psychology)
- Hyman 1953 — *"Stimulus information as a determinant of reaction time"* (Journal of Experimental Psychology)
- Tesler ~1985 — *"Conservation of Complexity"*
- Card, Moran, Newell 1983 — *The Psychology of Human-Computer Interaction* (Lawrence Erlbaum)
- Tognazzini 1992+ — asktog.com First Principles
