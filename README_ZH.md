# MyWiki

[English](./README.md) | **[中文](./README_ZH.md)**

一个由 LLM Agent 维护的知识库模板。

设计思想来自 [`llm-wiki.md`](./llm-wiki.md)：不是 RAG，而是把知识**编译**进一个持续演化的 markdown 知识库，交叉引用、综合、矛盾检查都预先做好，而不是每次查询时重新发现。

---

## 快速开始

1. Fork 本项目到自己的仓库，然后 clone 到本地
2. 用任意 AI coding agent（Claude Code、Codex 等）打开该项目
3. 添加内容，并告诉 agent 需要 ingest 或 query 的内容
4. Agent 会读取 `AGENTS.md`，理解 wiki 结构，处理好一切：摘要、交叉引用、归档、索引

然后你可以按需开启 extension：
- **web-reader**（强烈建议开启）：让 agent 直接从 URL 获取文章。告诉你的 agent "enable the web-reader extension" 即可
- **qmd**：wiki 语义搜索。建议等你的 wiki 有很多文件了以后再开。告诉你的 agent "enable the qmd extension"
- **website**：将 wiki 生成为静态网站。如果你不打算用 Obsidian 浏览，可以直接开。告诉你的 agent "enable the website extension"

开启任何 extension 的方法都是直接告诉你的 AI agent，让它帮你操作。

---

## 这是什么

- 一个由 LLM 写、人类读的活的知识库
- 人类负责策划源、提问、判断；LLM 负责摘要、链接、维护
- 结构为：`raw/`（原始源）-> `sources/`（摘要）-> `pages/`（综合的实体/概念/主题）-> `maps/` & `queries/`（高层综合和探索）

## 这不是什么

- 不是聊天历史的堆积
- 不是原始文件的 RAG 检索
- 不是手工维护的 wiki

---

## 目录结构

```
MyWiki/
├── AGENTS.md        LLM 操作手册（核心规则，每次会话加载）
├── taxonomy.md      受控词表（type / tags / aliases 规范）
├── index.md         内容目录（LLM 维护）
├── log.md           时间线（append-only）
├── llm-wiki.md      设计思想原文
├── README.md        英文版说明
│
├── workflows/       工作流文档（按需加载）
│   ├── ingest.md    摄入新源
│   ├── query.md     查询 wiki
│   └── lint.md      健康检查
├── extensions/      可选能力扩展（按需加载）
│   ├── qmd/         混合语义搜索
│   ├── web-reader/  网页内容提取
│   └── website/     静态站点生成
│
├── raw/             不可变原始源
├── sources/         每源一页摘要（1:1 同 basename）
├── pages/           wiki 页面：实体/概念/主题/工具/书/人物/笔记
├── maps/            高层 MOC / 领域地图
└── queries/         回填的探索、对比、分析
```

---

## 如何使用（日常）

### 加入一个新源

1. 把 md 文件放进 `raw/`，命名 `YYYY-MM-DD-title.md`
2. 告诉 LLM agent："ingest `raw/2026-04-05-xxx.md`"
3. Agent 会先读源，和你讨论 takeaways，等你确认后再写 wiki
4. 一次 ingest 可能触及 5-15 个 pages，你在 Obsidian 里实时看到更新

### 查询

1. 直接问 agent："对比一下 X 和 Y"、"我读过哪些讲 Z 的东西"
2. Agent 用搜索引擎查找，综合答案
3. 如果是有价值的新综合，agent 会问你要不要回填到 `queries/`

### 定期维护

- `lint`：让 agent 做一次健康检查（术语一致性、孤儿页、断链等）
- 直接改 `taxonomy.md` 来重组分类
- 直接改 `AGENTS.md` 来调整工作流和仓库规则

---

## 给 LLM Agent 的入口

**只需读 [`AGENTS.md`](./AGENTS.md)**。它是唯一需要在会话开始时加载的文件。

AGENTS.md 包含核心规则，并会在需要时指引你读取工作流文档（`workflows/`) 和扩展文档（`extensions/`）。不要预读所有文件。

---

## License

本项目结构（AGENTS.md、taxonomy.md、workflows/、extensions/、llm-wiki.md）设计为可开源模板：把 `raw/` `sources/` `pages/` `maps/` `queries/` 里的内容清空，就是一份可供他人直接使用的框架。
