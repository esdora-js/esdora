# Dora Pocket (esdora) - Agent Entry

Dora Pocket is a TypeScript utility library monorepo. The canonical project
rules, workflows, and references live in `.agents/skills/esdora/`.

Read `.agents/skills/esdora/SKILL.md` first, then match the task through
`.agents/skills/esdora/routing.yaml`.

Conflicts between loaded project instructions should resolve in this order:
explicit user request, `.agents/skills/esdora/`, this compatibility shell, legacy
tool-specific files.

<always-applicable>

## Always Read

Authoritative list lives in `.agents/skills/esdora/routing.yaml` under `always_read:`.
Load that file first, then read every path it lists.

</always-applicable>

<task-routing>

## Quick Routing

Task routes and fallback behavior live in `.agents/skills/esdora/routing.yaml`. For
non-trivial work, select the matching route, read its `required_reads`, and
follow its `workflow`.

</task-routing>

## Auto-Triggers

- New task in the same session: re-read `.agents/skills/esdora/SKILL.md`, then re-match
  `.agents/skills/esdora/routing.yaml`.
- Changes to code, docs, or AI instructions: run the matched workflow's closure
  checks before reporting completion.
- AI instruction changes: run
  `node .agents/skills/esdora/scripts/check-skill-architecture.mjs`.
