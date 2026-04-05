#!/usr/bin/env bash
# qmd-init.sh — initialize qmd search for MyWiki
#
# Run once after cloning, or after any change that affects many files.
# Requires: qmd installed globally (npm i -g @tobilu/qmd)

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v qmd >/dev/null 2>&1; then
  echo "ERROR: qmd not found on PATH." >&2
  echo "Install with: npm install -g @tobilu/qmd" >&2
  echo "          or: bun install -g @tobilu/qmd" >&2
  exit 1
fi

echo "→ Registering collection contexts (semantic hints for the LLM)..."

# These contexts are the key feature of qmd — they help the LLM pick the
# right collection. See qmd README: "Don't sleep on it!"
qmd context add qmd://pages   "Synthesized wiki pages: entities, people, concepts, topics, tools, books, notes. The compiled knowledge layer — prefer this first for most questions." || true
qmd context add qmd://sources "Per-source summaries, 1:1 with raw/. Use when you need to trace a claim back to its origin or find which source said what." || true
qmd context add qmd://maps    "High-level Maps of Content (MOCs) and domain landscapes. Use for broad overview questions." || true
qmd context add qmd://queries "Saved explorations, comparisons, analyses — answers to past questions. Check before re-deriving." || true
qmd context add qmd://raw     "Immutable original source documents. Last resort when the sources/ summary is insufficient." || true

echo "→ Building embeddings (first run downloads models, ~minutes)..."
qmd embed

echo ""
echo "✓ qmd ready."
echo "  Try: qmd query 'your question'"
echo "  Or:  qmd search 'exact phrase' -c pages"
