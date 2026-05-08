# Quality Gates

## Pre-Commit Checks (lefthook)

Git hooks managed by lefthook. See lefthook.yml for full config.

## Required Checks Before Commit

- TypeScript type checking: `pnpm typecheck`
- Linting: `pnpm lint`
- Tests: `pnpm test`

## CI Checks

All of the above run in CI via GitHub Actions.

## Verification

```bash
# Run full quality gate
pnpm typecheck && pnpm lint && pnpm test
```
