# Log

> Timeline record. **Append-only**, do not modify historical entries.
> Entry format: `## [YYYY-MM-DD] <type> | <title>`
> View last 5 entries: `grep "^## \[" log.md | tail -5`
> `type` values: `ingest` `query` `lint` `map` `refactor` `taxonomy` `meta`

---

## [2026-04-05] meta | Project skeleton initialization

Created the initial structure for the MyWiki project.

**New files**:
- `AGENTS.md` -- LLM operational manual
- `taxonomy.md` -- Controlled vocabulary
- `README.md` -- Project description
- `index.md` -- Content directory (empty skeleton)
- `log.md` -- This file
- `qmd.yml` -- qmd search configuration
- `scripts/qmd-init.sh` -- qmd initialization script
- `.gitignore`

**Directories**: `raw/` `sources/` `pages/` `maps/` `queries/` `scripts/`

**Git**: Initialized repository, created GitHub private repo `crokily/MyWiki`, first push.

**Next step**: Add the first source and begin the ingest workflow.

---

## [2026-04-05] meta | Create public branch

Created the `public` branch at `1fa894c` (project skeleton commit), capturing the pre-ingest framework state.

**Purpose**: After confirming the service works, use this branch as a "template / public release version", syncing only framework configuration from main (AGENTS.md, taxonomy.md, llm-wiki.md, scripts, .gitignore, etc.), excluding personal content (raw/sources/pages/queries/log, etc.).

**Current state**: public == main (both point to `1fa894c`, since main has no content yet). Future ingests only push to main; the public branch sync strategy is deferred.

---

## [2026-04-05] taxonomy | add tech/agent

Added a new second-level tag for the first ingest.

- **`tech/agent`** -- AI agents, agent harnesses, agentic systems (including coding agents)
- Banned variants: `agent`, `Agent`, `agentic`, `ai-agent`, `AI-Agent`, `agent-harness`

Merged with the next ingest commit.

---

## [2026-04-05] ingest | Components of A Coding Agent (Sebastian Raschka)

**Source**: https://magazine.sebastianraschka.com/p/components-of-a-coding-agent (fetched via agent-browser, dismissed popup)

**Raw**:
- `raw/2026-04-04-components-of-a-coding-agent.md`

**Source**:
- `sources/2026-04-04-components-of-a-coding-agent.md`

**New pages (13)**:
- topic: `coding-agent`
- concept: `reasoning-model`, `context-engineering`, `prompt-prefix-caching`, `context-bloat`, `agent-session-memory`, `bounded-subagent`, `structured-tool-use`
- tool: `claude-code`, `codex-cli`, `mini-coding-agent`, `openclaw`
- person: `sebastian-raschka`
- book: `build-a-reasoning-model-from-scratch`

**Control layer updates**:
- `taxonomy.md` added `tech/agent`
- `index.md` rebuilt (0 to 1 source, 0 to 14 pages)

**Key takeaways**:
1. Six components of a coding agent: Live Repo Context / Prompt Prefix Caching / Structured Tool Use / Context Bloat compression / Session Memory layers / Bounded Subagent
2. Core thesis: "apparent model quality is really context quality", distilled into the [[context-engineering]] page
3. Session state has three objects (full transcript / working memory / compact transcript) with distinct responsibilities
4. Core tension of subagents: "spawn easy, bind hard"
5. Harness > model differentiation: vanilla LLMs converge, the harness is the competitive battleground

**User-confirmed decisions**:
- `coding-agent` and `agent-harness` merged into a single page (topic)
- `openclaw` created as a real project page (user confirmed it as a prominent 2026 agent project)
- Only `build-a-reasoning-model-from-scratch` gets its own book page; *Build a LLM from Scratch* is mentioned on [[sebastian-raschka]] only

---

## [2026-04-05] meta | raw/ supports arbitrary formats + URL sources

Relaxed the constraints on what can go into `raw/`.

**Motivation**: The LLM itself is the most capable multi-format extractor; no need to mandate md.

