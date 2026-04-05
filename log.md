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
