# AGENTS.md — MyWiki 操作手册

> 这是 LLM Agent 维护本 wiki 的规则书。每次会话开始时必读。
> 人类负责策划、提问、判断；LLM 负责读、写、链接、维护。
> 本项目的设计思想见 [`llm-wiki.md`](./llm-wiki.md)。

---

## 0. 扩展层（可选覆盖）

本项目采用“**核心规则 + 可选扩展**”架构。`extensions/` 目录下的每个子目录是一个可选扩展；每个扩展用一份 `README.md` 告诉 AI agent：

- 如何**检测**本扩展是否已启用（通常是某个二进制存在、某个配置文件存在）
- 启用后它**覆盖或补充**本手册的哪些小节

**会话开始时**（见 § 13）你必须 `ls extensions/ 2>/dev/null`，并逐个读取其 `README.md`。扩展的指示**优先于**本手册同一小节的默认描述——把扩展当作本手册的“可选覆盖层”。

**已知扩展**（具体列表以 `extensions/README.md` 为准）：

- `extensions/qmd/` — qmd 混合语义搜索（检测到后覆盖 § 10 的“搜索”子节）
- `extensions/web-reader/` — 网页内容提取：defuddle + agent-browser（检测到后覆盖 § 6 第 0 步的 URL 抓取方式）

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
| `raw/` | 不可变原始素材（**任意格式**：md / pdf / txt / docx / epub / 图片等；或 LLM 从 URL 抓取后落盘的 md） | `YYYY-MM-DD-slug.<ext>` |
| `sources/` | 每个 raw 源的摘要 + 链接（1:1 映射，**同 basename**） | 同 raw |
| `pages/` | 实体/概念/主题/工具/书/人物/笔记 | `english-slug.md` |
| `maps/` | 高层 MOC、领域地图 | `english-slug.md` |
| `queries/` | 回填的探索、对比、分析结果 | `YYYY-MM-DD-slug.md` |

**全部扁平，禁止建子目录**。组织靠 frontmatter + 双向链接 + `index.md`。

**文件名全局唯一**：因为用短链接 `[[slug]]`，跨目录 basename 不能撞。创建前用 `rg -l "^---" sources pages maps queries | xargs -n1 basename` 检查。

---

## 3. Frontmatter 强制规范

**创建或更新任何 frontmatter 前**：必须先读 [`taxonomy.md`](./taxonomy.md)，用已登记的 `type` 和 `tags`。禁止自创。

### pages/ 模板

```yaml
---
type: concept            # 从 taxonomy.md 的 7 种之一
title: 习惯养成           # 中文或英文
aliases: [habit formation, Habit Loop, 习惯回路]
tags: [learning/behavioral-psychology, personal/productivity]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-05-atomic-habits-ch1]]"
---
```

### sources/ 模板

```yaml
---
kind: source             # 固定为 source，不用 taxonomy 的 type 枚举
title: "《原子习惯》第一章"
source_type: book-chapter  # article | book-chapter | paper | podcast | video | note | web
raw: "[[2026-04-05-atomic-habits-ch1]]"   # 指向 raw/ 同名文件
author: "[[james-clear]]"
ingested: 2026-04-05
tags: [learning/behavioral-psychology]
touches:                  # 本源触及了哪些 pages（双向链接来源）
  - "[[habit-formation]]"
  - "[[james-clear]]"
  - "[[atomic-habits]]"
---
```

### maps/ 模板

```yaml
---
kind: map
title: 科技关注地图
tags: [tech]
created: 2026-04-05
updated: 2026-04-05
---
```

### queries/ 模板

```yaml
---
kind: query
title: "Rust 和 Zig 的内存管理有什么区别？"
asked: 2026-04-05
tags: [tech/rust, tech/zig]
references:               # 回答时引用了哪些 pages
  - "[[rust]]"
  - "[[zig]]"
---
```

> **注意**：`pages/` 用 `type`（语义类型，受 taxonomy 约束），其他三个目录用 `kind`（固定字段，表示所在目录）。不要混淆。

---

## 4. 链接规范

- **一律用** Obsidian wiki link：`[[page-name]]`
- 带显示文本：`[[page-name|显示文本]]`
- 跨目录也只写 basename：`[[habit-formation]]`（因为全局唯一）
- 不用相对路径 `./pages/xxx.md`，不用标准 markdown 链接

---

## 5. 语言规范

- **内容**：中文为主，专有名词/术语保留英文
- **文件名**：英文 slug（小写 + 连字符），例如 `habit-formation.md`
- **H1 标题**：中文优先，可中英混合
- **aliases**：中文名、英文缩写、常见异写全放这里

---

## 6. 工作流：Ingest（摄入新源）

用户提供一份素材，可能是：

- 一个本地文件（md / pdf / txt / docx / epub / 图片等，LLM 自己能读）
- 一个 URL（网页 / Substack / 论文 / YouTube 等）
- 一段直接粘贴的文本

**第 0 步：把它落到 `raw/`**（文件名 `YYYY-MM-DD-slug.<ext>`，basename 去扩展名后全局唯一）：

- 本地文件：直接拷进去，保留原扩展名
- URL：用 agent-browser / gemini / 其它合适工具抓取正文，清洗后保存为 md；在文件顶部注明 `source_url` 和抓取方式
- 粘贴文本：整理成 md 落盘

> 注意：`sources/<basename>.md` 与 `raw/<basename>.<ext>` 仍保持 1:1 映射，两者 basename（去扩展名后）一致即可。sources/ 总是 md，raw/ 可是任意格式。

