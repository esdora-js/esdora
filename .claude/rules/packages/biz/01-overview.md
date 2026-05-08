# @esdora/biz Overview

## Identity

- Name: @esdora/biz
- Type: library (standalone business utilities)
- Path: packages/biz
- Stack: vanilla TypeScript + business-specific external deps

## Boundary

- **Does NOT depend on any workspace package** — standalone design
- External dependencies allowed as needed (see package.json for current set)
- Provides business-specific utilities (query string, atom-css, etc.)

## Verification

```bash
# Verify NO workspace dependencies
cat packages/biz/package.json | grep 'workspace:' && echo "FAIL" || echo "PASS"
```
