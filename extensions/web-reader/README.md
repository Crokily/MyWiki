# web-reader Extension — 网页内容提取

> 这份 README 是**写给 AI agent（Claude Code / Codex / Pi 等）看的**操作引导。
> 它告诉 AI：如何检测本扩展是否已启用，以及启用后如何**覆盖** `AGENTS.md`
> 的对应小节。
>
> 人类用户只需运行一次 `bash extensions/web-reader/init.sh`。

---

## 本扩展解决什么问题

当 agent 通过 URL 抓取网页内容时，常见的 agent-browser 纯文本模式会：

- **丢失所有图片**（只剩 alt text 占位符）
- **夹带大量噪音**（sidebar、footer、nav、广告、cookie banner）
- **浪费 token**（噪音可占原始 HTML 30-60%）

本扩展以 [defuddle](https://github.com/kepano/defuddle)（内容提取）为首选，必要时再配合 agent-browser（交互式页面获取），为 agent 提供完整的网页阅读能力：

- 保留正文图片（`![alt](url)` 形式）
- 去除非正文噪音
- 直接输出 Markdown
- 自动提取元数据（author / date / title / description）
- 标准化代码块、数学公式、Obsidian callout

---

## 检测本扩展是否已启用

满足以下条件即视为已启用：

1. `npx defuddle --help` 能执行（defuddle 可用）

**不满足 → 视为未启用**，按 `AGENTS.md § 6` 原有方式（agent-browser 或直接粘贴）操作。

可选增强：

- `command -v agent-browser` 有输出 → agent-browser 可用，支持处理需要交互的页面（弹窗、登录等）

---

## 启用后：对 AGENTS.md 的覆盖

### 覆盖 `§ 6` 第 0 步：URL 抓取方式

当用户提供 URL 作为源时，按以下优先级依次尝试：

#### 路径 A：defuddle 直连 URL（首选，最快最省 token）

适用：绝大多数博客、新闻、文档、论文页面（服务端渲染、无需交互）。

```bash
npx defuddle parse "$URL" --markdown --json
```

- `--markdown`：输出 Markdown 格式正文
- `--json`：同时输出结构化元数据（title / author / date / description / wordCount）

**判断是否成功**：如果输出正文 < 100 字，或返回错误 → 该页面可能需要 JS 渲染或交互，进入路径 B。

#### 路径 B：agent-browser + defuddle（需要交互的页面）

适用：有弹窗/cookie wall、需要登录、SPA（React/Vue 等纯客户端渲染）。

步骤：

1. 用 agent-browser 打开 URL
2. 完成必要交互（关弹窗、登录、滚动加载等）
3. 提取当前页面的**完整渲染后 HTML**（在 agent-browser 页面上下文执行 `document.documentElement.outerHTML`）
4. 将 HTML 保存为临时文件
5. 用 defuddle 从 HTML 提取正文：

```bash
npx defuddle /tmp/page.html --markdown --json
```

**关键**：agent-browser 只负责"拿到完整 HTML"，defuddle 负责"从 HTML 提取干净内容"。不要使用 agent-browser 的纯文本模式。

#### 路径 C：agent-browser 纯文本（最后 fallback）

仅当 defuddle 也无法正常解析时使用（极少见）。

> ⚠️ 此模式会丢失图片，应尽量避免。

### 落盘到 `raw/` 的格式

无论走哪条路径，最终保存到 `raw/YYYY-MM-DD-slug.md` 时，文件头部应包含：

```markdown
# {title}

**Source**: {url}
**Author**: {author}
**Published**: {date}
**Retrieved**: {today's date} (via {defuddle | agent-browser+defuddle | agent-browser text})

---

{正文 markdown}
```

defuddle 的 `--json` 输出会提供 title / author / date 等字段，直接使用即可，无需从正文猜测。

---

## 文件一览

| 文件 | 角色 |
|---|---|
| `README.md` | 本文件，AI agent 阅读的启用引导 |
| `init.sh` | 一次性安装脚本：检测 / 安装 defuddle 和 agent-browser |

---

## 给人类用户的首次安装

```bash
bash extensions/web-reader/init.sh
```

或手动：

```bash
# 必装：defuddle
npm install -g @anthropic-ai/defuddle

# 选装：agent-browser（处理弹窗/登录页面时需要）
npm install -g @anthropic-ai/agent-browser
```

---

## 设计说明

本扩展把 URL 抓取拆成**两个独立阶段**：

```
URL（直连）                  提取正文（统一）
┌─────────────────┐         ┌────────────────┐
│ defuddle        │────────▶│ clean markdown │──▶ raw/
└─────────────────┘         └────────────────┘
┌─────────────────┐
│ agent-browser    │──HTML──▶ defuddle ─▶ clean markdown ─▶ raw/
│（弹窗/登录/SPA）   │
└─────────────────┘
```

好处：

- **图片保留**：defuddle 保留 `![](url)` 引用，人类在 Obsidian 里可看到图片
- **省 token**：只保留正文，去除噪音
- **元数据自动化**：author / date / title 自动提取
- **可替换性**：前端获取方式可随时替换（Playwright、Puppeteer 等），提取层不变
- **渐进增强**：没有 agent-browser 也能工作（路径 A），有则更强（路径 B）
