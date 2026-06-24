# Color Package Boundary

## Role

Color utility package wrapping `culori`.

## Constraints

- Wraps `culori` as primary dependency
- Depends on `@esdora/kit` for shared utilities
- Other packages may depend on color

## Verification

Check `package.json` dependencies include `culori` and `@esdora/kit`:

```bash
jq '.dependencies' packages/color/package.json

pnpm why @esdora/color
```

## Rationale

Color package provides color manipulation built on `culori`, reusing
foundation utilities from `kit` instead of reimplementing them.
