# Rule: Project Overview

## What This Is

Dora Pocket (esdora) is a TypeScript utility library monorepo. It provides practical tools for color processing, date manipulation, and business scenarios — supplementing rather than replacing libraries like Lodash.

## Core Values

- **Practical-first**: Only include tools solving real problems
- **Zero-dependency core**: @esdora/kit has zero dependencies
- **Type-safe**: Full TypeScript definitions, no `any`
- **Dual output**: ESM + CJS for all packages
- **100% coverage**: All packages enforce 100% test coverage
- **Co-located tests**: Tests live alongside implementation

## Why

These values keep the library lightweight and reliable. The zero-dependency rule for kit prevents bloat in consumer projects. Co-located tests keep context together.

## How to Apply

- When adding functions, ask: "Does this solve a real problem?"
- Never add dependencies to @esdora/kit
- Always include TypeScript types, never use `any`
- Write tests for every code path
