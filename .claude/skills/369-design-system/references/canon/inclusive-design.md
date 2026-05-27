# Inclusive Design — Accessibility as Innovation, Not Compliance

> **Disability is in the interaction, not the person.** This is the reframe that turns 369's accessibility rules (11–13) from compliance burden into design discipline. Microsoft Inclusive Design (2016+), Ron Mace's Universal Design (1997), Kat Holmes's *Mismatch* (2018), and the curb-cut-effect literature show: **designing for permanent disability creates wins for everyone.** Captions invented for deaf users help noisy environments. Keyboard shortcuts invented for motor disability help power users. Voice control invented for visual disability becomes Siri. **Inclusion is innovation.**

For tactical TUI accessibility, see [[tui-patterns]] §Accessibility. For i18n accessibility, see [[tui-i18n]]. For meta-context, see [[knowledge-bounds]].

---

## The Mismatch Reframe (Kat Holmes 2018)

**Citation:** Kat Holmes. *Mismatch: How Inclusion Shapes Design* (MIT Press, 2018).

**Premise:** *Disability is not a property of a person. It is a mismatch between the person and their environment.*

A wheelchair user is not "disabled" — they are mismatched with a staircase. Add a ramp, the mismatch dissolves. Same person, same chair, no disability in that context.

### The implication for 369
- "Accessibility issues" are not "user problems we accommodate"
- They are "interaction designs that exclude users we want"
- The verb is **designing inclusion**, not **adding accessibility**

**Reframe Rule 11–13:** Not "rules for accessibility compliance." Rules for **interaction discipline that doesn't exclude anyone.**

---

## Permanent / Temporary / Situational (Microsoft Inclusive Design Toolkit 2016)

**Citation:** Microsoft Design. *Inclusive Design Toolkit.* microsoft.design/inclusive

Every "disability" is one of three:

| Type | Permanent | Temporary | Situational |
|------|-----------|-----------|-------------|
| **One arm** | Amputee | Arm in cast | Holding a baby |
| **One eye** | Blind | Cataract surgery recovery | Sunny windshield glare |
| **One ear** | Deaf | Ear infection | Noisy bar |
| **Mobility** | Wheelchair | Walking cast | Holding shopping bags |
| **Cognitive** | Permanent disability | Concussion | Distracted parent |
| **Speech** | Mute | Laryngitis | Strong accent / 2nd language |

**Profound implication:** at any moment, **most users are situationally disabled**. Designing for a permanent disability creates wins for the much larger group of situational users.

### 369 application
- **Keyboard-only operation** (Rule 12) — designed for motor-disability users; benefits anyone with hands full, anyone using a slow trackpad, anyone working over SSH
- **Honor `NO_COLOR`** (Rule 12) — designed for color-blind users; benefits anyone in bright daylight, anyone with cheap monitors, anyone using a screen reader
- **High-contrast palette** — designed for low-vision users; benefits anyone reading in sunlight, anyone with imperfect color reproduction, anyone using a projector

---

## Ron Mace's 7 Principles of Universal Design (1997)

**Citation:** Ron Mace + Center for Universal Design (NC State University). *The Principles of Universal Design* (1997).

**Mace's history:** Contracted polio at age 9. Designed his life around independence. The 7 principles distill 30+ years of designing for the broadest possible range of users *without need for special adaptation*.

### The 7 principles

1. **Equitable Use** — same means of use for all users, where possible
   - 369: Same `Tab`-key navigation works for keyboard, switch, screen-reader users

2. **Flexibility in Use** — accommodates wide range of preferences and abilities
   - 369: Both mouse and keyboard; both light and dark themes; both verbose and quiet output modes

3. **Simple and Intuitive Use** — easy to understand regardless of user's experience, knowledge, language skills, current concentration level
   - 369: Bracket notation (`[CLIENT]`) is obvious; mnemonic keys; conventions over invention

4. **Perceptible Information** — communicates necessary info effectively regardless of ambient conditions or user's sensory abilities
   - 369: Color + glyph + label always paired (Rule 6 + 12)

5. **Tolerance for Error** — minimizes hazards and adverse consequences of accidental/unintended actions
   - 369: `Esc` cancels everywhere; undo for reversible ops; confirmation for destructive

6. **Low Physical Effort** — used efficiently, comfortably, with minimum fatigue
   - 369: Single-keystroke operations; macros for repetition; no required mouse movement

7. **Size and Space for Approach and Use** — appropriate size and space provided for approach, reach, manipulation regardless of body size, posture, mobility
   - 369: TUI medium is inherently this (every user gets the same target size); GUI 369 needs explicit touch-target sizing

### 369 baseline restatement
**The 369 accessibility tier is the 369 baseline.** There is no separate "accessibility mode." Universal Design implemented as default.

---

## The Curb-Cut Effect

**Origin:** 1970s disability-rights movement (Berkeley, CA). Sidewalk curb cuts designed for wheelchair users.

**The effect:** Curb cuts benefit far more people than wheelchair users:
- Strollers, delivery carts, bicycles, scooters
- Suitcases on wheels
- Elderly walkers
- Skateboards
- Tired people in heels

The lesson: **accessibility wins are universal wins**, not narrow accommodations.

### 8 Curb-Cut Examples in Tech

