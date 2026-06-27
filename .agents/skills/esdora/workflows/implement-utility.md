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

## Package-Specific Rules

If the target package has `.agents/rules/`, read those files for:

- Dependency constraints (e.g., zero runtime dependencies, standalone requirement)
- Library integration patterns (e.g., which external libraries to use)
- Package role (e.g., meta-package that only re-exports)

Common package rules:

- Kit: `@packages/kit/.agents/rules/package-boundary.md`
- Color: `@packages/color/.agents/rules/package-boundary.md`
- Biz: `@packages/biz/.agents/rules/package-boundary.md`
- Date: `@packages/date/.agents/rules/package-boundary.md`
- Esdora: `@packages/esdora/.agents/rules/meta-package.md`

AI should automatically detect the target package and read its specific rules.

## Verification

Prefer package-scoped tests if available, otherwise run:

```bash
pnpm test
pnpm typecheck
```
