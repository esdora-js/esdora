# esdora (meta) Overview

## Identity

- Name: esdora
- Type: meta package (aggregator)
- Path: packages/esdora
- Stack: re-exports only

## Boundary

- Aggregates all workspace packages via re-exports
- No independent implementation — only re-exports
- Depends on all workspace packages

## Verification

```bash
# Verify it depends on all workspace packages
cat packages/esdora/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); deps=d.get('dependencies',{}); pkgs=['@esdora/kit','@esdora/color','@esdora/date','@esdora/biz']; print('PASS' if all(p in deps for p in pkgs) else 'FAIL')"
```