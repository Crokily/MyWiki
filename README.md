# MyWiki

**[English](./README.md)** | [中文](./README_ZH.md)

A knowledge-base template maintained by LLM agents.

The design is described in [`llm-wiki.md`](./llm-wiki.md): instead of RAG, knowledge is **compiled** into a continuously evolving markdown wiki. Cross-referencing, synthesis, and contradiction checking are done upfront, not re-derived on every query.

---

## Quick start

1. Fork this repository and clone it locally
2. Open the project with any AI coding agent (Claude Code, Codex, etc.)
3. Add content and tell the agent what to ingest or query
4. The agent reads `AGENTS.md`, understands the wiki structure, and handles summarizing, cross-referencing, filing, and indexing

You can then enable extensions as needed:
- **web-reader** (strongly recommended): lets the agent fetch articles directly from URLs. Just tell your agent "enable the web-reader extension"
- **qmd**: semantic search across your wiki. Best enabled once you have many pages. Tell your agent "enable the qmd extension"
- **website**: generates a static site from your wiki. Useful if you don't use Obsidian for browsing. Tell your agent "enable the website extension"

Enabling any extension is as simple as telling your AI agent to do it.

---

## What this is

- A living knowledge base written by LLMs, read by humans
- Humans curate sources, ask questions, make judgments; the LLM summarizes, links, and maintains
- Structure: `raw/` (original sources) -> `sources/` (summaries) -> `pages/` (synthesized entities/concepts/topics) -> `maps/` & `queries/` (high-level synthesis and exploration)

## What this is not

- Not a chat history dump
- Not RAG retrieval over raw files
- Not a manually maintained wiki

---

## Directory structure

```
MyWiki/
├── AGENTS.md        LLM operational manual (core rules, loaded every session)
├── taxonomy.md      Controlled vocabulary (type / tags / aliases spec)
├── index.md         Content directory (LLM-maintained)
├── log.md           Timeline (append-only)
├── llm-wiki.md      Design philosophy
├── README.md        This file
│
├── workflows/       Workflow docs (loaded on demand)
│   ├── ingest.md    Ingest new sources
│   ├── query.md     Query the wiki
│   └── lint.md      Health checks
├── extensions/      Optional capability extensions (loaded on demand)
│   ├── qmd/         Hybrid semantic search
│   ├── web-reader/  Web content extraction
│   └── website/     Static site generation
│
├── raw/             Immutable original sources
├── sources/         Per-source summaries (1:1 with raw)
├── pages/           Wiki pages: entity / concept / topic / tool / book / person / note
├── maps/            High-level MOC / domain maps
└── queries/         Backfilled explorations, comparisons, analyses
```

---

## Daily usage

### Ingesting a new source

1. Place a markdown file in `raw/`, named `YYYY-MM-DD-title.md`
2. Tell the LLM agent: "ingest `raw/2026-04-05-xxx.md`"
3. The agent reads the source, discusses takeaways with you, and writes to the wiki after your confirmation
4. A single ingest may touch 5-15 pages; you see updates in real time in Obsidian

### Querying

1. Ask the agent: "compare X and Y", "what have I read about Z"
2. The agent searches the wiki, synthesizes an answer
3. If the synthesis is valuable, the agent asks whether to backfill it to `queries/`

### Periodic maintenance

- `lint`: have the agent run a health check (term consistency, orphan pages, broken links, etc.)
- Edit `taxonomy.md` directly to reorganize categories
- Edit `AGENTS.md` directly to adjust workflows and repository rules

---

## For LLM agents

**Read [`AGENTS.md`](./AGENTS.md) only.** It is the sole file required at session start.

AGENTS.md contains core rules and directs you to workflow docs (`workflows/`) and extension docs (`extensions/`) as needed. Do not preload everything.

---

## License

This project structure (AGENTS.md, taxonomy.md, workflows/, extensions/, llm-wiki.md) is designed to be open-sourced as a template: clear the content directories (`raw/` `sources/` `pages/` `maps/` `queries/`) and you have a ready-to-use framework for anyone.
