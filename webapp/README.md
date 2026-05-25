# CleanLA Webapp

Phase 2 map MVP for the CleanLA PWA. The home screen is now the read-only Los Angeles cleanup map; the Phase 1.5 validation report table remains as historical input and is migrated into Phase 2 spots.

## Local Development

```bash
npm install
npm run dev
```

Required environment variables are documented in `.env.example`.

## Scripts

- `npm run dev`: start the local Next.js server
- `npm run build`: create a production build
- `npm run start`: run the production build
- `npm run lint`: run ESLint
- `npm run typecheck`: run TypeScript checks
- `npm run format`: format project files

## Phase 2 Map MVP

Before running the map against a Supabase project, apply migrations through `20260525000200_phase2_spots.sql` and then run `supabase/seed.sql`. The app reads visible spots through the `spots_in_bounds` RPC via `GET /api/spots`.

The primary Phase 2 route is `/`. It requires:

- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If the Mapbox token is missing, the app renders a 369-compliant error panel instead of crashing.

## Design system — NON-NEGOTIABLE

Every UI surface in `webapp/` follows the **369 design system**. Not a preference, not "we'll polish later" — the rules are cheap to follow correctly the first time and expensive to retrofit.

**Before writing any component, any CSS class, any `className`, or any visual decision: invoke `369-design-system` via the Skill tool** (root-level skill at [`../.claude/skills/369-design-system/SKILL.md`](../.claude/skills/369-design-system/SKILL.md)).

The 8 non-negotiable rules at a glance (full skill is the source of truth):

1. **Spacing:** multiples of 3 ONLY (3, 6, 9, 12, 15, 18, 21, 24, …). Never 4, 5, 7, 8, 10, 14, 16, 20.
2. **Border radius:** `0` everywhere. One exception: `50%` for circular pins.
3. **Borders:** `1px solid #999999` on every container. No 2px. No colored borders except `success`/`warning`.
4. **Typography:** Helvetica Neue eText Pro, 12px body, type scale `{9, 12, 15, 18, 24, 30, 33, 36}`. UPPERCASE for labels, headers, buttons.
5. **Colors:** 8 core tokens. **Never Tailwind defaults** — `gray-100`, `blue-500`, etc. are bugs.
   - `navy #001089` · `grey #999999` · `white #FFFFFF` · `manila #f8eac7` · `amberSand #c7a87d` · `headerTop #94a3d6` · `headerCurrent #b8dae8` · `success #228B22` · `warning #a60315`
6. **Decoration:** NONE. No shadows, no gradients, no blur, no icon libraries (Lucide, Heroicons). Text glyphs only: `★ ✓ ✕ → ← • [+] [−] [×] i`.
7. **Run engines, don't guess.** For data → use the `presentation()` engine. For entities → use `resolveAny()`. Hand-picking a chart type defeats the system.
8. **Same input → same output.** The system is deterministic — run it twice; if the HTML differs, something is wrong.

**Five copy-paste patterns** (use directly, no skill invocation needed for these):

```tsx
// Window bar (program header)
className="h-[27px] flex items-center px-[9px] bg-[#94a3d6]"
// text: text-[15px] text-white font-bold uppercase

// Button
className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#001089]"
// hover: bg-[#f8eac7]

// Input
className="w-full bg-white border border-[#999999] px-[6px] py-[6px] text-[12px] text-[#001089] focus:outline-none focus:border-[#001089] focus:bg-[#f8eac7]"

// Label
className="block text-[12px] font-bold text-[#001089] uppercase mb-[6px]"

// Manila card (default tone)
className="bg-[#f8eac7] border border-[#999999] p-[9px]"
// hover: bg-[#b8dae8]
```

**Red flags to refuse:** any `px` not divisible by 3, any `rounded-*` Tailwind class, any Tailwind default color, borders ≠ 1px solid grey, shadows/gradients/blur, icon-library imports, emoji codepoints. Full red-flag table is in the skill's "Red flags — Stop and Fix" section.

Deeper guidance loads on demand from `../.claude/skills/369-design-system/references/`:

- `visual-rules.md` — exact spacing/color/typography rules
- `architecture.md` — file placement in `src/base/`, `src/pillars/`, `src/roof/`
- `engines.md` — `presentation()` and `resolveAny()` API
- `cards.md` — Card-primitive composition rules
- `tufte.md` / `tufte-principles.md` / `analytical-design.md` — data-viz canon
