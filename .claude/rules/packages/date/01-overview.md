# @esdora/date Overview

## Identity

- Name: @esdora/date
- Type: library
- Path: packages/date
- Stack: vanilla TypeScript + date-fns

## Boundary

- Depends on @esdora/kit (workspace) and date-fns (external)
- Provides date manipulation utilities
- Subpath exports: `.`, `./fp`, `./locale`

## Verification

```bash
# Verify expected dependencies exist
cat packages/date/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); deps=d.get('dependencies',{}); print('PASS' if 'date-fns' in deps and '@esdora/kit' in deps else 'FAIL')"
```