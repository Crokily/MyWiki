# Lint

> Read this document when the user says "run a lint" or "health check".

---

## Prerequisites

[`taxonomy.md`](../taxonomy.md) -- needed to check for term drift.
[`index.md`](../index.md) -- helps you inspect the current wiki layout.

---

## Checks

1. **Terminology consistency**: scan page titles, headings, aliases, and frontmatter labels for obvious variants or duplicate concepts
2. **Orphan pages**: pages in `pages/` not linked from any other file
3. **Broken links**: `[[...]]` pointing to nonexistent files
4. **Contradictions**: conflicting claims across interlinked pages
5. **Staleness**: older pages not updated after newer sources have covered the topic
6. **Missing pages**: concepts/entities mentioned multiple times but lacking a dedicated page

## Search tools

Read [`extensions/qmd/README.md`](../extensions/qmd/README.md) for search methods, or use directly:

```bash
rg -l "pattern" pages sources maps queries
rg "^tags:" pages/ sources/ --no-heading
```

## Execution

1. **Output a report** to the user, **wait for confirmation** before fixing
2. After fixing: append to `log.md` + commit: `lint: <summary>`
