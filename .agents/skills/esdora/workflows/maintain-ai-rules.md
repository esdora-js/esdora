# Maintain AI Rules Workflow

## Purpose

Use this workflow for changes to `AGENTS.md`, `CLAUDE.md`, `.agents/skills/esdora/`,
`.claude/agents/`, `.claude/skills/`, and package-level
`AGENTS.md` files.

Judge against the desired governance and quality standard. Treat current files
as evidence, not as a reason to preserve weaker rules when project intent
points to a stronger, reviewable constraint.

## Steps

1. Keep `.agents/skills/esdora/` as the canonical source of rules, workflows, and
   references.
2. Keep shells thin:
   - `AGENTS.md` routes to `.agents/skills/esdora/SKILL.md` and `routing.yaml`.
   - `CLAUDE.md` contains only `@AGENTS.md`.
   - `.claude/agents/*.md` may define Claude-specific tool/model metadata, but
     the body must route to this skill.
3. Keep task routes in `.agents/skills/esdora/routing.yaml`; do not copy route tables
   into shells.
4. Put constraints in `rules/`, procedures in `workflows/`, and background or
   templates in `references/`.
5. Run the verification trio:
   - `pnpm lint:skills` (static architecture)
   - `pnpm lint:skill-graph` (loading reachability graph)
   - `pnpm test:ai-load:dry` (harness self-check, zero cost; run real
     `pnpm test:ai-load` locally on demand)

## Done When

- No shell points to missing `.agents/rules.*` files.
- `SKILL.md` stays within the line budget.
- Route workflows and required reads exist.
- Claude registration entries route to the formal skill.
- `pnpm lint:skill-graph` and `pnpm test:ai-load:dry` pass.
