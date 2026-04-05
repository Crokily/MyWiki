---
type: tool
title: Claude Code
aliases: [Claude Code, Claude Code CLI, claude-code, claude-code-cli]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Claude Code

Anthropic 出品的终端 [[coding-agent]]，是 *coding harness* 的代表作之一。把 Claude 模型包在一个针对软件工程优化的 harness 里，让它能读写 repo、调工具、运行命令、维护跨轮次记忆。

在 [[sebastian-raschka]] 的 [[2026-04-04-components-of-a-coding-agent]] 一文里，Claude Code 被作为典型 coding harness 与 [[codex-cli]]、作者的 [[mini-coding-agent]] 并列对照。

## 关键能力（基于文章描述 + 常识）

- Live Repo Context 采集（自动发现 `AGENTS.md` / `CLAUDE.md` / `README`）
- Stable prompt prefix + caching
- 结构化工具集 + approval gating
- Session transcript + working memory 分层（见 [[agent-session-memory]]）
- **Subagent 支持较早**：Raschka 指出 Claude Code 很早就支持了 [[bounded-subagent]]，相比之下 [[codex-cli]] 是后来才加入的

## 本 wiki 中的角色

本 MyWiki 项目本身就是设计给 **[[claude-code]] / pi 这类 coding agent** 使用的。项目根目录的 `AGENTS.md` 就是让这类 agent 在启动时读取的"项目操作手册"。

## 相关

- 产品对照：[[codex-cli]], [[mini-coding-agent]]
- 上位概念：[[coding-agent]]
- 与之对比的广义 agent 平台：[[openclaw]]
