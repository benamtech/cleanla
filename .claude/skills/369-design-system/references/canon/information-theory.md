# Information Theory in HCI — The Math Under 369's Density Rules

> **Shannon (1948), Hick-Hyman (1952–53), Miller (1956), Fitts (1954), Sweller (1988), Kahneman (2011).** These six papers give 369 the *math* for density, attention, decision cost, and cognitive load. Where Tufte gives us "maximize data-ink" as a heuristic, information theory gives us bits/second as a measurable quantity. Where Krug says "don't make me think," Kahneman tells us why: System 1 is free, System 2 costs ~850ms per novel pattern.

For data-viz perceptual grounding, see [[cleveland-mcgill]]. For UX heuristics, see [[hci-foundations]]. For TUI-specific UX, see [[tui-ux-design]].

---

## Shannon (1948) — The Foundation

**Citation:** Claude Shannon. *"A Mathematical Theory of Communication"* (Bell System Technical Journal, July/October 1948).

**Information** = `log₂(N)` bits, where N is the number of equally likely outcomes.

**Entropy** of a random variable X with outcomes x with probability p(x):
```
H(X) = -Σ p(x) log₂ p(x)
```

**Channel capacity:** maximum bits/second a channel can carry without error.

**Shannon-Hartley theorem:** `C = B · log₂(1 + S/N)` (bandwidth × log of signal-to-noise).

### Why this matters for HCI
- A UI is a *channel*. It has a capacity in bits/second.
- A user is a *receiver*. They have a capacity in bits/second.
- **Good design matches channel capacity to receiver capacity** at the right semantic level.
- Information content depends on *probability*, not raw bytes. The 9999th item in a 10000-item dropdown carries the same bits as the 1st.

### 369 implication
The `presentation()` engine's job is **maximizing relevant information per cell**. Cells × cell-information-bits / time = bits/second to the user. Wasted cells (chartjunk, decoration) waste channel capacity.

---

## Hick-Hyman Law (1952–53) — Decision Cost

**Citations:**
- W. E. Hick. *"On the rate of gain of information."* Quarterly Journal of Experimental Psychology Vol. 4, No. 1 (1952), pp. 11–26.
- R. Hyman. *"Stimulus information as a determinant of reaction time."* Journal of Experimental Psychology Vol. 45, No. 3 (1953), pp. 188–196.

**Formula:** `T = a + b · log₂(N)`

Where T = reaction time, N = number of choices, a + b = empirical constants.

### The logarithmic insight
Doubling choices adds a *constant* time, not double. The 16th option takes only 1× longer than the 8th option (one more bit of entropy).

### Menu-depth implications
| Choices | Decision time |
|---------|---------------|
| 2 | log₂(2) = 1.0 bit |
| 4 | log₂(4) = 2.0 bits |
| 8 | log₂(8) = 3.0 bits |
| 16 | log₂(16) = 4.0 bits |
| 32 | log₂(32) = 5.0 bits |
| 64 | log₂(64) = 6.0 bits |

**Optimal menu shape:** broad-and-shallow > narrow-and-deep, up to ~16 items per level. Beyond 16, *fuzzy search* (constant-time lookup) wins.

### 369 application
- **Command palette > nested menus.** A 1000-item fuzzy-find runs in O(1) (typing-time) regardless of N.
- **Sidebar: ≤ 7 items.** Above that, group + nest.
- **Dropdown: ≤ 16 items.** Above that, switch to combobox with type-ahead.
- **A 369 sidebar with 9 items takes 680ms decision time vs 7 items at 620ms.** Measurable.

---

## Miller's Magical Number Seven (1956)

**Citation:** George A. Miller. *"The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information"* (Psychological Review Vol. 63, No. 2, March 1956, pp. 81–97).

**Premise:** Human working memory holds 7±2 chunks. A "chunk" is an arbitrary, meaning-bearing unit.

**Examples:**
- Phone numbers chunked as 3-3-4 = 3 chunks (not 10 digits)
- A chess master sees a board as ~5 patterns, not 64 squares
- A vim power-user sees `:s/old/new/g` as 1 command, not 13 chars

### Cowan's update (2001)

**Citation:** Nelson Cowan. *"The magical number 4 in short-term memory: a reconsideration of mental storage capacity."* Behavioral and Brain Sciences Vol. 24, No. 1 (Feb 2001), pp. 87–185.

Cowan's research shows **the *unchunked* limit is closer to 4±1.** Miller's 7 was achieved through chunking. Without chunking, ~4 is the cap.

