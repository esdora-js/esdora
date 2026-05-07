# Rule: Package Overview - @esdora/date

## Identity

- **Package**: @esdora/date
- **Description**: Modern, immutable date utility library powered by date-fns
- **Location**: packages/date/

## Structure

| Path | Purpose |
|------|---------|
| src/constant/ | Date constants |
| src/convenience/ | Esdora-specific convenience functions |
| src/fp.ts | Functional programming exports |
| src/locale.ts | Locale exports |

## Dependencies

- date-fns (date engine)
- @esdora/kit (workspace:*)

## Exports

- Main: `@esdora/date`
- FP: `@esdora/date/fp`
- Locale: `@esdora/date/locale`

## Why

date-fns is the industry-standard date library. Esdora adds convenience functions on top.

## How to Apply

- Re-export date-fns functions from src/index.ts
- Add Esdora-specific functions in src/convenience/
- Support FP and locale subpath exports
