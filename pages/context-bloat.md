---
type: concept
title: Context Bloat / 上下文膨胀
aliases: [context bloat, 上下文膨胀, context compaction, 上下文压缩, context reduction]
tags: [tech/llm, tech/agent]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Context Bloat（上下文膨胀）

> Coding agent 比普通多轮对话更容易出现上下文膨胀——反复读取同一文件、工具输出冗长、日志大量涌入。如果 runtime 原封不动保留这些，上下文窗口会被迅速吃光。

这是 [[coding-agent]] 的第四个组件，是 [[context-engineering]] 最具体的执行面。

## 为什么它特别严重

相比 plain chat，coding agent 有三个放大器：

1. **重复文件读**：同一个文件可能在一轮里被读 3 次、在一个 session 里被读 30 次
2. **长 tool 输出**：`ls -R`、测试日志、编译错误、stacktrace 都可能是几百到几千行
3. **工具调用链**：每一步都在往 transcript 里堆东西

即使 LLM 支持越来越长的 context window，长 context 仍然**贵**，并且会**引入噪声**（无关信息稀释注意力）。

## 最小 harness 的两条压缩策略

### 1. Clipping（截短）

对**任意一段过长内容**做截断，防止它独占 prompt 预算：

- 大型文档片段
- 工具输出
- memory notes
- 单条 transcript 条目

原则是：不让某个"刚好话多"的元素吃掉整轮预算。

### 2. Transcript Reduction / Summarization（转录压缩）

把完整的 session history 变成一个"可塞进 prompt 的摘要"（即 [[agent-session-memory]] 里提到的 *compact transcript*）。两个关键技巧：

- **recency bias**：近期事件保留得更详细（当前步更可能用到）
- **aggressive old-event compression**：越旧的事件压缩越狠

### 3. 去重（deduplication）

对**旧的文件读**做去重——如果一个文件在 session 前段被读过，后面再次读它时不需要把内容重复塞进 prompt。

## 被低估的工程面

Raschka 把这块形容为 *"one of the underrated, boring parts of good coding-agent design"*。它很少出现在营销素材里，但**很多看起来是"模型变笨了"的现象，本质是 context 被污染了**。这也是 [[context-engineering]] 最核心的命题之一。

## 相关

- 所属：[[coding-agent]] 组件 ④
- 上位哲学：[[context-engineering]]
- 姐妹：[[prompt-prefix-caching]]（稳定部分的复用）、[[agent-session-memory]]（本页提到的 compact transcript 属于它）
