---
kind: source
title: "Components of A Coding Agent"
source_type: article
raw: "[[2026-04-04-components-of-a-coding-agent]]"
author: "[[sebastian-raschka]]"
url: https://magazine.sebastianraschka.com/p/components-of-a-coding-agent
published: 2026-04-04
ingested: 2026-04-05
tags: [tech/agent, tech/llm]
touches:
  - "[[coding-agent]]"
  - "[[reasoning-model]]"
  - "[[context-engineering]]"
  - "[[prompt-prefix-caching]]"
  - "[[context-bloat]]"
  - "[[agent-session-memory]]"
  - "[[bounded-subagent]]"
  - "[[structured-tool-use]]"
  - "[[claude-code]]"
  - "[[codex-cli]]"
  - "[[mini-coding-agent]]"
  - "[[openclaw]]"
  - "[[sebastian-raschka]]"
  - "[[build-a-reasoning-model-from-scratch]]"
---

# Components of A Coding Agent

Sebastian Raschka 在 *Ahead of AI* 上的一篇 reference-style 文章，系统梳理了 **coding agent / coding harness** 的设计结构与六大核心组件。作者以自己写的开源 [[mini-coding-agent]] 为对照样本，贯穿全文。

## 概览

文章的核心论点是：**当下各家 vanilla LLM 的原始能力高度趋同，真正拉开产品差距的是围绕模型的 harness**——即负责装配 prompt、暴露工具、追踪文件状态、管理权限、缓存稳定前缀、维护记忆的软件脚手架。因此「表面上看起来的 model quality，很多其实是 context quality」。

## 概念分层

作者先厘清了容易被混淆的几个术语（见 [[coding-agent]] 详述）：

- **LLM**：原始的 next-token 模型
- **Reasoning model**（见 [[reasoning-model]]）：经训练/提示在推理期多花算力做中间推理与自验证的 LLM
- **Agent**：围绕模型的控制循环 —— 决定下一步看什么、调用哪个工具、如何更新状态、何时停止
- **Agent harness**：agent 的软件脚手架，泛用的
- **Coding harness**：agent harness 的特化子类，专为软件工程任务设计（代码上下文、工具、执行、迭代反馈）

类比：LLM 是引擎，reasoning model 是强化引擎，harness 是让我们能"驾驭"引擎的车架。[[claude-code]] 与 [[codex-cli]] 是典型 coding harness，[[openclaw]] 则被作者举为更广义的 agent harness。

## 六大组件（本文骨架）

1. **Live Repo Context**（见 [[coding-agent]]）—— agent 启动时就采集"stable facts"：是否在 git 仓库、分支/状态、`AGENTS.md`/`README` 等项目指令文件、目录布局。让每次 prompt 不必从零开始。

2. **Prompt Shape And Cache Reuse**（见 [[prompt-prefix-caching]]）—— 把 prompt 分成"稳定前缀"（通用指令 + 工具描述 + workspace 摘要）和"易变尾部"（最新请求 + 近期 transcript + 短期记忆）。稳定前缀被 runtime 缓存复用，避免每轮重建。

3. **Structured Tools, Validation & Permissions**（见 [[structured-tool-use]]）—— 模型不自由拼 shell 命令，而是输出结构化 action，经 **parse → 是否已注册 → 参数校验 → 审批 gate → 路径沙箱 → 执行 → bounded 结果回灌**的管线。harness 给模型"更少自由"换来"更高可用性"。

4. **Minimizing Context Bloat**（见 [[context-bloat]]）—— coding agent 比普通对话更容易上下文膨胀（重复文件读、长工具输出、日志）。最小 harness 至少用两种压缩策略：**clipping**（截短单条过长内容）+ **transcript reduction**（对旧事件更激进压缩、保留近期事件富信息、对重复文件读去重）。作者评价："一个看起来的 model quality 问题，背后很多其实是 context quality 问题"——这是 [[context-engineering]] 的核心命题。

5. **Structured Session Memory**（见 [[agent-session-memory]]）—— 需要区分三种状态对象：
   - **full transcript**：durable 存档，支持 resume
   - **working memory**：跨轮次保留的蒸馏状态（当前任务、关键文件、近期笔记）
   - **compact transcript**：为下一轮 prompt 重建而临时生成的压缩视图

   前两者是"存储时"结构（落盘 JSON），第三者是"prompt 时"结构。工作记忆的 job 是 task continuity，compact transcript 的 job 是 prompt reconstruction，容易混淆但职责不同。

6. **Delegation With (Bounded) Subagents**（见 [[bounded-subagent]]）—— 把旁路问题（某个符号在哪定义、某个 config 说了什么、某个 test 为什么挂）分出去给子 agent 跑，主循环不必被打断。核心张力是"spawn 容易，bind 难"：subagent 要继承足够上下文才能干活，又必须被约束（只读、递归深度上限、任务范围），否则会 fanout 失控。Claude Code 很早支持 subagent，Codex 后来加入，但 Codex 不强制只读，边界主要靠任务范围 + 上下文 + 深度控制。

## 与 Agent Harness / OpenClaw 的对照

作者末尾拿 [[openclaw]] 做对比：OpenClaw 是更广义的本地通用 agent 平台，也用 workspace 指令文件（`AGENTS.md` / `SOUL.md` / `TOOLS.md`），也有 JSONL 会话 + transcript 压缩 + subagent。但它不是 repo-centric 的，而是为"跨对话、跨频道、跨工作区运行多个长生命周期 agent"设计，coding 只是其众多 workload 之一。

换句话说：**coding agent 的 emphasis = repo 导向的短会话 + 高密度工具执行；OpenClaw 的 emphasis = 多路长生命周期 + 跨上下文运营**。

## 次要提及

- 作者自推的新书 [[build-a-reasoning-model-from-scratch]]（Manning，~528 页，已全书 early access）。
- 版本号提及：GPT-5.4 / Claude Opus 4.6 / GLM-5（2026-04 当期生态参照），OpenAI 曾维护 GPT-5.3 与 GPT-5.3-Codex 变体以做 harness-specific 后训练。

## 关键原话（值得记住）

- *"A lot of apparent 'model quality' is really context quality."*
- *"The tricky design problem is not just how to spawn a subagent but also how to bind one."*
- *"The harness is giving the model less freedom, but it also improves the usability at the same time."*
