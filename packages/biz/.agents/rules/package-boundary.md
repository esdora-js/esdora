# Biz Package Boundary

## Role

Business utility package.

## Constraints

- **Standalone** (no @esdora workspace dependencies)
- May use external npm packages
- Other packages should not depend on biz

## Verification

Check `package.json` has no @esdora dependencies:

```bash
# Verify no workspace dependencies
jq '.dependencies | to_entries | map(select(.key | startswith("@esdora")))' packages/biz/package.json
# Should return: []
```

## Rationale

Biz utilities are business-domain specific and should remain standalone to:
- Avoid coupling business logic with foundation utilities
- Keep clear separation of concerns
- Allow independent versioning
