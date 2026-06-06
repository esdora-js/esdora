# Package Boundaries

## Layering

Read each package's `package.json` as the authoritative dependency source.

| Package         | Boundary                                                                   |
| --------------- | -------------------------------------------------------------------------- |
| `@esdora/kit`   | Foundation utility package. It must not have runtime dependencies.         |
| `@esdora/color` | Color utilities built around `culori` and shared kit utilities.            |
| `@esdora/date`  | Date utilities built around `date-fns` and shared kit utilities.           |
| `@esdora/biz`   | Standalone business utilities. It should not depend on workspace packages. |
| `esdora`        | Meta package. It only aggregates and re-exports workspace packages.        |

## Constraints

- Avoid circular dependencies between workspace packages.
- Keep `kit` dependency-free at runtime.
- Keep `biz` standalone unless a deliberate architecture change is requested.
- Keep `esdora` implementation-free; add new logic to the owning package and
  re-export it from the meta package.
- Use external dependencies where the package exists to wrap them (`color`,
  `date`, `biz`), not in `kit`.

## Verification

```bash
pnpm build
pnpm typecheck
```
