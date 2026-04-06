#!/usr/bin/env bash
# init.sh — initialize the web-reader extension for MyWiki
#
# Installs defuddle (web content extractor) and optionally agent-browser.
# Run once after cloning.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "=== web-reader extension setup ==="
echo ""

# 1. Check / install defuddle
if npx defuddle --help >/dev/null 2>&1; then
  echo "-> defuddle already available via npx."
else
  echo "-> Installing defuddle..."
  npm install -g @anthropic-ai/defuddle || npm install -g defuddle
fi

# 2. Check agent-browser (optional, for interactive pages)
if command -v agent-browser >/dev/null 2>&1; then
  echo "-> agent-browser found."
else
  echo "-> agent-browser not found (optional)."
  echo "   Install with: npm install -g @anthropic-ai/agent-browser"
  echo "   Only needed for pages requiring login or popup dismissal."
fi

echo ""
echo "Done. web-reader extension ready."
echo "  Test: curl -sL 'https://example.com' | npx defuddle --markdown"
