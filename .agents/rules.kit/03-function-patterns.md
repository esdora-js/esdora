# Rule: Function Patterns (kit)

## Directory Structure

```
src/[category]/[function-name]/
  index.ts          # Implementation
  index.test.ts     # Unit tests
```

## Function Requirements

- Pure functions only (no side effects)
- Full TypeScript types (no `any`)
- TSDoc comments in Chinese
- At least one `@example` in TSDoc
- Handle edge cases explicitly

## Experimental Functions

- Location: `src/experimental/`
- Export: `@esdora/kit/experimental` subpath only

## Why

Directory-per-function keeps code modular. Pure functions ensure predictability and testability.

## How to Apply

- Create function in appropriate category directory
- Add TSDoc with Chinese description and `@example`
- Write `index.test.ts` with 100% coverage
- Export from category index.ts, then root index.ts
