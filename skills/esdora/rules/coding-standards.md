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
- Keep utilities pure where practical: do not mutate caller-owned inputs unless
  the API explicitly documents mutation as its purpose.

## Public API Stability

- Decide whether a new public API is stable or experimental before exporting it.
- Experimental APIs must live under `src/experimental/`, use an `_unstable_`
  function name prefix, include `@experimental` in TSDoc, and export only from
  the package's experimental entry.
- Stable APIs should live in the appropriate feature category and avoid
  `_unstable_` names or `@experimental` tags.
- Graduating an experimental API requires moving it to the stable category,
  removing `_unstable_` and `@experimental`, updating exports, docs, tests, and
  release notes.

## Tests

Public functions need focused tests covering normal cases, edge cases, and error
or boundary behavior. Mock external dependencies only when the dependency is not
part of the behavior being tested.
