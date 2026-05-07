# Rule: Testing Requirements

## Coverage Thresholds (All Packages)

- branches: 100
- functions: 100
- lines: 100
- statements: 100

## Test Structure

- Co-located: `src/**/*.test.ts` alongside implementation
- Export tests: `test/export.test.ts` per package
- Snapshots: `test/exports/*.yaml` (YAML format)

## Test Patterns

- Framework: vitest (globals: describe, it, expect)
- Environment: node
- Use `vitest-package-exports` for export validation

## Required Test Types

1. **Unit tests**: Every function must have tests
2. **Export tests**: Every package validates exports match package.json
3. **Type tests**: Use `.test-d.ts` for TypeScript type testing
4. **Boundary tests**: null, undefined, empty values, edge cases

## Why

100% coverage ensures reliability. Export tests prevent package.json exports pointing to non-existent files.

## How to Apply

- Write tests before or alongside implementation
- Test boundary cases explicitly
- Run `pnpm test:coverage` to verify thresholds
