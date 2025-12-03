# Phase 5: Result Summarization and Integration Testing

汇总所有文档生成结果，生成最终报告，并执行集成测试。

## 使用方式

```bash
/workflow:tools:docs-result-summary --session "WFS-docs-[timestamp]"
```

## 参数说明

- `--session`: Workflow 会话 ID（必需）

---

## 执行任务

### 步骤 1: 收集所有文档结果

从所有 groups 收集生成结果：

```bash
session_dir=".workflow/active/${session_id}"

# 收集所有 QA 报告
qa_reports=$(find "${session_dir}/.summaries" -name "qa-*.json" 2>/dev/null)
total_groups=$(echo "$qa_reports" | wc -l)

# 收集所有改进报告
improve_reports=$(find "${session_dir}/.summaries" -name "improve-*-iter*.json" 2>/dev/null)

# 收集所有草稿文档
draft_docs=$(find "${session_dir}/.summaries" -name "group-*-draft.md" 2>/dev/null)
```

### 步骤 2: 计算质量指标

汇总质量统计数据：

```bash
# 初始化统计变量
total_score=0
pass_count=0
warning_count=0
fail_count=0
total_iterations=0

# 遍历所有 QA 报告
for qa_report in $qa_reports; do
  score=$(jq -r '.qa_score' "$qa_report")
  iterations=$(jq -r '.iteration_count' "$qa_report")

  total_score=$((total_score + score))
  total_iterations=$((total_iterations + iterations))

  # 分类统计
  if [ "$score" -ge 90 ]; then
    pass_count=$((pass_count + 1))
  elif [ "$score" -ge 70 ]; then
    warning_count=$((warning_count + 1))
  else
    fail_count=$((fail_count + 1))
  fi
done

# 计算平均得分
average_score=$((total_score / total_groups))

# 计算通过率
pass_rate=$((pass_count * 100 / total_groups))
```

**质量指标**：

- **平均得分**：所有文档的 QA 得分平均值
- **通过率**：得分 >= 90 的文档占比
- **警告率**：得分 70-89 的文档占比
- **失败率**：得分 < 70 的文档占比
- **平均迭代次数**：所有文档的改进迭代次数平均值

### 步骤 3: 收集错误日志

汇总执行过程中的所有错误：

```bash
# 收集错误日志
errors=[]

# 检查是否有失败的 groups
for qa_report in $qa_reports; do
  group_id=$(jq -r '.group_id' "$qa_report")
  score=$(jq -r '.qa_score' "$qa_report")
  iterations=$(jq -r '.iteration_count' "$qa_report")

  # 得分 < 70 且达到最大迭代次数
  if [ "$score" -lt 70 ] && [ "$iterations" -ge 2 ]; then
    errors+=("{\"group\": \"${group_id}\", \"error\": \"Quality threshold not reached after ${iterations} iterations (score: ${score})\", \"severity\": \"high\"}")
  fi

  # 得分 70-89 且达到最大迭代次数
  if [ "$score" -ge 70 ] && [ "$score" -lt 90 ] && [ "$iterations" -ge 2 ]; then
    errors+=("{\"group\": \"${group_id}\", \"error\": \"Quality warning after ${iterations} iterations (score: ${score})\", \"severity\": \"medium\"}")
  fi
done

# 检查是否有缺失的文档
expected_groups=$(jq -r '.groups | length' "${session_dir}/.process/file-groups.json")
if [ "$total_groups" -lt "$expected_groups" ]; then
  missing_count=$((expected_groups - total_groups))
  errors+=("{\"error\": \"${missing_count} groups failed to generate documents\", \"severity\": \"high\"}")
fi
```

### 步骤 4: 计算执行时间

统计总执行时间和并行加速比：

```bash
# 从会话元数据获取开始时间
session_start=$(jq -r '.created_at' "${session_dir}/workflow-session.json")
session_end=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# 计算总执行时间（秒）
start_timestamp=$(date -d "$session_start" +%s)
end_timestamp=$(date -d "$session_end" +%s)
total_execution_time=$((end_timestamp - start_timestamp))

# 计算单个 group 平均时间
for qa_report in $qa_reports; do
  group_time=$(jq -r '.execution_time_seconds // 0' "${session_dir}/.task/$(basename $qa_report | sed 's/qa-/group-/' | sed 's/.json/-assessment.json/')")
  total_group_time=$((total_group_time + group_time))
done
average_group_time=$((total_group_time / total_groups))

# 计算并行加速比
parallel_count=$(jq -r '.max_concurrency // 3' "${session_dir}/.process/file-groups.json")
sequential_time=$((average_group_time * total_groups))
speedup=$(echo "scale=2; $sequential_time / $total_execution_time" | bc)
```

**执行时间指标**：

