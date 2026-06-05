# Implement Utility Workflow

## Steps

1. Identify the owning package and read nearby source, tests, exports, and
   package `package.json`.
2. Study at least three similar local patterns when available.
3. Decide whether the public API is stable or experimental before choosing its
   directory, name, TSDoc tags, and export entry.
4. Implement the utility in the package's existing style.
5. Add or update tests for public behavior, edge cases, and errors.
6. Update exports, export snapshots, TSDoc, and API docs when the public surface
   changes.
7. Run the narrowest relevant tests first, then broader checks when needed.

## Package Notes

- `kit`: no runtime dependencies.
- `color`: use `culori` for color math where appropriate.
- `date`: use `date-fns` for date operations where appropriate.
- `biz`: keep business utilities standalone.
- `esdora`: re-export only.

## Verification

Prefer package-scoped tests if available, otherwise run:

```bash
pnpm test
pnpm typecheck
```
