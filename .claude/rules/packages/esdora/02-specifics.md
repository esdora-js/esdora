# esdora (meta) Specifics

## Constraint

esdora is a meta package. It MUST NOT contain independent implementation.

## Why

The meta package provides a single entry point for consumers who want all Esdora utilities. Adding implementation here duplicates logic and creates maintenance burden.

## How to Apply

- Only re-export from workspace packages
- No new functions or logic in esdora
- Update re-exports when workspace packages add new public APIs

## Verification

```bash
# Check that esdora source only contains re-exports
grep -r "export" packages/esdora/src/ | grep -v "export.*from" && echo "WARNING: found non-re-export" || echo "PASS"
```
