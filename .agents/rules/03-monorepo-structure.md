# Rule: Monorepo Structure

## Package Hierarchy

```
kit (zero deps)  ←  color, date, biz (each depends on kit)
                          ↓
                    esdora (aggregates all)
```

## Dependency Rules

| From | To | Rule |
|------|-----|------|
| color | kit | Allowed (workspace:*) |
| date | kit | Allowed (workspace:*) |
| biz | kit | Allowed (workspace:*) |
| esdora | all | Allowed (workspace:*) |
| kit | any external | **FORBIDDEN** |
| any | color/date/biz | Forbidden (no cross-deps) |

## Directory Structure

```
packages/[name]/
  src/
    [category]/
      [function-name]/
        index.ts          # Implementation
        index.test.ts     # Tests
    index.ts              # Barrel export
  test/                   # Export validation tests
  package.json
  tsdown.config.ts
  vitest.config.ts
```

## Why

Clear hierarchy prevents circular dependencies. kit as the zero-dep foundation ensures core utilities have no transitive deps.

## How to Apply

- Add new functions to appropriate category directories
- Export from `src/index.ts` via `export * from './category'`
- Define subpath exports in `package.json` exports field
- Never import between color/date/biz packages
