# Lint — 健康检查

> 用户说"跑一次 lint"时再读取本文档。

---

## 前置读取

[`taxonomy.md`](../taxonomy.md) — 需要对比检查术语漂移。

---

## 检查项

1. **术语漂移**：扫描所有 frontmatter `tags`，对比 `taxonomy.md`，报告未登记 tag 和疑似变体
2. **孤儿页面**：`pages/` 中没有被任何其他文件链接的
3. **断链**：`[[...]]` 指向不存在文件的
4. **矛盾**：互相链接的页面中主张冲突的
5. **过期**：新源已覆盖但旧页面未更新的
6. **缺页**：被多次提及但没有独立页面的概念/实体

## 搜索工具

读 [`extensions/qmd/README.md`](../extensions/qmd/README.md) 了解搜索方法，或直接使用：

```bash
rg -l "pattern" pages sources maps queries
rg "^tags:" pages/ sources/ --no-heading
```

## 执行

1. **输出报告**给用户，**等确认**后再修复
2. 修复后：追加 `log.md` + commit：`lint: <summary>`
