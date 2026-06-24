# Gotchas

## Broken Package AGENTS Includes

Package-level `AGENTS.md` files previously referenced `../../.agents/rules.*`,
but this project did not contain a `.agents/` directory. Keep package-level
entries as thin overlays and route canonical rules through `skills/esdora/`.

## Duplicate AI Rule Bodies

Long `.claude/agents/*.md` files are hard to keep aligned with Codex and other
harnesses. Store durable bodies in `skills/esdora/`; keep Claude agents as
thin wrappers with tool metadata only.

## Enumerating Dependencies in Rules

Do not maintain dependency allowlists in rule files. Read `package.json` as the
source of truth and keep rules focused on boundary strategy.

## AI Instruction Loading Verification

Package rules load differently per agent tool:

- Claude Code: `@import` in `CLAUDE.md` / `AGENTS.md` expands recursively, so
  package `.agents/rules/` enter context without producing a `Read` call.
- Codex: `@import` is plain text; package rules load only if the agent reads
  them itself (typically via shell `cat` / `rg`).

Three verification commands cover this from cheap to expensive:

- `pnpm run lint:skills` (CI): static skill-architecture checks.
- `pnpm run lint:skill-graph` (CI): static per-tool loading reachability —
  proves the `@import` chain is intact for Claude and quantifies the Codex gap.
- `pnpm run test:ai-load` (local only): drives real `claude` / `codex` in an
  isolated git worktree and asserts the expected rules/skills were loaded.
  Burns API and mutates files (worktree-scoped). Use `--dry-run` for a no-cost
  self-check, `--case <id>` / `--tool claude|codex` to scope, `--no-strict` to
  skip file-mutation checks.
