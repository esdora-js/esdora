# Agent Behavior

## Context

Read formal skill files before acting on non-trivial work. Use
`skills/esdora/routing.yaml` to select only the workflow and references needed
for the current task.

## Editing

- Respect existing user changes. Do not revert unrelated work.
- Keep changes scoped to the requested task.
- Prefer edits that preserve established package patterns.
- Do not duplicate rule bodies across shells; compatibility files should route
  to `skills/esdora/`.

## Communication

- Respond in Simplified Chinese for project work.
- Keep English technical identifiers, code, logs, and file paths unchanged.
- Report verification commands and results at the end.

## Git

- Stage only files produced by the current task.
- Use Chinese commit messages when the user asks for a commit.
- Do not run destructive git operations unless the user explicitly requests
  them.
