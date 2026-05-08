# @esdora/color Overview

## Identity

- Name: @esdora/color
- Type: library
- Path: packages/color
- Stack: vanilla TypeScript + culori

## Boundary

- Depends on @esdora/kit (workspace) and culori (external)
- Provides color conversion and manipulation utilities
- Re-exports culori functionality with Esdora-specific APIs

## Verification

```bash
# Verify expected dependencies exist
cat packages/color/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); deps=d.get('dependencies',{}); print('PASS' if 'culori' in deps and '@esdora/kit' in deps else 'FAIL')"
```