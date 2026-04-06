# Ingest

> Read this document after confirming the user wants to ingest a new source.

---

## Prerequisites

1. [`taxonomy.md`](../taxonomy.md) -- get available types and tags
2. [`index.md`](../index.md) -- overview of existing pages

---

## Step 0: Save to `raw/`

Filename `YYYY-MM-DD-slug.<ext>`, basename (without extension) must be globally unique.

| Input type | Action |
|---|---|
| Local file | Copy directly into `raw/`, preserving the original extension |
| URL | Read [`extensions/web-reader/README.md`](../extensions/web-reader/README.md) for extraction method, save as md |
| Pasted text | Format as md and save |

> `sources/<basename>.md` and `raw/<basename>.<ext>` maintain 1:1 mapping, matching basename is sufficient.

## Step 1: Read the raw source in full

Read through the entire raw file to understand the content.

## Step 2: Discuss takeaways

**Critical step, cannot be skipped.**

List 3-7 key points. Ask the user which ones to emphasize and whether anything is missing. **Wait for the user to respond before writing.**

## Step 3: Write `sources/`

Write `sources/<same-basename>.md`: structured summary + `touches` listing the pages that will be affected.

## Step 4: Update or create `pages/`

A single ingest may touch 5-15 pages:
- **New pages**: select `type` and `tags` from taxonomy
- **Existing pages**: append new information, insert citations, revise outdated claims as needed

## Step 5: Bidirectional link maintenance

Add the current source link to the `sources` field of referenced pages.

## Step 6: Tag/type registration

If a tag/type not in taxonomy is needed, **stop** and inform the user. After confirmation, write to `taxonomy.md`.

## Step 7: Regenerate `index.md`

Group by type and tag.

## Step 8: Append to `log.md`

`## [YYYY-MM-DD] ingest | <title>` + list of affected files.

## Step 9: Search index

If 3 or more files were created or modified, read [`extensions/qmd/README.md`](../extensions/qmd/README.md) to check whether the search index needs updating.

## Step 10: Git commit

`ingest: <short title>`

One ingest = one commit. Do not split.
