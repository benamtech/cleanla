# 369 Architecture — File Placement

Where every file goes in the 3/6/9 architecture. Three layers — BASE (3), PILLARS (6), ROOF (9). Each layer owns a specific concern; `src/app/` is the Next.js routing shell and is NOT a layer.

**Foundational principle:** Domain-specific abstraction beats generic tools (`canon-axioms.md` Axiom 9). A PILLAR's name should disclose its domain (`<SSMCard>` not `<DetailView>`). If a component name is generic, the design is probably wrong.

**Separation of concerns** (`canon-axioms.md` Axiom 9, Plan 9 Rio lineage): text I/O, graphics I/O, and input streams are **independent layers**. Don't model "terminal state" or "screen state" as a single monolith — treat each surface (window bar, body, footer, status strip) as its own composable PILLAR.

## The three layers

| # | Layer | Location | Owns | Principle |
|---|-------|----------|------|-----------|
| 3 | BASE | `src/base/` | Tokens, types, registry, services, state machines, auth, Supabase, shared types, generative engines (composition, component, spacing) | Every visual primitive follows multiples of 3 |
| 6 | PILLARS | `src/pillars/` | 6 programs + SHOP with co-located types, views, storage, fixtures | Programs are self-contained modules that declare needs via manifests |
| 9 | ROOF | `src/roof/` | AppShell, Wall, Sidebar, contexts, questionTree, wizard, Card primitive + templates | The Roof organizes rendered content without owning it |

**`src/app/`** is the Next.js routing shell (thin `page.tsx` files) — it is NOT a layer. Pages import from `roof` or `pillars`; they do not contain logic.

## File placement decision

Walk the questions in order. The first "yes" is your layer.

1. **Is it a visual primitive, token, type, business rule, or generative engine?** → `src/base/`
   - Examples: `tokens.ts`, `spec.ts`, `presentation/`, `recipes/`, `resolver.ts`, `spacing.ts`, `StateMachine.ts`, `auth/`, `UserContext.tsx`
2. **Else, is it a program component, program type, or program fixture?** → `src/pillars/<program>/`
   - Examples: `pillars/jbs/JobBoard.tsx`, `pillars/ssm/types.ts`, `pillars/pow/fixtures.ts`, `pillars/shop/storefront/`
3. **Else, is it layout, context, navigation, or cross-program orchestration?** → `src/roof/`
   - Examples: `AppShell.tsx`, `Wall.tsx`, `Sidebar.tsx`, `WallContext.tsx`, `wizard/`, `Card.tsx`, `cards/`
4. **Else, is it a Next.js route entry point?** → `src/app/<route>/page.tsx` (keep these thin — import from roof/pillars)

**Anti-patterns** (these are bugs, fix on sight):
- File in `src/components/` — there is no such directory. Move to the right layer.
- File in `src/lib/` — there is no such directory. Move to the right layer.
- Logic inside `src/app/<route>/page.tsx` — extract to roof or pillars; the route file should be a thin import + render.
- Cross-pillar import (e.g., `pillars/jbs/` importing from `pillars/ssm/`) — promote the shared type/utility to `base/` or `roof/`.

## The six programs

| ID | Name | Route | Category | Purpose |
|----|------|-------|----------|---------|
| `home` | HOME | `/home` | core | Marketing funnel — pitch, philosophy |
| `start` | START | `/start` | core | Producer discovery wizard |
| `ssm` | SPEC SHEET MANAGER | `/ssm` | tool | [CLIENT] command center — specs, production, embeds all |
| `jbs` | JOB BIDDING SYSTEM | `/jbs` | tool | [PRODUCER] marketplace — blind bidding, tag-gated |
| `sps` | SECURE PAYMENT SYSTEM | `/sps` | system | Milestone escrow + standalone invoicing |
| `pow` | PROOF OF WORK | `/pow` | system | Trust — proof, profiles, ratings, disputes |
| `shop` | SHOP | `/shop` | marketplace | Storefront for American-made goods (art, products) |

Programs use bracket notation: `[HOME] [START] [SSM] [JBS] [SPS] [POW] [SHOP]`.

## Bracket notation discipline

**User-visible UI** (mode toggle, marketing prose, tooltips, aria-labels, 369 specimens, emails):
- Full words ONLY: `[CLIENT]`, `[PRODUCER]`, `[SSM]`, `[JBS]`, `[SPS]`, `[POW]`, `[HOME]`, `[START]`, `[SHOP]`.
- NEVER `[C]` / `[P]` — the adjacency reads as a harmful shorthand.

**Code-only** (TS types, code comments, DB columns, internal logs):
- `[CLIENT]` / `[PRODUCER]` shorthand is allowed for terseness.
- Still NEVER `[C]` / `[P]` site-wide — even in code, full-word `[CLIENT]` / `[PRODUCER]` is preferred when the context allows.

## Cross-references

For visual rules (spacing, colors, typography, layout constants) → `visual-rules.md`.
For engines (`presentation`, `resolveAny`) and how data/entities become HTML → `engines.md`.
For the Card primitive and how to compose card-shaped UI → `cards.md`.
