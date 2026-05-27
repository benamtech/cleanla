# Comparative Design Systems — What Lives, What Dies, Why

> **Apple HIG has survived 39 years (1987–2026). Microsoft Metro UI lasted 7 (2010–17). Bootstrap dominated for 4 years and faded over the next 8. Material Design survived three regenerations.** This canon page is the comparative case-study layer — survivors, deaths, ancestors, modern emerging systems — distilling the survival patterns and death patterns. Used to position 369 strategically and avoid known failure modes.

For the practical positioning, see `canon-axioms.md`. For modern ecosystem context, see [[tui-modern-2026]].

---

## Survivors (and Their Survival DNA)

### Apple Human Interface Guidelines (1987–present)
**Genesis:** Macintosh HIG (1987) → System 7 era → Aqua (2000) → flat (iOS 7, 2013) → unified cross-platform (iOS/iPadOS/macOS/watchOS/tvOS/visionOS 2020+).

**Why it survived:**
- **Platform lock-in** — Apple controls the OS; HIG is non-negotiable for App Store
- **Version discipline** — never fork-and-replace; always "Material 1 → Material 3" style evolution
- **Designer training infrastructure** — Apple Developer events, certifications, free courses
- **Branded fiat** — Apple decides; the community doesn't vote

**39-year lesson:** Platform integration + version discipline + branded authority = compound survival.

### Google Material Design (2014–present)
**Genesis:** Material 1 (2014) "paper and ink" metaphor → Material 2 (2018) refined → Material 3 / Material You (2021) dynamic theming + Android 12.

**Why it survived:**
- **Open documentation** — material.io as free, public, comprehensive
- **Code libraries (MDC)** — Android, Flutter, web; reduces adoption cost
- **Token-first architecture** — design tokens travel across platforms cleanly
- **Brand continuity through evolution** — "Material 1 → 3" is the same brand, not different products
- **Ecosystem incentive alignment** — Android developers use it because Google rewards it

**12-year lesson:** Open + tooled + token-first + brand-continuous = compound adoption.

### Microsoft Fluent Design System (2017–present)
**Genesis:** Replaced Metro UI (which died — see below). Fluent 1 (2017) → Fluent 2 (2023).

**Why surviving (so far):**
- **Office's installed base** — billion+ users see Fluent daily
- **Open source** — github.com/microsoft/fluentui — community contributions + transparency
- **Cross-platform tokens** — Windows + Office + Web + iOS share token system
- **Lesson from Metro's death** — Fluent inherits user habit; Metro broke it

### Tailwind CSS (2017–present)
**Genesis:** Adam Wathan + Steve Schoger, 2017. Utility-first CSS. Tailwind v3 (2021) JIT engine. v4 (2024) faster + smaller.

**Why surviving:**
- **Developer ergonomics** — utility classes match how engineers think (composability)
- **Constraint-based system** — pre-built spacing scale, color palette, type scale — **analogous to 369's ×3**
- **Strong design opinions** — defaults that work; deviation is conscious choice
- **React ecosystem alignment** — Tailwind became the React-default CSS approach
- **Documentation as marketing** — tailwindcss.com is itself a portfolio piece

**8-year lesson:** Constraint-as-feature + developer-ergonomics + framework-alignment = adoption.

### Bauhaus / Swiss Design (1919–1960s, still influencing 2026)
**Genesis:** Bauhaus school (Weimar 1919, Dessau 1925, closed 1933 by Nazis). Swiss Style (1950s, Müller-Brockmann + Hofmann + Ruder).

**Why principles survived 100+ years:**
- **Decoupled from medium** — works in print, web, screen, signage
- **Trained generations** — every modern design school teaches it
- **Math-grounded** — grid + ratio + proportion outlast style trends

**100-year lesson:** Universal principles + decoupling from medium = generational survival.

---

## Deaths (and Their Death Patterns)

### Microsoft Metro UI / Modern UI (2010–17)
**Genesis:** Windows Phone 7 (2010), Windows 8 (2012). "Authentically digital" — flat, typography-first, live tiles.

**Why it died:**
- **Bet on Windows Phone** — which failed in market
- **Windows 8 backlash** — desktop users hated touch-first paradigm forced on them
- **Broke user habit** — Start Menu removed, replaced with Start Screen
- **Aesthetic dating** — bright primary tile colors became "Microsoft 2010s"