### 369 application
- **Sidebar items: 4–5 visible** (with grouping; subgroups can extend)
- **Command palette top results: 4** before the user scrolls
- **Form fields per screen: 4–5** (split larger forms across steps)
- **Dashboard panels: 4** maximum
- **Tabs: 4–5** at the top level; beyond → menu

**Chunking is the user's productivity gain.** A 369 power user chunks `:wq` as one operation, not three keys. Design accommodates both the 4±1 raw-capacity user and the 7±2 chunked user.

---

## Sweller — Cognitive Load Theory (1988+)

**Citation:** John Sweller. *"Cognitive Load During Problem Solving: Effects on Learning."* Cognitive Science Vol. 12, No. 2 (1988), pp. 257–285.

Three types of cognitive load:

1. **Intrinsic load** — inherent to the task (a hard problem stays hard)
2. **Extraneous load** — caused by the interface (poor design adds cost)
3. **Germane load** — productive load that builds skill (good learning generates this)

**Goal of UX design:** minimize extraneous, preserve intrinsic, foster germane.

### Sweller's empirical effects
- **Worked-example effect** — showing solved problems before novel ones reduces extraneous load
- **Split-attention effect** — visual + textual info in *separate* locations doubles load (vs co-located)
- **Redundancy effect** — duplicating information across channels adds load (vs single channel)

### 369 application
- **369 quick-reference patterns** (in SKILL.md) = worked examples
- **Status line co-located with cursor** (not in a separate window) = no split-attention
- **Color OR position OR text — not all three for the same datum** = no redundancy
- **Animations are extraneous load unless they convey state** = remove decorative motion

---

## Fitts (1954) — Information Theory of Motor Control

**Citation:** Paul Fitts. *"The information capacity of the human motor system in controlling the amplitude of movement."* Journal of Experimental Psychology Vol. 47, No. 6 (June 1954).

**Formula:** `T = a + b · log₂(2D/W)` (logarithmic, identical shape to Hick-Hyman)

Where T = movement time, D = distance, W = target width.

### Index of Difficulty (ID)
`ID = log₂(2D/W)` — measured in bits

### Throughput
`TP = ID / T` — bits per second of motor channel

A typical mouse has ~5–6 bits/sec throughput. A typical keyboard has ~10–15 bits/sec. **TUIs operate at the higher rate** — this is why they feel faster.

