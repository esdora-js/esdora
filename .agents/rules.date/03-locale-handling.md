# Rule: Locale Handling

## Subpath Export

Locale is exported via `@esdora/date/locale` subpath:

```json
"./locale": {
  "import": { "types": "./dist/locale.d.mts", "default": "./dist/locale.mjs" },
  "require": { "types": "./dist/locale.d.cts", "default": "./dist/locale.cjs" }
}
```

## Pattern

- Re-export date-fns locales from `src/locale.ts`
- Do not bundle locales into main export (tree-shaking)

## Why

Separate locale export prevents bundle bloat. Users import only needed locales.

## How to Apply

- Add locale re-exports to `src/locale.ts`
- Ensure `package.json` exports field includes `./locale`
- Test locale subpath in `test/export.test.ts`
