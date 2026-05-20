# Verify Package Workflow

## Steps

1. Identify the changed packages or docs area.
2. Select the narrowest meaningful command.
3. Run broader checks when exports, package boundaries, or shared config changed.
4. Report failures with the command, failing target, and next concrete fix.

## Common Commands

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm docs:build
```

## Done When

Relevant checks pass, or any skipped check is explicitly reported with the
reason.
