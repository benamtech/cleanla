# Format-as-Interface — The Text File Is the Longest-Living UI

> **The longest-lasting user interface in computing is not an app — it's a file format.** README.md (2008+ canonical), `.NFO` files (1990+), dotfiles (`.bashrc`, `.vimrc`), JSON, CSV, YAML, TOML. These ARE interfaces, not just data. In the LLM-agent era (2024–2026), files-as-interface is the agent-readable substrate. 369 outputs HTML — but it should also have a doctrine for the **data file as the user interface**.

For Unix CLI principles, see [[unix-cli-principles]]. For modern TUI ecosystem, see [[tui-modern-2026]]. For AI-TUI patterns, see [[tui-modern-gaps]].

---

## The Thesis

A user interface is anywhere a human (or AI) reads + writes information. By that definition:

- A `README.md` is an interface to a project
- A `.bashrc` is an interface to a shell environment
- A `JSON` config file is an interface to an application's behavior
- A `CSV` is an interface to a dataset
- A `.NFO` file is an interface to a warez release (1990s; first format-as-interface)
- A `man` page is the interface to a Unix tool

**The file is the interface.** This is design discipline, not data export.

### Why this matters in 2026

LLM agents consume project state by reading files. Claude Code, Aider, OpenHands, Toad — all file-mediated. **The format you choose is now the interface for both humans AND AI agents.**

A 369 component should ask: "if an LLM agent reads my output file, can it understand the system state without UI inspection?"

---

## The README.md Standard

### Genesis
- **1980s** — README.TXT (plain text) at top of every distribution
- **1995** — github.com inherits convention
- **2004** — John Gruber publishes Markdown (daringfireball.net/projects/markdown)
- **2014** — CommonMark spec (commonmark.org) standardizes
- **2008+** — README.md becomes canonical at GitHub

### The community-evolved structure

The pattern was never centrally designed; it emerged from millions of repos:

```
# Project Name
One-line description.

[Badges] [Build status] [License] [Version]

## Features (optional)
## Installation
## Usage
## Configuration (optional)
## API / Reference (for libraries)
## Contributing
## License
```

**No standards body imposed this.** Convergence happened because it answers the user's questions in the order they ask them.

### Notable structural conventions
- **Google Style Guide for READMEs** (github.com/google/styleguide)
- **RichardLitt's README spec** (github.com/RichardLitt/standard-readme)
- **Awesome-README** (github.com/matiassingers/awesome-readme)

