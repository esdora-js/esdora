---
name: esdora
description: >
  Use this skill when working in the Dora Pocket / esdora TypeScript utility
  library monorepo: implementing package APIs, updating API docs, maintaining
  package boundaries, running quality gates, or evolving project AI rules.
primary: true
---

# Esdora Project Skill

Dora Pocket is a TypeScript utility library monorepo. This skill is the
canonical project instruction source for Codex, Claude Code, and compatible
agent harnesses.

## Always Read

- `skills/esdora/rules/project-rules.md`
- `skills/esdora/rules/coding-standards.md`
- `skills/esdora/rules/agent-behavior.md`

## Routing

Task routes live in `skills/esdora/routing.yaml`.

For every non-trivial task:

1. Read `skills/esdora/routing.yaml`.
2. Match the task by `labels`, `trigger_examples`, scope, and user intent.
3. Read the route's `required_reads` in addition to Always Read files.
4. Follow the route's `workflow`.

## Common Tasks

- Package API implementation or package changes:
  `skills/esdora/workflows/implement-utility.md`
- New workspace package scaffolding:
  `skills/esdora/workflows/create-package.md`
- API reference docs:
  `skills/esdora/workflows/update-api-doc.md`
- Build, test, lint, typecheck, package verification:
  `skills/esdora/workflows/verify-package.md`
- AI rules, agents, skills, and project instruction maintenance:
  `skills/esdora/workflows/maintain-ai-rules.md`
- Release and versioned change preparation:
  `skills/esdora/workflows/release-change.md`

## Priority

Formal docs under `skills/esdora/` are authoritative. Compatibility shells in
`AGENTS.md`, `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.cursor/`, and
package-level `AGENTS.md` must route here instead of duplicating rule bodies.

If instructions conflict, prefer the most specific user request first, then this
skill, then compatibility shells.

## Closure

Before completing a task that changes code, docs, or project instructions:

- Re-check the original user constraints.
- Run the relevant verification command from the matched workflow.
- Report changed files and any verification that could not be run.