- **总执行时间**：从会话开始到结束的总时间
- **平均 group 时间**：单个 group 的平均生成时间
- **并行加速比**：顺序执行时间 / 实际执行时间
- **并行效率**：加速比 / 并行度

### 步骤 5: 生成文档列表

生成所有文档的列表，包含 VitePress 链接：

```bash
# 生成文档列表
document_list=[]

for qa_report in $qa_reports; do
  group_id=$(jq -r '.group_id' "$qa_report")
  doc_path=$(jq -r '.document' "$qa_report")
  score=$(jq -r '.qa_score' "$qa_report")
  iterations=$(jq -r '.iteration_count' "$qa_report")

  # 转换为 VitePress 链接
  vitepress_link=$(echo "$doc_path" | sed 's|docs/||' | sed 's|\.md$||')

  document_list+=("{\"group\": \"${group_id}\", \"path\": \"${doc_path}\", \"vitepress_link\": \"/${vitepress_link}\", \"score\": ${score}, \"iterations\": ${iterations}}")
done
```

### 步骤 6: 生成最终报告

创建最终报告 Markdown 文件：

```bash
cat > "${session_dir}/FINAL_REPORT.md" <<EOF
# Documentation Generation Report

**Session ID**: ${session_id}
**Generated At**: ${session_end}
**Total Execution Time**: ${total_execution_time}s ($(($total_execution_time / 60))m $(($total_execution_time % 60))s)

---

## Summary

- **Total Documents**: ${total_groups}
- **Average Quality Score**: ${average_score}/100
- **Pass Rate**: ${pass_rate}% (${pass_count}/${total_groups} documents with score >= 90)
- **Warning Rate**: $((warning_count * 100 / total_groups))% (${warning_count}/${total_groups} documents with score 70-89)
- **Fail Rate**: $((fail_count * 100 / total_groups))% (${fail_count}/${total_groups} documents with score < 70)
- **Average Iterations**: $(echo "scale=2; $total_iterations / $total_groups" | bc)
- **Parallel Speedup**: ${speedup}x (${parallel_count} concurrent generators)

---

## Generated Documents

| Group | Document | VitePress Link | Quality Score | Iterations | Status |
|-------|----------|----------------|---------------|------------|--------|
$(for doc in "${document_list[@]}"; do
  group=$(echo "$doc" | jq -r '.group')
  path=$(echo "$doc" | jq -r '.path')
  link=$(echo "$doc" | jq -r '.vitepress_link')
  score=$(echo "$doc" | jq -r '.score')
  iterations=$(echo "$doc" | jq -r '.iterations')
  status=$([ "$score" -ge 90 ] && echo "✅ Pass" || ([ "$score" -ge 70 ] && echo "⚠️ Warning" || echo "❌ Fail"))
  echo "| ${group} | \`${path}\` | [View](${link}) | ${score}/100 | ${iterations} | ${status} |"
done)

---

## Quality Metrics

### Score Distribution

- **90-100 (Excellent)**: ${pass_count} documents
- **70-89 (Good)**: ${warning_count} documents
- **0-69 (Needs Improvement)**: ${fail_count} documents

### Improvement Statistics

- **Total Improvement Iterations**: ${total_iterations}
- **Documents Requiring Improvement**: $((total_iterations > 0 ? total_groups - pass_count : 0))
- **Average Score Improvement**: $(echo "scale=2; $total_iterations / ($total_groups - $pass_count)" | bc 2>/dev/null || echo "N/A")

---

## Execution Performance

- **Total Execution Time**: ${total_execution_time}s
- **Average Group Time**: ${average_group_time}s
- **Sequential Estimate**: ${sequential_time}s
- **Parallel Speedup**: ${speedup}x
- **Parallel Efficiency**: $(echo "scale=2; $speedup / $parallel_count * 100" | bc)%

---

## Error Log

$(if [ ${#errors[@]} -eq 0 ]; then
  echo "No errors encountered during execution."
else
  echo "| Group | Error | Severity |"
  echo "|-------|-------|----------|"
  for error in "${errors[@]}"; do
    group=$(echo "$error" | jq -r '.group // "N/A"')
    error_msg=$(echo "$error" | jq -r '.error')
    severity=$(echo "$error" | jq -r '.severity')
    echo "| ${group} | ${error_msg} | ${severity} |"
  done
fi)

---

## Next Steps

$(if [ "$fail_count" -gt 0 ]; then
  echo "### Manual Review Required"
  echo ""
  echo "${fail_count} documents failed to reach quality threshold (score < 70) after maximum iterations."
  echo "Please review these documents manually and apply necessary improvements."
  echo ""
fi)

$(if [ "$warning_count" -gt 0 ]; then
  echo "### Quality Warnings"
  echo ""
  echo "${warning_count} documents have quality warnings (score 70-89)."
  echo "Consider reviewing these documents for potential improvements."
  echo ""
fi)

$(if [ "$pass_count" -eq "$total_groups" ]; then
  echo "### All Documents Passed"
  echo ""
  echo "All ${total_groups} documents met the quality threshold (score >= 90)."
  echo "Documentation generation completed successfully!"
  echo ""
fi)

---

## Workflow Session

- **Session Directory**: \`${session_dir}\`
- **File Groups Config**: \`${session_dir}/.process/file-groups.json\`
- **QA Reports**: \`${session_dir}/.summaries/qa-*.json\`
- **Improvement Reports**: \`${session_dir}/.summaries/improve-*.json\`

EOF
```

