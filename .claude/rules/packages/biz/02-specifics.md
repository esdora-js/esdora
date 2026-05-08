# @esdora/biz Specifics

## Dependency Strategy

@esdora/biz is a standalone business utilities package.

## Constraints

- Do NOT add `workspace:*` dependencies to biz
- External dependencies are allowed as needed — see package.json for the current dependency set (authoritative source)
- Subpath exports for modular imports (see package.json `exports` field)

## Why

biz dependencies are specific to business scenarios, not core utilities. Cross-package dependencies create coupling where none is needed.

## How to Apply

- Keep biz independent from workspace packages
- If a function needs kit utilities, duplicate it or move the function to kit
- External dependencies: add to package.json directly, no need to update rule files

## Verification

```bash
# Verify no workspace dependencies
cat packages/biz/package.json | grep 'workspace:' && echo "FAIL" || echo "PASS"
```
