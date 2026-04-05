# Log

> 时间线记录。**append-only**，不要修改历史条目。
> 条目格式：`## [YYYY-MM-DD] <type> | <title>`
> 查看最近 5 条：`grep "^## \[" log.md | tail -5`
> `type` 可取值：`ingest` `query` `lint` `map` `refactor` `taxonomy` `meta`

---

## [2026-04-05] meta | 项目骨架初始化

创建 MyWiki 项目的初始结构。

**新增文件**：
- `AGENTS.md` — LLM 操作手册
- `taxonomy.md` — 受控词表
- `README.md` — 项目说明
- `index.md` — 内容目录（空骨架）
- `log.md` — 本文件
- `qmd.yml` — qmd 搜索配置
- `scripts/qmd-init.sh` — qmd 初始化脚本
- `.gitignore`

**目录**：`raw/` `sources/` `pages/` `maps/` `queries/` `scripts/`

**Git**：初始化仓库，创建 GitHub private repo `crokily/MyWiki`，首次 push。

**下一步**：放入第一份源，开始 ingest 流程。

---

## [2026-04-05] meta | 创建 public 分支

在 `1fa894c`（项目骨架初始化 commit）创建 `public` 分支，捕获 pre-ingest 的纯框架状态。

**用途**：未来确认服务可用后，以此分支作为“模板 / 公开发布版”，只同步 main 的布道配置（AGENTS.md 、taxonomy.md、llm-wiki.md、scripts、.gitignore 等），不包含个人内容（raw/sources/pages/queries/log 等）。

**当前状态**：public == main（均指向 `1fa894c`，由于此时 main 也还没有内容）。后续的 ingest 只会 push 到 main，public 分支的未来同步策略留待后续讨论。

---

## [2026-04-05] taxonomy | add tech/agent

为首次 ingest 新增一级下级 tag。

- **`tech/agent`** — AI 智能体、agent harness、agentic 系统（含 coding agent）
- 禁用变体：`agent`, `Agent`, `agentic`, `ai-agent`, `AI-Agent`, `智能体`, `agent-harness`

与下一条 ingest 合并在同一次 commit 中。

---

## [2026-04-05] ingest | Components of A Coding Agent (Sebastian Raschka)

**源**：https://magazine.sebastianraschka.com/p/components-of-a-coding-agent（通过 agent-browser 获取并关闭弹窗）

**Raw**：
- `raw/2026-04-04-components-of-a-coding-agent.md`

**Source**：
- `sources/2026-04-04-components-of-a-coding-agent.md`

**新建 pages（13 页）**：
- topic：`coding-agent`
- concept：`reasoning-model`、`context-engineering`、`prompt-prefix-caching`、`context-bloat`、`agent-session-memory`、`bounded-subagent`、`structured-tool-use`
- tool：`claude-code`、`codex-cli`、`mini-coding-agent`、`openclaw`
- person：`sebastian-raschka`
- book：`build-a-reasoning-model-from-scratch`

**控制层更新**：
- `taxonomy.md` 新增 `tech/agent`
- `index.md` 重建（0→1 source、0→14 pages）

**关键 takeaways**：
1. 一个 coding agent 的 6 大组件：Live Repo Context / Prompt Prefix Caching / Structured Tool Use / Context Bloat 压缩 / Session Memory 三层 / Bounded Subagent
2. 核心命题：“apparent model quality is really context quality” → 沉淀为 [[context-engineering]] 页面
3. Session 状态的三个对象（full transcript / working memory / compact transcript）设计职责各不相同，不要混淦
4. Subagent 的核心张力是“spawn 容易，bind 难”
5. Harness > model 的拉差——vanilla LLM 趋同，harness 是差异化主战场

**用户确认的决策**：
- `coding-agent` 与 `agent-harness` 合并为一页（topic）
- `openclaw` 作为真实项目建页（用户确认 2026 年爆火的 agent 项目）
- 只建 `build-a-reasoning-model-from-scratch`一本书；另一本 *Build a LLM from Scratch* 仅在 [[sebastian-raschka]] 页提及不独立建页
