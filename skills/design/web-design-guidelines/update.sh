#!/usr/bin/env bash
# Refresh rules.md from the upstream Web Interface Guidelines and append to FETCH_LOG.md.
# Usage: ./update.sh          fetch now, update rules.md only if upstream changed
#        ./update.sh --check  exit 0 if the last fetch is under 7 days old, 1 if stale
set -euo pipefail
cd "$(dirname "$0")"

URL="https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"
LOG="FETCH_LOG.md"
MAX_AGE_DAYS=7

if [ "${1:-}" = "--check" ]; then
  last=$(grep -E '^\| [0-9]{4}-' "$LOG" 2>/dev/null | tail -1 | cut -d'|' -f2 | tr -d ' ' || true)
  if [ -z "$last" ]; then
    echo "never fetched"
    exit 1
  fi
  last_epoch=$(date -j -f "%Y-%m-%d" "$last" +%s 2>/dev/null || date -d "$last" +%s)
  age_days=$(( ($(date +%s) - last_epoch) / 86400 ))
  if [ "$age_days" -ge "$MAX_AGE_DAYS" ]; then
    echo "stale: last fetched $last ($age_days days ago)"
    exit 1
  fi
  echo "fresh: last fetched $last"
  exit 0
fi

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
curl -fsSL "$URL" -o "$tmp"

new_sha=$(shasum -a 256 "$tmp" | cut -c1-12)
old_sha=$( [ -f rules.md ] && shasum -a 256 rules.md | cut -c1-12 || echo "none" )

if [ "$new_sha" = "$old_sha" ]; then
  result="unchanged"
else
  cp "$tmp" rules.md
  result="updated ($old_sha -> $new_sha)"
fi

if [ ! -f "$LOG" ]; then
  printf '# Fetch log\n\nSource: %s\n\n| Date | Result |\n|------|--------|\n' "$URL" > "$LOG"
fi
printf '| %s | %s |\n' "$(date +%F)" "$result" >> "$LOG"
echo "$result"
