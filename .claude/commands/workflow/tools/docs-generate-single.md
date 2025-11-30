# Phase 2: Single Group Document Generator

为单个文件分组生成文档，支持并行执行和自我质量评估。

## 使用方式

```bash
/workflow:tools:docs-generate-single --session "WFS-docs-[timestamp]" --group-id "group-001"
```

## 参数说明

- `--session`: Workflow 会话 ID（必需）
- `--group-id`: 文件分组 ID（必需，格式：group-NNN）

---

## 执行任务

### 步骤 1: 加载文件分组配置

从 Phase 1 输出加载文件分组信息：

```bash
session_dir=".workflow/active/${session_id}"
group_config=$(jq ".groups[] | select(.group_id == \"${group_id}\")" "${session_dir}/.process/file-groups.json")

# 提取分组信息
files=$(echo "$group_config" | jq -r '.files[]')
package_name=$(echo "$group_config" | jq -r '.package_name')
output_dir=$(echo "$group_config" | jq -r '.output_dir')
doc_type=$(echo "$group_config" | jq -r '.doc_type')
ai_model=$(echo "$group_config" | jq -r '.ai_model')
skip_type_gen=$(echo "$group_config" | jq -r '.skip_type_gen')
```

### 步骤 2: 生成类型声明（可选）

如果未设置 `--skip-type-gen`，生成 TypeScript 类型声明：

```bash
if [ "$skip_type_gen" != "true" ]; then
  echo "Generating type declarations for package: ${package_name}"

  # 创建临时类型目录
  mkdir -p ".tmp/types/${package_name}"

  # 运行 TypeScript 编译器
  cd "packages/${package_name}" && pnpm tsc --declaration --emitDeclarationOnly --outDir "../../.tmp/types/${package_name}"

  # 验证类型声明生成
  type_files=$(find ".tmp/types/${package_name}" -name "*.d.ts" | wc -l)
  if [ "$type_files" -eq 0 ]; then
    echo "Warning: No type declaration files generated, continuing with source-only mode"
  fi
fi
```

### 步骤 3: 收集上下文文件

收集 3 类上下文文件：

1. **源文件**：从文件分组配置
2. **类型声明**：`.tmp/types/${package_name}/**/*.d.ts`（如果已生成）
3. **测试文件**：自动发现

```bash
# 收集源文件路径
source_files="${files}"

# 收集类型声明路径
if [ "$skip_type_gen" != "true" ]; then
  type_declarations=$(find ".tmp/types/${package_name}" -name "*.d.ts" 2>/dev/null)
fi

# 自动发现测试文件
test_files=""
for src_file in $source_files; do
  # 推断测试文件路径：src/path/file.ts → test/path/file.test.ts
  test_path=$(echo "$src_file" | sed 's|packages/[^/]*/src/|packages/'"${package_name}"'/test/|' | sed 's|\.ts$|.test.ts|')

  if [ -f "$test_path" ]; then
    test_files="$test_files $test_path"
  fi
done
```

### 步骤 4: AI 文档生成

根据 `--ai-model` 参数选择 AI 工具：

#### Codex 生成（默认，推荐用于 API 文档）

```bash
if [ "$ai_model" = "codex" ]; then
  # 构建 CONTEXT 字段
  context_field="@${source_files}"
  [ -n "$type_declarations" ] && context_field="$context_field @../../.tmp/types/${package_name}/**/*.d.ts"
  [ -n "$test_files" ] && context_field="$context_field @${test_files}"
  context_field="$context_field @../../docs/contributing/documentation/${doc_type}-template.md"

  # 执行 Codex 生成
  codex -C "packages/${package_name}" --full-auto exec "PURPOSE: Generate ${doc_type} documentation for file group ${group_id} with type-safe examples and comprehensive coverage | TASK: • Read source files, type declarations (.d.ts), and test files • Extract 100% accurate type signatures from .d.ts • Document all exported functions/classes with TypeScript signatures • Include usage examples with import statements and output comments • Cover boundary cases from test files • Ensure Chinese terminology compliance | MODE: write | CONTEXT: ${context_field} | EXPECTED: Complete ${doc_type} documentation following ${doc_type}-template.md structure with 4-item quality checklist compliance (type accuracy, boundary cases, example completeness, Chinese expression) | RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | Focus on type accuracy and practical examples | CRITICAL: NO meta-descriptions (禁止 \"以下示例来源于...\" \"以下类型信息来自...\" 等元描述), source link MUST use markdown hyperlink format [源码](URL) not inline code | write=CREATE/MODIFY/DELETE" --skip-git-repo-check -s danger-full-access
fi
```

