# Phase 3: Independent Quality Assurance

对生成的文档进行独立质量验证，提供客观评分和改进建议。

## 使用方式

```bash
/workflow:tools:docs-qa --session "WFS-docs-[timestamp]" --group-id "group-001"
```

## 参数说明

- `--session`: Workflow 会话 ID（必需）
- `--group-id`: 文件分组 ID（必需，格式：group-NNN）

---

## 执行任务

### 步骤 1: 加载文档和上下文

从 Phase 2 输出加载草稿文档和自评结果：

```bash
session_dir=".workflow/active/${session_id}"

# 加载草稿文档
draft_doc="${session_dir}/.summaries/group-${group_id}-draft.md"
if [ ! -f "$draft_doc" ]; then
  echo "Error: Draft document not found for group ${group_id}"
  exit 1
fi

# 加载自评 JSON
self_assessment="${session_dir}/.task/group-${group_id}-assessment.json"
self_score=$(jq -r '.quality_score' "$self_assessment")

# 加载文件分组配置（获取源文件、类型声明、测试文件）
group_config=$(jq ".groups[] | select(.group_id == \"${group_id}\")" "${session_dir}/.process/file-groups.json")
source_files=$(echo "$group_config" | jq -r '.files[]')
type_declarations=$(echo "$group_config" | jq -r '.type_declarations[]')
test_files=$(echo "$group_config" | jq -r '.test_files[]')
doc_type=$(echo "$group_config" | jq -r '.doc_type')
```

### 步骤 2: 独立质量验证

使用 @universal-executor agent 进行客观验证，检查 4 项质量标准：

```bash
# 使用 Gemini 进行独立 QA 分析
cd "$(dirname "$draft_doc")" && gemini -p "
PURPOSE: Independently verify documentation quality for group ${group_id} with objective scoring and specific improvement suggestions
TASK:
• Read draft documentation and compare with source files, type declarations, and test files
• Verify 4 quality criteria from doc-standards.md:
  1. Type Accuracy: All type signatures match .d.ts declarations exactly (25 points)
  2. Boundary Case Coverage: All test edge cases are documented (25 points)
  3. Example Completeness: Examples include import statements and output comments (25 points)
  4. Chinese Expression Quality: Natural terminology, no awkward translations (25 points)
• Calculate objective QA score (0-100, sum of 4 items)
• Generate specific improvement suggestions for failed items
• Compare with self-assessment score and explain discrepancies
MODE: analysis
CONTEXT: @$(basename "$draft_doc") @${source_files} @${type_declarations} @${test_files} @../../docs/contributing/documentation/${doc_type}-template.md @../../docs/contributing/documentation/doc-standards.md
EXPECTED: Objective QA report with score, checklist results, improvement suggestions, and comparison with self-assessment (score: ${self_score})
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/analysis/02-review-code-quality.txt) | Focus on objective verification and actionable feedback | analysis=READ-ONLY
"
```

### 步骤 3: 计算 QA 得分

根据 4 项检查结果计算客观得分：

#### 评分标准

1. **Type Accuracy（类型准确性）- 25 分**
   - 检查方法：逐个对比文档中的类型签名与 .d.ts 文件
   - 扣分规则：-5 分/类型不匹配（最多 5 个不匹配）
   - Pass 条件：0 个类型不匹配（25 分）
   - Warning 条件：1-2 个不匹配（15-20 分）
   - Fail 条件：3+ 个不匹配（0-10 分）

2. **Boundary Case Coverage（边界情况覆盖）- 25 分**
   - 检查方法：提取测试文件中的所有边界情况，验证文档是否覆盖
   - 扣分规则：-5 分/缺失边界情况（最多 5 个缺失）
   - Pass 条件：所有测试边界情况都有文档说明（25 分）
   - Warning 条件：缺失 1-2 个边界情况（15-20 分）
   - Fail 条件：缺失 3+ 个边界情况（0-10 分）

3. **Example Completeness（示例完整性）- 25 分**
   - 检查方法：验证每个示例是否包含 import 语句和输出注释
   - 扣分规则：-12.5 分/缺失要求（2 个要求）
   - Pass 条件：所有示例都有 import 和输出注释（25 分）
   - Fail 条件：缺失任一要求（0-12.5 分）

4. **Chinese Expression Quality（中文表达质量）- 25 分**
   - 检查方法：验证术语规范性、表达自然性、无生硬翻译
   - 扣分规则：-5 分/术语错误或不规范（最多 5 个错误）
   - Pass 条件：术语规范且表达自然（25 分）
   - Warning 条件：1-2 个术语问题（15-20 分）
   - Fail 条件：3+ 个术语问题（0-10 分）

```bash
# 计算总分
qa_score=$((type_accuracy_score + boundary_case_score + example_score + chinese_score))
```

### 步骤 4: 生成改进建议

为每个未通过的检查项生成具体的改进建议：

```bash
improvement_suggestions=[]

# Type Accuracy 建议
if [ "$type_accuracy_score" -lt 25 ]; then
  improvement_suggestions+=("Fix type signature mismatches: [list specific mismatches with line numbers]")
fi

# Boundary Case Coverage 建议
if [ "$boundary_case_score" -lt 25 ]; then
  improvement_suggestions+=("Document missing boundary cases: [list specific test cases not covered]")
fi

# Example Completeness 建议
if [ "$example_score" -lt 25 ]; then
  [ missing_imports ] && improvement_suggestions+=("Add import statements to examples at lines: [line numbers]")
  [ missing_outputs ] && improvement_suggestions+=("Add output comments to examples at lines: [line numbers]")
fi

# Chinese Expression 建议
if [ "$chinese_score" -lt 25 ]; then
  improvement_suggestions+=("Refine Chinese terminology: [list specific terms and suggested replacements]")
fi
```