**Changes**:
- `AGENTS.md` section 2: raw/ changed to "original material in any format", filename format extended to `YYYY-MM-DD-slug.<ext>`
- `AGENTS.md` section 6: ingest step 1 rewritten, explicitly supporting three input types (local file / URL / pasted text) with corresponding persistence strategies
- `taxonomy.md` section 4: file-naming table updated, raw/ allows any extension; sources/ still requires .md; global uniqueness rule changed to "unique after removing extension"

**Unaffected**: `sources/<basename>.md` and `raw/<basename>.<ext>` still maintain 1:1 mapping, `[[basename]]` link mechanism unchanged.

**Will sync to public branch** (pure configuration change).

---

## [2026-04-05] meta | Introduce extensions/ mechanism (qmd as first extension)

Refactored the project from "qmd built-in" to "core rules + optional extensions" architecture, demoting qmd to the first optional extension.

**New structure**:
```
extensions/
├── README.md              # Extension index for AI agents (loading protocol + future directions)
└── qmd/
    ├── README.md          # qmd extension guide: detection + AGENTS.md overrides
    ├── qmd.yml            # Canonical configuration
    └── init.sh            # Create symlink + register context + qmd embed
```

**File moves**:
- `qmd.yml` (project root) to `extensions/qmd/qmd.yml`; project root becomes symlink to the latter
- `scripts/qmd-init.sh` to `extensions/qmd/init.sh` (path `cd` adjusted accordingly)
- `scripts/` empty directory deleted

**AGENTS.md changes**:
- Added section 0 (extension layer): defined "extension README overrides manual" protocol
- Section 10 (search): **default reversed**, rg/fd is now default, qmd becomes "extension override"
- Section 13 (checklist): inserted new step "load extensions" (between reading taxonomy and reading log)

**Validation**: After this commit, an AI agent enters the project, reads AGENTS.md section 0, runs `ls extensions/`, reads `qmd/README.md`, detects qmd is installed and context exists, adopts qmd search workflow. User experience unchanged.

**Public branch**: This change is a non-content framework change; will be cherry-picked to public.

---

## [2026-04-06] meta | web-reader switched to defuddle direct

Adjusted `extensions/web-reader/README.md` URL fetch priority:

1. `defuddle` direct URL
2. `agent-browser + defuddle`
3. `agent-browser` plain text fallback

Also updated the `Retrieved` description in the raw header and the design diagram.

---

## [2026-04-06] meta | On-demand loading refactor: streamline AGENTS.md + separate workflows + self-contained extensions

**Problem**: At every session start, the agent unconditionally loaded AGENTS.md + taxonomy.md + all extension READMEs + log.md (~28K chars / ~8K tokens), regardless of the actual task.

**Changes**:

1. **AGENTS.md streamlined**: from ~285 lines to ~130 lines, keeping only core rules (architecture, naming, frontmatter, links, language, git, prohibitions). Removed "first session checklist" and all inline workflows.

2. **Workflows separated to `workflows/`** (loaded on demand):
   - `workflows/ingest.md` -- ingest new source (formerly section 6)
   - `workflows/query.md` -- query wiki (formerly section 7)
   - `workflows/lint.md` -- health check (formerly section 8)

3. **Extension mechanism refactored**:
   - Removed "must load all extensions at session start" protocol
   - Each extension README became **self-contained** (detect, use, fallback, install)
   - Removed the "override AGENTS.md section X" concept; extensions are independent capability docs
   - Workflows reference extensions when needed, instead of preloading everything at startup

4. **Updated README.md**: directory structure + agent entry point description

**Impact**:
- Simple tasks (e.g., query): startup overhead reduced from ~8K tokens to ~1.5K tokens (only AGENTS.md + query workflow)
- Full ingest: loads incrementally on demand, total similar but spread across workflow execution
- All documentation works with any agent (Claude Code / Codex / Pi etc.), no platform-specific dependencies

**New files**: `workflows/ingest.md` `workflows/query.md` `workflows/lint.md`
**Rewritten files**: `AGENTS.md` `extensions/README.md` `extensions/qmd/README.md` `extensions/web-reader/README.md` `README.md`
