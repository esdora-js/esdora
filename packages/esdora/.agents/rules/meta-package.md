# Esdora Meta Package

## Role

Aggregation meta-package.

## Constraints

- **Zero implementation** (only re-exports)
- Depends on other @esdora packages
- 80% test coverage threshold (lower than individual packages)

## Verification

```bash
# Verify esdora only re-exports
cat packages/esdora/src/index.ts
# Should only contain export statements

# Check dependencies are @esdora packages
jq '.dependencies | keys | map(select(startswith("@esdora")))' packages/esdora/package.json
```

## Rationale

As a meta-package, esdora:
- Provides convenient single-import access to all utilities
- Has no implementation of its own
- Lower coverage threshold acceptable since it only re-exports
