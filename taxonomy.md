# Taxonomy — 受控词表

本 wiki 的**术语标准**。所有 frontmatter 的 `type` 和 `tags` 都必须来自本文件。

> ⚠️ **LLM**：创建或更新任何页面 frontmatter 前，**必须**先读本文件。新增词汇时走第 5 节的维护流程。
> 本文件随 wiki 共同演化——它是活的。每次新增都是一次 commit（`taxonomy: ...`）。

---

## 1. `type` 枚举（仅用于 `pages/`）

`pages/` 里的每个文件**必须**有 `type` 字段，取值**只能**是下表之一：

| type | 定义 | 典型例子 |
|---|---|---|
| `entity` | 具体可指的事物：组织、地点、作品、产品（人除外） | `rust-foundation`, `mit` |
| `person` | 人物 | `james-clear`, `linus-torvalds` |
| `concept` | 抽象概念、理论、方法、原则 | `habit-formation`, `memory-safety` |
| `topic` | 主题综合页，串起多个 concept/entity | `personal-productivity`, `systems-programming` |
| `tool` | 软件、工具、服务、库 | `obsidian`, `qmd`, `neovim` |
| `book` | 书籍 | `atomic-habits` |
| `note` | 个人笔记、日记、反思、计划 | `2026-q2-goals`, `diet-log` |

**其他目录不用 `type`**：
- `sources/` 用 `kind: source`
- `maps/` 用 `kind: map`
- `queries/` 用 `kind: query`

**不可自创新 type**。确有必要时 LLM 向用户提议，用户批准后写入本表。

---

## 2. `tags` 层级受控词表

### 格式规则

- **小写**，例 `rust` 不是 `Rust`
- 单词间用 **连字符** `-`，例 `behavioral-psychology`
- 层级用 **斜杠** `/`，例 `tech/rust`
- **最多 3 层**：`tech/lang/rust` 可以，`tech/lang/systems/rust` 不行
- 一级前缀必须从下方已登记列表中选

### 已登记 tags

> 初始只列几个示范条目。真正的词表会随 ingest 增长。LLM 新增时按第 5 节流程。

#### `tech/` — 科技、工程、计算机

- `tech/rust` — Rust 编程语言
  - 禁用变体：`Rust`, `rust-lang`, `rustlang`
- `tech/javascript` — JavaScript 语言
  - 禁用变体：`JS`, `js`, `javaScript`, `ecmascript`
- `tech/ai` — 人工智能（广义）
  - 禁用变体：`AI`, `人工智能`, `artificial-intelligence`
- `tech/llm` — 大语言模型
  - 禁用变体：`LLM`, `大模型`, `大语言模型`, `large-language-model`
- `tech/agent` — AI 智能体、agent harness、agentic 系统（含 coding agent）
  - 禁用变体：`agent`, `Agent`, `agentic`, `ai-agent`, `AI-Agent`, `智能体`, `agent-harness`

#### `learning/` — 学习方法、学习资料、教育

_(待填充)_

#### `life/` — 生活知识、健康、日常

_(待填充)_

#### `personal/` — 个人记录、目标、反思

- `personal/goals` — 目标与计划
- `personal/journal` — 日记与反思

#### `meta/` — 关于 wiki 本身的笔记

- `meta/workflow` — 工作流设计、工具使用

---

## 3. `aliases` 字段约定

`aliases` 是给 Obsidian 全文搜索和 `[[...]]` 自动补全用的。放：

- **中文名**（当文件名是英文 slug 时）
- **常见缩写**（JS、AI、LLM，作为别名可以，但 **tag 必须用全称**）
- **常见异写**（`JavaScript` / `Javascript` / `Java Script`）
- **人物的其他称呼、笔名**

**示例**：

```yaml
# pages/javascript.md
aliases: [JavaScript, JS, js, JavaScript 语言, ECMAScript]
```

注意这里 `JS` 可以出现在 `aliases` 里，但**绝不**能出现在 `tags` 里。

---

## 4. 文件名 Slug 规则

| 目录 | 规则 | 例子 |
|---|---|---|
| `raw/` | `YYYY-MM-DD-slug.<ext>`（任意扩展名） | `2026-04-05-atomic-habits-ch1.md`, `2026-04-10-paper.pdf`, `2026-04-11-talk.webp` |
| `sources/` | 同 `raw/`（basename 一致，**总是 .md**） | `2026-04-05-atomic-habits-ch1.md`（即使 raw 是 .pdf） |
| `pages/` | `english-slug.md`，**不带日期** | `habit-formation.md` |
| `maps/` | `english-slug.md`，**不带日期** | `tech-landscape.md` |
| `queries/` | `YYYY-MM-DD-slug.md` | `2026-04-05-rust-vs-zig-memory.md` |

**全局唯一**：任何两个文件的 basename（去掉扩展名）不能相同，跨目录也不行。因为我们用 `[[slug]]` 短链接。例如 `raw/2026-04-10-paper.pdf` 和 `sources/2026-04-10-paper.md` 是合法的 1:1 配对，但不能再有 `raw/2026-04-10-paper.docx`。

Slug 本身的规则：
- 英文小写
- 单词间连字符 `-`
- 无空格、无下划线、无大写
- 保持简洁但有意义（`rust` 比 `rust-programming-language` 好）

---

## 5. 维护流程

### 5.1 新增 tag

1. 确认已有 tag 都不合适
2. 查「禁用变体」列表确认不是已有 tag 的异写
3. 在对应一级前缀下新增一行，写清**定义**
4. 列出你能想到的所有**禁用变体**
5. 在 **同一个 commit** 内同时：
   - 修改 `taxonomy.md`
   - 应用新 tag 的页面
6. commit message：`taxonomy: add tech/xxx`

### 5.2 修复术语漂移（lint 发现或人工发现）

1. 选一个规范形式（优先已登记的）
2. 把其他变体加入「禁用变体」列表
3. 全局替换（`rg -l "tag: xxx" | xargs sed -i ...` 或手工）
4. 在 `log.md` 记录此次规范化
5. commit：`taxonomy: normalize xxx -> yyy`

### 5.3 新增 `type`

**需要用户明确批准**。LLM 提议 → 用户同意 → 写入本表 → commit。

### 5.4 新增一级 tag 前缀（如 `tech/` `life/` 之外的）

同样需要用户批准。新前缀会影响整体分类观感，不要轻易增加。
