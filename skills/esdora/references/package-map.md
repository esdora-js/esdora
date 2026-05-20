# Package Map

| Package         | Path              | Role                 | Notes                                             |
| --------------- | ----------------- | -------------------- | ------------------------------------------------- |
| `@esdora/kit`   | `packages/kit`    | Foundation utilities | Must remain runtime dependency-free.              |
| `@esdora/color` | `packages/color`  | Color utilities      | Uses `culori` and may use `@esdora/kit`.          |
| `@esdora/date`  | `packages/date`   | Date utilities       | Uses `date-fns` and may use `@esdora/kit`.        |
| `@esdora/biz`   | `packages/biz`    | Business utilities   | Standalone package for business-oriented helpers. |
| `esdora`        | `packages/esdora` | Meta package         | Re-exports workspace packages only.               |

Read `pnpm-workspace.yaml` and package `package.json` files before making
architecture decisions; this map is an orientation aid, not the source of truth.

For new package scaffolding, use `skills/esdora/references/package-scaffold.md`.
