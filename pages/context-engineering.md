---
type: concept
title: Context Engineering / 上下文工程
aliases: [context engineering, 上下文工程, context quality, context management]
tags: [tech/llm, tech/agent]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Context Engineering（上下文工程）

> **核心命题**（[[sebastian-raschka]]）：*"A lot of apparent 'model quality' is really context quality."*
>
> 看起来像是"模型不够聪明"的问题，很多时候其实是"上下文质量没做好"的问题。

## 是什么

Context engineering 指的是一整套**围绕 LLM 设计、装配、精简、维护其输入上下文**的工程实践。在 agent 和 coding agent 语境下它变得尤其重要，因为：

1. 一个 session 内模型会被反复调用，每次的 prompt 都要重新组装
2. coding 任务天然会产生大量上下文（文件读、工具输出、日志、错误栈）
3. 上下文窗口虽然在变长，但 **长 ≠ 便宜、更 ≠ 信号密度高**

## 在 Coding Agent 中的具体手段

在 [[coding-agent]] 的六大组件里，**至少有四个都是 context engineering 的体现**：

| 组件 | 做什么 |
|---|---|
| Live Repo Context | 上岗前采集 "stable facts"（见 [[coding-agent]]） |
| [[prompt-prefix-caching]] | 把稳定部分和易变部分分开，缓存前者 |
| [[context-bloat]] | clipping + 旧事件压缩 + 重复文件读去重 |
| [[agent-session-memory]] | 区分 full transcript / working memory / compact transcript 三种对象 |

剩下两个（[[structured-tool-use]]、[[bounded-subagent]]）也间接服务于上下文质量：结构化工具调用让 tool 输出有边界，subagent 让旁路探索不污染主循环。

## 为什么这是 "被低估的无聊部分"

Raschka 在文中评价这类工作是 *"one of the underrated, boring parts of good coding-agent design"*。它不像"换一个更大的模型"那样显眼，但在实际产品中它往往是决定"这个 agent 能不能被信任地用起来"的关键。

这也解释了为什么同样的底层模型，在 [[claude-code]] / [[codex-cli]] 里的体验，和在 plain chat UI 里的体验会有数量级的差异。

## 相关

- 总纲：[[coding-agent]]
- 分支执行：[[prompt-prefix-caching]]、[[context-bloat]]、[[agent-session-memory]]
- 互补：[[reasoning-model]]（更强的推理核）
