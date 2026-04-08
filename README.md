# MyWiki

**[English](./README.md)** | [中文](./README_ZH.md)

A knowledge base template maintained by LLM agents. Instead of RAG, knowledge is compiled into a continuously evolving markdown wiki. Cross-referencing, synthesis, and contradiction checking happen once at ingest time, not on every query.

The design philosophy is described in [`llm-wiki.md`](./llm-wiki.md).

## Getting Started

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCrokily%2FMyWiki&project-name=mywiki&repository-name=mywiki)

Click the button above. It will fork this repository to your GitHub account and deploy it to Vercel automatically. Then clone your fork to your local machine and open it with any AI coding agent (Claude Code, Codex, Pi, OpenClaw, etc.). The agent reads `AGENTS.md` on startup, understands everything, and you can start adding sources and asking questions immediately.

## How It Works

You provide sources. The AI agent reads them, extracts key information, and integrates it into the wiki. It handles summarizing, cross-referencing, filing, and indexing. You never write the wiki yourself. The agent writes and maintains all of it.

The wiki is a persistent, compounding artifact. Every source you add and every question you ask makes it richer. The cross-references are already there. The contradictions have already been flagged. The synthesis already reflects everything you have read.

### Ingest

Drop a file into `raw/` and tell the agent to ingest it. The agent reads the source, discusses takeaways with you, and writes to the wiki after your confirmation. A single ingest may touch 5 to 15 pages.

You can also give the agent a URL directly if the web-reader extension is enabled.

### Query

Ask the agent questions: "compare X and Y", "what have I read about Z". The agent searches the wiki, synthesizes an answer, and offers to save valuable results back into the wiki.

### Lint

Ask the agent to run a health check. It looks for term inconsistencies, orphan pages, broken links, missing cross-references, and other issues.

## Extensions

Extensions add optional capabilities. Enable any of them by telling your AI agent.

| Extension | What it does |
|---|---|
| **web-reader** | Lets the agent fetch articles from URLs. Strongly recommended. |
| **qmd** | Semantic search across your wiki. Useful once you have many pages. |
| **website** | Generates a static site from your wiki. Already deployed by Vercel in step 1. |

## Directory Structure

```
MyWiki/
├── AGENTS.md         LLM operational manual (loaded every session)
├── taxonomy.md       Controlled vocabulary (type / tags / aliases)
├── index.md          Content directory (LLM maintained)
├── log.md            Timeline (append only)
├── llm-wiki.md       Design philosophy
│
├── workflows/        Workflow docs (loaded on demand)
│   ├── ingest.md
│   ├── query.md
│   └── lint.md
├── extensions/       Optional capability extensions
│   ├── qmd/
│   ├── web-reader/
│   └── website/
│
├── raw/              Immutable original sources
├── sources/          Per source summaries
├── pages/            Wiki pages (entities, concepts, topics, ...)
├── maps/             High level domain maps
└── queries/          Explorations, comparisons, analyses
```

## Use Cases

- **Personal knowledge management**: journal entries, articles, podcast notes, self-improvement tracking
- **Research**: papers, reports, and articles compiled into an evolving synthesis
- **Reading a book**: chapter by chapter, building out pages for characters, themes, and plot threads
- **Business**: meeting transcripts, project documents, customer calls turned into a living internal wiki
- **Anything where knowledge accumulates over time** and you want it organized rather than scattered

## For LLM Agents

Read [`AGENTS.md`](./AGENTS.md) only. It is the sole file required at session start.

## License

MIT