**然后**按此顺序执行：

1. **读 `taxonomy.md`**（强制，即使你刚读过）
2. **读 `index.md`** 获取已有页面概览
3. **读 raw 源全文**
4. **🔑 和用户讨论 takeaways**：列出你认为的 3-7 个关键点，问用户哪些值得强调、有没有遗漏。**等用户回复后再动笔**。这是文档作者推荐的关键步骤，不要跳过。
5. **写 `sources/<same-basename>.md`**：结构化摘要 + `touches` 列出将触及的 pages
6. **更新或新建 `pages/`**：一次 ingest 可能触及 5-15 个页面
   - 新页面：按 taxonomy 选 `type` 和 `tags`
   - 已有页面：追加新信息、在合适位置插入引用、必要时修订旧说法
7. **双向链接维护**：在被引用页面的 `sources` 字段加上本次的 source 链接
8. **新 tag/type 登记**：若使用了 taxonomy 中没有的 tag，**先停下**告知用户，确认后写入 `taxonomy.md`
9. **重新生成 `index.md`**：按 type 和 tag 分组
10. **追加 `log.md`**：`## [YYYY-MM-DD] ingest | <title>` + 触及文件清单
11. **Git commit**：`ingest: <short title>`

---

## 7. 工作流：Query（查询 wiki）

用户提问。按此顺序：

1. **读 `index.md`** 找相关页面
2. 用 `qmd query "..."` 搜索（见第 10 节）
3. 读相关 `pages/` `sources/`，综合答案
4. **回复带 `[[链接]]`** 引用来源
5. **判断是否值得回填**：如果探索产生新综合/对比/洞察，主动问用户："要回填到 `queries/` 吗？"
6. 若回填：
   - 写 `queries/YYYY-MM-DD-slug.md`
   - 更新被引用 pages 的反向链接（在其 frontmatter 或「相关」章节）
   - 追加 `log.md`
   - commit：`query: <question>`

---

## 8. 工作流：Lint（健康检查）

用户说"跑一次 lint"时。按此顺序：

1. **术语漂移检查**：扫描所有 frontmatter `tags`，对比 `taxonomy.md`，报告未登记 tag 和疑似变体
2. **孤儿页面**：找出 `pages/` 中没有被任何其他文件链接的
3. **断链**：`[[...]]` 指向不存在文件的
4. **矛盾**：互相链接的页面中主张冲突的
5. **过期**：新源已覆盖但旧页面未更新的
6. **缺页**：被多次提及但没有独立页面的概念/实体
7. **输出报告**给用户，**等确认**后再修复
8. 修复后：追加 `log.md` + commit：`lint: <summary>`

---

## 9. Git Commit 规范

格式：`<type>: <short description>`

| type | 用途 |
|---|---|
| `ingest` | 摄入新源 |
| `query` | 回填探索结果 |
| `lint` | 健康检查修复 |
| `map` | 新建/更新 MOC |
| `refactor` | 拆分、合并、重命名页面 |
| `taxonomy` | 词表维护（新增 tag、规范化漂移） |
| `meta` | AGENTS.md / README / 脚本等控制层变更 |

**一次 ingest = 一个 commit**，不要拆。

---

## 10. 工具

### 搜索（默认：无扩展）

```bash
rg -l "pattern" pages sources maps queries
rg "pattern" -C 2 pages/
fd -e md . pages sources maps queries
```

> **扩展覆盖**：如果 `extensions/qmd/` 已启用（见 § 0），请按 `extensions/qmd/README.md` 的指引，把本小节替换为基于 `qmd query` / `qmd search` / `qmd get` 的工作流——qmd 负责语义/主题搜索，rg/fd 仍作为精确字符串匹配的补充。

### 扫描 frontmatter

```bash
# 列出所有 pages 的 type
rg "^type:" pages/ --no-heading

# 列出所有用过的 tag
rg "^  - " pages/ sources/ -A 0 | sort -u
```

### 文件查找

优先 `fd` > `find`，优先 `rg` > `grep`。

---

## 11. 什么时候问用户，什么时候自决

**必须问**：
- Ingest 的 takeaways（第 6.4 步）
- 新增 `type`（不能自创）
- 新增 `tag` 前也建议快速确认一次
- Lint 发现的问题如何修
- Query 结果是否回填

**自决**：
- 从 taxonomy 已有 tag 中选哪个
- 文件放哪个目录
- 链接风格、命名风格
- 一次 ingest 触及多少页面

---

## 12. 禁止事项

- ❌ 修改 `raw/` 下任何文件
- ❌ 自创 `type` 或 `tag` 而不登记到 taxonomy
- ❌ 删除页面而没有用户明确批准
- ❌ 批量改写 > 5 个文件而不先告知范围
- ❌ 把重要结论只留在对话里，不回填 wiki
- ❌ 用标准 markdown 链接 `[text](file.md)`（必须用 `[[...]]`）
- ❌ 在 `sources/` `maps/` `queries/` 里用 `type` 字段（这些用 `kind`）

---

## 13. 首次会话 Checklist

新开一个会话时，按顺序：

1. 读 `AGENTS.md`（本文件）
2. 读 `taxonomy.md`
3. **加载扩展**：`ls extensions/ 2>/dev/null`，对每个子目录读其 `README.md`，按其指引判定启用状态并应用对本手册的覆盖（见 § 0）
4. `grep "^## \[" log.md | tail -10` 看最近动向
5. 根据用户意图选择工作流（ingest / query / lint / 其他）
