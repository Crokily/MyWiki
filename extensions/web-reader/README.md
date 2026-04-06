# web-reader — 网页内容提取

> 需要从 URL 抓取内容时读取本文件。自包含：检测 → 使用 → 回退。

---

## 检测

`npx defuddle --help` 能执行 → defuddle 可用。

可选增强：`command -v agent-browser` → 支持需要交互的页面。

---

## 使用（defuddle 可用时）

### 路径 A：defuddle 直连（首选，最快）

适用于绝大多数博客、新闻、文档、论文页面。

```bash
npx defuddle parse "$URL" --markdown --json
```

`--json` 输出结构化元数据（title / author / date / description）。

**判断成功**：输出正文 < 100 字或返回错误 → 进入路径 B。

### 路径 B：agent-browser + defuddle（需要交互的页面）

适用于弹窗/cookie wall、登录、SPA。

1. agent-browser 打开 URL，完成交互
2. 提取渲染后 HTML（`document.documentElement.outerHTML`）
3. 保存为临时文件
4. `npx defuddle /tmp/page.html --markdown --json`

### 路径 C：agent-browser 纯文本（最后 fallback）

仅当 defuddle 也无法解析时使用。会丢失图片。

---

## 回退（defuddle 不可用时）

使用 agent 自带的网页访问能力直接获取内容。

---

## 落盘格式

保存到 `raw/YYYY-MM-DD-slug.md` 时：

```markdown
# {title}

**Source**: {url}
**Author**: {author}
**Published**: {date}
**Retrieved**: {today} (via {defuddle | agent-browser+defuddle | agent-browser text})

---

{正文 markdown}
```

---

## 安装（给人类用户）

```bash
bash extensions/web-reader/init.sh
# 或手动：npm install -g @anthropic-ai/defuddle
```

## 文件说明

| 文件 | 角色 |
|---|---|
| `README.md` | 本文件 |
| `init.sh` | 一次性安装脚本 |
