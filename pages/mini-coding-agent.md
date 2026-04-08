---
type: tool
title: Mini Coding Agent
aliases: [Mini Coding Agent, mini-coding-agent, rasbt/mini-coding-agent]
tags: [tech/agent, tech/llm]
created: 2026-04-05
updated: 2026-04-05
sources:
  - "[[2026-04-04-components-of-a-coding-agent]]"
---

# Mini Coding Agent

[[sebastian-raschka]] 的开源 **从零实现** 的最小 [[coding-agent]]，用**纯 Python、零外部依赖**写成。是 [[2026-04-04-components-of-a-coding-agent]] 一文的配套参考实现。

- **仓库**：<https://github.com/rasbt/mini-coding-agent>
- **定位**：不追求像 [[claude-code]] / [[codex-cli]] 那样好用好看，而是**让六大组件在代码层面一目了然**

## 六大组件在代码里的映射

仓库里的代码顶部用注释明确标出了每个模块对应文章的哪个组件：

```python
##############################
#### Six Agent Components ####
##############################
# 1) Live Repo Context -> WorkspaceContext
# 2) Prompt Shape And Cache Reuse -> build_prefix, memory_text, prompt
# 3) Structured Tools, Validation, And Permissions
#      -> build_tools, run_tool, validate_tool, approve, parse, path, tool_*
# 4) Context Reduction And Output Management -> clip, history_text
# 5) Transcripts, Memory, And Resumption -> SessionStore, record, note_tool, ask, reset
# 6) Delegation And Bounded Subagents -> tool_delegate
```

这使得它特别适合拿来学 [[coding-agent]] 的骨架设计——文章是"心智模型"，这个仓库是"心智模型的可执行版本"。

## 局限（作者自陈）

- 输出比 Claude Code / Codex 朴素（纯 Python，没做 TUI 美化）
- [[bounded-subagent]] 的实现被简化：subagent 仍然是**同步**跑的，但设计理念一致
- 用于理解与教学，不是生产级工具

## 相关

- 作者：[[sebastian-raschka]]
- 配套文章：[[2026-04-04-components-of-a-coding-agent]]
- 对照产品：[[claude-code]], [[codex-cli]]
- 上位：[[coding-agent]]
