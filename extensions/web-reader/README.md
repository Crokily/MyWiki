# web-reader -- web content extraction

> Read this file when you need to fetch content from a URL. Self-contained: detect, use, fallback.

---

## Detection

`npx defuddle --help` runs successfully: defuddle is available.

Optional enhancement: `command -v agent-browser` succeeds: interactive page support enabled.

---

## Usage (when defuddle is available)

### Path A: defuddle direct (preferred, fastest)

Works for the vast majority of blogs, news, documentation, and paper pages.

```bash
npx defuddle parse "$URL" --markdown --json
```

`--json` outputs structured metadata (title / author / date / description).

**Success check**: if the output body is under 100 characters or returns an error, proceed to Path B.

### Path B: agent-browser + defuddle (for interactive pages)

For pages with popups, cookie walls, login, or SPA rendering.

1. Open the URL with agent-browser, complete the interaction
2. Extract the rendered HTML (`document.documentElement.outerHTML`)
3. Save to a temporary file
4. `npx defuddle /tmp/page.html --markdown --json`

### Path C: agent-browser plain text (last resort)

Use only when defuddle also fails to parse. Images will be lost.

---

## Fallback (when defuddle is unavailable)

Use the agent's built-in web access capability to fetch the content directly.

---

## Output format

When saving to `raw/YYYY-MM-DD-slug.md`:

```markdown
# {title}

**Source**: {url}
**Author**: {author}
**Published**: {date}
**Retrieved**: {today} (via {defuddle | agent-browser+defuddle | agent-browser text})

---

{body markdown}
```

---

## Installation (for human users)

```bash
bash extensions/web-reader/init.sh
# or manually: npm install -g @anthropic-ai/defuddle
```

## Files

| File | Role |
|---|---|
| `README.md` | This file |
| `init.sh` | One-time installation script |
