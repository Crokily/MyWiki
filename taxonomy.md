# Taxonomy

The **controlled vocabulary** for this wiki. All frontmatter `type` and `tags` values must come from this file.

> **LLM**: Before creating or updating any page frontmatter, you **must** read this file first. When adding new terms, follow the maintenance procedures in section 5.
> This file co-evolves with the wiki. Each addition is a commit (`taxonomy: ...`).

---

## 1. `type` enum (pages/ only)

Every file in `pages/` **must** have a `type` field with a value from this table:

| type | Definition | Examples |
|---|---|---|
| `entity` | A concrete, referable thing: org, place, work, product (not a person) | `rust-foundation`, `mit` |
| `person` | A person | `james-clear`, `linus-torvalds` |
| `concept` | Abstract concept, theory, method, principle | `habit-formation`, `memory-safety` |
| `topic` | Synthesis page linking multiple concepts/entities | `personal-productivity`, `systems-programming` |
| `tool` | Software, tool, service, library | `obsidian`, `qmd`, `neovim` |
| `book` | Book | `atomic-habits` |
| `note` | Personal note, journal, reflection, plan | `2026-q2-goals`, `diet-log` |

**Other directories do not use `type`**:
- `sources/` uses `kind: source`
- `maps/` uses `kind: map`
- `queries/` uses `kind: query`

**Do not self-create new types.** If genuinely needed, the LLM proposes to the user; upon approval, add to this table.

---

## 2. `tags` hierarchical controlled vocabulary

### Format rules

- **Lowercase**, e.g. `rust` not `Rust`
- Words separated by **hyphens** `-`, e.g. `behavioral-psychology`
- Hierarchy uses **slashes** `/`, e.g. `tech/rust`
- **Maximum 3 levels**: `tech/lang/rust` is fine, `tech/lang/systems/rust` is not
- Top-level prefix must be from the registered list below

### Registered tags

> Initially only a few example entries. The vocabulary grows with ingests. LLM follows section 5 procedures when adding.

#### `tech/` -- technology, engineering, computing

- `tech/rust` -- Rust programming language
  - Banned variants: `Rust`, `rust-lang`, `rustlang`
- `tech/javascript` -- JavaScript language
  - Banned variants: `JS`, `js`, `javaScript`, `ecmascript`
- `tech/ai` -- artificial intelligence (broad)
  - Banned variants: `AI`, `artificial-intelligence`
- `tech/llm` -- large language models
  - Banned variants: `LLM`, `large-language-model`
- `tech/agent` -- AI agents, agent harnesses, agentic systems (including coding agents)
  - Banned variants: `agent`, `Agent`, `agentic`, `ai-agent`, `AI-Agent`, `agent-harness`

#### `learning/` -- learning methods, materials, education

_(to be populated)_

#### `life/` -- life knowledge, health, daily

_(to be populated)_

#### `personal/` -- personal records, goals, reflections

- `personal/goals` -- goals and plans
- `personal/journal` -- journals and reflections

#### `meta/` -- notes about the wiki itself

- `meta/workflow` -- workflow design, tool usage

---

## 3. `aliases` field conventions

`aliases` is used for Obsidian full-text search and `[[...]]` auto-completion. Include:

- **Alternative language names** (when the filename is an English slug)
- **Common abbreviations** (JS, AI, LLM may appear as aliases, but **tags must use the full form**)
- **Common misspellings** (`JavaScript` / `Javascript` / `Java Script`)
- **Alternative names, pen names for people**

**Example**:

```yaml
# pages/javascript.md
aliases: [JavaScript, JS, js, ECMAScript]
```

Note that `JS` may appear in `aliases`, but **never** in `tags`.

---

## 4. Filename slug rules

| Directory | Rule | Examples |
|---|---|---|
| `raw/` | `YYYY-MM-DD-slug.<ext>` (any extension) | `2026-04-05-atomic-habits-ch1.md`, `2026-04-10-paper.pdf`, `2026-04-11-talk.webp` |
| `sources/` | Same as `raw/` (matching basename, **always .md**) | `2026-04-05-atomic-habits-ch1.md` (even if raw is .pdf) |
| `pages/` | `english-slug.md`, **no date prefix** | `habit-formation.md` |
| `maps/` | `english-slug.md`, **no date prefix** | `tech-landscape.md` |
| `queries/` | `YYYY-MM-DD-slug.md` | `2026-04-05-rust-vs-zig-memory.md` |

**Globally unique**: No two files may share the same basename (without extension), even across directories. We use `[[slug]]` short links. For example, `raw/2026-04-10-paper.pdf` and `sources/2026-04-10-paper.md` are a valid 1:1 pair, but there cannot also be `raw/2026-04-10-paper.docx`.

Slug rules:
- English lowercase
- Words separated by hyphens `-`
- No spaces, no underscores, no uppercase
- Keep it concise but meaningful (`rust` is better than `rust-programming-language`)

---

## 5. Maintenance procedures

### 5.1 Adding a new tag

1. Confirm no existing tag fits
2. Check the "banned variants" list to ensure it is not an alternate spelling of an existing tag
3. Add a new entry under the appropriate top-level prefix with a clear **definition**
4. List all **banned variants** you can think of
5. In the **same commit**:
   - Update `taxonomy.md`
   - Apply the new tag to relevant pages
6. Commit message: `taxonomy: add tech/xxx`

### 5.2 Fixing term drift (found by lint or manually)

1. Choose a canonical form (prefer the registered one)
2. Add other variants to the "banned variants" list
3. Global replace (`rg -l "tag: xxx" | xargs sed -i ...` or manually)
4. Record the normalization in `log.md`
5. Commit: `taxonomy: normalize xxx -> yyy`

### 5.3 Adding a new `type`

**Requires explicit user approval.** LLM proposes, user agrees, write to this table, commit.

### 5.4 Adding a new top-level tag prefix (beyond `tech/` `life/` etc.)

Also requires user approval. A new prefix affects the overall categorization. Do not add lightly.
