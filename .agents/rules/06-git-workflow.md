# Rule: Git Workflow

## Branch Naming

- Features: `feat/description`
- Fixes: `fix/description`
- Docs: `docs/description`

## Commit Convention

- Format: Conventional Commits (enforced by commitlint)
- Examples: `feat(kit): add isEmail validator`, `fix(color): correct hsl parsing`
- Scope: package name (kit, color, date, biz) or area (docs, ci)

## PR Workflow

1. Sync: `git checkout main && git pull upstream main --ff-only`
2. Branch: `git checkout -b feat/description`
3. Code + test
4. Commit with conventional format
5. Push and create PR
6. Use rebase (not merge) to sync with main

## Pre-commit Checks (lefthook)

- Branch name validation
- ESLint with auto-fix on staged files
- Commit message linting

## Why

Conventional commits enable automated changelog. Rebase keeps linear history.

## How to Apply

- Always branch from latest main
- Use `git rebase main` to sync, not `git merge main`
- Use `git push --force-with-lease` after rebase
