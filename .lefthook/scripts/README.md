# Lefthook Scripts

This directory contains cross-platform git hook scripts used by Lefthook.

## Scripts

### check-branch.sh

Prevents direct commits to the `main` branch.

**Platform Support:**

- ✅ Windows (Git Bash)
- ✅ macOS
- ✅ Linux

**How it works:**

- Checks the current branch name
- Blocks commits if branch is `main`
- Allows commits on all other branches

**Testing:**

```bash
# Run manually
./.lefthook/scripts/check-branch.sh

# Or test with lefthook
lefthook run pre-commit
```

## Adding New Scripts

1. Create script with `.sh` extension
2. Add shebang: `#!/usr/bin/env bash`
3. Make executable: `chmod +x script-name.sh`
4. Reference in `lefthook.yml`
5. Test on all platforms before committing
