# Rule: Dependency Rules (biz)

## Allowed External Dependencies

| Package | Purpose |
|---------|---------|
| qs | Query string parsing/stringifying |
| class-variance-authority | Component variant management |
| clsx | Conditional className utility |
| tailwind-merge | Tailwind class conflict resolution |

## No Workspace Dependencies

@esdora/biz does NOT depend on @esdora/kit or other workspace packages.

## Why

biz is a standalone business utilities package. Its dependencies are specific to business scenarios, not core utilities.

## How to Apply

- Only use the listed external dependencies
- Do not add workspace:* dependencies to biz
- If a function needs kit utilities, duplicate it or move the function to kit
