# Phase 1: docs-prepare - Parameter Validation and File Grouping

Prepare documentation generation workflow by validating parameters, verifying file existence, inferring output paths, and grouping files for parallel execution.

## Usage

```bash
/workflow:tools:docs-prepare \
  --session "WFS-docs-1732589200" \
  --files "path1.ts,path2.ts,..." \
  --type api \
  [--output "docs/packages/[package]/reference/"] \
  [--ai-model codex] \
  [--skip-type-gen] \
  [--parallel 3]
```

## Parameters

- `--session`: Workflow session ID (required, format: WFS-docs-[timestamp])
- `--files`: Source file paths, comma-separated (required)
- `--type`: Document type (required, enum: api|architecture|guide|best-practices|contribution)
- `--output`: Output directory (optional, auto-inferred if not provided)
- `--ai-model`: AI model selection (optional, default: codex, enum: codex|gemini)
- `--skip-type-gen`: Skip TypeScript type declaration generation (optional, boolean)
- `--parallel`: Max concurrent generators (optional, default: 3, range: 1-5)

---

## Execution Tasks

### Function 1: validate_parameters - Parameter Validation

Validate all CLI parameters against schema constraints.

**Validation Rules**:

1. **Required Parameters**
   - `--session`: Must be provided, format: `WFS-docs-[timestamp]`
   - `--files`: Must be provided, non-empty string
   - `--type`: Must be provided, must be in enum [api, architecture, guide, best-practices, contribution]

2. **Optional Parameters with Defaults**
   - `--output`: If not provided, will be inferred in Function 3
   - `--ai-model`: Default "codex", must be in enum [codex, gemini]
   - `--skip-type-gen`: Default false, boolean flag
   - `--parallel`: Default 3, must be integer in range [1, 5]

3. **Enum Validation**
   - `--type` valid values: api, architecture, guide, best-practices, contribution
   - `--ai-model` valid values: codex, gemini

4. **Range Validation**
   - `--parallel`: If < 1 or > 5, warn and clamp to valid range [1, 5]

**Error Handling**:

```bash
# Missing required parameter
if [ -z "$files" ] || [ -z "$type" ]; then
  echo "Error: Missing required parameter"
  echo "Usage: /workflow:tools:docs-prepare --session <session-id> --files <paths> --type <type>"
  echo "Required: --files, --type"
  exit 1
fi

# Invalid enum value for --type
if [[ ! "$type" =~ ^(api|architecture|guide|best-practices|contribution)$ ]]; then
  echo "Error: Invalid --type value: $type"
  echo "Valid options: api, architecture, guide, best-practices, contribution"
  exit 1
fi

# Invalid enum value for --ai-model
if [[ ! "$ai_model" =~ ^(codex|gemini)$ ]]; then
  echo "Error: Invalid --ai-model value: $ai_model"
  echo "Valid options: codex, gemini"
  exit 1
fi

# Out-of-range --parallel value
if [ "$parallel" -lt 1 ] || [ "$parallel" -gt 5 ]; then
  echo "Warning: --parallel value $parallel out of range [1-5], clamping to valid range"
  parallel=$(( parallel < 1 ? 1 : (parallel > 5 ? 5 : parallel) ))
fi
```

**Output**: Validated parameters object

```json
{
  "session_id": "WFS-docs-1732589200",
  "files": ["packages/kit/src/is/is-array.ts", "packages/kit/src/is/is-empty.ts"],
  "type": "api",
  "output": "docs/packages/kit/reference/",
  "ai_model": "codex",
  "skip_type_gen": false,
  "parallel": 3
}
```

---

### Function 2: verify_files - File Existence Verification

Verify all source files exist before proceeding with workflow.

**Verification Logic**:

```bash
# Parse comma-separated file list
IFS=',' read -ra file_array <<< "$files"

# Track missing files
missing_files=()

# Check each file
for file_path in "${file_array[@]}"; do
  # Trim whitespace
  file_path=$(echo "$file_path" | xargs)

  if [ ! -f "$file_path" ]; then
    missing_files+=("$file_path")
  fi
done

# Report errors if any files missing
if [ ${#missing_files[@]} -gt 0 ]; then
  echo "Error: The following files do not exist:"
  for missing in "${missing_files[@]}"; do
    echo "  - $missing"
  done
  echo ""
  echo "Please verify file paths and ensure all files exist."
  exit 1
fi
```

**Error Handling**:

- **Scenario 1: Non-existent file paths**
  - Collect all missing files into error list
  - Output clear error message with missing file list
  - Exit with status code 1 (fail fast)

**Output**: Verified file list (all files exist)

---

### Function 3: infer_output_path - Output Path Inference

Infer output directory path if --output parameter not provided.

