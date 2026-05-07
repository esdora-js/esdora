# Rule: Zero Dependency (kit only)

## Constraint

@esdora/kit MUST NOT have any `dependencies` in package.json.

## Why

kit is the foundation. Adding dependencies forces them on all consumers, including those who only need basic utilities.

## How to Apply

- Check package.json has NO `dependencies` field
- If a function needs an external library:
  a. Implement it natively
  b. Move it to a different package
- Never add culori, date-fns, qs, or any external dep to kit

## Verification

```bash
cat packages/kit/package.json | grep '"dependencies"' && echo "FAIL" || echo "PASS"
```
