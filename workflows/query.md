# Query — 查询 wiki

> 确定用户在提问后再读取本文档。

---

## 第 1 步：定位相关页面

读 [`index.md`](../index.md) 找相关页面。

## 第 2 步：搜索

读 [`extensions/qmd/README.md`](../extensions/qmd/README.md) 了解搜索方法（qmd 语义搜索或 rg 回退）。

## 第 3 步：阅读与综合

读相关 `pages/` `sources/`，综合答案。

## 第 4 步：回复

回复带 `[[链接]]` 引用来源。

## 第 5 步：判断是否回填

如果探索产生了新综合/对比/洞察，主动问用户："要回填到 `queries/` 吗？"

## 第 6 步：若回填

1. 读 [`taxonomy.md`](../taxonomy.md) 选 tags
2. 写 `queries/YYYY-MM-DD-slug.md`
3. 更新被引用 pages 的反向链接
4. 追加 `log.md`：`## [YYYY-MM-DD] query | <question>`
5. Git commit：`query: <question>`
