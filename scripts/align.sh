#!/usr/bin/env bash
# scripts/align.sh
#
# Read-only audit of the CleanLA webapp + wiki + dev plan.
# Produces a snapshot of "what's true right now" so any collaborator can
# pull and see the latest state without re-deriving it.
#
# This is the bash version of memory/prompt.md — what an AI agent would
# gather before producing the alignment report. The agent (Claude Code's
# /align command, or any human reading the output) then synthesizes the
# narrative.
#
# Usage:
#   bash scripts/align.sh                 # print to stdout
#   bash scripts/align.sh > snapshot.txt  # save raw output
#
# Does NOT edit files, push code, run migrations, or change deps.

set -u
cd "$(dirname "$0")/.." || exit 1

hr() { printf '\n──────────────────────────────────────────────────────────────\n%s\n──────────────────────────────────────────────────────────────\n' "$1"; }

hr "GIT STATE"
git status --short --branch 2>&1 || echo "not a git repo"

hr "RECENT COMMITS (15)"
git log --oneline -15 2>&1

hr "BRANCHES vs ORIGIN"
git rev-list --left-right --count origin/main...HEAD 2>&1 | awk '{print "behind origin by: " $1 "  ·  ahead of origin by: " $2}'
echo ""
echo "(run 'git fetch origin' first if these numbers look stale)"

hr "WEBAPP SOURCE TREE"
find webapp/src webapp/supabase/migrations -type f 2>/dev/null | grep -v ".gitkeep" | sort
echo ""
echo "wiki decision logs:"
ls -1 wiki/decisions/*.md 2>/dev/null | xargs -n1 basename
echo ""
echo "memory notes (newest first):"
ls -1t memory/*.md 2>/dev/null | xargs -n1 basename

hr "ENV CONTRACT (.env.example)"
cat webapp/.env.example 2>/dev/null || echo "no .env.example"
echo ""
if [ -f webapp/.env.local ]; then
  echo ".env.local is present. Required keys (values redacted):"
  awk -F= '/^[A-Z_]+=/{print "  " $1 "=" (length($2)>0 ? "<set>" : "<empty>")}' webapp/.env.local
else
  echo ".env.local is NOT present — copy .env.example and fill values."
fi

hr "PACKAGE DEPS"
if [ -f webapp/package.json ]; then
  node -e "const p=require('./webapp/package.json'); console.log('runtime: ' + Object.keys(p.dependencies||{}).sort().join(', ')); console.log('dev: ' + Object.keys(p.devDependencies||{}).sort().join(', '));"
fi

hr "MIGRATIONS PRESENT"
ls -1 webapp/supabase/migrations/*.sql 2>/dev/null

hr "WEBAPP HEALTH CHECKS"
if [ ! -d webapp/node_modules ]; then
  echo "node_modules missing — run 'cd webapp && npm install' first"
else
  # If a dev server is running on :3000 we skip the build (which would clear .next
  # and break the live server). Lint+typecheck still run and use a side .next.
  DEV_LIVE=0
  curl -fsS -o /dev/null --max-time 1 http://localhost:3000 2>/dev/null && DEV_LIVE=1

  if [ "$DEV_LIVE" = "0" ]; then
    echo "→ clearing .next cache (no live dev server detected)"
    rm -rf webapp/.next webapp/tsconfig.tsbuildinfo 2>/dev/null
  else
    echo "→ keeping .next cache (live dev server detected on :3000)"
    rm -f webapp/tsconfig.tsbuildinfo 2>/dev/null
  fi

  echo ""
  echo "→ npm run lint"
  (cd webapp && npm run lint 2>&1 | tail -5)

  echo ""
  echo "→ npm run typecheck"
  (cd webapp && npm run typecheck 2>&1 | tail -5)

  if [ "$DEV_LIVE" = "0" ]; then
    echo ""
    echo "→ npm run build (also lists routes)"
    (cd webapp && npm run build 2>&1 | tail -20)
  else
    echo ""
    echo "→ skipping npm run build (would clear .next and break live dev server)"
    echo "   to include routes in a fresh build, stop the dev server first and re-run /align."
  fi
fi

hr "RUNNING SERVICES"
echo "Next.js dev (port 3000):"
if curl -fsS -o /dev/null -w "  HTTP %{http_code}\n" --max-time 2 http://localhost:3000 2>/dev/null; then
  curl -fsS -o /dev/null -w "  GET /                       → HTTP %{http_code} (%{size_download}b)\n" --max-time 2 http://localhost:3000
  curl -fsS -o /dev/null -w "  GET /admin/health           → HTTP %{http_code}\n" --max-time 2 http://localhost:3000/admin/health
  curl -fsS -o /dev/null -w "  GET /manifest.webmanifest   → HTTP %{http_code}\n" --max-time 2 http://localhost:3000/manifest.webmanifest
  curl -fsS -o /dev/null -w "  GET /api/spots (LA bounds)  → HTTP %{http_code}\n" --max-time 2 "http://localhost:3000/api/spots?west=-118.7&south=33.6&east=-118.0&north=34.4&limit=50"
  curl -fsS -o /dev/null -w "  GET /api/spots (no params)  → HTTP %{http_code} (should be 400)\n" --max-time 2 http://localhost:3000/api/spots
else
  echo "  not responding (start with 'cd webapp && npm run dev')"
fi
echo ""
echo "Supabase local stack:"
if (cd webapp && npx --no -p supabase supabase status 2>&1 | grep -qE "API URL|DB URL"); then
  (cd webapp && npx --no -p supabase supabase status 2>&1 | grep -E "(API URL|DB URL|Studio URL)") || true
else
  echo "  not running (start with 'cd webapp && npx supabase start')"
fi

hr "STALE DOC CHECK"
if [ -f CleanLA-development-plan.md ]; then
  if grep -qiE "(react native|expo|@rnmapbox|firebase|EAS)" CleanLA-development-plan.md; then
    echo "⚠ CleanLA-development-plan.md still references the OLD mobile/Firebase stack."
    echo "  The current code is Next.js + Supabase + mapbox-gl (web)."
    echo "  See wiki/decisions/2026-05-web-stack-over-mobile.md for the supersession."
  else
    echo "✓ CleanLA-development-plan.md appears stack-aligned."
  fi
fi

hr "OPEN QUESTIONS FROM wiki/index.md"
# Print lines starting with "- " between the "## Open questions" header and the next "## " header.
awk '/^## Open questions/{found=1; next} found && /^## /{exit} found && /^- /' wiki/index.md 2>/dev/null | head -10

hr "DONE"
echo "Snapshot taken: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""
echo "This script gathers state only — it does NOT write a report."
echo "For the narrative report, run the /align slash command in Claude Code,"
echo "which feeds this output to the agent and updates memory/LATEST_ALIGNMENT.md."
