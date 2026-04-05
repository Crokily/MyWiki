#!/usr/bin/env bash
# init.sh — initialize the qmd extension for MyWiki
#
# Run once after cloning, or after heavy repo changes.
# Requires: qmd installed globally (npm i -g @tobilu/qmd)

set -euo pipefail

# Resolve project root (this script lives at extensions/qmd/init.sh)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

if ! command -v qmd >/dev/null 2>&1; then
  echo "ERROR: qmd not found on PATH." >&2
  echo "Install with: npm install -g @tobilu/qmd" >&2
  echo "          or: bun install -g @tobilu/qmd" >&2
  exit 1
fi

# 1. Ensure qmd.yml symlink at project root
if [ ! -e "qmd.yml" ] && [ ! -L "qmd.yml" ]; then
  echo "→ Creating symlink qmd.yml -> extensions/qmd/qmd.yml"
  ln -s extensions/qmd/qmd.yml qmd.yml
elif [ -L "qmd.yml" ]; then
  echo "→ qmd.yml symlink already present."
else
  echo "WARNING: qmd.yml exists at root but is not a symlink." >&2
  echo "  The canonical config is extensions/qmd/qmd.yml." >&2
  echo "  Consider: rm qmd.yml && ln -s extensions/qmd/qmd.yml qmd.yml" >&2
fi

# 2. Register collection contexts (semantic hints for the LLM)
echo "→ Registering collection contexts..."
qmd context add qmd://pages   "Synthesized wiki pages: entities, people, concepts, topics, tools, books, notes. The compiled knowledge layer — prefer this first for most questions." || true
qmd context add qmd://sources "Per-source summaries, 1:1 with raw/. Use when you need to trace a claim back to its origin or find which source said what." || true
qmd context add qmd://maps    "High-level Maps of Content (MOCs) and domain landscapes. Use for broad overview questions." || true
qmd context add qmd://queries "Saved explorations, comparisons, analyses — answers to past questions. Check before re-deriving." || true
qmd context add qmd://raw     "Immutable original source documents. Last resort when the sources/ summary is insufficient." || true

# 3. Build embeddings
echo "→ Building embeddings (first run downloads models, ~minutes)..."
qmd embed

echo ""
echo "✓ qmd extension ready."
echo "  Try: qmd query 'your question'"
echo "  Or:  qmd search 'exact phrase' -c pages"
