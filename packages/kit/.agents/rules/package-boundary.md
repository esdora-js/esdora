# Kit Package Boundary

## Role

Foundation utility package.

## Constraints

- **Zero runtime dependencies** (devDependencies allowed)
- Must not depend on other @esdora workspace packages
- Other packages may depend on kit

## Verification

Check `package.json` dependencies section is empty:

```bash
# Verify no runtime dependencies
jq '.dependencies' packages/kit/package.json
# Should return: null or {}

# See which packages depend on kit
pnpm why @esdora/kit
```

## Rationale

As the foundation layer, kit must remain dependency-free to:
- Avoid circular dependencies
- Keep bundle size minimal for dependent packages
- Ensure maximum portability
