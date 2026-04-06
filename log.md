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

---

## [2026-04-05] meta | raw/ 支持任意格式 + URL 来源

放宽「什么可以进 `raw/`」的限制。

**动机**：LLM 本身就是最强多格式提取器，不必强制 md。

**改动**：
- `AGENTS.md § 2`：raw/ 行改为“任意格式的原始素材”，文件名格式扩展为 `YYYY-MM-DD-slug.<ext>`
- `AGENTS.md § 6`：ingest 第 1 步重写，明确支持三种输入态（本地文件 / URL / 粘贴文本），和对应的落盘策略
- `taxonomy.md § 4`：file-naming 表更新，raw/ 允许任意扩展名；sources/ 仍强制 .md；全局唯一规则改为“去扩展名后唯一”

**不影响的**：`sources/<basename>.md` 与 `raw/<basename>.<ext>` 仍保持 1:1 映射，`[[basename]]` 链接机制不变。

**会同步到 public 分支**（纯配置改动）。

---

## [2026-04-05] meta | 引入 extensions/ 机制（qmd 作为首个扩展）

把项目从“qmd 内置”重构为“核心规则 + 可选扩展”架构，qmd 降级为首个可选扩展。

**新结构**：
```
extensions/
├── README.md              # 扩展索引，给 AI agent 读（加载协议 + 未来方向）
└── qmd/
    ├── README.md          # qmd 扩展的启用引导：检测方法 + 对 AGENTS.md 的覆盖
    ├── qmd.yml            # canonical 配置
    └── init.sh            # 建符号链接 + 注册 context + qmd embed
```

**文件搬家**：
- `qmd.yml` (项目根) → `extensions/qmd/qmd.yml`；项目根改为符号链接指向后者
- `scripts/qmd-init.sh` → `extensions/qmd/init.sh`（路径 `cd` 相应修正）
- `scripts/` 空目录删除

**AGENTS.md 改动**：
- 新增 `§ 0 扩展层`：明确“扩展读 README 覆盖手册”协议
- `§ 10 搜索`：**默认反转**——rg/fd 为默认，qmd 变为“扩展覆盖”
- `§ 13 checklist`：插入新步骤“加载扩展”（位于读 taxonomy 和 读 log 之间）

**效果验证**：本次 commit 后，AI agent 进入项目 → 读 AGENTS.md § 0 → ls extensions/ → 读 qmd/README.md → 检测到 qmd 已装且 context 存在 → 采用 qmd 搜索工作流。用户体验无感。

**public 分支**：本次改动属于“非文档的框架配置”，将 cherry-pick 到 public。

---

## [2026-04-06] meta | web-reader 改为 defuddle 直连

将 `extensions/web-reader/README.md` 的 URL 抓取优先级从 `curl + defuddle` 调整为：

1. `defuddle` 直连 URL
2. `agent-browser + defuddle`
3. `agent-browser` 纯文本 fallback

同时同步更新了 raw 头部中的 `Retrieved` 说明与设计示意图。

---

## [2026-04-06] meta | 按需加载重构：精简 AGENTS.md + 工作流分离 + 扩展自包含

**问题**：每次会话开始时，agent 无条件加载 AGENTS.md + taxonomy.md + 所有扩展 README + log.md（~28K chars / ~8K tokens），无论用户实际只需要做什么任务。

**改动**：

1. **AGENTS.md 精简**：从 ~285 行缩减到 ~130 行，只保留核心规则（架构、命名、frontmatter、链接、语言、git、禁止事项）。删除了「首次会话 Checklist」和所有内联工作流。

2. **工作流分离到 `workflows/`**（按需加载）：
   - `workflows/ingest.md` — 摄入新源（原 § 6）
   - `workflows/query.md` — 查询 wiki（原 § 7）
   - `workflows/lint.md` — 健康检查（原 § 8）

3. **扩展机制重构**：
   - 删除「会话开始时必须加载所有扩展」的协议
   - 每个扩展 README 改为**自包含**格式（检测 → 使用 → 回退 → 安装）
   - 删除「覆盖 AGENTS.md § X」的概念——扩展不再是补丁，而是独立的能力文档
   - 工作流在需要时引用扩展，而非启动时全量预加载

4. **更新 README.md**：目录结构 + agent 入口说明

**效果**：
- 简单任务（如 query）：从 ~8K tokens 启动开销降至 ~1.5K tokens（只读 AGENTS.md + query workflow）
- 完整 ingest：按需逐步加载，总量类似但分散在工作流进行中而非全部前置
- 所有文档对任意 agent（Claude Code / Codex / Pi 等）通用，无平台特定依赖

**新增文件**：`workflows/ingest.md` `workflows/query.md` `workflows/lint.md`
**重写文件**：`AGENTS.md` `extensions/README.md` `extensions/qmd/README.md` `extensions/web-reader/README.md` `README.md`
