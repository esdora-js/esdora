# Package Map

| Package         | Path              | Role                 | Notes                              |
| --------------- | ----------------- | -------------------- | ---------------------------------- |
| `@esdora/kit`   | `packages/kit`    | Foundation utilities | Core TypeScript utilities.         |
| `@esdora/color` | `packages/color`  | Color utilities      | Color conversion and manipulation. |
| `@esdora/date`  | `packages/date`   | Date utilities       | Date and time utilities.           |
| `@esdora/biz`   | `packages/biz`    | Business utilities   | Business-oriented helpers.         |
| `esdora`        | `packages/esdora` | Meta package         | Aggregate package.                 |

Read `pnpm-workspace.yaml` and package `package.json` files before making
architecture decisions; this map is an orientation aid, not the source of truth
for package membership, dependencies, exports, or boundary constraints. Use
`skills/esdora/rules/package-boundaries.md` for boundary rules.

For new package scaffolding, use `skills/esdora/references/package-scaffold.md`.