**Inference Logic**:

```bash
# If --output provided, use it directly
if [ -n "$output" ]; then
  output_dir="$output"
else
  # Extract package name from first file path
  # Pattern: packages/[package-name]/src/... → [package-name]
  first_file="${file_array[0]}"

  if [[ "$first_file" =~ packages/([^/]+)/src/ ]]; then
    package_name="${BASH_REMATCH[1]}"

    # Extract module name from path
    # Pattern: packages/[package]/src/[module]/... → [module]
    if [[ "$first_file" =~ packages/[^/]+/src/([^/]+)/ ]]; then
      module_name="${BASH_REMATCH[1]}"
      output_dir="docs/packages/${package_name}/reference/${module_name}/"
    else
      # No module subdirectory, use package-level reference
      output_dir="docs/packages/${package_name}/reference/"
    fi
  else
    # Fallback: use docs/reference/ if pattern doesn't match
    echo "Warning: Cannot infer package name from path: $first_file"
    echo "Using fallback output directory: docs/reference/"
    output_dir="docs/reference/"
  fi
fi

# Ensure output directory exists
mkdir -p "$output_dir"
```

**Examples**:

| Input File Path | Inferred Output Path |
|----------------|---------------------|
| `packages/kit/src/is/is-array.ts` | `docs/packages/kit/reference/is/` |
| `packages/biz/src/query/parse.ts` | `docs/packages/biz/reference/query/` |
| `packages/color/src/index.ts` | `docs/packages/color/reference/` |
| `src/utils/helper.ts` (no packages/) | `docs/reference/` (fallback) |

**Output**: Inferred output directory path

---

### Function 4: group_files - File Grouping Strategy

Group source files into batches of 2-3 files for parallel execution.

**Grouping Algorithm**:

```bash
# Parse file list
IFS=',' read -ra file_array <<< "$files"
total_files=${#file_array[@]}

# Calculate optimal group count
# Formula: ceil(total_files / 3)
group_count=$(( (total_files + 2) / 3 ))

# Initialize groups array
groups=()

# Distribute files into groups
for (( i=0; i<group_count; i++ )); do
  group_id=$(printf "group-%03d" $i)

  # Calculate file indices for this group
  start_idx=$((i * 3))
  end_idx=$((start_idx + 2))
  [ $end_idx -ge $total_files ] && end_idx=$((total_files - 1))

  # Extract files for this group
  group_files=()
  for (( j=start_idx; j<=end_idx; j++ )); do
    group_files+=("${file_array[$j]}")
  done

  # Extract package name from first file in group
  first_file="${group_files[0]}"
  if [[ "$first_file" =~ packages/([^/]+)/src/ ]]; then
    package_name="${BASH_REMATCH[1]}"
  else
    package_name="unknown"
  fi

  # Create group object
  groups+=("{
    \"group_id\": \"$group_id\",
    \"files\": [$(printf '\"%s\",' "${group_files[@]}" | sed 's/,$//')],
    \"package_name\": \"$package_name\",
    \"output_dir\": \"$output_dir\",
    \"type_declarations\": [],
    \"test_files\": []
  }")
done
```

**Grouping Rules**:

- **Minimum**: 1 file per group (no artificial padding)
- **Maximum**: 3 files per group (prevent context overflow)
- **Distribution**: Evenly distribute files across groups
- **Total Groups**: `ceil(total_files / 3)`

**Examples**:

| Total Files | Groups | Distribution |
|------------|--------|--------------|
| 1 | 1 | [1] |
| 2 | 1 | [2] |
| 3 | 1 | [3] |
| 4 | 2 | [3, 1] |
| 5 | 2 | [3, 2] |
| 7 | 3 | [3, 3, 1] |
| 10 | 4 | [3, 3, 3, 1] |

**Output**: File groups JSON

```json
{
  "session_id": "WFS-docs-1732589200",
  "groups": [
    {
      "group_id": "group-000",
      "files": ["packages/kit/src/is/is-array.ts", "packages/kit/src/is/is-empty.ts", "packages/kit/src/is/is-circular.ts"],
      "package_name": "kit",
      "output_dir": "docs/packages/kit/reference/is/",
      "type_declarations": [],
      "test_files": []
    },
    {
      "group_id": "group-001",
      "files": ["packages/kit/src/is/is-object.ts"],
      "package_name": "kit",
      "output_dir": "docs/packages/kit/reference/is/",
      "type_declarations": [],
      "test_files": []
    }
  ],
  "template_path": "docs/contributing/documentation/api-template.md",
  "ai_model": "codex",
  "max_concurrency": 3,
  "quality_threshold": 90
}
```

---

## Output Files

Generate 3 JSON files in workflow session directory:

### 1. validated-parameters.json