1. **Typewriter (1860s)** — originally invented for blind users (Pellegrino Turri). Became universal writing tool.
2. **Closed captions** — designed for deaf users. Now used by 50–80% of all viewers (Netflix, BBC stats). Essential in noisy environments, second-language learners, public spaces, comprehension boost.
3. **Voice control** — Siri/Alexa/Google Assistant inherit from accessibility tools for motor/visual disability. Now used by everyone hands-free in cars.
4. **Audiobooks** — designed for blind users (Library of Congress 1932). $1.5 billion industry; majority of users sighted.
5. **Keyboard shortcuts** — designed for users who can't operate a mouse. Now defines "power user" identity.
6. **Dark mode** — designed for light-sensitivity / migraine users. Now the default-preference across platforms.
7. **Text scaling / zoom** — for low-vision users. Now used by everyone aging into presbyopia.
8. **Command palettes** (Ctrl+P / Cmd+K) — adopted from motor-disability assistive tech. Now the standard "find a command quickly" pattern.

**The pattern:** disability-invented features become **default expectations** within 2 generations.

### 369 implication
If you design Rule 12 (Rule of Silence) for terminal-pipeline users (motor-bandwidth disability), you also serve scripting power users, AI agents, automated tests, headless CI runs. The accessibility win is universal.

---

## WCAG 2.2 — POUR Principles

**Citation:** W3C. *Web Content Accessibility Guidelines (WCAG) 2.2* (October 2023).

### The 4 POUR principles

1. **Perceivable** — Information and UI must be presentable in ways users can perceive
2. **Operable** — UI must be operable
3. **Understandable** — Information and operation must be understandable
4. **Robust** — Content must be robust enough to be interpreted by wide variety of user agents, including assistive technologies

### 13 guidelines under POUR

**Perceivable:**
1.1 Text alternatives for non-text content
1.2 Time-based media alternatives
1.3 Adaptable content (programmatic structure)
1.4 Distinguishable (contrast, color, audio control)

**Operable:**
2.1 Keyboard accessible
2.2 Enough time
2.3 Seizures (no flashing)
2.4 Navigable
2.5 Input modalities (touch + pointer + voice)

**Understandable:**
3.1 Readable (language)
3.2 Predictable behavior
3.3 Input assistance

**Robust:**
4.1 Compatible (with assistive tech)

### Conformance levels
- **A** — minimum
- **AA** — standard (most regulations require this)
- **AAA** — enhanced

### Where WCAG fails for TUI
- 1.4 Distinguishable / contrast — assumes RGB pixel rendering; terminal-color-mode varies
- 2.5 Input modalities — assumes pointer; TUIs are keyboard-only by design
- 1.3 Adaptable — assumes semantic HTML; TUIs emit ANSI bytes

**See [[tui-modern-gaps]] §Accessibility for the WCAG-for-terminal gap analysis.**

---

## The 369 Accessibility Doctrine — 6 Principles

Reframing rules 11–13 from constraint to discipline:

1. **The 369 accessibility tier is the 369 baseline.** There is no separate "a11y mode." Universal Design is default.

2. **Designing for one extends to many.** Every accessibility win is a usability win for the broader population (curb-cut effect).

3. **Mismatches dissolve via design, not therapy.** Disability is in the interaction. Fix the interaction, not the person.

4. **Pair every channel.** Color + glyph + label. Audio + caption + transcript. Touch + keyboard + voice.

5. **Defaults match the 80%.** Universal Design Principle 3 (Simple and Intuitive Use). 369 defaults should require zero learning for the largest user segment.

6. **Robust beats clever.** WCAG Principle 4. A 369 TUI that works on a default terminal under `NO_COLOR=1` with a screen reader is more robust than one optimized only for Kitty + truecolor.

---

## Disability-Led Design

**Citation:** Liz Jackson + The Disabled List (disabledlist.org).

The movement: **design *with* disabled people, not *for* them.** Adaptive controllers (Xbox Adaptive Controller, 2018) were designed in partnership with disabled gamers. Apple's Voice Control (2019) was designed with motor-disability collaborators.

**369 implication:** When extending 369 with accessibility features, partner with users who will actually use them. The 369 community should explicitly recruit disabled contributors.

---

## See Also

- [[tui-patterns]] §Accessibility — tactical patterns
- [[tui-i18n]] — i18n as accessibility
- [[tui-modern-gaps]] — modern accessibility gaps in TUI frameworks
- [[tui-ux-design]] §Color + contrast — terminal-specific WCAG translation
- `canon-axioms.md` Axiom 8 — i18n as pre-display, not render-time

---

## Sources

- Holmes 2018 — *Mismatch: How Inclusion Shapes Design* (MIT Press)
- Microsoft Design Inclusive Toolkit — microsoft.design/inclusive
- Mace 1997 — *The Principles of Universal Design* (NCSU Center for Universal Design)
- Hendren 2020 — *What Can a Body Do?* (Riverhead Books)
- W3C 2023 — WCAG 2.2 spec (w3.org/TR/WCAG22)
- Gustafson — alistapart.com Progressive Enhancement articles
- Mac 2019 — *"Design's Lost Generation"* (Tatiana Mac)
- Stanford / IDEO design thinking literature
- Apple Accessibility — apple.com/accessibility/
- Microsoft Accessibility — microsoft.com/en-us/accessibility
- Google Material Design Accessibility — material.io/design/usability/accessibility.html
- ADA 1990 — Americans with Disabilities Act (public law 101-336)
- Center for American Progress — curb-cut-effect framing
- Liz Jackson + The Disabled List — disabledlist.org
- Xbox Adaptive Controller — xbox.com/en-US/accessories/controllers/xbox-adaptive-controller
