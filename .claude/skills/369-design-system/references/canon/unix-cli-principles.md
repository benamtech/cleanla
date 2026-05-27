# Unix CLI Principles — ESR's 17 Rules + CLIG Design Patterns

> **The Unix philosophy is a design system for software.** Seventeen rules from Eric S. Raymond's *The Art of Unix Programming* define how programs should behave in a composable ecosystem. CLIG (clig.dev) extends these into specific, actionable guidelines for modern CLI and TUI tools. Together they are the canonical reference for any 369 tool that runs in a shell.

---

## ESR's 17 Rules of Unix Design

Source: Eric S. Raymond, *The Art of Unix Programming*, Chapter 1.

These rules were distilled from decades of Unix practice. They describe not just code style but an entire philosophy of interface design — the same philosophy that makes `grep | sort | uniq | wc -l` work.

### 1. Rule of Modularity
**Build simple parts connected by clean interfaces.**

Complexity is the source of most bugs. Keep functions and programs focused on a single task. A large program is a collection of small programs that each do one thing. The Unix pipe (`|`) is the interface.

> "Write programs that do one thing and do it well. Write programs to work together." — Doug McIlroy

### 2. Rule of Clarity
**Clarity is better than cleverness.**

Code is read far more often than it is written. Optimize for the next person reading it (often yourself, six months later). Avoid tricks, obfuscated index arithmetic, and "smart" solutions that require re-derivation to understand.

### 3. Rule of Composition
**Design programs to be connected with other programs.**

Your program should be composable: it should read from stdin, write to stdout, and write errors/status to stderr. A program that can only be used standalone is a dead end. Composability is the mechanism by which small tools become powerful systems.

### 4. Rule of Separation
**Separate policy from mechanism; separate interfaces from engines.**

The engine (what the program computes) should be separate from the policy (how results are presented, what options are available). This is the 369 formulation: the `presentation()` engine is mechanism; the choice of `medium` is policy. Policy can change without rewriting mechanism.

### 5. Rule of Simplicity
**Design for simplicity; add complexity only where you must.**

Every feature has a cost: maintenance burden, cognitive load on users, test surface. Add complexity only when the benefit is clear and quantified. The question is not "could this be useful?" but "is this feature worth its complexity?"

### 6. Rule of Parsimony
**Write a big program only when nothing else will do.**

Before writing code, check if an existing tool solves the problem. Before adding a feature, check if a combination of existing features solves it. The best code is code not written.

### 7. Rule of Transparency
**Design for visibility to make inspection and debugging easier.**

A program should make its operation visible. Output enough information for a user to understand what it's doing without reading source code. `--verbose` and `--debug` flags are the mechanism. Logged intermediate states help.

### 8. Rule of Robustness
**Robustness is the child of transparency and simplicity.**

A program is robust when its failure modes are well-understood, tested, and recoverable. Simple programs fail in simple ways. Transparent programs make failure visible. The combination is robustness.

### 9. Rule of Representation
**Fold knowledge into data so program logic can be stupid and robust.**

Complex behavior encoded in a data structure (lookup table, configuration file, grammar) is easier to change and reason about than complex branching logic. The 369 recipes (`src/base/recipes/`) are an example: all component design decisions live in data, not code.

### 10. Rule of Least Surprise
**In interface design, always do the least surprising thing.**

A `--force` flag should not require interactive confirmation. A `--dry-run` flag should not actually write files. Flags should behave as their name implies, consistently across invocations. When uncertain, copy what similar tools do — users have already learned those conventions.

### 11. Rule of Silence
**When a program has nothing surprising to say, it should say nothing.**

Successful operations should produce no output. Progress output belongs on stderr, not stdout. A user who pipes your output to another program should not have to filter out status messages. Unix tools are silent on success: `mv`, `cp`, `mkdir` produce no output when they succeed.

This maps directly to CLIG: "Default to terse. Verbose with `--verbose`."

### 12. Rule of Repair
**When you must fail, fail noisily and as soon as possible.**

Fail fast; fail loudly; fail at the right layer. When input validation fails, say exactly which input failed and why. Print to stderr. Exit with a non-zero status code. Never silently accept invalid input and produce wrong output — that is the worst failure mode.

### 13. Rule of Economy
**Programmer time is expensive; conserve it in preference to machine time.**

