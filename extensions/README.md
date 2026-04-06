# Extensions

> **Do not load this file or any extension docs at session start.**
> Workflow documents (`workflows/`) will direct you to the relevant extension when needed.

Each extension README.md is **self-contained**: it includes detection, usage, and fallback instructions. Reading it alone is sufficient; no cross-referencing needed.

## Available extensions

| Extension | Capability | When to read |
|---|---|---|
| [`qmd/`](./qmd/README.md) | Hybrid semantic search | When searching wiki content |
| [`web-reader/`](./web-reader/README.md) | Web content extraction | When fetching content from a URL |
| [`website/`](./website/README.md) | Static site generation | When deploying the wiki as a website |

## Adding a new extension

Create a new directory + write a self-contained README.md (detect, use, fallback, install).
