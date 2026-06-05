# Documentation Rules

## Scope

API reference docs live under `docs/packages/{pkg}/reference/{category}/{name}.md`.
Package guides and indexes live under `docs/packages/{pkg}/`.

## Source of Truth

Generate API docs from source and tests:

- Source: `packages/{pkg}/src/**`
- Tests: colocated `*.test.ts` files or package test directories
- Template: `skills/esdora/references/doc-template.md`

## Requirements

- Include frontmatter with `title` and `description`.
- Include runnable TypeScript examples with import statements.
- Prefer examples extracted from tests.
- Use `// =>` output comments instead of `console.log`.
- Keep function signatures aligned with source.
- Public APIs need TSDoc in source before or alongside API docs.
- For overloaded APIs, keep overload comments concise for IDE hints and put the
  full explanation, examples, and remarks on the implementation signature.
- Prefer Chinese TSDoc for public APIs unless nearby source has a different
  established style.
- Link related source and test files.
- Add Mermaid flow diagrams only when the function has meaningful branching,
  recursion, state transitions, or multi-step processing.

## Verification

```bash
pnpm docs:build
```
