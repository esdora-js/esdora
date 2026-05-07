# Rule: Subpath Exports (biz)

## Export Structure

```json
{
  "exports": {
    ".": { "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" }, "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" } },
    "./atom-css": { "import": { "types": "./dist/atom-css/index.d.mts", "default": "./dist/atom-css/index.mjs" }, "require": { "types": "./dist/atom-css/index.d.cts", "default": "./dist/atom-css/index.cjs" } },
    "./qs": { "import": { "types": "./dist/qs/index.d.mts", "default": "./dist/qs/index.mjs" }, "require": { "types": "./dist/qs/index.d.cts", "default": "./dist/qs/index.cjs" } }
  }
}
```

## Directory-to-Export Mapping

| Source | Export Path | Output |
|--------|-------------|--------|
| src/atom-css/index.ts | @esdora/biz/atom-css | dist/atom-css/index.mjs |
| src/qs/index.ts | @esdora/biz/qs | dist/qs/index.mjs |

## Why

Subpath exports enable tree-shaking. Users import only what they need.

## How to Apply

- Add new submodules as directories under src/
- Update package.json exports field
- Ensure tsdown.config.ts handles subpath builds
- Add export tests for new subpaths
