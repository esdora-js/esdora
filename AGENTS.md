# Dora Pocket (esdora) - AI Development Guide

You are working on Dora Pocket, a TypeScript utility library monorepo.
Follow the rules below when contributing to this codebase.

## Project Identity

- **Name**: Dora Pocket (四次元口袋)
- **Type**: TypeScript utility library monorepo
- **Packages**: @esdora/kit, @esdora/color, @esdora/date, @esdora/biz, esdora (meta)
- **Philosophy**: Practical-first, zero-dependency core, ESM + CJS dual output

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Build all | `pnpm build` |
| Test all | `pnpm test` |
| Lint | `pnpm lint` |
| Typecheck | `pnpm typecheck` |
| Dev mode | `pnpm dev` |
| Docs site | `pnpm docs` |

## Documentation Layers

- **Human API docs**: `docs/` (VitePress site at esdora.js.org)
- **AI dev guide**: This file + `.agents/rules/`

## Package Overview

| Package | Version | Description | External Deps |
|---------|---------|-------------|---------------|
| @esdora/kit | 0.6.0 | Zero-dep utility functions | none |
| @esdora/color | 0.3.3 | Color conversion/manipulation | culori |
| @esdora/date | 0.1.5 | Date utilities | date-fns |
| @esdora/biz | 0.2.0 | Business tools (qs, atom-css) | qs, cva, clsx, tailwind-merge |
| esdora | 0.2.9 | Meta package (re-exports all) | all workspace packages |

@include .agents/rules/01-project-overview.md
@include .agents/rules/02-tech-stack.md
@include .agents/rules/03-monorepo-structure.md
@include .agents/rules/04-coding-standards.md
@include .agents/rules/05-testing-requirements.md
@include .agents/rules/06-git-workflow.md
@include .agents/rules/07-release-process.md
@include .agents/rules/08-documentation.md
