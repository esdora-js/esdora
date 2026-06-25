# AI Instruction Loading

How project rules reach the agent's context, and where each rule belongs.

## Three loading conditions

| Condition | Mechanism | Loads when |
| --- | --- | --- |
| Always | `routing.yaml` `always_read` | every task |
| Task (route) | a route's `required_reads` | task matches that route |
| Location (directory) | `CLAUDE.md` / `AGENTS.md` `@import` chain | agent operates in that directory |

Claude Code expands `@import` recursively (≤5 levels) when it loads a
`CLAUDE.md`. Codex reads `AGENTS.md` but treats `@import` as plain text, so
the agent reads the referenced file itself. A subdirectory
`CLAUDE.md`/`AGENTS.md` loads only when the agent operates inside that
subdirectory — that is the location condition.

## Where a rule belongs (by scope)

Put a rule in its **smallest applicable scope**. Physical location is the
loading condition: the deeper a rule lives, the more precisely it loads.

| Scope | Location | Loads when |
| --- | --- | --- |
| Cross-package / project-wide | `skills/esdora/rules/` (`always_read` or a route's `required_reads`) | always / route match |
| Whole package | `packages/<pkg>/.agents/rules/` | operating in the package |
| One category inside a package | `packages/<pkg>/src/<cat>/.agents/rules/` | operating in that category |

Package-level rules still apply at the category level (directory loading
recurses upward), so a category directory only adds its own specifics — it
never re-declares package rules.

## Decision

- Only one package? → `packages/<pkg>/.agents/`.
- Cross-package or a project-wide convention? → `skills/esdora/rules/`,
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
