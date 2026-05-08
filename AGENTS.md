# Dora Pocket (esdora) - AI Development Guide

You are working on Dora Pocket, a TypeScript utility library monorepo.
Follow the rules below when contributing to this codebase.

## Project Identity

- **Name**: Dora Pocket (四次元口袋)
- **Type**: TypeScript utility library monorepo
- **Packages**: @esdora/kit, @esdora/color, @esdora/date, @esdora/biz, esdora (meta)
- **Philosophy**: Practical-first, zero-dependency core, ESM + CJS dual output

## Quick Reference

| Task         | Command          |
| ------------ | ---------------- |
| Install deps | `pnpm install`   |
| Build all    | `pnpm build`     |
| Test all     | `pnpm test`      |
| Lint         | `pnpm lint`      |
| Typecheck    | `pnpm typecheck` |
| Dev mode     | `pnpm dev`       |
| Docs site    | `pnpm docs`      |

## Documentation Layers

- **Human API docs**: `docs/` (VitePress site at esdora.js.org)
- **AI dev guide**: `.claude/rules/` (see `_index.md` for the full rule index)
- **AI agents**: `.claude/agents/` (intent-driven specialized agents, e.g. `doc-generator`)
- **AI templates**: `.claude/templates/` (reusable prompt templates, e.g. `api-doc.md`)

## Package Overview

| Package       | Description                   | External Deps                 |
| ------------- | ----------------------------- | ----------------------------- |
| @esdora/kit   | Zero-dep utility functions    | none                          |
| @esdora/color | Color conversion/manipulation | culori                        |
| @esdora/date  | Date utilities                | date-fns                      |
| @esdora/biz   | Business tools (qs, atom-css) | qs, cva, clsx, tailwind-merge |
| esdora        | Meta package (re-exports all) | all workspace packages        |

@include .claude/rules/\_index.md
