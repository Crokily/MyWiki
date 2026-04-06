# AGENTS.md — MyWiki 操作手册

> LLM Agent 维护本 wiki 的核心规则。保持精简，每次会话自动加载。
> 具体工作流见 `workflows/`，按需加载。设计思想见 [`llm-wiki.md`](./llm-wiki.md)。
>
> **加载原则**：本文件是唯一需要在会话开始时读取的文档。
> 工作流（`workflows/`）和扩展（`extensions/`）**按需加载**，不要预读。

---

## 1. 三层架构

| 层 | 位置 | 谁拥有 | 规则 |
|---|---|---|---|
| **Raw 层** | `raw/` | 用户 | **不可变**。LLM 只读，永不修改。 |
| **Wiki 层** | `sources/` `pages/` `maps/` `queries/` | LLM | LLM 创建、更新、维护。 |
| **控制层** | `AGENTS.md` `taxonomy.md` `index.md` `log.md` | 共同演化 | LLM 按规则更新，重大变更告知用户。 |

---

## 2. 目录说明

| 目录 | 内容 | 文件命名 |
|---|---|---|
| `raw/` | 不可变原始素材（任意格式） | `YYYY-MM-DD-slug.<ext>` |
| `sources/` | 每个 raw 源的摘要（1:1 映射，总是 .md） | 同 raw basename |
| `pages/` | 实体/概念/主题/工具/书/人物/笔记 | `english-slug.md` |
| `maps/` | 高层 MOC、领域地图 | `english-slug.md` |
| `queries/` | 回填的探索、对比、分析结果 | `YYYY-MM-DD-slug.md` |

**全部扁平，禁止子目录**。组织靠 frontmatter + `[[双向链接]]` + `index.md`。

**文件名全局唯一**：跨目录 basename（去扩展名）不能撞，因为用 `[[slug]]` 短链接。

---

## 3. Frontmatter 规范

**创建或更新任何 frontmatter 前**：必须先读 [`taxonomy.md`](./taxonomy.md)，用已登记的 `type` 和 `tags`。禁止自创。

### pages/

```yaml
---
type: concept            # taxonomy.md 的 7 种之一
title: 习惯养成
aliases: [habit formation, Habit Loop]
tags: [learning/behavioral-psychology]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-05-atomic-habits-ch1]]"
---
```

### sources/

```yaml
---
kind: source
title: "《原子习惯》第一章"
source_type: book-chapter  # article | book-chapter | paper | podcast | video | note | web
raw: "[[2026-04-05-atomic-habits-ch1]]"
author: "[[james-clear]]"
ingested: 2026-04-05
tags: [learning/behavioral-psychology]
touches:
  - "[[habit-formation]]"
---
```

### maps/ 和 queries/

```yaml
# maps/                           # queries/
---                                ---
kind: map                          kind: query
title: 科技关注地图                  title: "Rust vs Zig 内存管理？"
tags: [tech]                       asked: 2026-04-05
created: 2026-04-05                tags: [tech/rust, tech/zig]
updated: 2026-04-05                references:
---                                  - "[[rust]]"
                                   ---
```

> `pages/` 用 `type`（语义类型，受 taxonomy 约束），其他目录用 `kind`（固定字段）。

---

## 4. 链接与语言

- **链接**：一律用 `[[page-name]]`（Obsidian wiki link），跨目录只写 basename
- 带显示文本：`[[page-name|显示文本]]`。禁止 `[text](file.md)` 格式
- **内容语言**：中文为主，专有名词保留英文
- **文件名**：英文 slug（小写 + 连字符）
- **aliases**：中英名、缩写、常见异写全放这里

---

## 5. 工作流

根据用户意图，**读取对应的工作流文档后执行**：

| 用户意图 | 读取 | 触发词示例 |
|---|---|---|
| 摄入新源 | [`workflows/ingest.md`](./workflows/ingest.md) | "ingest"、提供文件/URL/文本 |
| 查询 wiki | [`workflows/query.md`](./workflows/query.md) | 提问、"对比"、"分析" |
| 健康检查 | [`workflows/lint.md`](./workflows/lint.md) | "lint"、"检查" |

> **不要预读所有工作流**。确定用户意图后只读取对应的一个。

---

## 6. 扩展（可选能力）

`extensions/` 提供可选增强能力（如语义搜索、网页抓取）。**不要在会话开始时加载扩展**——工作流文档会在需要时指引你读取相关扩展的说明。

扩展列表见 [`extensions/README.md`](./extensions/README.md)。

---

## 7. Git Commit 规范

格式：`<type>: <short description>`

| type | 用途 |
|---|---|
| `ingest` | 摄入新源 |
| `query` | 回填探索结果 |
| `lint` | 健康检查修复 |
| `map` | 新建/更新 MOC |
| `refactor` | 拆分、合并、重命名页面 |
| `taxonomy` | 词表维护 |
| `meta` | AGENTS.md / README / 脚本等控制层变更 |

**一次 ingest = 一个 commit**，不要拆。

---

## 8. 自决 vs 必须问

**必须问**：
- Ingest 的 takeaways（关键步骤，不可跳过）
- 新增 `type`（不能自创）
- 新增 `tag` 前建议确认
- Lint 发现的问题如何修
- Query 结果是否回填

**可自决**：
- 从 taxonomy 已有 tag 中选哪个
- 文件放哪个目录、链接风格、命名风格
- 一次 ingest 触及多少页面

---

## 9. 禁止事项

- 修改 `raw/` 下任何文件
- 自创 `type` 或 `tag` 而不登记到 taxonomy
- 删除页面而没有用户明确批准
- 批量改写 > 5 个文件而不先告知范围
- 把重要结论只留在对话里，不回填 wiki
- 用标准 markdown 链接 `[text](file.md)`（必须用 `[[...]]`）
- 在 `sources/` `maps/` `queries/` 里用 `type` 字段（用 `kind`）
- **会话开始时预读所有工作流文档和扩展文档**
