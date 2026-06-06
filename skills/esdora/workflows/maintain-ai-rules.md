# Maintain AI Rules Workflow

## Purpose

Use this workflow for changes to `AGENTS.md`, `CLAUDE.md`, `skills/esdora/`,
`.claude/agents/`, `.claude/skills/`, and package-level
`AGENTS.md` files.

## Steps

1. Keep `skills/esdora/` as the canonical source of rules, workflows, and
   references.
2. Keep shells thin:
   - `AGENTS.md` routes to `skills/esdora/SKILL.md` and `routing.yaml`.
   - `CLAUDE.md` contains only `@AGENTS.md`.
   - `.claude/agents/*.md` may define Claude-specific tool/model metadata, but
     the body must route to this skill.
3. Keep task routes in `skills/esdora/routing.yaml`; do not copy route tables
   into shells.
4. Put constraints in `rules/`, procedures in `workflows/`, and background or
   templates in `references/`.
5. Run `node skills/esdora/scripts/check-skill-architecture.mjs`.

## Done When

- No shell points to missing `.agents/rules.*` files.
- `SKILL.md` stays within the line budget.
- Route workflows and required reads exist.
- Claude registration entries route to the formal skill.
