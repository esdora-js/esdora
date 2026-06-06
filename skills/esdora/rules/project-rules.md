# Project Rules

## Workspace

Read `pnpm-workspace.yaml` and package `package.json` files as the authoritative
source for workspace membership, scripts, dependencies, package metadata, and
exports. Do not maintain duplicated package inventories or dependency lists in
rules.

## Commands

Use root `package.json` scripts unless a workflow asks for a package-specific
command. When scripts change, prefer the current `package.json` over older docs
or generated notes.

## Documentation Layers

- Human docs: `docs/`
- Formal AI project skill: `skills/esdora/`
- Compatibility shells: `AGENTS.md` (Codex-native, also read by other tools),
  `CLAUDE.md`, package-level `AGENTS.md`, `.claude/agents/`, `.claude/skills/`

Compatibility shells must route to `skills/esdora/`; do not copy durable rule,
workflow, reference, package boundary, or command bodies into shells.

## Verification

For broad changes, select checks through `skills/esdora/rules/quality-gates.md`
and run the current scripts from root `package.json`.
