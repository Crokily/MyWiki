---
type: book
title: Build a Reasoning Model (From Scratch)
aliases: [Build a Reasoning Model From Scratch, Build A Reasoning Model, 从零构建推理模型]
tags: [tech/llm, tech/ai]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Build a Reasoning Model (From Scratch)

[[sebastian-raschka]] 的新书，Manning 出版，**2026 年**全书进入 early access，篇幅约 **528 页**。作者自述是"到目前为止最 ambitious 的一本书"——写了大约 1.5 年，做了大量实验。

## 核心主题

- **Evaluating reasoning models**：如何评估 [[reasoning-model]]
- **Inference-time scaling**：推理期算力扩展（多轮思考、候选搜索等）
- **Self-refinement**：模型自我修正
- **Reinforcement learning**：RL 在 reasoning 训练中的应用
- **Distillation**：把强 reasoning 能力蒸馏到更小模型

## 定位

作者在 [[2026-04-04-components-of-a-coding-agent]] 一文末尾宣传此书时给出的理由是：

> "围绕 'reasoning in LLMs' 有很多讨论，而真正理解它在 LLM 语境下意味着什么的最好办法，是**从零实现一个**。"

这延续了作者上一本 *Build a Large Language Model (From Scratch)* 的风格：不是俯瞰式综述，而是"自己敲一遍"的工程教学。

## 获取

- Manning（early access，含完整 pre-final layout）
- Amazon pre-order

## 相关

- 作者：[[sebastian-raschka]]
- 核心概念：[[reasoning-model]]
- 间接关联：[[coding-agent]]（harness 和 reasoning model 是互补关系）
