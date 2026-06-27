# Dora Pocket (esdora) - Agent Entry

Dora Pocket is a TypeScript utility library monorepo. The canonical project
rules, workflows, and references live in `.agents/skills/esdora/`.

## Always-on constraints

Inlined so agents that only read this file (e.g. ZCode, which does not expand
`@import` or scan the skill tree) start with the constitution in context.
Full rules live in `.agents/skills/esdora/rules/`.

- `@esdora/kit` must stay **zero runtime dependencies**.
- Utilities are **pure**: never mutate caller-owned inputs; return new values.
- Decide each new public API **stable or experimental** before export;
  experimental ones live under `src/experimental/` with `_unstable_` prefix.
- Respond in **Simplified Chinese** for project work; keep code/paths/IDs in
  English.
- Read `packages/<pkg>/.agents/rules/` before changing a package.
- Run the relevant quality gate (tests / typecheck / lint) before reporting a
  code change done.

Read `.agents/skills/esdora/SKILL.md` first, then match the task through
`.agents/skills/esdora/routing.yaml`. Conflicts resolve in order: explicit user
request, `.agents/skills/esdora/`, this shell, legacy files.

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
