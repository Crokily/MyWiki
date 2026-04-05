---
type: concept
title: Structured Tool Use / 结构化工具调用
aliases: [structured tool use, tool use, 结构化工具调用, tool validation, tool permissions, function calling, tool calling]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Structured Tool Use（结构化工具调用）

[[coding-agent]] 的第三个组件。工具访问与使用是"从 chat 变成 agent"的分界线——但 agent 的工具调用并不是"让模型自由写 shell 命令然后执行"那么简单。

## 模型 ≠ shell

一个 plain LLM 可以**建议**一条命令（"你可以试试 `pytest -x`"）。但 coding agent 里的 LLM 要做的是**实际执行这条命令并把结果拿回循环**（而不是让用户手工复制粘贴）。

然而让模型**自由拼 syntax** 是危险且不可靠的。因此 harness 的设计选择是：**提供一个预定义的、命名的、参数明确的工具清单**。常见工具类别：

- 列目录 / 读文件
- 搜索（grep / 语义搜索）
- 运行 shell 命令（可以是一个 `bash`/`subprocess.call` 包装工具，以支持任意命令）
- 写文件 / 打 patch
- ……

## 验证管线

模型要调用工具时，输出一个**结构化 action**。harness 在真正执行前会跑一串程序化检查：

```
模型输出 action
      ↓
① Parse（语法上是合法的 JSON/结构化调用吗？）
      ↓
② 已注册？（这是 harness 认识的工具吗？）
      ↓
③ 参数合法？（字段齐全、类型对、值在约束内？）
      ↓
④ 需要审批？（是否需要用户确认？）
      ↓
⑤ 路径沙箱（请求的路径在 workspace 范围内吗？）
      ↓
⑥ 执行
      ↓
⑦ Bounded result 回灌到循环
```

> 只有全部检查通过，工具才会真正跑。

## 设计哲学："更少自由 = 更高可用性"

> *"The harness is giving the model less freedom, but it also improves the usability at the same time."* —— [[sebastian-raschka]]

这是一个反直觉但重要的观察：**限制 agent 的行动空间不是在削弱它，而是在让它更可用**。

原因：

- 拒绝 malformed action → 减少模型幻觉出的无效调用导致的卡死
- Approval gating → 关键操作（删文件、rm -rf、push 到 main）留给用户拍板
- 路径沙箱 → 防止 agent 碰到 workspace 之外的文件
- 结构化参数 → 让 tool 输出可以被精确 bounded（见 [[context-bloat]]）

## Bounded Result

工具执行完后返回的"结果"不是原始 stdout，而是**经过裁剪的 bounded result**——这直接接到 [[context-bloat]] 里的 clipping 策略。

## 相关

- 所属：[[coding-agent]] 组件 ③
- 下游消费：[[context-bloat]]（bounded result）、[[bounded-subagent]]（subagent 本身就是一个特殊的 tool）
- 上位哲学：[[context-engineering]]
