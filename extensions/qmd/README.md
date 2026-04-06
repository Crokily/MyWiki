# qmd -- hybrid semantic search

> Read this file when you need to search wiki content. Self-contained: detect, use, fallback.

---

## Detection

All **three** conditions must be met:

1. `command -v qmd` produces output
2. `qmd.yml` exists at project root
3. `qmd context list` returns a non-empty list

**If any condition fails, skip to the "Fallback" section below.**

---

## Usage (when qmd is available)

```bash
qmd query "natural language question"          # hybrid search + reranking, preferred
qmd search "exact phrase" -c pages             # search within a specific collection
qmd get "pages/xxx.md" --full                  # read a file with metadata
```

Available collections: `pages`, `sources`, `maps`, `queries`, `raw`.

`rg` / `fd` remain useful as supplements for **exact string** matching.

### Index update

After creating or modifying 3 or more files, run before git commit:

```bash
qmd embed
```

---

## Fallback (when qmd is unavailable)

```bash
rg -l "pattern" pages sources maps queries
rg "pattern" -C 2 pages/
fd -e md . pages sources maps queries
```

---

## Installation (for human users)

```bash
npm install -g @tobilu/qmd
bash extensions/qmd/init.sh
```

## Files

| File | Role |
|---|---|
| `README.md` | This file |
| `qmd.yml` | qmd configuration (the root `qmd.yml` is a symlink to this file) |
| `init.sh` | One-time initialization script |
