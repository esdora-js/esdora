# Date Export & Usage Notes

## Subpath Exports

Read `package.json` `exports` field for the authoritative export structure.

### Implementation Context
- **Main**: Custom convenience functions + selected date-fns re-exports
- **Functional Programming** (`/fp`): Pure re-export of `date-fns/fp` (curried, data-last style)
  - Example: `pipe(date, addDays(7), format('yyyy-MM-dd'))`
- **Locale** (`/locale`): Pure re-export of `date-fns/locale` (i18n support)
  - Example: `import { zhCN, enUS } from '@esdora/date/locale'`

When adding new subpaths:
1. Add to `package.json` `exports`
2. Create corresponding file in `src/`
3. No need to update this document

## Implementation Guidelines
- Wrap date-fns for common patterns
- Keep date-fns API compatibility for wrapped functions
- Use date-fns types as foundation
- Add convenience functions that complement date-fns
- Maintain functional programming support via fp subpath

## Development
- `pnpm build`: Build all subpaths (main + fp + locale)
- `pnpm test`: Run tests with 100% coverage threshold
- `pnpm typecheck`: Verify types

## Special Considerations
- **fp subpath**: Pure re-export of date-fns/fp
  - Source: `src/fp.ts` → `export * from 'date-fns/fp'`
  - No custom logic, maintains date-fns fp API
- **locale subpath**: Pure re-export of date-fns/locale
  - Source: `src/locale.ts` → `export * from 'date-fns/locale'`
  - Provides all locale definitions for i18n
- Each subpath is independently usable
- Main export should not bloat with all date-fns functions
- Prefer selective re-exports in main, full re-exports in subpaths
