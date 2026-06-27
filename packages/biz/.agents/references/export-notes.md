# Biz Export & Usage Notes

## Subpath Exports

Read `package.json` `exports` field for the authoritative export structure.

### Implementation Context
- **Main**: Aggregates all utilities for convenient import and namespace compatibility
- **Atom CSS** (`/atom-css`): Combines `clsx` + `tailwind-merge` + `class-variance-authority` for Tailwind CSS className utilities
- **Query String** (`/qs`): Built on top of `qs` library for query string parsing

When adding new subpaths:
1. Add to `package.json` `exports`
2. Create corresponding file in `src/`
3. No need to update this document

## Implementation Guidelines
- Keep utilities standalone (no workspace deps)
- Use external libs where appropriate:
  - `qs` for query string parsing
  - `clsx` + `tailwind-merge` for className utilities
  - `class-variance-authority` for variant-based className composition

## Development
- `pnpm build`: Build all subpaths (main + atom-css + qs)
- `pnpm test`: Run tests with 100% coverage threshold
- `pnpm typecheck`: Verify types

## Special Considerations
- Each subpath should be independently usable
- Main export provides namespace-style access for backward compatibility
- Standalone constraint: verify no @esdora/* dependencies in package.json