#### Gemini 生成（推荐用于架构/指南文档）

```bash
if [ "$ai_model" = "gemini" ]; then
  # 构建 CONTEXT 字段
  context_field="@${source_files}"
  [ -n "$type_declarations" ] && context_field="$context_field @../../.tmp/types/${package_name}/**/*.d.ts"
  [ -n "$test_files" ] && context_field="$context_field @${test_files}"
  context_field="$context_field @../../docs/contributing/documentation/${doc_type}-template.md"

  # 执行 Gemini 生成
  cd "packages/${package_name}" && gemini -p "
PURPOSE: Generate ${doc_type} documentation for file group ${group_id} with architectural clarity and design rationale
TASK:
• Read source files, type declarations, and test files
• Understand overall architecture and component relationships
• Document design patterns and their rationale
• Explain integration points with other modules
• Include system diagrams using Mermaid syntax
• Ensure Chinese terminology compliance
MODE: write
CONTEXT: ${context_field}
EXPECTED: Complete ${doc_type} documentation following ${doc_type}-template.md structure with clear design rationale and visual diagrams
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | Focus on architectural clarity and pattern documentation | CRITICAL: NO meta-descriptions (禁止 \"以下示例来源于...\" \"以下类型信息来自...\" 等元描述), source link MUST use markdown hyperlink format [源码](URL) not inline code | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
fi
```

### 步骤 5: 自我质量评估

AI 对生成的文档进行 4 项质量检查：

#### 质量检查项（每项 25 分，总分 100）

1. **Item 1: Type Accuracy（类型准确性）**
   - 检查：所有类型签名与 .d.ts 文件完全一致
   - 评分：-5 分/类型不匹配（最多 5 个不匹配 = 0 分）
   - Pass 条件：0 个类型不匹配

2. **Item 2: Boundary Case Coverage（边界情况覆盖）**
   - 检查：测试文件中的所有边界情况都已文档化
   - 评分：-5 分/缺失边界情况（最多 5 个缺失 = 0 分）
   - Pass 条件：所有测试边界情况都有文档说明

3. **Item 3: Example Completeness（示例完整性）**
   - 检查：示例包含 import 语句和输出注释
   - 评分：-12.5 分/缺失要求（2 个要求：import 语句、输出注释）
   - Pass 条件：所有示例都有 import 和输出注释

4. **Item 4: Chinese Expression Quality（中文表达质量）**
   - 检查：术语规范、表达自然、无生硬翻译
   - 评分：-5 分/术语错误或不规范（最多 5 个错误 = 0 分）
   - Pass 条件：术语规范且表达自然

#### 计算质量得分

```bash
# AI 自动评估并计算得分
quality_score=$((item1_score + item2_score + item3_score + item4_score))

# 生成改进建议（如果有项目未通过）
improvement_suggestions=[]
[ "$item1_score" -lt 25 ] && improvement_suggestions+=("Fix type signature mismatches with .d.ts declarations")
[ "$item2_score" -lt 25 ] && improvement_suggestions+=("Document missing boundary cases from test files")
[ "$item3_score" -lt 25 ] && improvement_suggestions+=("Add import statements and output comments to examples")
[ "$item4_score" -lt 25 ] && improvement_suggestions+=("Refine Chinese terminology and expression")
```

### 步骤 6: 输出结果

生成 2 个输出文件：

