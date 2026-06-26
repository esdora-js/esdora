# Documentation Rules

## Scope

API reference docs live under `docs/packages/{pkg}/reference/{category}/{name}.md`.
Package guides and indexes live under `docs/packages/{pkg}/`.

## Source of Truth

Generate API docs from source and tests:

- Source: `packages/{pkg}/src/**`
- Tests: colocated `*.test.ts` files or package test directories
- Template: `.agents/skills/esdora/references/doc-template.md`

## Requirements

- Include frontmatter with `title` and `description`.
- Include runnable TypeScript examples with import statements.
- Use `// =>` output comments instead of `console.log`.
- Keep function signatures aligned with source.
- Public APIs need TSDoc in source before or alongside API docs.
- For overloaded APIs, keep overload comments concise for IDE hints and put the
  full explanation, examples, and remarks on the implementation signature.
- Prefer Chinese TSDoc for public APIs unless nearby source has a different
  established style.
- Link related source and test files.

Structure, complexity tiers, and optional sections (config tables, Mermaid,
performance) live in `doc-template.md`; do not duplicate them here.

## Verification

```bash
pnpm docs:build
```
