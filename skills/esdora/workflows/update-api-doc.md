# Update API Doc Workflow

## Steps

1. Resolve the package, category, and function from the user request.
2. Read the implementation and related tests.
3. Read `skills/esdora/references/doc-template.md`.
4. Check source TSDoc for public API notes, overload behavior, experimental or
   deprecated status, and examples that should be reflected in docs.
5. Determine the function complexity:
   - simple: basic usage, signature, parameters, return value, notes
   - medium: include config objects, edge cases, and meaningful examples
   - complex: include runtime logic, Mermaid flow when useful, performance or
     compatibility notes
6. Write docs under `docs/packages/{pkg}/reference/{category}/{function}.md`.
7. Verify links to source and tests.

## Batch Mode

When asked to update many APIs, process at most five functions per batch unless
the user explicitly asks for a larger sweep.

## Verification

```bash
pnpm docs:build
```