**Death pattern:** form-factor bet + breaking habit + dated aesthetic = collapse.

### Apple Aqua (2000–14)
**Genesis:** macOS X 10.0 (2001). Pinstripes, glassy buttons, drop shadows, lickable UI.

**Why it died:**
- **iOS-led design shift** — mobile changed what aesthetics felt current
- **Computational cost** — animated bouncing icons + drop shadows aged
- **Aesthetic dating** — early-2000s gloss became cringe

**Death pattern:** aesthetic-dating + tech-evolution-overtaking-decoration.

**Note:** Aqua didn't die outright — it was replaced by Yosemite flat design (2014). Apple's brand continued; the visual language changed. **Survival via internal regeneration.**

### Skeuomorphism (1990s–2013, Apple-led)
**Genesis:** Mac OS 7 era textures → iOS 1–6 era (stitched leather, yellow legal pad, green felt).

**Why it died:**
- **Jony Ive replaced it** with iOS 7 flat design (2013)
- **Broke at retina densities** — textures designed for 72 DPI looked terrible at 264 DPI
- **Future-designer hostility** — locked to specific cultural objects that future designers can't refresh

**Death pattern:** locked to objects that age + breaks at higher resolution.

### Bootstrap dominance (2013–18)
**Genesis:** Twitter Bootstrap (2011), Mark Otto + Jacob Thornton. Peak ~2014–18 (most-used CSS framework).

**Why it shrunk:**
- **CSS Grid** (2017, native) eliminated need for 12-column framework
- **React component-libraries era** — Bootstrap was CSS-only; couldn't compose with React/Vue
- **Tailwind alternative** — utility classes beat component classes for customization

**Death pattern:** technology-shift-eliminates-need + ecosystem-misalignment.

**Status:** Bootstrap survives in maintenance mode. Wordpress, jQuery, server-rendered sites still use it. Not dead — just no longer growing.

### OpenLook / Motif / various Unix-workstation HIGs (1990s)
**Genesis:** Sun's OpenLook, OSF's Motif — pre-web GUI design systems.

**Why they died:**
- Open-source desktop fragmentation (GNOME / KDE / others)
- Linux market never consolidated to support a single HIG
- Apple + Microsoft consolidated 95%+ of desktop market

**Death pattern:** market fragmentation + lack of consolidation + commercial-platform dominance.

---

## Ancestors (Where the Lineage Comes From)

### Xerox PARC Star (1981)
**Citation:** Smith et al. *The Star User Interface: An Overview.* National Computer Conference 1982.

First commercial GUI design system. Defined:
- WIMP paradigm (Windows / Icons / Menus / Pointer)
- Desktop metaphor
- Cut/copy/paste vocabulary
- Double-click semantics

**Direct descendants:** Apple Lisa (1983), Mac (1984), Windows 1.0 (1985), all subsequent GUIs.

**45-year lesson:** WIMP paradigm survived even as visual languages changed.

### Macintosh HIG (1987)
**Citation:** Apple. *Macintosh Human Interface Guidelines* (1987).

First *formal* publication of design rules for an entire platform. Direct ancestor of modern HIG.

**What survived:** Mac menu bar, command-key conventions (Cmd-C/V/Z), document-centric model, modal dialogs.

---

## Modern Emerging (Trajectory Cases)

### Linear (2019–present)
**linear.app design language**

- Specific to project management
- Dense + keyboard-driven (TUI-influenced)
- Speed-obsessed
- Restraint as brand identity

**Why might survive:** strong product-design alignment; user habits forming; clear competitive moat (Jira vs Linear is a paradigm gap)

### Vercel / Geist (2020–present)
**vercel.com/design**

- Component library + design tokens
- Dark-mode-first
- Tied to Next.js platform

**Why might survive:** linked to dominant React framework

### Shadcn UI (2023–present)
**ui.shadcn.com**

- "Copy-paste components" not framework
- Owned-not-installed model
- Built on Radix + Tailwind

**Why exploding:** developer ergonomics; AI-agent friendliness; no version-lock-in

---

## Survival Patterns (What Lives)

