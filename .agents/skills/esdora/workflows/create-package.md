# Create Package Workflow

## Purpose

Use this workflow when the user asks to create a new `@esdora/*` workspace
package that should follow this repository's package, build, test, docs, and AI
overlay conventions.

## Inputs to Resolve

Before writing files, resolve these fields from the user request or ask a short
clarifying question:

- Package name, for example `@esdora/string`.
- Package role: foundation, library wrapper, standalone business/domain package,
  or meta package.
- Runtime dependency policy: zero dependency, workspace dependency on `kit`,
  external library wrapper, or standalone external dependencies.
- Initial public API: empty placeholder, first utility function, or re-export
  surface.

## Steps

1. Confirm the package name is kebab-case under `packages/{name}` and does not
   already exist.
2. Choose the closest existing package template:
   - `color` or `date` for ordinary library packages.
   - `biz` for standalone business/domain packages with subpath exports.
   - `kit` only for foundation-package constraints, not for its IIFE build.
   - `esdora` only for meta packages.
3. Create the package files listed in
   `.agents/skills/esdora/references/package-scaffold.md`.
4. Configure `package.json` exports for ESM + CJS dual output and
   `"sideEffects": false`.
5. Add `tsdown.config.ts`, `tsconfig.json`, `src/index.ts`, and an initial test.
6. Add the package AI overlay per `package-scaffold.md`: `AGENTS.md` +
   `CLAUDE.md` thin shells and `.agents/rules/package-boundary.md` with the
   package-specific boundary (role, dependency policy, verification).
7. Register the package in the `.agents/skills/esdora/rules/package-boundaries.md`
   table — one row: `` `@esdora/{name}` `` + a one-line boundary. The
   architecture check requires every `packages/*` to be listed and to carry
   `.agents/rules/`.
8. Add docs stubs under `docs/packages/{name}/`.
9. If the new package should be included by the `esdora` meta package, update
   `packages/esdora/package.json` dependencies and `packages/esdora/index.ts`.
10. Update any package docs index or navigation only after checking the existing
    VitePress config and docs structure.
11. Add a changeset if the package is intended to be published.

## Done When

- The package appears under `packages/{name}` and is matched by
  `pnpm-workspace.yaml`.
- `pnpm -C packages/{name} build` passes.
- `pnpm -C packages/{name} typecheck` passes when the package has that script.
- `pnpm -C packages/{name} test` passes when tests exist.
- `pnpm lint:skills` still passes if AI overlays changed.
- `pnpm lint:skill-graph` passes if AI overlays changed (new packages alter the
  loading graph).

For broad package creation, also run:

```bash
pnpm build
pnpm typecheck
pnpm test
```
