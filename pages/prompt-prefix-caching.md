---
type: concept
title: Prompt Prefix Caching / 稳定前缀缓存
aliases: [prompt prefix caching, stable prompt prefix, 稳定前缀缓存, prompt caching, prefix caching, prompt shape]
tags: [tech/llm, tech/agent]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Prompt Prefix Caching（稳定前缀缓存）

在 [[coding-agent]] 的六大组件中，这一条解决的是："一旦 agent 有了 repo 视图，**该怎么把这些信息高效地喂给模型**"。

## 问题背景

一个 coding session 是**高度重复**的：

- agent 的通用指令规则 → 几乎每轮不变
- tool descriptions → 几乎每轮不变
- workspace summary（见 [[coding-agent]] 的 Live Repo Context）→ 大多数情况下不变
- **真正变化的部分**：最新用户请求、近期 transcript、短期记忆

如果每一轮都把所有东西拼成一个"大而无差别的 prompt"，大量算力和 token 费用会花在重新处理根本没变的内容上。

## 解决方案：分层 prompt shape

"聪明"的 runtime 会把 prompt 拆成两块：

```
┌─────────────────────────────┐
│  Stable Prompt Prefix       │  ← 缓存复用
│  - 通用指令                  │
│  - tool descriptions         │
│  - workspace summary         │
├─────────────────────────────┤
│  Volatile Suffix            │  ← 每轮重建
│  - 短期记忆                  │
│  - 近期 transcript           │
│  - 最新用户请求              │
└─────────────────────────────┘
```

runtime 在底层（通过 prompt cache / KV cache reuse 等机制）**只重算易变部分**，稳定前缀的计算被跨轮次重用。

## 与 Live Repo Context 的分工

- [[coding-agent]] 的 "Live Repo Context" 一节关注的是**采集 repo 事实**
- 本页关注的是**打包、缓存、复用这些事实**

同一份信息，在前一步被生成，在这一步被高效地装入 prompt。

## 工程含义

这直接影响：

- **延迟**：缓存命中的轮次 token 处理更快
- **成本**：大部分厂商对 cache-hit token 收费更低
- **"稳定"的边界**：任何对 stable prefix 的改动都会打穿缓存，因此 harness 设计者倾向把这块内容维持得"尽量少变"。这也反过来影响了 agent 指令文件（如 `AGENTS.md`）的约定——这些文件通常在 session 开始时读一次，进入 stable prefix，整个 session 不再重读。

## 相关

- 所属：[[coding-agent]] 组件 ②
- 上位哲学：[[context-engineering]]
- 姐妹组件：[[context-bloat]]（对易变部分的压缩）、[[agent-session-memory]]（易变部分的来源之一）