Write code that is fast to read and modify, not just fast to execute. Premature optimization is the enemy of clarity. Measure before optimizing. When the user's time is the bottleneck (interactive TUI), optimize ruthlessly. When machine time is cheap and ample, optimize for programmer time.

### 14. Rule of Generation
**Avoid hand-hacking; write programs to write programs when you can.**

Code generators, template systems, and macros reduce maintenance burden. In 369: the `presentation()` and `resolveAny()` engines *generate* HTML rather than requiring hand-written layouts for every data shape. The recipe system is a generator. When you find yourself writing the same structure repeatedly, consider generation.

### 15. Rule of Optimization
**Prototype before polishing. Get it working before you optimize it.**

A working prototype reveals the actual bottlenecks. Optimized guesses are usually wrong about what's slow. Profile first, then optimize the measured bottleneck. The terminal rendering pipeline is an exception — frame timing constraints are known in advance.

### 16. Rule of Diversity
**Distrust all claims for one true way.**

No single language, framework, or paradigm is always correct. 369 runs in three TUI frameworks (Textual, Ratatui, Bubbletea) because each is better in its environment. The rule is not "always use X" but "know when X is the right tool."

### 17. Rule of Extensibility
**Design for the future, because it will be here sooner than you think.**

Export data in documented, standard formats. Make the internal structure visible and hookable. Use config files instead of compiled-in defaults. Write plugins where you expect extension. The `--output json` flag is extensibility. The XDG config path is extensibility.

---

## The Three Interface Archetypes

ESR identifies two dominant Unix TUI archetypes. A third has since emerged.

### Filter Pattern
The simplest and most composable Unix interface. Reads from stdin, transforms, writes to stdout.

```bash
cat data.csv | myfilter --option | sort | uniq > output.csv
```

Properties:
- Stateless between invocations
- No interactive UI
- Fully composable with the pipe operator
- Testable with `echo "input" | myprogram`
- Exit 0 on success, non-zero on failure

369 tools that process data should default to the filter pattern. The engine (`presentation()`) is a pure function — it is filter-shaped by design.

### Interactive vi/emacs Model
Full-screen TUI that takes over the terminal. Two sub-archetypes:
- **vi model:** Modal — distinct insert/command/visual modes. Steep learning curve, expert ceiling
- **emacs model:** Modeless — all commands via modifier keys (Ctrl, Meta). Shallow curve, deep key namespace

Properties:
- Requires TTY; degrades gracefully when not available
- State is held in-memory (the Model in Elm Architecture terms)
- Exit on `q` / `Ctrl-C` restores the terminal
- Must clean up on signal (`SIGTERM`, `SIGINT`) — restore terminal raw mode

### Server + TUI Dashboard (modern)
A long-running process (server, build system, job queue) with a TUI dashboard connected to it. The server is filter-like (stdin/stdout JSON protocol); the TUI is vi/emacs-like (full-screen). They communicate via IPC.

Properties:
- The dashboard is optional — `--no-tui` falls back to log output
- The server must be operable without the TUI (for CI, headless servers)
- State lives in the server; the TUI subscribes to state changes

---

## CLIG — Modern CLI Design Guidelines

