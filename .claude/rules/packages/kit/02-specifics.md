# @esdora/kit Specifics

## Constraint

@esdora/kit MUST NOT have any `dependencies` in package.json.

DevDependencies for build and test tooling are allowed.

## Why

kit is the foundation of the entire library. Adding runtime dependencies forces them on all consumers, including those who only need basic utilities.

## How to Apply

- Implement functionality natively when possible
- If a function needs an external library, move it to a different package (e.g., color, date, biz)
- Functions should be tree-shakable and small
- One utility per file preferred

## Verification

```bash
# Check dependencies field is empty or absent
cat packages/kit/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); deps=d.get('dependencies',{}); print('FAIL' if deps else 'PASS')"
```