Location: `.workflow/active/${session_id}/.process/validated-parameters.json`

```json
{
  "session_id": "WFS-docs-1732589200",
  "files": ["packages/kit/src/is/is-array.ts", "packages/kit/src/is/is-empty.ts"],
  "type": "api",
  "output": "docs/packages/kit/reference/is/",
  "ai_model": "codex",
  "skip_type_gen": false,
  "parallel": 3,
  "validated_at": "2025-11-27T10:00:00Z"
}
```

### 2. file-groups.json

Location: `.workflow/active/${session_id}/.process/file-groups.json`

```json
{
  "session_id": "WFS-docs-1732589200",
  "groups": [
    {
      "group_id": "group-000",
      "files": ["packages/kit/src/is/is-array.ts", "packages/kit/src/is/is-empty.ts"],
      "package_name": "kit",
      "output_dir": "docs/packages/kit/reference/is/",
      "type_declarations": [],
      "test_files": []
    }
  ],
  "template_path": "docs/contributing/documentation/api-template.md",
  "ai_model": "codex",
  "max_concurrency": 3,
  "quality_threshold": 90,
  "created_at": "2025-11-27T10:00:00Z"
}
```

### 3. generator-tasks.json

Location: `.workflow/active/${session_id}/.process/generator-tasks.json`

```json
{
  "session_id": "WFS-docs-1732589200",
  "tasks": [
    {
      "id": "IMPL-002.1",
      "title": "Generate api docs for group-000 (2 files)",
      "status": "pending",
      "meta": {
        "type": "docs",
        "agent": "@doc-generator",
        "cli_execute": true,
        "ai_model": "codex"
      },
      "context": {
        "group_id": "group-000",
        "files": ["packages/kit/src/is/is-array.ts", "packages/kit/src/is/is-empty.ts"],
        "type_declarations": [],
        "test_files": [],
        "template": "docs/contributing/documentation/api-template.md",
        "output_dir": "docs/packages/kit/reference/is/",
        "doc_type": "api"
      },
      "flow_control": {
        "cli_command": "codex -C packages/kit --full-auto exec \"PURPOSE: Generate API documentation | TASK: • Read source files and type declarations • Extract accurate type signatures • Generate parameter tables and usage examples • Perform self-assessment quality scoring | MODE: auto | CONTEXT: @src/is/is-array.ts @src/is/is-empty.ts @docs/contributing/documentation/api-template.md | EXPECTED: Complete API docs with quality score >= 90 | RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | Type signatures must match .d.ts exactly | auto=FULL operations\" --skip-git-repo-check -s danger-full-access"
      }
    }
  ],
  "created_at": "2025-11-27T10:00:00Z"
}
```

---

## Implementation

Execute the 4 core functions in sequence:

```bash
# Function 1: Validate parameters
validate_parameters

# Function 2: Verify file existence
verify_files

# Function 3: Infer output path (if not provided)
infer_output_path

# Function 4: Group files for parallel execution
group_files

# Write output files
write_output_files
```

**Success Output**:

```
✅ Phase 1: docs-prepare completed

Parameters validated:
- Session: WFS-docs-1732589200
- Files: 10 files
- Type: api
- Output: docs/packages/kit/reference/is/
- AI Model: codex
- Parallel: 3

File grouping:
- Total groups: 4
- Distribution: [3, 3, 3, 1]
- Max concurrency: 3

Output files:
- .workflow/active/WFS-docs-1732589200/.process/validated-parameters.json
- .workflow/active/WFS-docs-1732589200/.process/file-groups.json
- .workflow/active/WFS-docs-1732589200/.process/generator-tasks.json

Ready for Phase 2: docs-generate-single
```

---

## Error Scenarios

### Scenario 1: Missing Required Parameters

**Trigger**: `--files` or `--type` not provided

**Error Message**:
```
Error: Missing required parameter
Usage: /workflow:tools:docs-prepare --session <session-id> --files <paths> --type <type>
Required: --files, --type
```

**Exit Code**: 1

---

### Scenario 2: Non-existent File Paths

**Trigger**: One or more files in `--files` do not exist

**Error Message**:
```
Error: The following files do not exist:
  - packages/kit/src/is/is-invalid.ts
  - packages/kit/src/is/is-missing.ts

Please verify file paths and ensure all files exist.
```

**Exit Code**: 1

---

## Related Documentation

- [Multi-Agent Documentation Workflow Architecture](.workflow/active/WFS-optimize-generate-docs-multi-agent-workflow/.process/architecture-design.md)
- [workflow:docs-generate](.claude/commands/workflow/docs-generate.md) - Orchestrator command
- [generate-docs](.claude/commands/generate-docs.md) - Original sequential implementation
