---
type: tool
title: OpenClaw
aliases: [OpenClaw, Open Claw, openclaw]
tags: [tech/agent]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# OpenClaw

一个在 **2026 年前后开始爆火**的 agent 项目（由用户确认为真实项目；更详细的技术细节待未来 ingest 补充）。在 [[sebastian-raschka]] 的 [[2026-04-04-components-of-a-coding-agent]] 文末，作者把它作为一个"更广义的 agent harness"和 coding harness（[[claude-code]]、[[codex-cli]]）做对照。

## 定位（根据文章描述）

> "OpenClaw is more like a local, general agent platform that can also code, rather than being a specialized (terminal) coding assistant." —— Sebastian Raschka

翻译过来就是：**OpenClaw 是一个本地的、通用的 agent 平台，coding 只是它能做的 workload 之一**，而不是像 [[claude-code]] / [[codex-cli]] 那样专为 coding 优化的终端工具。

## 与 Coding Harness 的共通点

文章列出几处重叠：

1. **workspace 指令文件**：使用 `AGENTS.md`、`SOUL.md`、`TOOLS.md` 这类项目级指令文件
2. **JSONL session 文件**：会话持久化
3. **transcript 压缩和 session 管理**：和 [[agent-session-memory]] 里的概念一致
4. **子 session / subagent**：能 spawn 辅助 session（见 [[bounded-subagent]]）

## Emphasis 上的差异

作者点出的关键区别：

| 维度 | Coding Harness（Claude Code / Codex） | OpenClaw |
|---|---|---|
| 核心用户场景 | 一个人在 repo 里让 agent 看文件、改代码、跑本地工具 | 跨对话、跨频道、跨 workspace 运行多个**长生命周期**的本地 agent |
| 任务类型 | 高密度的软件工程 | coding 只是其中一种 workload |
| 会话特征 | 短会话 + repo-centric | 长生命周期 + 多上下文 |

换句话说，Coding harness 和 OpenClaw 都属于"agent harness"这个大伞，但它们选择了**不同的设计 trade-off**：前者是"为一个 repo 的短会话榨取最高生产力"，后者是"为一个用户的长生命周期多场景编排多个 agent"。

## 待补充

- 架构细节、具体使用体验、社区生态等，等未来专门 ingest 时再扩展
- 本页当前主要依据 [[2026-04-04-components-of-a-coding-agent]] 的描述

## 相关

- 类别对照：[[claude-code]], [[codex-cli]], [[mini-coding-agent]]
- 上位：[[coding-agent]]（本 wiki 中 coding harness 与 agent harness 的共同枢纽）
