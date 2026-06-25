# Package Scaffold Reference

Use this as the default scaffold for a new ordinary `@esdora/*` utility package.
Adapt package boundaries from `skills/esdora/rules/package-boundaries.md`.

## Files

```text
packages/{name}/
├── AGENTS.md
├── CLAUDE.md
├── .agents/
│   └── rules/
│       └── package-boundary.md
├── README.md
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── src/
    ├── index.ts
    └── {category}/
        └── {utility}/
            ├── index.test.ts
            └── index.ts

docs/packages/{name}/
├── index.md
└── usage.md
```

## package.json Baseline

Use existing package metadata fields consistently:

- `name`: `@esdora/{name}`
- `type`: `module`
- `version`: `0.0.0` for unpublished new packages unless instructed otherwise
- `author`, `license`, `funding`, `homepage`, `repository`, `bugs`: match
  existing packages
- `sideEffects`: `false`
- `main`, `module`, `types`: point to `dist/index.*`
- `files`: include `dist`
- scripts: `build`, `dev`, `prepublishOnly`, `test`, `test:coverage`,
  `test:ui`, `typecheck`

Use ESM + CJS export shape:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  }
}
```

## tsdown.config.ts Baseline

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
  },

])
```

## tsconfig.json Baseline

For packages that depend on `@esdora/kit`, include the kit path mapping. For
zero-dependency packages, use only the local `@` alias.

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "paths": {
      "@": ["./src"],
      "@esdora/kit": ["../packages/kit/src/index.ts"]
    },
    "resolveJsonModule": true,
    "strict": true,
    "strictNullChecks": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipDefaultLibCheck": true,
    "skipLibCheck": true
  }
}
```

## Source Pattern

- `src/index.ts` exports public categories or utilities.
- Category barrels use `export * from './{utility}'`.
- Utility modules expose `index.ts` and colocated `index.test.ts`.
- Tests use Vitest and assert public behavior, edge cases, and error behavior.

## Package AGENTS Overlay

Each package carries its own boundary rule under `.agents/rules/` and imports
it from a thin `AGENTS.md` (Codex entry) + `CLAUDE.md` (Claude entry). See
`references/instruction-loading.md` for the loading model.

`packages/{name}/AGENTS.md`:

```markdown
# @esdora/{name} Agent Overlay

Package: `@esdora/{name}`
Location: `packages/{name}/`

## Package Rules

@./.agents/rules/package-boundary.md
```

`packages/{name}/CLAUDE.md`:

```markdown
# {Name} Package

@./AGENTS.md
```

`packages/{name}/.agents/rules/package-boundary.md` holds the package-specific
boundary (role, dependency policy, verification). Also register the package in
the global table at `skills/esdora/rules/package-boundaries.md` — the
architecture check enforces consistency both ways (every `packages/*` must be
listed and carry `.agents/rules/`).
