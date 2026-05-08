# Git Workflow

## Commit Convention

- Uses commitlint with config-conventional
- Commit via: `pnpm commit` (czg / commitizen)
- Commit message language: 中文

## Release Process

- Changesets for versioning and changelog
- `pnpm ci:publish` publishes with provenance

## Branch Strategy

- Main development on `main` branch
- Feature branches for development
- Changeset entries required for versioned releases

## Verification

```bash
# Check commit message format
npx commitlint --from HEAD~1 --to HEAD --verbose
```
