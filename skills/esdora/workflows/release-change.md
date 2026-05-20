# Release Change Workflow

## Steps

1. Identify whether the change affects a published package.
2. Add a changeset for user-facing package changes unless policy says it is not
   needed.
3. Run relevant tests, typecheck, and build.
4. Confirm package exports and docs match the released surface.

## Verification

```bash
pnpm build
pnpm typecheck
pnpm test
```
