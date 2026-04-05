# MyWiki

一个由 LLM Agent 增量维护的个人知识 wiki。

设计思想来自 [`llm-wiki.md`](./llm-wiki.md)：不是 RAG，而是把知识**编译**进一个持续演化的 markdown 知识库，交叉引用、综合、矛盾检查都预先做好，而不是每次查询时重新发现。

---

## 这不是什么

- ❌ 不是聊天历史的堆积
- ❌ 不是原始文件的 RAG 检索
- ❌ 不是手工维护的 wiki

## 这是什么

- ✅ 一个由 LLM 写、人类读的活的知识库
- ✅ 人类负责策划源、提问、判断；LLM 负责摘要、链接、维护
- ✅ 结构为：`raw/`（原始源）→ `sources/`（摘要）→ `pages/`（综合的实体/概念/主题）→ `maps/` & `queries/`（高层综合和探索）

---

## 首次使用

```bash
# 1. clone
git clone https://github.com/<you>/MyWiki.git
cd MyWiki

# 2. 装 qmd（本地搜索引擎，给 LLM agent 用）
npm install -g @tobilu/qmd
# 或 bun install -g @tobilu/qmd

# 3. 初始化 qmd 索引（会下载嵌入模型，首次较慢）
./scripts/qmd-init.sh

# 4. 用 Obsidian 打开 MyWiki/ 目录作为 vault
#    （Obsidian 配置不入 git，各台电脑独立）

# 5. 启动 LLM agent（Claude Code / Codex CLI / Pi），
#    它会自动读 AGENTS.md 作为操作手册
```

---

## 目录结构

```
MyWiki/
├── AGENTS.md       LLM 操作手册（工作流 + 规则）
├── taxonomy.md     受控词表（type / tags / aliases 规范）
├── index.md        内容目录（LLM 维护）
├── log.md          时间线（append-only）
├── llm-wiki.md     设计思想原文
├── README.md       本文件
├── qmd.yml         qmd 搜索配置
│
├── raw/            📥 不可变原始源（markdown）
├── sources/        📝 每源一页摘要（1:1 同 basename）
├── pages/          📚 wiki 页面：实体/概念/主题/工具/书/人物/笔记
├── maps/           🗺  高层 MOC / 领域地图
├── queries/        🔍 回填的探索、对比、分析
└── scripts/        🔧 维护脚本
```

---

## 如何使用（日常）

### 加入一个新源

1. 把 md 文件放进 `raw/`，命名 `YYYY-MM-DD-title.md`
2. 告诉 LLM agent："ingest `raw/2026-04-05-xxx.md`"
3. agent 会先读源，和你讨论 takeaways，等你确认后再写 wiki
4. 一次 ingest 可能触及 5-15 个 pages，你在 Obsidian 里实时看到更新

### 查询

1. 直接问 agent："对比一下 X 和 Y"、"我读过哪些讲 Z 的东西"
2. agent 用 `qmd` 搜索，综合答案
3. 如果是有价值的新综合，agent 会问你要不要回填到 `queries/`

### 定期维护

- `lint` —— 让 agent 做一次健康检查（术语漂移、孤儿页、断链等）
- 直接改 `taxonomy.md` —— 如果你想重组分类
- 直接改 `AGENTS.md` —— 如果你想调整工作流

---

## 给 LLM Agent 的入口

**读 [`AGENTS.md`](./AGENTS.md)**。所有工作流规则都在里面。

第一次会话时，agent 应该按顺序读：
1. `AGENTS.md` — 规则
2. `taxonomy.md` — 词表
3. `log.md` 最后几条 — 最近发生了什么

---

## License & 脱敏

本项目结构（AGENTS.md、taxonomy.md、qmd.yml、scripts/）设计为可脱敏开源：把 `raw/ sources/ pages/ maps/ queries/` 里的内容清空，就是一份可供他人直接使用的模板。
