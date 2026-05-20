# Coding Standards

## Formatting

- Use 2 spaces.
- Follow the repository's existing ESLint and TypeScript formatting.
- Use trailing commas where existing code uses them.
- Do not add semicolons unless local code already requires them.

## Naming

- Variables and functions: `camelCase`
- Classes and types: `PascalCase`
- Files and folders: `kebab-case`
- Test files: colocated `*.test.ts` where that package already uses the pattern

## Imports and Exports

- Prefer named imports and exports.
- Use `node:` prefixes for Node.js built-ins.
- Keep each package's `src/index.ts` as the barrel export entry.
- Configure public subpath exports through the package `package.json`.

## Implementation

- Prefer boring, small utilities with single responsibility.
- Follow nearby package patterns before introducing new abstractions.
- Avoid runtime dependencies in core utilities unless the package boundary allows
  them.
- Keep internal helpers under `_internal/` when they are not public API.

## Tests

Public functions need focused tests covering normal cases, edge cases, and error
or boundary behavior. Mock external dependencies only when the dependency is not
part of the behavior being tested.
