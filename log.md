# Log

> 时间线记录。**append-only**，不要修改历史条目。
> 条目格式：`## [YYYY-MM-DD] <type> | <title>`
> 查看最近 5 条：`grep "^## \[" log.md | tail -5`
> `type` 可取值：`ingest` `query` `lint` `map` `refactor` `taxonomy` `meta`

> **注意**：这是 `public` 分支的 log，只记录框架/配置类事件，不包含 main 分支上的 ingest / query / refactor 等内容事件。

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

在 `1fa894c`（项目骨架初始化 commit）从 main 创建 `public` 分支。

**用途**：未来确认服务可用后，以此分支作为"模板 / 公开发布版"，只承载框架配置（AGENTS.md、taxonomy.md、llm-wiki.md、README.md、extensions/、.gitignore 等），不包含个人内容（raw/sources/pages/queries 等）。这样可以直接发布为公开服务而不泄漏隐私。

**同步策略**：main 上的纯配置改动（meta type 的 commit）会 cherry-pick / 手动同步到 public；ingest/query/refactor 等内容改动只留在 main。

---

## [2026-04-05] meta | raw/ 支持任意格式 + URL 来源（synced from main d4af3aa）

放宽「什么可以进 `raw/`」的限制。

**动机**：LLM 本身就是最强多格式提取器，不必强制 md。

**改动**：
- `AGENTS.md § 2`：raw/ 行改为"任意格式的原始素材"，文件名格式扩展为 `YYYY-MM-DD-slug.<ext>`
- `AGENTS.md § 6`：ingest 第 1 步重写，明确支持三种输入态（本地文件 / URL / 粘贴文本），和对应的落盘策略
- `taxonomy.md § 4`：file-naming 表更新，raw/ 允许任意扩展名；sources/ 仍强制 .md；全局唯一规则改为"去扩展名后唯一"

**不影响的**：`sources/<basename>.md` 与 `raw/<basename>.<ext>` 仍保持 1:1 映射，`[[basename]]` 链接机制不变。

---

## [2026-04-05] meta | 引入 extensions/ 机制（qmd 作为首个扩展）（synced from main 0792921）

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
- `scripts/qmd-init.sh` → `extensions/qmd/init.sh`
- `scripts/` 空目录删除

**AGENTS.md 改动**：
- 新增 `§ 0 扩展层`：明确“extensions/*/README.md 覆盖本手册对应小节”协议
- `§ 10 搜索`：**默认反转**——rg/fd 为默认，qmd 变为“扩展覆盖”
- `§ 13 checklist`：插入新步骤“加载扩展”

**效果**：AI agent 进入项目 → 读 AGENTS.md § 0 → ls extensions/ → 读 qmd/README.md → 检测到 qmd 已装 → 采用 qmd 搜索工作流。未装 qmd 的用户自动退回 rg/grep。

**未来方向**（非承诺）：web-viewer / discord-bot / embedding-skill 等扩展均可遵循同一协议（放个目录 + 写个 README），零代码。
