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
