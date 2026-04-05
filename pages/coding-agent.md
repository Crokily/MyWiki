---
type: topic
title: Coding Agent / 编码智能体
aliases: [coding agent, coding harness, 编码智能体, 编码 harness, agentic coding tool, agentic coding assistant]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Coding Agent（编码智能体 / Coding Harness）

> **定义**（[[sebastian-raschka]] in [[2026-04-04-components-of-a-coding-agent]]）：一种将 LLM 包裹在"应用层"（即 *agentic harness*）中、专为软件工程任务优化的 agentic 工具。"Coding agent" 与 "coding harness" 在大多数语境下可互换使用——严格地说，agent 是模型驱动的决策循环，harness 是围绕它的软件脚手架。

典型例子：[[claude-code]]、[[codex-cli]]、[[mini-coding-agent]]。

## 为什么需要它

LLM 本身只是 next-token 模型，独立跑 coding 任务有根本局限：**编码工作只有一部分是"生成下一个 token"**，更多的是 repo 导航、搜索、函数查找、diff 应用、测试执行、错误诊断、以及"把相关信息始终保持在 context 里"。这些都是 harness 的职责。

因此当下一个重要的观察是：**vanilla LLM 能力在收敛，真正拉开产品差距的是 harness**。作者甚至推测把一个 SOTA 开源模型（GLM-5 级别）塞进同质量的 harness，表现可能持平 [[claude-code]] / [[codex-cli]]。

## 与上位概念 Agent Harness 的关系

| 层级 | 是什么 | 例子 |
|---|---|---|
| Agent | 模型 + 工具 + 记忆 + 环境反馈构成的循环 | —— |
| Agent harness | 围绕 agent 的软件脚手架，管理上下文、工具、prompt、状态、控制流（领域无关） | [[openclaw]] |
| **Coding harness** | agent harness 的特化：专为代码上下文、工具、执行、迭代反馈 | [[claude-code]], [[codex-cli]] |

Coding harness 可以看成 agent harness 的 *task-specific 子类*。当我们说 "coding agent"，通常就是指 coding harness + 被它包裹的模型整体。

## Agent loop 的四步骨架

文章把 agent loop 描述为四个动作的不断循环：

1. **observe**：从环境采集信息
2. **inspect**：分析采集到的信息
3. **choose**：选择下一步动作
4. **act**：执行该动作

这个循环运行在三层之上：**model family（引擎）+ agent loop（决策）+ runtime supports（管线）**。

## 六大组件（本 wiki 对应页面）

Raschka 把一个实用 coding agent 拆成六个"组件"，彼此紧密交织但各有焦点：

1. **Live Repo Context**（本页下一节）—— 上岗前采集 repo 事实
2. **Prompt Shape & Cache Reuse** → [[prompt-prefix-caching]]
3. **Structured Tool Use & Permissions** → [[structured-tool-use]]
4. **Context Reduction / 压缩** → [[context-bloat]]
5. **Session Memory 三层结构** → [[agent-session-memory]]
6. **Bounded Subagent Delegation** → [[bounded-subagent]]

横贯这六个组件的设计哲学：[[context-engineering]]——"表面上的 model quality 很多其实是 context quality"。

## 组件 1：Live Repo Context（本页就地展开）

当用户说"修一下测试"或"实现 xyz"时，模型需要知道：

- 当前是否在一个 git 仓库里
- 分支是什么、有哪些 uncommitted 改动、最近的 commits
- 项目里有没有 `AGENTS.md` / `README.md` / `CLAUDE.md` 这种指令文件（比如从中得知测试命令）
- repo root 和目录布局

Coding agent 在启动/每轮工作前先构造一份**小型 workspace summary**（"stable facts"），和用户的自然语言请求拼成一个 combined prompt。这样模型不是"每次 prompt 从零开始"。

这也是为什么类似 `AGENTS.md` / `CLAUDE.md` 这种 **agent 指令文件**的习惯在 2025-2026 间迅速标准化——它们是 coding agent 自动发现项目约定的入口。

## 读者应用（本 wiki 自身）

本 wiki 的 `AGENTS.md` 就是上述 "Live Repo Context" 机制的一个典型消费者：coding agent（pi / Claude Code）启动时会自动读取它并按其规则工作。因此本页面的概念直接解释了"为什么这个 wiki 项目的设计要用 `AGENTS.md` 这样一份 LLM 操作手册"。

## 相关

- 上位：[[context-engineering]]
- 平行：[[reasoning-model]]（更强的"引擎"，和 harness 互补）
- 竞品类比：[[openclaw]]（更广义的 agent 平台）
- 产品实例：[[claude-code]], [[codex-cli]], [[mini-coding-agent]]
