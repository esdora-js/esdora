# Gotchas

## Package AGENTS Overlays Stay Thin

Package-level `AGENTS.md` / `CLAUDE.md` must stay thin shells — they only
`@import` the package's `.agents/rules/`. Do not copy rule bodies into them.
(History: overlays once referenced a non-existent `../../.agents/rules.*`; the
full-coverage check in `check-skill-architecture.mjs` now enforces that every
`.agents/{rules,references}/*.md` is `@import`'d by its package shell.)

## Duplicate AI Rule Bodies

Long `.claude/agents/*.md` files are hard to keep aligned with Codex and other
harnesses. Store durable bodies in `.agents/skills/esdora/`; keep Claude agents as
thin wrappers with tool metadata only.

## Enumerating Dependencies in Rules

Do not maintain dependency allowlists in rule files. Read `package.json` as the
source of truth and keep rules focused on boundary strategy.

## AI Instruction Loading Verification

Scope tiers (where a rule lives) and loading conditions (when it loads) are
documented in `references/instruction-loading.md`.

Package rules load differently per agent tool:

- Claude Code: `@import` in `CLAUDE.md` / `AGENTS.md` expands recursively, so
  package `.agents/rules/` enter context without producing a `Read` call.
- Codex: `@import` is plain text; package rules load only if the agent reads
  them itself (typically via shell `cat` / `rg`). It does scan
  `$REPO_ROOT/.agents/skills/` to discover skills natively.
- ZCode: only auto-injects the workspace `AGENTS.md` — no `@import` expansion,
  no child-directory recursion, no in-repo skill scanning. This is why
  `AGENTS.md` inlines the always-on constraints: it is the sole context ZCode
  receives automatically. Project skills are NOT auto-discovered; to call this
  skill via `$esdora`, symlink it into the global skill dir:
  ```bash
  ln -s "$PWD/.agents/skills/esdora" "$HOME/.agents/skills/esdora"
  ```
  Then `$esdora` is available project-wide (the symlink resolves to the repo
  copy, so edits track the repo). Without this, ZCode relies entirely on the
  `AGENTS.md` prose hints to read skill files on demand.

Three verification commands cover this from cheap to expensive:

- `pnpm run lint:skills` (CI): static skill-architecture checks.
- `pnpm run lint:skill-graph` (CI): static per-tool loading reachability —
  proves the `@import` chain is intact for Claude and quantifies the Codex gap.
- `pnpm run test:ai-load` (local only): drives real `claude` / `codex` in an
  isolated git worktree and asserts the expected rules/skills were loaded.
  Burns API and mutates files (worktree-scoped). Use `--dry-run` for a no-cost
  self-check, `--case <id>` / `--tool claude|codex` to scope, `--no-strict` to
  skip file-mutation checks.

## Verifying a specific agent actually loads the skill

The static commands above prove reachability, not that a real agent run pulls
the skill into context. To confirm empirically, from cheapest to heaviest:

1. **One-shot JSONL probe** (single agent call, lowest cost, most direct).
   Drive the agent once with JSON output, then inspect which skill files it
   actually read via shell. Codex:
   ```bash
   codex exec "<task>" --sandbox read-only --skip-git-repo-check --json \
     > /tmp/codex.jsonl 2>&1
   grep -oE '"command":"[^"]*"' /tmp/codex.jsonl | grep -iE 'cat.*\.agents/skills'
   ```
   Claude Code:
   ```bash
   claude -p "<task>" --output-format stream-json --verbose \
     > /tmp/claude.jsonl 2>&1
   grep -oE '"file_path":"[^"]*"' /tmp/claude.jsonl | grep '\.agents/skills'
   ```
   A populated list means the agent found and read the skill tree. This is
   the simplest way to answer "does agent X load the skill?".

2. **Structured harness assertion** (`pnpm test:ai-load --case A1 --tool codex`):
   runs N isolated worktree sessions and asserts `expect_reads` for each. The
   default `n: 5` is heavy (one worktree install per session); scope to one
   case and add `--no-strict` for a faster check.

3. **Static reachability** (`pnpm lint:skill-graph`): proves the `@import` /
   hint path exists, but does NOT prove a real agent reads it. Treat as a
   necessary-but-insufficient check; combine with method 1 or 2.

Note: discovering the skill (Codex indexing `.agents/skills/esdora/SKILL.md`
frontmatter) is separate from reading its body. The full `SKILL.md` and
`routing.yaml` are still loaded by the agent following prose hints — the
`--json` probe in method 1 captures that follow-on read behavior.
