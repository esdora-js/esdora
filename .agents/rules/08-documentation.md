# Rule: Documentation

## Two-Layer System

| Layer | Location | Audience | Content |
|-------|----------|----------|---------|
| Human API docs | `docs/` | Developers | API reference, guides, examples |
| AI dev guide | `AGENTS.md` + `.agents/rules/` | AI tools | Architecture, workflows, standards |

## When to Update What

- **New function**: Add to `docs/api/[package]/`
- **New package**: Create package AGENTS.md
- **Workflow change**: Update `.agents/rules/`
- **Pattern change**: Update both docs/ and AGENTS.md

## docs/ Structure

- `docs/api/[package]/`: API reference
- `docs/guide/`: Getting started
- `docs/contributing/`: Contribution guides
- `docs/packages/`: Package overviews

## Cross-references

- AGENTS.md links to docs/ for API details
- docs/ does NOT link to AGENTS.md

## Why

Separation prevents bloat. Humans need examples; AI tools need constraints.

## How to Apply

- After adding a function, check if docs/ needs updating
- If you change a pattern, update AGENTS.md
- Keep AGENTS.md focused on "how to work with code"
