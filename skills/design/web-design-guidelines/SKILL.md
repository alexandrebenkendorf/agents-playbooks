---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". Also use to refresh the rules ("update web design guidelines").
metadata:
  author: vercel
  version: "1.1.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Vercel's Web Interface Guidelines.

Upstream: https://github.com/vercel-labs/web-interface-guidelines (`command.md`). A snapshot is vendored in `rules.md`, so reviews work offline; `FETCH_LOG.md` records every refresh.

## How It Works

1. Run `./update.sh --check` (from this skill's folder). If it exits 1 (last fetch 7+ days ago, or never), run `./update.sh` to refresh `rules.md`. If the fetch fails (offline), continue with the existing snapshot and say it may be stale.
2. Read the specified files (or ask the user for files/pattern if none given).
3. Check against all rules in `rules.md`.
4. Output findings in the terse `file:line` format that `rules.md` specifies.

## Updating on demand

When the user asks to update/refresh the guidelines, run `./update.sh` and report its output (`unchanged` or `updated (old -> new)`). If updated, show what changed with `git diff rules.md`.
