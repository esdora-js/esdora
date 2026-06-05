# Release Change Workflow

## Steps

1. Identify whether the change affects a published package.
2. Classify the SemVer impact:
   - major: incompatible API changes or stable API removals
   - minor: backward-compatible public features
   - patch: backward-compatible bug fixes
3. Add a changeset for user-facing package changes unless policy says it is not
   needed.
4. For deprecations, keep the API available for at least one minor release,
   mark it with `@deprecated`, document the replacement, and only remove it in a
   major release.
5. Run relevant tests, typecheck, and build.
6. Confirm package exports, API docs, and changelog intent match the released
   surface.

## Verification

```bash
pnpm build
pnpm typecheck
pnpm test
```
