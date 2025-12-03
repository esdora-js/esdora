# Phase 4: Iterative Document Improvement

基于 QA 反馈对文档进行迭代改进，最多 2 次循环。

## 使用方式

```bash
/workflow:tools:docs-improve --session "WFS-docs-[timestamp]" --group-id "group-001" --max-iterations 2
```

## 参数说明

- `--session`: Workflow 会话 ID（必需）
- `--group-id`: 文件分组 ID（必需，格式：group-NNN）
- `--max-iterations`: 最大迭代次数（可选，默认 2）

---

## 执行任务

### 步骤 1: 加载 QA 反馈

从 Phase 3 输出加载 QA 报告：

```bash
session_dir=".workflow/active/${session_id}"

# 加载 QA 报告
qa_report="${session_dir}/.summaries/qa-${group_id}.json"
if [ ! -f "$qa_report" ]; then
  echo "Error: QA report not found for group ${group_id}"
  exit 1
fi

# 提取 QA 信息
qa_score=$(jq -r '.qa_score' "$qa_report")
iteration_count=$(jq -r '.iteration_count' "$qa_report")
improvement_suggestions=$(jq -r '.improvement_suggestions[]' "$qa_report")
requires_improvement=$(jq -r '.requires_improvement' "$qa_report")

# 检查是否需要改进
if [ "$requires_improvement" != "true" ]; then
  echo "Document quality is sufficient (score: ${qa_score}), no improvement needed"
  exit 0
fi

# 检查迭代次数限制
if [ "$iteration_count" -ge "$max_iterations" ]; then
  echo "Max iterations reached (${max_iterations}), manual review required"
  exit 1
fi
```

### 步骤 2: 选择改进策略

根据 QA 得分选择改进模式：

```bash
if [ "$qa_score" -ge 80 ]; then
  improvement_mode="patch"
  echo "Using patch mode: targeted edits for specific issues"
else
  improvement_mode="regenerate"
  echo "Using regenerate mode: full document regeneration with feedback context"
fi
```

**改进策略**：

- **Patch Mode（得分 80-89）**：使用 Edit 工具进行针对性修改
  - 适用场景：少量问题，文档整体质量良好
  - 优势：快速、保留原有内容结构
  - 方法：根据 improvement_suggestions 定位问题行，使用 Edit 工具修改

- **Regenerate Mode（得分 < 80）**：完全重新生成文档
  - 适用场景：多个问题，文档整体质量不足
  - 优势：全面改进、确保一致性
  - 方法：将 QA 反馈作为额外约束，重新调用 AI 生成

### 步骤 3: 执行改进

#### Patch Mode（针对性修改）

```bash
if [ "$improvement_mode" = "patch" ]; then
  draft_doc="${session_dir}/.summaries/group-${group_id}-draft.md"

  # 逐条应用改进建议
  for suggestion in "${improvement_suggestions[@]}"; do
    echo "Applying improvement: $suggestion"

    # 使用 Edit 工具进行针对性修改
    # 示例：修改术语
    if [[ "$suggestion" == *"terminology"* ]]; then
      # 提取需要替换的术语
      old_term=$(echo "$suggestion" | grep -oP "'[^']+'" | head -1 | tr -d "'")
      new_term=$(echo "$suggestion" | grep -oP "'[^']+'" | tail -1 | tr -d "'")

      # 使用 Edit 工具替换
      Edit(file_path="$draft_doc", old_string="$old_term", new_string="$new_term", replace_all=true)
    fi

    # 示例：添加缺失的边界情况文档
    if [[ "$suggestion" == *"edge case"* ]]; then
      # 提取边界情况描述
      edge_case=$(echo "$suggestion" | grep -oP 'edge case: \K[^(]+')

      # 在适当位置插入边界情况文档
      # （需要 AI 辅助定位插入位置和生成内容）
    fi
  done
fi
```

#### Regenerate Mode（完全重新生成）

```bash
if [ "$improvement_mode" = "regenerate" ]; then
  # 加载原始上下文
  group_config=$(jq ".groups[] | select(.group_id == \"${group_id}\")" "${session_dir}/.process/file-groups.json")
  source_files=$(echo "$group_config" | jq -r '.files[]')
  type_declarations=$(echo "$group_config" | jq -r '.type_declarations[]')
  test_files=$(echo "$group_config" | jq -r '.test_files[]')
  doc_type=$(echo "$group_config" | jq -r '.doc_type')
  ai_model=$(echo "$group_config" | jq -r '.ai_model')
  package_name=$(echo "$group_config" | jq -r '.package_name')

  # 构建改进约束
  improvement_constraints=$(echo "${improvement_suggestions[@]}" | jq -R 'split(" ") | join("; ")')

  # 使用 AI 重新生成（添加 QA 反馈作为约束）
  if [ "$ai_model" = "codex" ]; then
    codex -C "packages/${package_name}" --full-auto exec "PURPOSE: Regenerate ${doc_type} documentation for group ${group_id} with QA feedback integration | TASK: • Address all QA improvement suggestions: ${improvement_constraints} • Maintain existing content structure where quality is sufficient • Focus on fixing identified issues: type mismatches, missing boundary cases, incomplete examples, terminology errors • Ensure all 4 quality criteria pass (score >= 90) | MODE: write | CONTEXT: @${source_files} @../../.tmp/types/${package_name}/**/*.d.ts @${test_files} @../../docs/contributing/documentation/${doc_type}-template.md @${draft_doc} (previous version for reference) | EXPECTED: Improved ${doc_type} documentation addressing all QA feedback with quality score >= 90 | RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | Apply all improvement suggestions | write=CREATE/MODIFY/DELETE" --skip-git-repo-check -s danger-full-access
  else
    cd "packages/${package_name}" && gemini -p "
PURPOSE: Regenerate ${doc_type} documentation for group ${group_id} with QA feedback integration
TASK:
• Address all QA improvement suggestions: ${improvement_constraints}
• Maintain existing content structure where quality is sufficient
• Focus on fixing identified issues
• Ensure all 4 quality criteria pass (score >= 90)
MODE: write
CONTEXT: @${source_files} @../../.tmp/types/${package_name}/**/*.d.ts @${test_files} @../../docs/contributing/documentation/${doc_type}-template.md @${draft_doc}
EXPECTED: Improved ${doc_type} documentation addressing all QA feedback with quality score >= 90
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | Apply all improvement suggestions | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
  fi
fi
```

