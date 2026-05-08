# Shared Tech Stack

## TypeScript

- Version: see root package.json devDependencies (catalog)
- Config: each package has its own tsconfig.json
- Output: ESM (`type: "module"`) with CJS compatibility via tsdown

## Build System

- tsdown for package builds
- turbo for orchestration
- Build outputs to `dist/` (gitignored)

## Testing

- Vitest for unit tests
- Coverage via @vitest/coverage-v8
- Test files: `*.test.ts` alongside source files or in `test/` directory

## Linting

- ESLint with @antfu/eslint-config
- Run: `pnpm lint` (with cache)
- Fix: `pnpm lint:fix`

## Package Exports

- Each package defines `exports` in package.json
- Subpath exports for modular imports (e.g., `@esdora/date/fp`)

## Verification

```bash
# Verify all packages build successfully
pnpm build

# Verify types across workspace
pnpm typecheck
```