Source: [clig.dev](https://clig.dev) — written by Aanand Prasad, Ben Firshman, Carl Tashian, and Eva Parish. The most comprehensive contemporary treatment of CLI/TUI design.

### The Eight Principles

**1. Human-First Design**
> "Build for humans first, machines second."

When stdout is a TTY, optimize for readability. When piped, optimize for parsing. The `isatty()` call is the decision point. Never make humans parse machine output to get human information, or vice versa.

**2. Simple Parts That Work Together**
> "Write programs that do one thing well and work with other programs."

McIlroy's dictum, restated for the modern era. Composability through pipes, `--output json`, and documented exit codes.

**3. Consistency Across Programs**
> "Use existing conventions; don't invent new ones."

`--help` means help. `-n` means dry-run (or count). `--verbose` means more output. `--quiet` means less. Deviate from convention only when there is a compelling reason, and document the deviation.

**4. Saying Just Enough**
> "Print just enough — not more, not less."

Terse by default. Silent on success (Rule of Silence). Error messages that tell the user exactly what went wrong and how to fix it. Progress that disappears when done.

**5. Ease of Discovery**
> "Help text should be thorough. Examples are essential."

`--help` should show usage, all flags with descriptions, and at least one concrete example. `--help` subcommand for each subcommand. Man page for complex tools. The help text is part of the interface.

**6. Conversation as the Norm**
> "Design a back-and-forth with the user."

For interactive tools (TTY): prompt for missing required inputs. Confirm dangerous operations. Show what is about to happen before doing it. For non-interactive (piped): error immediately with a clear message when required input is missing.

**7. Robustness**
> "Produce the same output given the same input."

Deterministic output. No hidden state (clock, random seeds, env vars that change behavior silently). The 369 Rule 8 ("Same input → same output") is this principle, stated for TUIs specifically.

**8. Empathy**
> "Treat users as intelligent adults."

Don't add unnecessary friction (confirmation for non-destructive operations). Don't hide information (show what the command is doing with `--verbose`). Don't assume users know your internals (error messages should explain the fix, not the implementation).

---

## Output Design — Canonical Patterns

### Progress and Status

```
# Spinner for unknown duration
⠸ Fetching jobs...       ← overwrites in-place, clears on done

# Progress bar for known duration
Uploading  [████████░░░░░░░░░░░░]  42%  1.2 MB/s  00:14 remaining

# Completed action
✓ 42 jobs synced in 3.2s

# Error
✕ Connection refused: api.adn.com:443
  Check your API_KEY and network connection.
  See: https://docs.adn.com/auth
```

Rules:
- Progress to stderr; data to stdout
- Use `\r` to overwrite a single status line; `\x1b[A` to go up and overwrite multiple lines
- Clear progress on completion (don't leave spinners hanging)
- Show count + timing on completion
- Error messages: what failed + why + how to fix it

### Column Alignment

Align output columns for human readability (TTY only):

```
NAME              STATUS    AGE    BUDGET
Sunset Lofts      active    3d     $15,000
Downtown Center   pending   12h    $8,500
```

When piped, emit TSV or JSON instead:
```
Sunset Lofts\tactive\t3d\t15000
```

Detect with `isatty(stdout)`.

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error (catch-all) |
| `2` | Misuse of shell / incorrect usage (wrong flags) |
| `126` | Command cannot execute |
| `127` | Command not found |
| `128+N` | Terminated by signal N |
| `130` | Terminated by Ctrl-C (signal 2) |

Always exit non-zero on failure. Always exit zero on success. Scripts depend on this.

---

## Standard Environment Variables

| Variable | Meaning |
|----------|---------|
| `NO_COLOR` | When set, disable all ANSI color output |
| `TERM` | Terminal type (`xterm-256color`, `vt100`, `dumb`) |
| `COLORTERM` | `truecolor` or `24bit` → true-color supported |
| `COLUMNS` / `LINES` | Terminal dimensions (may not be set; use `tput cols`/`tput lines`) |
| `PAGER` | Program to use for long output (default: `less`) |
| `EDITOR` | Program to open files for editing |
| `VISUAL` | Same as `EDITOR` (prefer `VISUAL` when set) |
| `XDG_CONFIG_HOME` | Config dir (default: `~/.config`) |
| `XDG_DATA_HOME` | Data dir (default: `~/.local/share`) |
| `XDG_CACHE_HOME` | Cache dir (default: `~/.cache`) |

---

## Signal Handling

A TUI must restore the terminal before exiting. Failure to do so leaves the user with raw mode enabled, no cursor, and a broken shell.

**Signals to handle:**

| Signal | Default | TUI handler |
|--------|---------|-------------|
| `SIGINT` (Ctrl-C) | Terminate | Save state, restore terminal, exit 130 |
| `SIGTERM` | Terminate | Same as SIGINT |
| `SIGWINCH` | Ignore | Re-query terminal size, re-render |
| `SIGHUP` | Terminate | Same as SIGTERM (terminal closed) |

**Cleanup pattern (Go):**
```go
c := make(chan os.Signal, 1)
signal.Notify(c, os.Interrupt, syscall.SIGTERM)
go func() {
    <-c
    p.Kill() // restore terminal
    os.Exit(130)
}()
```

---

## See Also

- `references/canon/tui-design.md` — Terminal rendering model, framework archetypes (Textual/Ratatui/Bubbletea), Elm Architecture, 369→TUI rule mapping
- `references/visual-rules.md` — 369 spacing, color, and typography rules
- `references/engines.md` — `presentation()` and `resolveAny()` engines (add `medium: 'terminal'` for TUI output)
