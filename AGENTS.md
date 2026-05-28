# Dora Pocket (esdora) - Agent Entry

Dora Pocket is a TypeScript utility library monorepo. The canonical project
rules, workflows, and references live in `skills/esdora/`.

Formal docs live under `skills/`. Read `skills/esdora/SKILL.md` first, then
match the task through `skills/esdora/routing.yaml`.

Conflicts between loaded project instructions should resolve in this order:
explicit user request, `skills/esdora/`, this compatibility shell, legacy
tool-specific files.

<always-applicable>

## Always Read

Authoritative list lives in `skills/esdora/routing.yaml` under `always_read:`.
Load that file first, then read every path it lists.

## Core Project Facts

- Packages: `@esdora/kit`, `@esdora/color`, `@esdora/date`, `@esdora/biz`,
  `esdora`
- Build system: pnpm workspace, turbo, tsdown
- Test framework: Vitest
- Docs site: VitePress under `docs/`

</always-applicable>

<task-routing>

## Quick Routing

Task routes live in `skills/esdora/routing.yaml`.

For every non-trivial task:

1. Read `skills/esdora/routing.yaml`.
2. Match by `labels`, `trigger_examples`, scope, and task intent.
3. Read the route's `required_reads` plus Always Read files.
4. Follow the route's `workflow`.

If no route matches, use the `default:` node in `routing.yaml` as fallback.

</task-routing>

## Common Commands

| Task         | Command          |
| ------------ | ---------------- |
| Install deps | `pnpm install`   |
| Build all    | `pnpm build`     |
| Test all     | `pnpm test`      |
| Lint         | `pnpm lint`      |
| Typecheck    | `pnpm typecheck` |
| Dev mode     | `pnpm dev`       |
| Docs site    | `pnpm docs`      |

## Auto-Triggers

- New task in the same session: re-read `skills/esdora/SKILL.md`, then re-match
  `skills/esdora/routing.yaml`.
- Changes to code, docs, or AI instructions: run the matched workflow's closure
  checks before reporting completion.
- AI instruction changes: run
  `node skills/esdora/scripts/check-skill-architecture.mjs`.
