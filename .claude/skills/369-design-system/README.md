# 369 Design System — Extracted

This skill has been extracted into its own dedicated repository as of **2026-05-27**.

**New canonical location:** `~/code/369-design-system/` (GitHub: `navruhtra/369-design-system`, private)

**Brain wrapper:** `~/brain/369-design-system/`

## How to use

The 369 design system is loaded **automatically** by Claude Code via the global skill at `~/.claude/skills/369-design-system/`, which symlinks to the canonical repo. No setup required — invoke any 369 design work and the skill auto-loads.

### Optional: per-project symlink

If you want the skill at the project-level too (for IDE plugins or tooling that scans `.claude/`):

```bash
rm -rf .claude/skills/369-design-system
ln -s ~/code/369-design-system .claude/skills/369-design-system
```

But this is optional — global loading is sufficient for Claude Code.

## Upgrading 369

The 369 design system is **read-only from CleanLA's perspective**. Upgrades happen in the dedicated repo:

```bash
cd ~/code/369-design-system/
# edit canon / axioms / rules
git commit -am "[upgrade] <description>"
git push
```

Changes are immediately available to all brains via the global skill.

## Lineage

Wave history for 369 (waves 1–8) is preserved in CleanLA's git log up through commit `04cc6f3`. After that commit, the canonical history continues in the dedicated repo.

See `~/code/369-design-system/README.md` for full details.