1. **草稿文档**：`.workflow/active/${session_id}/.summaries/group-${group_id}-draft.md`
2. **自评 JSON**：`.workflow/active/${session_id}/.task/group-${group_id}-assessment.json`

```bash
# 保存草稿文档
cp "${output_dir}/generated-doc.md" "${session_dir}/.summaries/group-${group_id}-draft.md"

# 生成自评 JSON
cat > "${session_dir}/.task/group-${group_id}-assessment.json" <<EOF
{
  "group_id": "${group_id}",
  "document_path": "${output_dir}/generated-doc.md",
  "quality_score": ${quality_score},
  "checklist_results": {
    "type_accuracy": {"score": ${item1_score}, "status": "$([ $item1_score -eq 25 ] && echo 'pass' || echo 'fail')"},
    "boundary_case_coverage": {"score": ${item2_score}, "status": "$([ $item2_score -eq 25 ] && echo 'pass' || echo 'fail')"},
    "example_completeness": {"score": ${item3_score}, "status": "$([ $item3_score -eq 25 ] && echo 'pass' || echo 'fail')"},
    "chinese_expression_quality": {"score": ${item4_score}, "status": "$([ $item4_score -eq 25 ] && echo 'pass' || echo 'fail')"}
  },
  "improvement_suggestions": $(echo "${improvement_suggestions[@]}" | jq -R 'split(" ")'),
  "execution_time_seconds": ${execution_time},
  "ai_model": "${ai_model}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

---

## 错误处理

### CLI 工具超时

- 超时阈值：10 分钟
- 重试策略：最多 3 次，每次延长 5 分钟
- 失败处理：记录错误，报告给 orchestrator，继续其他 groups

### 类型声明生成失败

- 警告用户：类型生成失败，使用源文件推断模式
- 继续执行：从 CONTEXT 移除 type_declarations
- 降级质量：Item 1 (Type Accuracy) 自动降为 20 分（警告级别）

### 文件写入失败

- 检查输出目录权限
- 尝试创建父目录
- 失败则报告给 orchestrator，标记 group 为 failed

---

## 并行执行支持

本命令设计为并行执行就绪：

- **独立会话**：每个 group 使用独立的 CLI 会话
- **无共享状态**：所有状态存储在 session 目录的独立文件中
- **错误隔离**：单个 group 失败不影响其他 groups
- **输出命名**：使用 group_id 确保文件名唯一性

**并行调用示例**（由 orchestrator 执行）：

```bash
# 批次 1：3 个并行 generators
/workflow:tools:docs-generate-single --session "WFS-docs-123" --group-id "group-000" &
/workflow:tools:docs-generate-single --session "WFS-docs-123" --group-id "group-001" &
/workflow:tools:docs-generate-single --session "WFS-docs-123" --group-id "group-002" &
wait

# 批次 2：继续下一批
/workflow:tools:docs-generate-single --session "WFS-docs-123" --group-id "group-003" &
# ...
```

---

## 输出格式

### 草稿文档（Markdown）

遵循对应的文档模板结构：
- API 文档：api-template.md
- 架构文档：architecture-template.md
- 用户指南：guide-template.md
- 最佳实践：best-practices-template.md
- 贡献指南：contribution-template.md

### 自评 JSON

```json
{
  "group_id": "group-001",
  "document_path": "docs/packages/kit/reference/is/is-circular.md",
  "quality_score": 95,
  "checklist_results": {
    "type_accuracy": {"score": 25, "status": "pass"},
    "boundary_case_coverage": {"score": 25, "status": "pass"},
    "example_completeness": {"score": 23, "status": "fail"},
    "chinese_expression_quality": {"score": 22, "status": "fail"}
  },
  "improvement_suggestions": [
    "Add output comments to example code blocks",
    "Refine terminology: use '判断' instead of '检测' for boolean predicates"
  ],
  "execution_time_seconds": 45,
  "ai_model": "codex",
  "timestamp": "2025-11-27T16:00:00Z"
}
```
