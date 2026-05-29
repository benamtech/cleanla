#!/usr/bin/env bash
set -euo pipefail

# 369 contrast audit wrapper for CleanLA
# Runs the 369 WCAG AA + APCA + ΔE contrast audit against the site
# at the specified base URL, using the local manifest.
#
# Usage:
#   ./scripts/audit-369/audit-contrast.sh                    # uses http://localhost:3000
#   ./scripts/audit-369/audit-contrast.sh http://localhost:5173   # custom port
#   BASE=https://preview.example.com ./scripts/audit-369/audit-contrast.sh
#
# Environment:
#   BASE       - URL to audit (default: http://localhost:3000)
#   MANIFEST   - path to overlay manifest (default: ./scripts/audit-369/manifest.json)
#   ARTIFACTS  - directory for screenshots + SVG overlays on failure (default: ./.audit-output)
#   REPORT     - write JSON report to this path (default: ./.audit-output/report.json)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLEANLA_ROOT="$(cd "$(dirname "$SCRIPT_DIR")" && pwd)"

# Resolve defaults
BASE="${1:-${BASE:-http://localhost:3000}}"
MANIFEST="${MANIFEST:-$SCRIPT_DIR/manifest.json}"
ARTIFACTS="${ARTIFACTS:-./.audit-output}"
REPORT="${REPORT:-$ARTIFACTS/report.json}"

# Ensure manifest exists
if [[ ! -f "$MANIFEST" ]]; then
  echo "Error: manifest not found at $MANIFEST" >&2
  exit 1
fi

# Try to find audit-contrast.mjs in local node_modules first, then fall back to skill copy
AUDIT_SCRIPT=""
if [[ -f "$CLEANLA_ROOT/node_modules/@adn/369-design-system/references/audit-contrast.mjs" ]]; then
  AUDIT_SCRIPT="$CLEANLA_ROOT/node_modules/@adn/369-design-system/references/audit-contrast.mjs"
elif [[ -f "$CLEANLA_ROOT/webapp/node_modules/@adn/369-design-system/references/audit-contrast.mjs" ]]; then
  AUDIT_SCRIPT="$CLEANLA_ROOT/webapp/node_modules/@adn/369-design-system/references/audit-contrast.mjs"
elif [[ -f "/home/love-america/.claude/skills/369-design-system/references/audit-contrast.mjs" ]]; then
  AUDIT_SCRIPT="/home/love-america/.claude/skills/369-design-system/references/audit-contrast.mjs"
else
  echo "Error: audit-contrast.mjs not found. Install @adn/369-design-system or check skill path." >&2
  exit 1
fi

# Export environment and run audit
export BASE MANIFEST ARTIFACTS REPORT
exec node "$AUDIT_SCRIPT" "$@"
