# Ingest — 摄入新源

> 确定用户要摄入新源后再读取本文档。

---

## 前置读取

1. [`taxonomy.md`](../taxonomy.md) — 获取可用的 type 和 tags
2. [`index.md`](../index.md) — 已有页面概览

---

## 第 0 步：落盘到 `raw/`

文件名 `YYYY-MM-DD-slug.<ext>`，basename 去扩展名后全局唯一。

| 输入类型 | 操作 |
|---|---|
| 本地文件 | 直接拷进 `raw/`，保留原扩展名 |
| URL | 读 [`extensions/web-reader/README.md`](../extensions/web-reader/README.md) 获取抓取方法，保存为 md |
| 粘贴文本 | 整理成 md 落盘 |

> `sources/<basename>.md` 与 `raw/<basename>.<ext>` 保持 1:1 映射，basename 一致即可。

## 第 1 步：读 raw 源全文

通读整个 raw 文件，理解内容。

## 第 2 步：讨论 takeaways

**关键步骤，不可跳过。**

列出 3-7 个关键点，问用户哪些值得强调、有没有遗漏。**等用户回复后再动笔**。

## 第 3 步：写 `sources/`

写 `sources/<same-basename>.md`：结构化摘要 + `touches` 列出将触及的 pages。

## 第 4 步：更新或新建 `pages/`

一次 ingest 可能触及 5-15 个页面：
- **新页面**：按 taxonomy 选 `type` 和 `tags`
- **已有页面**：追加新信息、插入引用、必要时修订旧说法

## 第 5 步：双向链接维护

在被引用页面的 `sources` 字段加上本次 source 链接。

## 第 6 步：tag/type 登记

若需要 taxonomy 中没有的 tag/type，**先停下**告知用户，确认后写入 `taxonomy.md`。

## 第 7 步：重新生成 `index.md`

按 type 和 tag 分组。

## 第 8 步：追加 `log.md`

`## [YYYY-MM-DD] ingest | <title>` + 触及文件清单。

## 第 9 步：搜索索引

如果本次新建或修改了 ≥ 3 个文件，读 [`extensions/qmd/README.md`](../extensions/qmd/README.md) 检查是否需要更新搜索索引。

## 第 10 步：Git commit

`ingest: <short title>`

一次 ingest = 一个 commit，不要拆。
