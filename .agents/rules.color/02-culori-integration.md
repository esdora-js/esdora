# Rule: Culori Integration

## Dependency

@esdora/color depends on `culori` for core color engine functionality.

## Integration Pattern

- Re-export from culori: `export * from 'culori'` in `src/index.ts`
- Wrap culori functions with Esdora-specific APIs when needed
- Add Esdora-specific types in `src/_internal/types.ts`

## Key Types

- `EsdoraHslColor`, `EsdoraOklchColor`, `EsdoraRgbColor` (from _internal/types.ts)

## Why

Culori provides battle-tested color math. Re-exporting gives users direct access to the engine while Esdora layers convenience on top.

## How to Apply

- Use culori functions for color math operations
- Export Esdora-specific convenience functions
- Keep internal helpers in `_internal/` (not exported)
- Re-export culori types when they match Esdora conventions
