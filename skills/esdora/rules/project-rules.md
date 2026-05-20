# Project Rules

## Identity

- Name: Dora Pocket / esdora / 四次元口袋
- Type: TypeScript utility library monorepo
- Packages: `@esdora/kit`, `@esdora/color`, `@esdora/date`, `@esdora/biz`, `esdora`
- Philosophy: practical-first utilities, zero-dependency core, ESM-first with CJS output

## Workspace

This is a pnpm workspace orchestrated by turbo. Packages live under
`packages/*`; read `pnpm-workspace.yaml` and package `package.json` files as the
authoritative source for membership, scripts, dependencies, and exports.

## Commands

Use root scripts unless a workflow asks for a package-specific command:

- Install: `pnpm install`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Docs: `pnpm docs`

## Documentation Layers

- Human docs: `docs/`
- Formal AI project skill: `skills/esdora/`
- Compatibility shells: `AGENTS.md`, `CLAUDE.md`, package-level `AGENTS.md`,
  `.claude/agents/`, `.claude/skills/`, `.cursor/skills/`
- Legacy Claude rules: `.claude/rules/` remains as historical compatibility
  material; do not add new canonical rule bodies there.

## Verification

For broad changes, run:

```bash
pnpm typecheck && pnpm lint && pnpm test
```
