---
type: concept
title: Agent Session Memory / 会话记忆三层结构
aliases: [agent session memory, session memory, 会话记忆, working memory, full transcript, compact transcript, 工作记忆]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Agent Session Memory（会话记忆的三层结构）

在 [[coding-agent]] 的六大组件里，这一条关注的是：**agent 作为一个长期运行的系统，到底要把历史保留成什么形状**。

Raschka 在文中明确区分了**三种状态对象**——它们很容易被混为一谈，但在设计上有不同职责。

## 三种对象的对照表

| 对象 | 所属时刻 | 职责 | 特征 |
|---|---|---|---|
| **Full transcript** | 存储时（落盘） | **resumption**——保住整个 session 可以被重新加载 | durable，append-only，通常是 JSONL |
| **Working memory** | 存储时（落盘） | **task continuity**——跨轮次保留"当前在干什么"的蒸馏状态 | 小、会被 modify 和 compact，不是简单 append |
| **Compact transcript** | prompt 时（临时） | **prompt reconstruction**——给模型看一个"足够短但足够用"的近期历史 | 每轮由 full transcript + working memory 重新生成 |

> 关键区分（作者原话大意）：
> - Full transcript 和 working memory 都是**存储时**（storage-time）结构
> - Compact transcript 是**prompt 时**（prompt-time）结构
> - Working memory 的 job 是 *task continuity*，compact transcript 的 job 是 *prompt reconstruction*——它们的用途不同，不要混用

## 为什么是"至少两层"而不是一层

最简陋的 agent 只留 full transcript：resumption 是够了，但每轮都要从里面挖出"现在该关心什么"，既慢又容易漏。

所以好的 harness 额外维护 working memory：

- 是什么：一份**显式维护**的小状态
- 装什么：当前任务、关键文件、近期重要笔记
- 特征：**会被修改、被压缩**，而不是像 transcript 那样只增不改

两者分工：full transcript 是"档案馆"，working memory 是"工作台上的便签"。

## 与 Context Bloat 的分工

Compact transcript 的生成过程——截短、去重、按 recency 分级压缩——本身就是 [[context-bloat]] 那一章描述的工作。可以这样理解：

- [[context-bloat]] 回答："**how much of the past should go back into the model on the next turn?**"（prompt-time 问题）
- 本页回答："**what does the agent keep over time as a permanent record?**"（storage-time 问题）

两者紧密交织但焦点不同。

## 实现形态

在文中的 [[mini-coding-agent]] 里，full transcript 和 working memory 都作为 **JSON 文件落在磁盘上**，关闭 agent 后重新打开还能 resume。这也是 coding agent 产品（[[claude-code]]、[[codex-cli]] 等）通用的做法。

## 相关

- 所属：[[coding-agent]] 组件 ⑤
- 姐妹：[[context-bloat]]（compact transcript 的生成机制）
- 上位：[[context-engineering]]
