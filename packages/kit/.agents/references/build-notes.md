# Kit Build & Export Notes

## Exports

Read `package.json` `exports` field for the authoritative export structure.

- **Main**: Stable APIs
- **Experimental** (`/experimental`): Unstable APIs with `_unstable_` prefix

## Build Configuration

Read `tsdown.config.ts` for complete build configuration.

### Special: IIFE Build

Kit includes a browser IIFE build for CDN usage without bundlers.
- Configuration: See `tsdown.config.ts` format array
- Use case: `<script src="..."></script>` direct inclusion
- Output: Check `tsdown.config.ts` for output path and global variable name

## Development

```bash
pnpm build      # Build all formats (ESM + CJS + IIFE)
pnpm test       # Run tests with 100% coverage threshold
pnpm typecheck  # Verify types
```

## Special Considerations

### Zero Dependencies

No runtime dependencies allowed. This constraint ensures:
- Kit can be used in any environment
- No version conflicts with consumer projects
- Minimal bundle size

### Experimental APIs

APIs marked as experimental must:
- Live under `src/experimental/`
- Use `_unstable_` function name prefix
- Include `@experimental` TSDoc tag
- Export only from `./experimental` subpath
- Not be imported by stable APIs

Example:

```typescript
/**
 * @experimental
 * This API is unstable and may change in future versions.
 */
export function _unstable_newFeature() {
  // implementation
}
```
