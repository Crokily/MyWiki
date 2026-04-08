# AGENTS.md

> Core rules for LLM agents maintaining this wiki. Kept minimal; loaded at the start of every session.
> For detailed workflows see `workflows/`. For the design philosophy see [`llm-wiki.md`](./llm-wiki.md).
>
> **Loading principle**: This is the only file that must be read at session start.
> Workflows (`workflows/`) and extensions (`extensions/`) are loaded **on demand**. Do not preload them.

---

## 1. Three-layer architecture

| Layer | Location | Owner | Rule |
|---|---|---|---|
| **Raw** | `raw/` | User | **Immutable.** LLM read-only, never modify. |
| **Wiki** | `sources/` `pages/` `maps/` `queries/` | LLM | LLM creates, updates, and maintains. |
| **Control** | `AGENTS.md` `taxonomy.md` `index.md` `log.md` | Co-evolved | LLM updates per rules; notify user on major changes. |

---

## 2. Directory specification

| Directory | Content | File naming |
|---|---|---|
| `raw/` | Immutable original material (any format) | `YYYY-MM-DD-slug.<ext>` |
| `sources/` | Per-raw summary (1:1 mapping, always .md) | Same basename as raw |
| `pages/` | Entity / concept / topic / tool / book / person / note | `english-slug.md` |
| `maps/` | High-level MOC, domain landscape | `english-slug.md` |
| `queries/` | Backfilled explorations, comparisons, analyses | `YYYY-MM-DD-slug.md` |

**Flat only, no subdirectories.** Organization relies on frontmatter + `[[wikilinks]]` + `index.md`.

**Globally unique filenames**: Basenames (without extension) must not collide across directories, because `[[slug]]` short links are used.

---

## 3. Frontmatter specification

**Before creating or updating any frontmatter**: read [`taxonomy.md`](./taxonomy.md) first. Use only registered `type` and `tags`. Do not invent new ones.

### pages/

```yaml
---
type: concept            # Semantic type used by the page
title: Habit Formation
aliases: [habit formation, Habit Loop]
tags: [learning/behavioral-psychology]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-05-atomic-habits-ch1]]"
---
```

### sources/

```yaml
---
kind: source
title: "Atomic Habits Chapter 1"
source_type: book-chapter  # article | book-chapter | paper | podcast | video | note | web
raw: "[[2026-04-05-atomic-habits-ch1]]"
author: "[[james-clear]]"
ingested: 2026-04-05
tags: [learning/behavioral-psychology]
touches:
  - "[[habit-formation]]"
---
```

### maps/ and queries/

```yaml
# maps/                           # queries/
---                                ---
kind: map                          kind: query
title: Tech Landscape              title: "Rust vs Zig memory management?"
tags: [tech]                       asked: 2026-04-05
created: 2026-04-05                tags: [tech/rust, tech/zig]
updated: 2026-04-05                references:
---                                  - "[[rust]]"
                                   ---
```

> `pages/` uses `type` (semantic type). Other directories use `kind` (fixed field).

---

## 4. Links and language

- **Links**: always use `[[page-name]]` (Obsidian wiki link), basename only across directories
- With display text: `[[page-name|display text]]`. Do not use `[text](file.md)` format
- **Content language**: English by default; keep proper nouns in their original form
- **File names**: English slug (lowercase + hyphens)
- **aliases**: Include alternative names, abbreviations, and common misspellings

---

## 5. Workflows

Based on user intent, **read the corresponding workflow document before executing**:

| User intent | Read | Trigger examples |
|---|---|---|
| Ingest new source | [`workflows/ingest.md`](./workflows/ingest.md) | "ingest", providing a file/URL/text |
| Query wiki | [`workflows/query.md`](./workflows/query.md) | Asking questions, "compare", "analyze" |
| Health check | [`workflows/lint.md`](./workflows/lint.md) | "lint", "check" |

> **Do not preload all workflows.** After determining user intent, read only the relevant one.

---

## 6. Extensions (optional capabilities)

`extensions/` provides optional enhancements (e.g., semantic search, web scraping). **Do not load extensions at session start.** Workflow documents will direct you to the relevant extension README when needed.

Extension list: [`extensions/README.md`](./extensions/README.md).

---

## 7. Git commit conventions

Format: `<type>: <short description>`

| type | Use |
|---|---|
| `ingest` | Ingest new source |
| `query` | Backfill exploration results |
| `lint` | Health check fixes |
| `taxonomy` | Vocabulary maintenance |
| `map` | Create/update MOC |
| `refactor` | Split, merge, rename pages |
| `meta` | AGENTS.md / README / scripts / control layer changes |

**One ingest = one commit.** Do not split.

---

## 8. Autonomy matrix

**Must ask**:
- Ingest takeaways (critical step, cannot be skipped)
- Adding a new `type` (cannot self-create)
- Confirm before adding a new `tag`
- How to fix issues found by lint
- Whether to backfill query results

**Can decide independently**:
- Which existing tag to select from taxonomy
- Which directory a file belongs in, link style, naming style
- How many pages a single ingest touches

---

## 9. Prohibitions

- Modifying any file under `raw/`
- Self-creating `type` or `tag` without registering in taxonomy
- Deleting a page without explicit user approval
- Batch-rewriting more than 5 files without informing scope first
- Leaving important conclusions only in conversation without backfilling to wiki
- Using standard markdown links `[text](file.md)` (must use `[[...]]`)
- Using `type` field in `sources/` `maps/` `queries/` (use `kind`)
- **Preloading all workflow and extension documents at session start**
