# Extensions — MyWiki 可选扩展层

> 本目录是**给 AI agent（pi / Claude Code / Codex 等）看的**扩展索引。
> 每个子目录 = 一个可选扩展。**不是代码插件**，而是一份写给 AI 的引导：
> 告诉 AI 如何检测扩展是否已启用，以及启用后如何**覆盖** `AGENTS.md` 的
> 对应小节。

---

## 加载协议

AI agent 进入本项目时（见 `AGENTS.md § 0` 与 `§ 13` 的首次会话 checklist）：

1. `ls extensions/` 列出所有扩展子目录
2. 逐个读取 `extensions/<name>/README.md`
3. 按每个 README 里的"**检测方法**"判断该扩展是否已启用
4. 若启用：按 README 里的"**覆盖指示**"应用到 `AGENTS.md` 的对应小节

扩展的指示**优先于** `AGENTS.md` 同一小节的默认描述。把扩展当作本手册的"可选覆盖层"。

---

## 当前扩展

| 扩展 | 作用 | 覆盖的 AGENTS.md 小节 |
|---|---|---|
| [`qmd/`](./qmd/README.md) | 基于 qmd 的混合语义搜索（替代 rg/grep 作为首选） | § 10 "搜索" |
| [`web-reader/`](./web-reader/README.md) | 网页内容提取（defuddle + agent-browser：保留图片、去噪、提取元数据） | § 6 第 0 步 "URL 抓取" |

---

## 为什么用"README + markdown 引导"而不是代码

本项目的主要用户是 **coding agent** —— 它们原生理解自然语言指令。用 markdown 告诉 AI "检测到 X 就按 Y 配置"比写 loader / hook / 插件系统更简单、更灵活，也更容易 review。

**新增一个扩展 = 新建一个目录 + 写一份 README**，零代码。

---

## 未来可能的扩展方向（非承诺，仅示意）

- **`web-viewer/`** — 脱离 Obsidian，用网页浏览/编辑本 wiki 的方案
- **`discord-bot/`** — 从 Discord 触发 ingest / query，把 bot 聊天当作 raw 源
- **`embedding-skill/`** — 打包成一个 pi skill，让任何项目都能复用本 wiki 的约定
- **`export-static/`** — 把 wiki 渲染成可部署的静态网站
- **`backup-encrypted/`** — 加密备份到外部存储

每一种都遵循同一协议：**放个目录，写个 README，AI 来读**。

---

## 关于 `public` 分支

本 `extensions/` 目录整体属于"非文档的框架配置"，会跟随 `public` 分支一并发布。
用户 clone public 版本后，按 README 自行启用需要的扩展，**不会泄漏 main 分支
里的个人 wiki 内容**。
