# Rule: Export Conventions (kit)

## Barrel Export Pattern

Each category has `src/[category]/index.ts` that re-exports all functions:

```typescript
export * from './is-circular'
export * from './is-email'
```

Root `src/index.ts` re-exports all categories:

```typescript
export * from './function'
export * from './is'
export * from './number'
export * from './promise'
export * from './tree'
export * from './url'
```

## package.json Exports

```json
{
  "exports": {
    ".": { "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" }, "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" } },
    "./experimental": { "import": { "types": "./dist/experimental.d.mts", "default": "./dist/experimental.mjs" }, "require": { "types": "./dist/experimental.d.cts", "default": "./dist/experimental.cjs" } }
  }
}
```

## Why

Barrel exports provide clean import paths. Dual ESM/CJS exports ensure broad compatibility.

## How to Apply

- Always export from category index.ts first
- Then export category from root index.ts
- Keep package.json exports in sync with src/ structure
