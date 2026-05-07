# Rule: Package Overview - @esdora/kit

## Identity

- **Package**: @esdora/kit
- **Version**: 0.6.0
- **Description**: Zero-dependency utility function library
- **Location**: packages/kit/

## Categories

| Category | Path | Examples |
|----------|------|----------|
| function | src/function/ | safe |
| is | src/is/ | isCircular, isEmail, isPhone |
| number | src/number/ | clamp |
| promise | src/promise/ | to |
| tree | src/tree/ | filter, map, getLeafPath |
| url | src/url/ | getQueryParams |
| experimental | src/experimental/ | getVersion |

## Exports

- Main: `@esdora/kit`
- Experimental: `@esdora/kit/experimental`

## Why

kit is the foundation of the entire ecosystem. Zero dependencies ensure no transitive bloat.

## How to Apply

- Place new functions in appropriate category directory
- Export from category index.ts, then from root index.ts
- Use `@esdora/kit/experimental` for unstable APIs