### 步骤 4: 自我评估改进效果

AI 对改进后的文档进行新的自评：

```bash
# 重新执行 4 项质量检查
improved_score=$((new_item1_score + new_item2_score + new_item3_score + new_item4_score))

# 计算改进幅度
score_improvement=$((improved_score - qa_score))

# 判断改进是否有效
if [ "$score_improvement" -le 0 ]; then
  echo "Warning: No improvement in score (${qa_score} → ${improved_score})"
  improvement_effective=false
else
  echo "Score improved: ${qa_score} → ${improved_score} (+${score_improvement})"
  improvement_effective=true
fi
```

### 步骤 5: 决定下一步行动

根据改进结果决定是否继续迭代：

```bash
next_iteration=$((iteration_count + 1))

if [ "$improved_score" -ge 90 ]; then
  # 达到质量阈值，退出循环
  ready_for_qa=false
  next_phase="Phase 5: Result Summarization"
  echo "Quality threshold reached (score: ${improved_score}), proceeding to Phase 5"

elif [ "$next_iteration" -ge "$max_iterations" ]; then
  # 达到最大迭代次数，退出循环
  ready_for_qa=false
  next_phase="Manual Review Required"
  echo "Max iterations reached (${max_iterations}), manual review required (score: ${improved_score})"

elif [ "$improvement_effective" = false ]; then
  # 改进无效，退出循环
  ready_for_qa=false
  next_phase="Manual Review Required"
  echo "No improvement detected, manual review required"

else
  # 继续迭代
  ready_for_qa=true
  next_phase="Phase 3: QA Re-verification"
  echo "Improvement effective, proceeding to QA re-verification (iteration ${next_iteration})"
fi
```

**退出条件**：

1. **QA 得分 >= 90** → 成功，进入 Phase 5
2. **迭代次数 >= max_iterations** → 需要人工审查
3. **改进无效（得分无提升或下降）** → 需要人工审查

### 步骤 6: 输出改进报告

生成改进报告 JSON：

```bash
cat > "${session_dir}/.summaries/improve-${group_id}-iter${next_iteration}.json" <<EOF
{
  "group_id": "${group_id}",
  "iteration": ${next_iteration},
  "improvement_mode": "${improvement_mode}",
  "original_score": ${qa_score},
  "improved_score": ${improved_score},
  "score_improvement": ${score_improvement},
  "improvement_effective": ${improvement_effective},
  "changes_applied": $(echo "${improvement_suggestions[@]}" | jq -R 'split(" ")'),
  "ready_for_qa": ${ready_for_qa},
  "next_phase": "${next_phase}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# 更新 QA 报告的迭代计数
jq ".iteration_count = ${next_iteration}" "$qa_report" > "${qa_report}.tmp" && mv "${qa_report}.tmp" "$qa_report"
```

---

## 错误处理

### 改进失败导致得分下降

- 记录错误：改进操作导致质量下降
- 回滚文档：恢复到改进前的版本
- 标记为需要人工审查
- 退出循环

### CLI 工具超时

- 超时阈值：10 分钟
- 重试策略：重试 1 次
- 失败处理：标记为需要人工审查，退出循环

### 最大迭代次数后得分仍 < 70

- 标记为失败任务
- 需要人工介入
- 记录详细错误日志供人工审查

---

## 迭代循环流程

```
Phase 4 (Improvement) → Phase 3 (QA Re-verification)
  ↓ (if iteration_count < max_iterations AND qa_score < 90)
Phase 3 (QA) → Phase 4 (Next Iteration)
  ↓ (if iteration_count >= max_iterations OR qa_score >= 90)
Phase 5 (Result Summarization)
```

**循环控制**：

- **Max Iterations**: 2 次（防止无限循环）
- **Quality Threshold**: QA 得分 >= 90（成功退出）
- **No Improvement**: 得分无提升（强制退出）

---

## 输出格式

### 改进报告 JSON

```json
{
  "group_id": "group-001",
  "iteration": 1,
  "improvement_mode": "patch",
  "original_score": 88,
  "improved_score": 94,
  "score_improvement": 6,
  "improvement_effective": true,
  "changes_applied": [
    "Added edge case documentation for deep circular references (depth > 100)",
    "Updated terminology: '检测' → '判断' (3 occurrences)"
  ],
  "ready_for_qa": false,
  "next_phase": "Phase 5: Result Summarization",
  "timestamp": "2025-11-27T16:10:00Z"
}
```

### 迭代历史

每次迭代生成独立的改进报告：

- `improve-group-001-iter1.json`
- `improve-group-001-iter2.json`

最终 QA 报告包含最新的迭代计数：

```json
{
  "iteration_count": 2,
  "final_qa_score": 94
}
```
