# Workspace Rules

## Structure

pnpm workspace monorepo with turbo orchestration.
Packages located at: `packages/*` (see pnpm-workspace.yaml for full glob patterns).

## Cross-Package Dependencies

- Workspace packages use `workspace:*` protocol in dependencies
- `catalog:` protocol for shared devDependencies (managed in pnpm-workspace.yaml)
- Root package.json manages shared devDependencies and workspace scripts

## Dependency Direction

Workspace packages form a layered dependency structure.
Read each package's package.json to determine current dependency relationships (authoritative source).

### Layer Principles

| Layer      | Characteristic                                             |
| ---------- | ---------------------------------------------------------- |
| Foundation | Zero runtime dependencies; other packages may depend on it |
| Library    | Depends on foundation layer + external libraries           |
| Standalone | No workspace dependencies; self-contained                  |
| Meta       | Aggregates/re-exports from multiple workspace packages     |

### Constraints

- Foundation packages MUST NOT depend on any workspace package
- Standalone packages do NOT depend on workspace packages
- Meta packages aggregate workspace packages (no independent implementation)
- Circular dependencies between any packages are prohibited

### New Package Placement

When adding a new package, determine its layer by reading its package.json:

1. If it has `workspace:*` dependencies → Library or Meta layer
2. If it has zero workspace dependencies → Foundation or Standalone layer
3. If it re-exports from multiple workspace packages → Meta layer

## Verification

```bash
# Check for circular dependencies in workspace
pnpm dlx madge --circular packages/*/src/index.ts 2>/dev/null || echo "No circular deps detected (or madge not installed)"
```
