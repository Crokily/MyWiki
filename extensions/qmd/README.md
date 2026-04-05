# qmd Extension — 混合语义搜索

> 这份 README 是**写给 AI agent（pi / Claude Code / Codex 等）看的**操作引导，
> 不是普通的项目说明。它告诉 AI：如何检测本扩展是否已启用，以及启用后如何
> **覆盖** `AGENTS.md` 的对应小节。
>
> 人类用户通常只需要运行一次 `bash extensions/qmd/init.sh`。

---

## 检测本扩展是否已启用

按顺序满足**全部**三项才算已启用：

1. `command -v qmd` 有输出（qmd 二进制已安装）
2. 项目根存在 `qmd.yml`（通常是指向 `extensions/qmd/qmd.yml` 的符号链接）
3. `qmd context list` 能返回非空列表（说明已跑过 `init.sh`）

**任一项不满足 → 视为未启用**，按 `AGENTS.md § 10` 的默认搜索工作流（`rg`/`grep`/`fd`）操作即可。**不要**在未启用时假装 qmd 可用。

---

## 启用后：对 AGENTS.md 的覆盖

### ① 覆盖 `§ 10` 的"搜索"小节

当本扩展启用时，**优先**使用下面的 qmd 命令，替代 `AGENTS.md § 10` 默认的 rg/grep 工作流：

```bash
qmd query "自然语言问题"          # 混合搜索 + 重排，首选
qmd search "精确短语" -c pages   # 按 collection 限定精确匹配
qmd get "pages/coding-agent.md" --full   # 读文件（带元信息）
```

可用 collections：`pages`、`sources`、`maps`、`queries`、`raw`。每个都注册了语义 hint（见 `init.sh`）帮助 qmd 在自然语言查询时挑对集合。

`rg` / `fd` 仍然保留，作为**精确字符串**匹配的回退：**qmd 负责"语义/主题"搜索，rg 负责"字符串"搜索**，两者互补而非互斥。

### ② 覆盖 `§ 6` / `§ 7` 的 ingest/query 提交流程

每次 **ingest / query 回填 / refactor 涉及新建或修改 ≥ 3 个文件**时，在 `git commit` 前额外执行：

```bash
qmd embed
```

让新内容进入 qmd 的向量索引。只改 1-2 个文件的小 commit 可以跳过——下一次 batch 改动时一起刷新。

---

## 文件一览

| 文件 | 角色 |
|---|---|
| `README.md` | 本文件，AI agent 阅读的启用引导 |
| `qmd.yml` | qmd 的 canonical 配置（collections 定义）。项目根的 `qmd.yml` 是指向此文件的符号链接 |
| `init.sh` | 一次性初始化脚本：建符号链接 → 注册 collection contexts → 跑 `qmd embed` |

---

## 给人类用户的首次安装

```bash
# 1. 安装 qmd
npm install -g @tobilu/qmd      # 或：bun install -g @tobilu/qmd

# 2. 在项目根运行初始化脚本
bash extensions/qmd/init.sh
```

首次 `qmd embed` 会下载本地 embedding 模型，约数分钟。之后每次 `init.sh` 是幂等的。

---

## 设计说明

本扩展的存在是为了：**把 qmd 从"项目内置依赖"降级为"可选增强"**，让项目在没装 qmd 时也能工作（用 rg/grep），装了之后自动升级体验。这符合本项目 `extensions/README.md` 里描述的扩展哲学：*用 markdown 告诉 AI 怎么做，而不是用代码强制 AI 怎么做*。
