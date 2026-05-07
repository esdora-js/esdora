# Rule: Release Process

## Changeset Workflow

1. Make changes in feature branch
2. Run `pnpm changeset` to create changeset file
3. Commit changeset with code changes
4. Merge PR to main
5. `version.yml` workflow creates version PR
6. Merge version PR triggers `release.yml`
7. `release.yml` publishes to npm via OIDC

## Versioning

- Independent versioning per package
- Follows SemVer
- Changeset tracks which packages need version bumps

## CI/CD Pipelines

- **CI**: lint, typecheck, build, test, coverage
- **Version**: creates version bump PR
- **Release**: publishes to npm
- **Pages**: deploys VitePress docs

## npm Publishing

- Uses OIDC trusted publishing (no long-lived tokens)
- Provenance enabled

## Why

Changesets provide controlled version bumps. OIDC publishing eliminates token risks.

## How to Apply

- Always add changeset for user-facing changes
- Never manually bump versions in package.json
- Let CI handle publishing after version PR merge
