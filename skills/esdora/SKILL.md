---
name: esdora
description: >
  Use this skill when working in the Dora Pocket / esdora TypeScript utility
  library monorepo: implementing package APIs, updating API docs, maintaining
  package boundaries, running quality gates, or evolving project AI rules.
  触发词: 实现工具函数、新建包、更新 API 文档、检查质量门、维护 AI 指令、准备发版。
primary: true
---

# Esdora Project Skill

Dora Pocket is a TypeScript utility library monorepo. This skill is the
canonical project instruction source for Codex, Claude Code, and compatible
agent harnesses.

## Always Read

Authoritative list lives in `skills/esdora/routing.yaml` under `always_read:`.
Load that file first, then read every path it lists.

## Routing

Task routes live in `skills/esdora/routing.yaml`.

For every non-trivial task:

1. Read `skills/esdora/routing.yaml`.
2. Match the task by `labels`, `trigger_examples`, scope, and user intent.
3. Read the route's `required_reads` in addition to Always Read files.
4. Follow the route's `workflow`.

## Common Tasks

Task routes live in `skills/esdora/routing.yaml`; match the task there.

## Priority

Formal docs under `skills/esdora/` are authoritative. Compatibility shells in
`AGENTS.md`, `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, and
package-level `AGENTS.md` must route here instead of duplicating rule bodies.

If instructions conflict, prefer the most specific user request first, then this
skill, then compatibility shells.

## Closure

Before completing a task that changes code, docs, or project instructions:

- Re-check the original user constraints.
- Run the relevant verification command from the matched workflow.
- Report changed files and any verification that could not be run.
