# @esdora/date Specifics

## Integration Strategy

@esdora/date builds on top of date-fns for date manipulation.

## Constraints

- Provide both standard and fp (functional programming) style exports via subpath exports
- Locale support via `./locale` subpath export
- Wrap date-fns with Esdora-specific convenience APIs

## Why

date-fns is a battle-tested date library. Esdora adds project-specific convenience and re-exports.

## How to Apply

- Use date-fns for core date operations
- Export convenience functions with Esdora conventions
- Maintain `./fp` subpath for functional programming style imports
- Maintain `./locale` subpath for locale-specific exports

## Verification

```bash
# Verify date-fns is in dependencies
cat packages/date/package.json | grep '"date-fns"' && echo "PASS" || echo "FAIL"
```