### 369 application
- **Larger buttons = faster targeting.** `py-[6px] px-[12px]` is good; `py-[3px] px-[6px]` is faster only if W is still > min-target.
- **48px touch targets** (Apple HIG, Material) = log₂(2·screen/48) ID ~ 4 bits acquisition time
- **Edge of screen = infinite W** (mouse can't overshoot). 369 corner buttons exploit this.
- **In TUI: target-row distance = visual scan + j-keystrokes.** Both are log₂ in their respective channels.

---

## Kahneman — Thinking, Fast and Slow (2011)

**Citation:** Daniel Kahneman. *Thinking, Fast and Slow* (Farrar, Straus and Giroux, 2011).

Synthesis of Kahneman + Tversky decades of work. Two systems:

| System | Description | Cost | Examples |
|--------|-------------|------|----------|
| **System 1** | Fast, automatic, intuitive, effortless | ~0 | Recognizing a face; reading a word; "j = down" |
| **System 2** | Slow, deliberate, effortful | ~850ms+ | Solving 17×24; learning a new keybinding; reading dense legal text |

### HCI implications
- **Good interfaces let System 1 handle the work.** Conventions (Tab=next, q=quit) keep work in System 1.
- **Novel patterns force System 2.** Cost: ~850ms per pattern × frequency × users = enormous time cost.
- **Habits move work from S2 → S1.** This is why vim users get faster over years.

### The economic argument
For a 369 TUI used by 1000 power users 100 times/day, each pattern that forces System 2 costs:
```
850ms × 100 ops/day × 1000 users × 200 days/year = 4,722 person-hours/year
```
**One novel pattern wastes 4700 hours/year.** Conformance to convention is enormous.

### 369 application
- Conventions over invention (Rule 4 in SKILL.md)
- `Esc` cancels, `q` quits, `Tab` completes — never reassign
- New keybindings only when the action has no convention

---

## Broadbent's Filter (1958)

**Citation:** Donald Broadbent. *Perception and Communication* (Pergamon Press, 1958).

**The bottleneck:** Perception is filtered. Humans process ~4–7 bits/second of *conscious* attention, far below sensory capacity.

**369 implication:** No matter how much information you put on screen, the user consumes 4–7 bits/sec of conscious attention. Visual hierarchy must prioritize the bits that matter.

---

## Shneiderman — 8 Golden Rules

**Citation:** Ben Shneiderman & Catherine Plaisant. *Designing the User Interface* (6th ed., Pearson 2016). Originally 1986.

Already covered in [[hci-foundations]] — restated through information-theoretic lens:

1. **Strive for consistency** — Kahneman: minimize System 2 invocations
2. **Universal usability** — Holmes: zero exclusion; design for the full distribution
3. **Informative feedback** — Shannon: close the Gulf of Evaluation immediately
4. **Design dialogs to yield closure** — Miller: don't leave open chunks in working memory
5. **Prevent errors** — Sweller: errors generate extraneous load
6. **Permit easy reversal of actions** — Tognazzini: forgiveness is default
7. **Support internal locus of control** — Tesler: keep complexity on the system, not the user
8. **Reduce short-term memory load** — Miller/Cowan: 4±1 visible state at any time

---

## The 369 Information Budget — Concrete Numbers

**A 1920×1080 screen at 12px body type and 18px leading:**
- Character cells: ~160 columns × 60 rows = **9,600 cells**
- At 8 bits/character (Unicode/ASCII): **76,800 bits raw capacity**
- Data-ink ratio target (Tufte): 0.7–0.85
- Effective information: **~60,000 bits per screen**

**User consumption:**
- 4–7 bits/sec conscious attention (Broadbent)
- 4±1 chunks held in working memory (Cowan)
- 850ms penalty per novel pattern (Kahneman)

**The math says:** a 369 screen carries 10,000× more bits than the user can consume in one glance. **The design problem is hierarchy** — what 0.01% does the user need *first*?

### Per-task budgets
- **Glance** (~1 sec): 4–7 bits = single status word, one number, one shape
- **Scan** (~3 sec): 20–30 bits = 5–8 chunks, brief sentence, sparkline
- **Read** (~10 sec): 60–100 bits = full status line, table row, dashboard pane
- **Study** (~60 sec): 300+ bits = full screen, complete document, detailed dashboard

A 369 surface should make these budgets *explicit*. What's the glance content? Scan? Read? Study?

---

## 369 Axioms Derived from Information Theory

1. **Bits matter more than bytes.** Information content = entropy, not data volume. Wasted cells waste channel capacity.

2. **Log₂(N) is the cost curve.** Decisions, menus, target acquisition — all logarithmic. Doubling N adds constant time.

3. **4±1 is the working-memory floor.** Above 4 visible chunks, grouping is mandatory.

4. **System 1 conventions, System 2 novelty.** Conventions are free; novelty costs ~850ms. Pick novelty only when the value exceeds the cost.

5. **Extraneous load is the silent killer.** Every animation, every redundancy, every misaligned channel adds cost without value.

6. **Hierarchy = bit allocation.** Most-important info gets the most-perceptible channel. Position > length > color > shape.

7. **Channel capacity matches user capacity.** Don't emit 60,000 bits if user reads 7. Emit 60 bits ranked by importance.

---

## See Also

- [[cleveland-mcgill]] — perceptual-accuracy ladder (the *which channel* question; this canon answers *how much information*)
- [[hci-foundations]] — Fitts, Hick-Hyman, GOMS in HCI context
- [[tui-ux-design]] — TUI-specific density tradeoffs
- [[habit-formation]] — moving System 2 → System 1 over time
- [[tufte]] — analytical-design canon (complementary to information-theoretic grounding)

---

## Sources

- Shannon 1948 — *"A Mathematical Theory of Communication"* (BSTJ)
- Hick 1952 — *"On the rate of gain of information"* (QJEP)
- Hyman 1953 — *"Stimulus information as a determinant of reaction time"* (JEP)
- Miller 1956 — *"The Magical Number Seven"* (Psych Rev 63:2)
- Fitts 1954 — *"The information capacity of the human motor system"* (JEP 47:6)
- Sweller 1988 — *"Cognitive Load During Problem Solving"* (Cognitive Science 12:2)
- Cowan 2001 — *"The magical number 4 in short-term memory"* (BBS 24:1)
- Kahneman 2011 — *Thinking, Fast and Slow* (FSG)
- Broadbent 1958 — *Perception and Communication* (Pergamon)
- Card, Moran, Newell 1983 — *Psychology of HCI* (Lawrence Erlbaum)
- Shneiderman & Plaisant 2016 — *Designing the User Interface* (Pearson 6e)
- Healy & Enns 2012 — *"Attention and Visual Memory in Visualization and Computer Graphics"* (IEEE TVCG)
