# Rule: date-fns Integration

## Dependency

@esdora/date depends on `date-fns` for core date functionality.

## Integration Pattern

- Re-export from date-fns: `export * from 'date-fns'` in `src/index.ts`
- Add Esdora-specific functions in `src/convenience/`
- FP utilities in `src/fp.ts`
- Locale exports in `src/locale.ts`

## Esdora-Specific Functions

- `analyzeTimeRange` (in src/convenience/)
- Add new convenience functions here, not by modifying date-fns

## Why

date-fns provides comprehensive date manipulation. Re-exporting gives users full access while Esdora layers convenience on top.

## How to Apply

- Use date-fns for core date operations
- Add Esdora-specific convenience functions in src/convenience/
- Export FP variants via src/fp.ts
- Export locales via src/locale.ts
