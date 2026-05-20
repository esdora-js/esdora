# Quality Gates

## Required Checks

Use the smallest check set that covers the changed surface:

- Type checking: `pnpm typecheck`
- Linting: `pnpm lint`
- Tests: `pnpm test`
- Build: `pnpm build`
- Docs build: `pnpm docs:build`

## Selection

- Code changes: run tests relevant to the package, then broader checks if the
  change touches shared exports or cross-package behavior.
- Public API changes: run typecheck, tests, and build.
- Docs changes: run docs build when VitePress structure or Markdown syntax might
  be affected.
- AI instruction changes: run the skill architecture check script.

## Release Safety

Versioned changes need a changeset unless the change is internal-only,
documentation-only, or explicitly excluded by project release policy.
