# Rule: Package Overview - @esdora/biz

## Identity

- **Package**: @esdora/biz
- **Description**: Business utilities (query strings, atom CSS)
- **Location**: packages/biz/

## Structure

| Path | Purpose |
|------|---------|
| src/atom-css/ | Atomic CSS utilities (cn, cva integration) |
| src/qs/ | Query string parsing/stringifying |

## Dependencies

- qs, class-variance-authority, clsx, tailwind-merge

## Exports

- Main: `@esdora/biz` (namespaced: biz.atomCss, biz.qs)
- Subpath: `@esdora/biz/atom-css`
- Subpath: `@esdora/biz/qs`

## Why

Subpath exports provide better tree-shaking than root namespace imports.

## How to Apply

- Prefer subpath imports: `import { cn } from '@esdora/biz/atom-css'`
- Root export is for backward compatibility only
