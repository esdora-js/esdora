# @esdora/kit Overview

## Identity

- Name: @esdora/kit
- Type: library (foundation)
- Path: packages/kit
- Stack: vanilla TypeScript

## Boundary

- **Zero runtime dependencies** — this is the foundation package
- Other workspace packages may depend on kit
- kit does NOT depend on any workspace package

## Exports

See packages/kit/package.json `exports` field for current subpath exports (authoritative source).

## Verification

```bash
# Verify no dependencies
cat packages/kit/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); exit(1 if d.get('dependencies') else 0)" && echo "PASS" || echo "FAIL"
```
