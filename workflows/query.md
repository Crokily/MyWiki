# Query

> Read this document after confirming the user is asking a question.

---

## Step 1: Locate relevant pages

Read [`index.md`](../index.md) to find related pages.

## Step 2: Search

Read [`extensions/qmd/README.md`](../extensions/qmd/README.md) for search methods (qmd semantic search or rg fallback).

## Step 3: Read and synthesize

Read relevant `pages/` and `sources/`, synthesize an answer.

## Step 4: Reply

Reply with `[[link]]` references to sources.

## Step 5: Decide whether to backfill

If the exploration produced new synthesis, comparison, or insight, proactively ask the user: "Should this be backfilled to `queries/`?"

## Step 6: If backfilling

1. Read [`taxonomy.md`](../taxonomy.md) to select tags
2. Write `queries/YYYY-MM-DD-slug.md`
3. Update backlinks on referenced pages
4. Append to `log.md`: `## [YYYY-MM-DD] query | <question>`
5. Git commit: `query: <question>`
