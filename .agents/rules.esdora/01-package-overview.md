# Rule: Package Overview - esdora (meta)

## Identity

- **Package**: esdora
- **Version**: 0.2.9
- **Description**: Meta package that aggregates all Esdora packages
- **Location**: packages/esdora/

## Dependencies

All workspace packages:
- @esdora/biz (workspace:*)
- @esdora/color (workspace:*)
- @esdora/date (workspace:*)
- @esdora/kit (workspace:*)

## Exports

- Main: `esdora` (namespaced: biz, color, date, kit)

## Why

Meta package provides a single install for all Esdora utilities.

## How to Apply

- Re-export all workspace packages from index.ts
- Do not add logic to this package
- Update dependencies when new packages are added
