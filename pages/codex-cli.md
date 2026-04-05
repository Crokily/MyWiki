---
type: tool
title: Codex CLI
aliases: [Codex CLI, Codex, OpenAI Codex CLI, codex-cli]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Codex CLI

OpenAI 的终端 [[coding-agent]]，是 *coding harness* 的另一个代表作。把 GPT 系列（文章提到 OpenAI 历史上曾维护 **GPT-5.3 与 GPT-5.3-Codex** 两个变体）包在针对代码任务的 harness 里。

## 与 Claude Code 的对比

在 [[2026-04-04-components-of-a-coding-agent]] 中，Codex CLI 和 [[claude-code]] 被作为两大 coding harness 并列讨论。两者的相同点远多于不同点（都是 repo-centric 的、结构化工具的、有 session memory 的），但文中点出了一个具体差异：

- **Subagent 权限模型**：[[claude-code]] 很早支持 subagent；Codex 后来加入，但**不强制 subagent 只读**，而是让它继承主 agent 的 sandbox + approval 设置。因此 Codex 的 subagent 边界更多靠**任务范围 + 上下文 + 深度限制**，而不是硬性权限（见 [[bounded-subagent]]）

## Harness-specific 后训练

文中还提到一个重要事实：OpenAI 曾为 Codex 维护**独立的模型变体**（如 `GPT-5.3-Codex`）——这印证了作者的观点："harness-specific 后训练通常是有益的"，即使 harness 本身是差异化的主要来源，模型也可以为 harness 做一点额外适配。

## 相关

- 产品对照：[[claude-code]], [[mini-coding-agent]]
- 上位概念：[[coding-agent]]
- 相关组件：[[bounded-subagent]], [[structured-tool-use]]