1. **Token-first architecture** — Tailwind v4, Material 3, Fluent 2 all centered design tokens
2. **Version discipline** — Apple HIG 1987→2026; Material 1→3; brand continuity through visual change
3. **Platform/ecosystem integration** — Apple HIG ↔ App Store; Material ↔ Android; Tailwind ↔ React
4. **Open documentation + tooling** — Material.io, Fluent.microsoft.design, tailwindcss.com
5. **Constraint clarity** — Bauhaus, Swiss, Tailwind, Linear all made constraints the brand
6. **Decoupling from medium** — survives platform shifts (Bauhaus → print → web → mobile)
7. **Designer training infrastructure** — schools, certifications, conference talks, books

---

## Death Patterns (What Kills Design Systems)

1. **Form-factor bet that doesn't materialize** — Metro UI bet on Windows Phone
2. **Aesthetic dating** — Aqua's gloss, Skeuomorphism's leather, Metro's bright tiles
3. **Breaking user habit** — Windows 8 forced touch-first paradigm
4. **Locked to specific cultural objects** — Skeuomorphism couldn't refresh "yellow legal pad"
5. **Tech evolution eliminates need** — CSS Grid eliminated Bootstrap's column grid value
6. **Ecosystem misalignment** — Bootstrap couldn't compose with React
7. **Market fragmentation** — OpenLook/Motif/Linux desktop wars
8. **No version discipline** — fork-and-replace instead of evolve-the-brand

---

## 369 Positioning

### Where 369 sits
- **Between Linear and Tailwind:** domain-specific (like Linear, for ADN's PILLARS), but constraint-utility (like Tailwind, ×3 grid as the constraint-as-feature)
- **Token-first:** the 8 color tokens + ×3 spacing scale + type scale are tokens, not components
- **Open documentation:** the canon + skill is the documentation
- **Constraint clarity:** ×3 + 0-radius + 1px borders + 8 colors = visible discipline
- **Platform integration:** ADN is the platform; 369 is the design system

### Survival risks (per case studies)
- **Risk 1: aesthetic dating** — manila + navy + amberSand has 2026 vibes. Mitigation: tokens + ratio-grid stay; if aesthetic dates, swap colors but keep structure.
- **Risk 2: form-factor bet** — 369 is desktop + mobile + terminal. Adding `medium: 'terminal'` is a hedge.
- **Risk 3: ecosystem misalignment** — Currently aligned with Next.js / React / Tailwind. If those decline, what next? Engine output is medium-agnostic (HTML/text/ANSI) — partial hedge.
- **Risk 4: no version discipline** — 369-design-system replaced 4 older skills (May 2026). Next regeneration must be "369 → 369.next," not "369 → newname."

### Defensive moves
1. **Ship tokens first, components second** — tokens (×3, palette, type scale) outlive any specific component
2. **Embed in one perfect product** — ADN serves the role iOS App Store serves for Apple HIG
3. **Train designers in ×3 philosophy** — not just rules; the constraint-aesthetics theory
4. **Version aggressively, name it evolution** — 369 → 369.2 → 369.3, not 369 → newname
5. **Keep 369 as token + grid system** — exportable to iOS/Android/visionOS if needed

### Critical risk
**If 369 embeds aesthetic metaphors** (specific colors, specific glyph choices) more than principles, it dies when aesthetics cycle. **Defense:** keep 369 as token + ×3 grid system + axioms + rules, not "the manila aesthetic."

---

## See Also

- [[pattern-language]] — Alexander's framework; how to organize 369 patterns coherently
- [[grid-typography]] — Swiss grid + ×3 mathematical defense
- [[cleveland-mcgill]] — principled engine ranking (same survival logic)
- [[tui-modern-2026]] — modern ecosystem context
- `canon-axioms.md` — the foundational principles that survive aesthetic cycles

---

## Sources

- Apple Human Interface Guidelines — apple.com/design/human-interface-guidelines
- Material Design — material.io
- Microsoft Fluent — fluent2.microsoft.design
- Tailwind CSS — tailwindcss.com
- Bootstrap — getbootstrap.com
- Linear design — linear.app
- Vercel Geist — vercel.com/design
- Shadcn UI — ui.shadcn.com
- Smith et al. 1982 — *The Star User Interface: An Overview*
- Apple 1987 — *Macintosh Human Interface Guidelines*
- Wikipedia: Microsoft Metro, Aqua, Skeuomorphism, Bootstrap, Tailwind histories
- Frost 2016 — *Atomic Design* (bradfrost.com)