### 369 application
Every 369 PILLAR (program module) must have a README structured per these conventions. Specifically:
1. PILLAR name + 1-line description
2. Bracket-notation route (`/ssm`)
3. Mental-model statement (one sentence)
4. Key keyboard surface (top 5–10 commands)
5. Component map (link to BASE primitives used)
6. Engine integration (how it calls `presentation()` / `resolveAny()`)
7. State management (what's persistent, what's transient)
8. Tests (how to run; what's covered)

---

## Markdown's Victory

### vs alternatives
| Format | Year | Status |
|--------|------|--------|
| **Markdown** (Gruber) | 2004 | Winner |
| **reStructuredText** | 2002 | Python ecosystem only |
| **AsciiDoc** | 2002 | Niche (technical docs) |
| **Textile** | 2002 | Effectively dead |
| **BBCode** | Late 1990s | Legacy forums only |
| **wiki markup** (each engine) | Various | Fragmented |

### Why Markdown won
1. **"Write for humans first"** (Gruber's principle) — the plain-text source is readable as-is
2. **Forgiving syntax** — no strict whitespace rules; visual structure suffices
3. **HTML escape hatch** — `<div>` works inline when needed
4. **GitHub adoption** (2008) — every project README rendered
5. **CommonMark** (2014) — standardized + spec'd

### 369 implication
**Markdown-first documentation.** Every 369 doc that humans read should be Markdown. The plain-text source is the interface; the rendered HTML is the *projection* of that interface.

---

## Configuration File Format Wars

### The contenders

| Format | Year | Origin | Strength | Weakness |
|--------|------|--------|----------|----------|
| **INI** | 1985+ | Windows 3.1 | Simple flat sections | No nesting, no types |
| **JSON** | 2001 | Crockford / ECMA | Universal; type-aware | No comments, verbose |
| **YAML** | 2001 | Clark Evans + others | Human-friendly | Whitespace fragility; "Norway problem" |
| **TOML** | 2013 | Tom Preston-Werner | Simple + typed | Verbose for complex nesting |
| **Cuelang** | 2018 | Marcel van Lohuizen | Schema-validated + reusable | Learning curve |
| **HCL** | 2014 | HashiCorp | DevOps-friendly | Vendor-specific |
| **Dhall** | 2018 | Gabriel Gonzalez | Programmable + typed | Niche |

### Decision tree for 369

```
Is the config human-edited?
├── Yes → TOML or YAML
│   ├── Flat structure → TOML
│   └── Deep nesting → YAML (with linting)
└── No (machine-generated/consumed)
    ├── Need types → JSON
    ├── Need schema → Cuelang
    └── Need DevOps integration → HCL
```

### 369 application
- **User-facing config** (rc-files, preferences) → TOML
- **Pillar manifests** (component declarations) → JSON or TOML
- **Data export** (records, results) → JSONL or CSV
- **Documentation** → Markdown
- **Schema definitions** → JSON Schema or Cuelang

---

## Dotfiles Culture

### Genesis
**Unix convention:** files prefixed with `.` are hidden from default `ls`. Historical accident from `..` traversal handling.

Became the *user-environment-as-interface* pattern:
- `.bashrc` — shell config
- `.vimrc` — editor config
- `.gitconfig` — Git identity + behavior
- `.tmux.conf` — terminal multiplexer
- `.ssh/config` — connection preferences

### The dotfiles repo phenomenon
Github.com/topics/dotfiles — millions of repositories. The user's *configured environment* becomes the version-controlled, shareable, forkable interface.

### Notable patterns
- **Mathias Bynens dotfiles** (github.com/mathiasbynens/dotfiles) — canonical reference
- **Holman's dotfiles** (github.com/holman/dotfiles) — "topical" organization
- **Chezmoi, dotbot, yadm** — dotfile management tools

### 369 application
- 369 should have a documented dotfile path: `~/.config/369/config.toml`
- User preferences are part of the interface, not external to it
- Sharing dotfiles is sharing the configured interface

---

## Plain-Text Accounting — Format-as-Interface Maximalism

### Citation
plaintextaccounting.org — Scott Nesbitt + community.

### The tools
- **Ledger** (John Wiegley, 2003) — original plain-text accounting
- **hledger** (Simon Michael) — Haskell port
- **Beancount** (Martin Blais) — Python alternative

### The interface
A `.ledger` file IS the accounting application:

```ledger
2026-05-27 * Coffee
    Expenses:Food:Coffee   $4.50
    Liabilities:Visa
```

The file format encodes:
- Date
- Description
- Account hierarchy
- Amount
- Implicit balancing entry

**No GUI required.** `ledger` (the CLI tool) reads the file; emits reports. The file IS the user interface to financial state.

### Why this works
- Version-controllable
- Diffable
- Searchable with grep
- Editable in any text editor
- AI-agent readable
- Outlives any specific GUI accounting software

**Mint shut down (2024); QuickBooks subscription cost rises annually. Ledger users from 2003 have continuous records.**

### 369 lesson
For 369 PILLARS handling structured data (jobs, bids, payments): **the data file should be human-readable**, not just exportable. CSV / TOML / JSONL. The export IS the interface; the GUI is the projection.

---

## Plain Text + AI Agents (2024–2026)

### The shift
LLMs read text files better than they read UIs. Why:
- Plain text has predictable structure
- Markdown headers form natural agent-readable hierarchy
- File trees are graph data the LLM can navigate
- UI screenshots require visual reasoning (much harder for AI)

### MCP — Model Context Protocol (Anthropic, Nov 2024)
**Citation:** modelcontextprotocol.io

Anthropic's standard for LLM tools to read + write files + APIs. **Files are first-class.** An MCP server exposes a project's state as a file-tree the agent can read.

### AGENTS.md convention (2024+)
Emerging pattern: a project's root contains an `AGENTS.md` file describing:
- How AI agents should interact with this codebase
- Where the canonical state lives
- What operations are safe vs destructive
- Tone + voice expectations for agent-generated content

Used by: 60,000+ projects on GitHub (search "AGENTS.md").

### CLAUDE.md / .cursorrules / similar
Different naming, same concept: a config file at the root that's THE interface to AI-assisted development.

### 369 implication
- 369 projects should have AGENTS.md (or equivalent) describing 369-specific rules for agents
- Output formats should be agent-readable (Markdown / JSON / YAML preferred over screenshots)
- The 369 design system itself is implemented as a Claude Code SKILL.md — proof of the principle

---

## Doug McIlroy's Unix Philosophy (1978)

Already documented in [[unix-cli-principles]] — reinforced for format-as-interface:

> "Write programs to handle text streams."

McIlroy's principle was: text is the universal interface. **2026 corollary:** text is the universal interface for both human readers and AI agents.

The 50-year continuity of this principle is the strongest argument for prioritizing text formats over binary or proprietary ones.

---

## The man Page Tradition (1971+)

**Citation:** Ken Thompson + Dennis Ritchie. *Unix man pages* (Bell Labs, 1971).

Man pages have a strict format:
```
NAME
SYNOPSIS
DESCRIPTION
OPTIONS
EXAMPLES
ENVIRONMENT
FILES
DIAGNOSTICS
BUGS
HISTORY
SEE ALSO
```

**Why man pages persist 55 years:**
- Standardized structure (predictable)
- Searchable (`apropos`, `man -k`)
- Pipeable (`man ls | grep -A2 OPTIONS`)
- Offline-readable
- Agent-friendly

### 369 application
Complex 369 CLI tools should ship a man-page-formatted reference (alongside Markdown docs). The format predictability is a feature.

---

## Static-Site Generators — Plain-Text-to-Web

### The pattern
- **Jekyll** (2008, Tom Preston-Werner) — Markdown → HTML, deployed to GitHub Pages
- **Hugo** (2013, Steve Francia) — Go-based; very fast
- **Eleventy** (2017, Zach Leatherman) — Node; flexible
- **MkDocs** (2014, Tom Christie) — Python; documentation-focused
- **Docusaurus** (Meta, 2018) — React-based
- **Astro** (2021) — partial hydration

**All operate on the principle: file is the interface.** Plain text + frontmatter + Markdown → static HTML.

### 369 application
- 369 documentation site should use a static-site generator
- The Markdown sources are the canonical interface
- Generated HTML is the projection

---

## CSV vs JSON Lines (JSONL)

### Citations
- **CSV** — RFC 4180 (Yakov Shafranovich, 2005). Comma-Separated Values.
- **JSONL** — jsonlines.org (Ian Cooper). Newline-delimited JSON.

### When to use which

| Property | CSV | JSONL |
|----------|-----|-------|
| **Human readability** | ✓ (with viewer) | ✓ (per-record) |
| **Streaming** | ✓ | ✓ |
| **Type-aware** | ✗ (strings) | ✓ (JSON types) |
| **Nested data** | ✗ | ✓ |
| **Excel/sheet compatibility** | ✓ | ✗ |
| **AI-agent parsing** | OK | Better |
| **Bandwidth** | Smaller | Larger |

**369 default for tabular export:** JSONL (type-aware, streamable, agent-friendly).
**369 default for spreadsheet compatibility:** CSV.

---

## The Long-Term Archival Argument

What survives 50+ years?

| Format | 1970 | 1980 | 1990 | 2000 | 2010 | 2020 | 2026 | Survival? |
|--------|------|------|------|------|------|------|------|-----------|
| Plain text (ASCII/UTF-8) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ★★★ |
| TeX / LaTeX | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ★★★ |
| Markdown | — | — | — | — | ✓ | ✓ | ✓ | ★★★ (likely) |
| PDF | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ★★ (proprietary risk) |
| Microsoft Word .doc | — | ✓ | ✓ | ✓ | ✓ | (deprecated) | (legacy) | ★ |
| Microsoft Word .docx | — | — | — | — | ✓ | ✓ | ✓ | ★ (subscription risk) |
| Notion pages | — | — | — | — | — | ✓ | ? | ✗ (vendor lock-in) |
| Figma files | — | — | — | — | — | ✓ | ✓ | ✗ (vendor lock-in) |

**Plain text is the only format that survives every transition.** The 369 design system should respect this.

---

## The 369 Doctrine on Format-as-Interface

1. **Format IS interface.** Design with the same rigor you apply to CLI or UI.

2. **Markdown-first documentation.** CommonMark-compliant. Plain-text source is the canonical form.

3. **TOML for user-facing config.** JSON for machine-generated/consumed. Cuelang for schema-validated. Avoid YAML except for DevOps-tradition contexts.

4. **Agent-readable structure.** Clear hierarchy, fast parsing, frontmatter for metadata. An LLM reading the file should understand state without UI inspection.

5. **Durability over platform.** No Notion, no Confluence, no Figma. Plain-text alternatives in version-controlled repos.

6. **Every 369 PILLAR has README.md** following the documented structure.

7. **Data export = data interface.** JSONL preferred; CSV for spreadsheet compat. Never export to PDF as the canonical interface.

8. **AGENTS.md or equivalent** at every 369 project root.

9. **Man-page format** for complex 369 CLI tools.

10. **"A formatless future is a blind future."** Format choice is design discipline.

---

## See Also

- [[unix-cli-principles]] — McIlroy + ESR's 17 rules; text as universal interface
- [[tui-modern-gaps]] — AI-TUI patterns (Claude Code, MCP, ACP)
- [[tui-modern-2026]] — modern ecosystem context
- [[archives-deep]] — `.NFO` format history (BBS scene origin)
- `canon-axioms.md` — Axiom 10 (canon append-only with corrections)

---

## Sources

- Gruber 2004 — Markdown (daringfireball.net/projects/markdown)
- CommonMark 2014 — commonmark.org
- RFC 4180 — Shafranovich (CSV specification)
- jsonlines.org — Ian Cooper (JSONL)
- YAML.org — yaml.org/spec
- TOML — toml.io
- Cuelang — cuelang.org
- modelcontextprotocol.io — Anthropic MCP spec
- plaintextaccounting.org — community + Scott Nesbitt
- Ledger — ledger-cli.org (John Wiegley)
- Hugo — gohugo.io
- Jekyll — jekyllrb.com
- MkDocs — mkdocs.org
- McIlroy — *Unix Philosophy* (1978)
- Wiegley 2003 — Ledger first release
- github.com/mathiasbynens/dotfiles — canonical dotfiles reference
- github.com/holman/dotfiles — topical organization
- github.com/google/styleguide — README + many other style guides
- github.com/RichardLitt/standard-readme — README spec
- Unix man pages — manpath.org / history
