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
- **One public value export per leaf implementation file.** Each leaf
  implementation file (the file that actually declares the function/const/class,
  not a barrel) must export exactly one self-implemented public value symbol.
  This keeps the dependency graph clear, aids tree-shaking, and — critically for
  this repo — lets both the VitePress sidebar and the generated `llms.md` API
  index surface every public API as its own discoverable entry. This mirrors the
  convention used by modern TS utility libraries (es-toolkit, radash, remeda).
  - Exemptions (not violations): the symbol's directly-consumed companion types
    (`Options` / `Adjuster` / `Context` / `Result`) may live in the same file;
    function overloads (multiple signatures of one symbol) count as one;
    third-party re-exports (`export { parse } from 'qs'`) are a separate concern
    and don't count against the limit.
  - Excluded from the rule entirely: barrel files (`index.ts` that only
    re-export), pure-type files (`types.ts`), `helpers.ts`, `constant(s).ts`,
    `_internal/`, `experimental/`, and test files.
  - Enforced by `pnpm lint:exports` (`detectMultiValueExports` in
    `scripts/analyze-package-exports.mjs`), which hard-fails in CI.

## Implementation

- Prefer boring, small utilities with single responsibility.
- Follow nearby package patterns before introducing new abstractions.
- Avoid runtime dependencies in core utilities unless the package boundary allows
  them.
- Keep internal helpers under `_internal/` when they are not public API.
- Keep utilities pure: functions must not mutate caller-owned inputs, including
  objects, arrays, `Date` instances, maps, sets, and nested structures reachable
  from parameters.
- Do not add public APIs whose purpose is to mutate inputs. Return new values or
  copied structures instead.

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

Public functions that accept mutable reference inputs need tests proving the
input is unchanged after the call.
