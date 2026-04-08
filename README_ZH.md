# MyWiki

[English](./README.md) | **[中文](./README_ZH.md)**

一个由 LLM Agent 维护的知识库模板。不是 RAG，而是把知识编译进一个持续演化的 markdown wiki。交叉引用、综合、矛盾检查在摄入时一次完成，而不是每次查询时重新推导。

设计思想见 [`llm-wiki.md`](./llm-wiki.md)。

## 开始使用

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCrokily%2FMyWiki&project-name=mywiki&repository-name=mywiki)

点击上面的按钮，它会自动将本仓库 fork 到你的 GitHub 账号并部署到 Vercel。然后将你 fork 出来的仓库克隆到本地，用任意 AI coding agent（Claude Code、Codex、Pi、OpenClaw 等）打开即可。Agent 启动时会读取 `AGENTS.md`，自动理解一切，你可以立即开始添加源和提问。

## 工作原理

你提供源材料，AI agent 阅读并提取关键信息，整合到 wiki 中。它负责摘要、交叉引用、归档和索引。你不需要自己写 wiki，agent 负责全部编写和维护。

Wiki 是一个持续积累的产物。每添加一个源、每提一个问题，它都会变得更丰富。交叉引用已经建好了，矛盾已经标记了，综合已经反映了你读过的所有内容。

### 摄入

把文件放进 `raw/`，然后告诉 agent 去摄入它。Agent 会阅读源材料，和你讨论要点，确认后写入 wiki。一次摄入可能涉及 5 到 15 个页面。

如果启用了 web-reader 扩展，你也可以直接给 agent 一个 URL。

### 查询

向 agent 提问："对比一下 X 和 Y"，"我读过哪些关于 Z 的内容"。Agent 搜索 wiki，综合答案，并询问是否将有价值的结果保存回 wiki。

### 健康检查

让 agent 做一次健康检查。它会查找术语不一致、孤儿页、断链、缺失的交叉引用等问题。

## 扩展

扩展提供可选功能。告诉你的 AI agent 即可启用。

| 扩展 | 功能 |
|---|---|
| **web-reader** | 让 agent 从 URL 获取文章。强烈建议启用。 |
| **qmd** | Wiki 语义搜索。页面多了以后很有用。 |
| **website** | 将 wiki 生成为静态网站。第 1 步中 Vercel 已自动部署。 |

## 目录结构

```
MyWiki/
├── AGENTS.md         LLM 操作手册（每次会话加载）
├── taxonomy.md       受控词表（type / tags / aliases）
├── index.md          内容目录（LLM 维护）
├── log.md            时间线（仅追加）
├── llm-wiki.md       设计思想
│
├── workflows/        工作流文档（按需加载）
│   ├── ingest.md
│   ├── query.md
│   └── lint.md
├── extensions/       可选功能扩展
│   ├── qmd/
│   ├── web-reader/
│   └── website/
│
├── raw/              不可变原始源
├── sources/          每源一页摘要
├── pages/            Wiki 页面（实体、概念、主题……）
├── maps/             高层领域地图
└── queries/          探索、对比、分析
```

## 使用场景

- **个人知识管理**：日记、文章、播客笔记、自我提升追踪
- **研究**：论文、报告、文章编译成不断演化的综合
- **读书**：逐章构建角色、主题、情节线索的页面
- **商业**：会议记录、项目文档、客户通话转化为活的内部 wiki
- **任何知识随时间积累的场景**，你希望它被组织起来而非散落各处

## 给 LLM Agent 的入口

只需读取 [`AGENTS.md`](./AGENTS.md)。它是唯一需要在会话开始时加载的文件。

## License

MIT