### 步骤 5: 确定是否需要改进

根据 QA 得分确定下一步行动：

```bash
if [ "$qa_score" -ge 90 ]; then
  requires_improvement=false
  next_phase="Phase 5: Result Summarization"
elif [ "$qa_score" -ge 70 ]; then
  requires_improvement=true
  next_phase="Phase 4: Improvement (recommended)"
else
  requires_improvement=true
  next_phase="Phase 4: Improvement (required)"
fi
```

**QA 得分阈值**：

- **>= 90**: Pass ✅ → 直接进入 Phase 5（结果汇总）
- **70-89**: Needs Improvement ⚠️ → 进入 Phase 4（改进，推荐）
- **< 70**: Failed ❌ → 进入 Phase 4（改进，必需）

### 步骤 6: 输出 QA 报告

生成 QA 报告 JSON：

```bash
cat > "${session_dir}/.summaries/qa-${group_id}.json" <<EOF
{
  "group_id": "${group_id}",
  "document": "${draft_doc}",
  "qa_score": ${qa_score},
  "self_assessment_score": ${self_score},
  "score_discrepancy": $((qa_score - self_score)),
  "quality_checks": [
    {
      "check": "type_accuracy",
      "score": ${type_accuracy_score},
      "status": "$([ $type_accuracy_score -eq 25 ] && echo 'pass' || ([ $type_accuracy_score -ge 15 ] && echo 'warning' || echo 'fail'))",
      "details": "${type_accuracy_details}"
    },
    {
      "check": "boundary_cases_coverage",
      "score": ${boundary_case_score},
      "status": "$([ $boundary_case_score -eq 25 ] && echo 'pass' || ([ $boundary_case_score -ge 15 ] && echo 'warning' || echo 'fail'))",
      "details": "${boundary_case_details}"
    },
    {
      "check": "example_completeness",
      "score": ${example_score},
      "status": "$([ $example_score -eq 25 ] && echo 'pass' || echo 'fail')",
      "details": "${example_details}"
    },
    {
      "check": "chinese_expression_quality",
      "score": ${chinese_score},
      "status": "$([ $chinese_score -eq 25 ] && echo 'pass' || ([ $chinese_score -ge 15 ] && echo 'warning' || echo 'fail'))",
      "details": "${chinese_details}"
    }
  ],
  "improvement_suggestions": $(echo "${improvement_suggestions[@]}" | jq -R 'split(" ")'),
  "requires_improvement": ${requires_improvement},
  "next_phase": "${next_phase}",
  "iteration_count": 0,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

---

## 错误处理

### 文档文件未找到

- 检查 Phase 2 是否成功完成
- 验证文件路径和权限
- 失败则报告给 orchestrator，标记 group 为 failed

### QA 分析超时

- 超时阈值：5 分钟
- 降级策略：使用 self_assessment_score 作为 qa_score
- 警告用户：QA 分析超时，使用自评得分（可能不准确）

### 上下文文件缺失

- 源文件或类型声明缺失 → 警告并继续（降低 Type Accuracy 权重）
- 测试文件缺失 → 警告并继续（降低 Boundary Case Coverage 权重）
- 模板文件缺失 → 失败，无法进行质量验证

---

## 独立性保证

本 QA agent 设计为完全独立于 Phase 2 generator：

- **独立分析**：不依赖 Phase 2 的自评结果进行判断
- **客观标准**：基于 doc-standards.md 的 4 项客观标准
- **对比验证**：比较 QA 得分与自评得分，识别差异
- **无偏见**：使用 @universal-executor agent（非 @doc-generator）

**独立性验证**：

- QA 得分与自评得分差异 > 10 分 → 记录差异原因
- QA 得分 < 自评得分 → 说明 generator 过于乐观
- QA 得分 > 自评得分 → 说明 generator 过于保守

---

## 输出格式

### QA 报告 JSON

```json
{
  "group_id": "group-001",
  "document": ".workflow/active/WFS-docs-123/.summaries/group-001-draft.md",
  "qa_score": 88,
  "self_assessment_score": 95,
  "score_discrepancy": -7,
  "quality_checks": [
    {
      "check": "type_accuracy",
      "score": 25,
      "status": "pass",
      "details": "All type signatures match .d.ts declarations exactly"
    },
    {
      "check": "boundary_cases_coverage",
      "score": 20,
      "status": "warning",
      "details": "Missing edge case: circular reference depth > 100 (line 45 in test file)"
    },
    {
      "check": "example_completeness",
      "score": 25,
      "status": "pass",
      "details": "All examples include import statements and output comments"
    },
    {
      "check": "chinese_expression_quality",
      "score": 18,
      "status": "warning",
      "details": "Terminology issues: '检测' should be '判断' (3 occurrences at lines 12, 34, 56)"
    }
  ],
  "improvement_suggestions": [
    "Add edge case documentation for deep circular references (depth > 100) at line 45",
    "Refine terminology: use '判断' instead of '检测' for boolean predicates (lines 12, 34, 56)"
  ],
  "requires_improvement": true,
  "next_phase": "Phase 4: Improvement (recommended)",
  "iteration_count": 0,
  "timestamp": "2025-11-27T16:05:00Z"
}
```
