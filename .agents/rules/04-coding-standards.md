# Rule: Coding Standards

## Formatting

- Indentation: 2 spaces
- Semicolons: no
- Trailing commas: yes
- Follows @antfu/eslint-config defaults

## Naming

- Variables/functions: camelCase
- Classes/types: PascalCase
- Constants: camelCase (not UPPER_SNAKE)
- Files: kebab-case (e.g., `is-circular/index.ts`)
- Directories: kebab-case

## Import Order

1. `node:` prefixed built-ins
2. External dependencies
3. Internal workspace packages
4. Relative imports

## Code Patterns

- Barrel exports: `src/index.ts` aggregates category exports
- ESM-first with dual CJS support via tsdown
- Side effects: all packages declare `"sideEffects": false`
- Use `node:` prefix for Node.js built-ins

## Why

Consistent formatting reduces cognitive load. Kebab-case filenames work reliably across OSes.

## How to Apply

- Run `pnpm lint:fix` before committing (enforced by lefthook)
- Prefer named imports over default imports
- Keep files focused: one function per directory in kit/
