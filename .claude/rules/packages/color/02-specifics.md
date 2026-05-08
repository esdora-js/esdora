# @esdora/color Specifics

## Integration Strategy

@esdora/color builds on top of culori for color math operations.

## Constraints

- Re-export culori functions when they match Esdora conventions
- Wrap culori with Esdora-specific APIs for common use cases
- Add Esdora-specific types in `src/_internal/types.ts`
- Keep internal helpers in `_internal/` (not exported)

## Why

Culori provides battle-tested color math. Re-exporting gives users direct access while Esdora layers convenience on top.

## How to Apply

- Use culori for low-level color math operations
- Export convenience functions with Esdora naming conventions
- Internal types prefixed with Esdora (see _internal/types.ts for current naming)
- Do NOT re-export internal helpers

## Verification

```bash
# Verify culori is in dependencies
cat packages/color/package.json | grep '"culori"' && echo "PASS" || echo "FAIL"
```