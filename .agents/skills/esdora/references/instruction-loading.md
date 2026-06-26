# AI Instruction Loading

How project rules reach the agent's context, and where each rule belongs.

## Three loading conditions

| Condition            | Mechanism                                 | Loads when                       |
| -------------------- | ----------------------------------------- | -------------------------------- |
| Always               | `routing.yaml` `always_read`              | every task                       |
| Task (route)         | a route's `required_reads`                | task matches that route          |
| Location (directory) | `CLAUDE.md` / `AGENTS.md` `@import` chain | agent operates in that directory |

## Per-agent loading model

How each agent discovers the skill and expands references differs, and that
shapes which rules reliably reach context:

- **Claude Code**: auto-loads `CLAUDE.md` (not `AGENTS.md`), so `CLAUDE.md`
  stays a thin `@AGENTS.md` bridge. Expands `@import` recursively (≤5 levels),
  so package `.agents/rules/` enter context without producing a `Read` call.
- **Codex**: reads `AGENTS.md` natively, treats `@import` as plain text, and
  scans `$REPO_ROOT/.agents/skills/` to discover skills. Package rules load
  only if the agent reads them itself (typically via shell `cat` / `rg`).
- **ZCode**: reads the workspace `AGENTS.md` (does not merge across directory
  levels, does not recurse into child directories, does not expand `@import`).
  Skills are invoked explicitly via `$skill-name`, or imported from external
  Agent skill directories (it scans `.claude/skills/` and `.agents/skills/`
  as import sources). Loading therefore relies on `AGENTS.md` prose hints plus
  `$` invocation — directory scanning is not an automatic per-task load path.

A subdirectory `CLAUDE.md`/`AGENTS.md` loads only when the agent operates
inside that subdirectory — that is the location condition.

## Scope tiers (where a rule lives)

Put a rule in its **smallest applicable scope tier**. Physical location is the
loading condition: the deeper a rule lives, the more precisely it loads.

| Scope tier                    | Location                                                              | Loads when                 |
| ----------------------------- | --------------------------------------------------------------------- | -------------------------- |
| Cross-package / project-wide  | `.agents/skills/esdora/rules/` (`always_read` or a route's `required_reads`) | always / route match       |
| Whole package                 | `packages/<pkg>/.agents/rules/`                                       | operating in the package   |
| One category inside a package | `packages/<pkg>/src/<cat>/.agents/rules/`                             | operating in that category |

The root-level `.agents/skills/esdora/` (project-wide skill, the open
standard location scanned by Codex) is a distinct scope tier from the
package-level `packages/<pkg>/.agents/` (package-scoped rules). They do not
conflict — one is project-wide, the other is per-package.

Package-level rules still apply at the category level (directory loading
recurses upward), so a category directory only adds its own specifics — it
never re-declares package rules.

## Decision

- Only one package? → `packages/<pkg>/.agents/`.
- Cross-package or a project-wide convention? → `.agents/skills/esdora/rules/`,
  exposed via `always_read` (constitutional; keep it tiny) or a route's
  `required_reads` (conditional on task type).
- Only one category of tools inside a package? →
  `packages/<pkg>/src/<cat>/.agents/`.

`always_read` must stay minimal — project constitution only. Any domain
rule belongs in a route or a localized directory, never in `always_read`.

## Guards

`check-skill-architecture.mjs` enforces full coverage: every `.md` under a
package's or category's `.agents/{rules,references}/` must be `@import`'d
by that directory's `AGENTS.md`/`CLAUDE.md`. Adding a rule file without the
import fails `lint:skills` (and CI). `@import` target existence is checked
too, so a broken include chain fails loudly.
