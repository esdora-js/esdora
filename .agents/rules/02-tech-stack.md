# Rule: Tech Stack

## Versions

- Node.js: >= 22.16.0
- pnpm: >= 10.28.0 (managed via `packageManager` field)
- TypeScript: 5.x (strict mode)

## Build System

- **Build tool**: tsdown (Rollup-based)
- **Output**: Dual ESM (.mjs) + CJS (.cjs) with .d.mts/.d.cts types
- **Config**: Each package has `tsdown.config.ts`

## Monorepo Management

- **Package manager**: pnpm workspace
- **Task runner**: turbo (see turbo.json)
- **Dependency protocol**: `catalog:` for shared deps, `workspace:*` for internal

## Quality Tools

- **Lint**: ESLint with @antfu/eslint-config (type: 'lib')
- **Test**: vitest with v8 coverage
- **Git hooks**: lefthook

## Why

ESM-native tooling with CJS compatibility. tsdown provides smaller bundles. pnpm catalog prevents version drift.

## How to Apply

- Use `pnpm` for all package operations
- Run `pnpm build` before testing (turbo dependency)
- Follow ESLint auto-fixes (pre-commit hook enforces)
- Use `catalog:` for deps shared across packages
