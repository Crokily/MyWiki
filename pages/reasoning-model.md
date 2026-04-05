---
type: concept
title: Reasoning Model / 推理模型
aliases: [reasoning model, reasoning LLM, 推理模型, 推理 LLM, RLM]
tags: [tech/llm, tech/ai]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Reasoning Model（推理模型）

> **定义**（[[sebastian-raschka]]）：reasoning model 本质**仍然是一个 LLM**，但经过训练和/或提示，使其在推理期（inference time）花更多算力做**中间推理、自验证、或在候选答案之间搜索**。

## 与 LLM、Agent 的关系

作者用一个比喻串起三者（详见 [[coding-agent]]）：

| 层 | 是什么 | 类比 |
|---|---|---|
| **LLM** | 原始的 next-token 模型 | 引擎 |
| **Reasoning model** | 训练/提示后更擅长中间推理与自验证的 LLM | 强化引擎（更强，但更贵） |
| **Agent** | 围绕模型的控制循环 | 驾驭引擎的车架 |

三者并不互斥——reasoning model 可以独立跑（在 chat UI 或 Python session 里），也可以被包进 agent harness 里（这时是"强化引擎 + 车架"的组合）。

## 在 Coding Agent 语境中的作用

作者的一个关键观察：**一个好的 coding harness 能让 reasoning model 和非 reasoning model 都显得比在 plain chat box 里强得多**。换句话说，harness 和 reasoning capability 是互补关系而不是替代关系。

- 好的 LLM → 给 reasoning model 提供更好的底座
- 好的 reasoning model → 给 harness 提供更强的决策核
- 好的 harness → 把上下文、工具、记忆喂得更准，让 reasoning model 的推理更落地

## 作者自著

Raschka 正在出版一本专门书 [[build-a-reasoning-model-from-scratch]]，涵盖 reasoning model 的评估、inference-time scaling、self-refinement、RL、distillation 等从零构建主题。

## 相关

- 上位：LLM（本 wiki 暂未建独立页面）
- 平行：[[coding-agent]]、[[context-engineering]]
- 作者：[[sebastian-raschka]]
