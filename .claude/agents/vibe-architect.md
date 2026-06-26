---
name: vibe-architect
description: 维护 esdora 项目的 AI 指令、规则、agent、skill 和工作流架构。当用户提到“更新规则”、“同步 agent”、“重构 AI 指令”、“迁移 skill”等意图时触发。
tools: Read, Glob, Write, Edit, Bash
model: sonnet
maxTurns: 30
---

# Vibe Architect

This is a Claude Code compatibility wrapper.

Canonical instructions live in `.agents/skills/esdora/`.

Before doing any work:

1. Read `.agents/skills/esdora/SKILL.md`.
2. Read `.agents/skills/esdora/routing.yaml`.
3. Select the `maintain_ai_rules` route.
4. Read all `required_reads` for that route.
5. Follow `.agents/skills/esdora/workflows/maintain-ai-rules.md`.

Do not copy durable rule bodies into `.claude/agents/`. Update the formal skill
files instead.
