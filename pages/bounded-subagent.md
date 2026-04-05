---
type: concept
title: Bounded Subagent / 受约束的子智能体
aliases: [bounded subagent, subagent, 子智能体, subagent delegation, spawn and bind, agent delegation]
tags: [tech/agent]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Bounded Subagent（受约束的子智能体）

[[coding-agent]] 的第六个组件：**委派（delegation）**。它允许主 agent 把旁路问题交给子 agent 去跑，而不打断自己的主循环。

## 为什么需要它

一个主 agent 在做主任务的时候，经常会冒出"顺手需要一个答案"的情形：

- 这个符号是在哪个文件里定义的？
- 那个 config 具体说了什么？
- 为什么这个 test 在挂？

如果把这些都塞进主循环，主 transcript 会被迅速污染，注意力也被分散。更自然的做法是：把它切成一个**有限范围的 subtask**，交给一个 subagent 去跑，拿回一个简短结论。

## 核心设计张力："Spawn 容易，Bind 难"

> *"The tricky design problem is not just how to **spawn** a subagent but also how to **bind** one."* —— [[sebastian-raschka]]

- **要继承足够多的上下文**：如果子 agent 一无所知，它没法做真正有用的工作
- **又必须被约束**：否则几个 subagent 会同时动同样的文件，互相覆盖；或者递归 spawn，变成一颗失控的 agent 树

这就是所谓的 "spawn and bind"：**spawn 的关键是传递足够上下文，bind 的关键是设定边界**。常见的 bind 手段：

- **只读模式**：子 agent 不能改文件
- **限制递归深度**：子 agent 不能再 spawn 孙 agent，或最多一级
- **限定任务范围**：在一个明确的"问题声明"里工作，答完就退
- **沙箱继承**：继承主 agent 的 workspace 路径白名单、approval 规则等

## 产品实现对比

| 产品 | subagent 支持 | 约束方式 |
|---|---|---|
| [[claude-code]] | 较早支持 | —— |
| [[codex-cli]] | 后来加入 | **不强制只读**；继承主 agent 的 sandbox 和 approval 设置，边界更多靠任务范围 + 上下文 + 深度控制 |
| [[mini-coding-agent]] | 有简化版本 | child 仍然是同步跑的，但 spawn/bind 的设计理念一致 |

## 与其它组件的关系

Subagent 只有在 **tools**（[[structured-tool-use]]）和 **state**（[[agent-session-memory]]）都就位之后才变得有意义——它本质上是"把一小段 tool+state 的能力切出去独立跑"。

## 相关

- 所属：[[coding-agent]] 组件 ⑥
- 前置：[[structured-tool-use]]、[[agent-session-memory]]
- 上位哲学：[[context-engineering]]（把污染挡在主循环外）
