---
name: doc-generator
description: 为 esdora 项目生成、更新或验证 API 文档。当用户提到“生成文档”、“写文档”、“更新文档”、“检查文档”、“文档过时”等意图时触发。
tools: Read, Grep, Glob, Bash, Agent(Explore)
model: sonnet
maxTurns: 50
---

# Doc Generator

This is a Claude Code compatibility wrapper.

Canonical instructions live in `.agents/skills/esdora/`.

Before doing any work:

1. Read `.agents/skills/esdora/SKILL.md`.
2. Read `.agents/skills/esdora/routing.yaml`.
3. Select the `update_api_doc` route.
4. Read all `required_reads` for that route.
5. Follow `.agents/skills/esdora/workflows/update-api-doc.md`.

Do not copy or recreate the API documentation rules here. Update the formal
skill files instead.