### 步骤 7: 执行集成测试

运行 3 个集成测试用例：

#### Test 1: 单文件生成测试

```bash
echo "Running Test 1: Single file generation"

# 测试单个文件的完整流程
test_file="packages/kit/src/is/is-array.ts"
test_result=$(/workflow:docs-generate --files "$test_file" --type api 2>&1)

# 验证输出
if echo "$test_result" | grep -q "Quality score: [89][0-9]\|100"; then
  echo "✅ Test 1 Passed: Single file generation successful"
  test1_status="pass"
else
  echo "❌ Test 1 Failed: Quality score below threshold"
  test1_status="fail"
fi
```

#### Test 2: 批量并行生成测试

```bash
echo "Running Test 2: Batch parallel generation"

# 测试 5 个文件的并行生成
test_files="packages/kit/src/is/is-array.ts,packages/kit/src/is/is-boolean.ts,packages/kit/src/is/is-function.ts,packages/kit/src/is/is-number.ts,packages/kit/src/is/is-object.ts"
test_result=$(/workflow:docs-generate --files "$test_files" --type api --parallel 3 2>&1)

# 验证并行执行
if echo "$test_result" | grep -q "Parallel speedup: [2-9]"; then
  echo "✅ Test 2 Passed: Parallel execution achieved speedup"
  test2_status="pass"
else
  echo "❌ Test 2 Failed: Parallel speedup not achieved"
  test2_status="fail"
fi
```

#### Test 3: 改进迭代测试

```bash
echo "Running Test 3: Improvement iteration"

# 测试改进循环（使用低质量文档触发改进）
test_file="packages/kit/src/complex-module.ts"
test_result=$(/workflow:docs-generate --files "$test_file" --type api 2>&1)

# 验证改进迭代
if echo "$test_result" | grep -q "Iteration [1-2].*Score improved"; then
  echo "✅ Test 3 Passed: Improvement iteration successful"
  test3_status="pass"
else
  echo "⚠️ Test 3 Skipped: No improvement needed (high initial quality)"
  test3_status="skip"
fi
```

### 步骤 8: 更新会话状态

标记会话为已完成：

```bash
# 更新会话状态
jq '.status = "completed" | .completed_at = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' "${session_dir}/workflow-session.json" > "${session_dir}/workflow-session.json.tmp"
mv "${session_dir}/workflow-session.json.tmp" "${session_dir}/workflow-session.json"

# 归档会话（可选）
# mkdir -p ".workflow/archives/"
# mv "${session_dir}" ".workflow/archives/"
```

---

## 错误处理

### 缺失 QA 报告

- 检查 Phase 3 是否成功完成
- 验证所有 groups 都有对应的 QA 报告
- 缺失的 groups 标记为失败

### 报告生成失败

- 检查文件系统权限
- 验证 session 目录结构
- 失败则输出错误日志到 stderr

### 集成测试失败

- 记录失败的测试用例
- 不阻止报告生成
- 在最终报告中标记测试状态

---

## 输出格式

### 最终报告（FINAL_REPORT.md）

包含 6 个主要部分：

1. **Summary**: 总体统计（文档数量、平均得分、通过率）
2. **Generated Documents**: 文档列表（带 VitePress 链接）
3. **Quality Metrics**: 质量指标（得分分布、改进统计）
4. **Execution Performance**: 执行性能（总时间、并行加速比）
5. **Error Log**: 错误日志（失败的 groups、警告）
6. **Next Steps**: 后续行动（人工审查建议）

### 集成测试报告

```json
{
  "test_results": [
    { "test": "single_file_generation", "status": "pass" },
    { "test": "batch_parallel_generation", "status": "pass" },
    { "test": "improvement_iteration", "status": "skip" }
  ],
  "overall_status": "pass"
}
```

---

## 成功标准

工作流被认为成功完成，当：

1. **所有文档生成**：所有 groups 都有对应的文档和 QA 报告
2. **质量阈值**：平均得分 >= 85，通过率 >= 80%
3. **无高严重性错误**：没有 severity="high" 的错误
4. **集成测试通过**：至少 2/3 的集成测试通过

如果不满足以上条件，会话标记为 "completed_with_warnings"。
