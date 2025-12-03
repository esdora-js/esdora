# Multi-Agent Documentation Workflow Orchestrator

根据文档规范系统，通过 5 阶段多 agent 协同工作流自动生成高质量文档，支持并行执行和独立质量验证。

## 使用方式

```bash
/workflow:docs-generate --files "path1,path2,..." --type api [--output "output/path"] [--ai-model codex] [--parallel 3] [--skip-type-gen]
```

### 示例

```bash
# 单文件 API 文档生成
/workflow:docs-generate --files "packages/biz/src/query/parse.ts" --type api

# 批量并行生成（5 个并发 generator）
/workflow:docs-generate --files "packages/kit/src/is/is-array.ts,packages/kit/src/is/is-empty.ts,packages/kit/src/is/is-circular.ts,packages/kit/src/is/is-object.ts,packages/kit/src/is/is-string.ts" --type api --parallel 5

# 架构文档（使用 Gemini）
/workflow:docs-generate --files "packages/biz/src/query/index.ts" --type architecture --ai-model gemini
```

## 参数说明

- `--files`: 源文件路径列表（逗号分隔，必需）
- `--type`: 文档类型（必需）
  - `api` - API 参考文档（函数、类、接口）
  - `architecture` - 架构设计文档（系统、模块）
  - `guide` - 用户指南（快速开始、教程）
  - `best-practices` - 最佳实践（代码规范、模式）
  - `contribution` - 贡献指南（开发流程）
- `--output`: 输出目录（可选，默认自动推断为 docs/packages/[package-name]/reference/）
- `--ai-model`: AI 模型选择（可选，默认 codex）
  - `codex` - 使用 Codex（推荐用于 API 文档）
  - `gemini` - 使用 Gemini（推荐用于架构/指南文档）
- `--skip-type-gen`: 跳过类型声明生成（可选，加快速度但可能降低准确性）
- `--parallel`: 并行 generator 数量（可选，默认 3，范围 1-5）

---

## 执行任务

### 核心职责：session_init + phase_orchestration + parallel_coordination

本命令作为 orchestrator 协调 5 个 workflow 阶段的执行：

1. **Phase 1**: docs-prepare（参数解析和文件分组）
2. **Phase 2**: docs-generate-single（并行文档生成）
3. **Phase 3**: docs-qa（独立质量验证）
4. **Phase 4**: docs-improve（迭代改进）
5. **Phase 5**: result-summarization（结果汇总）

### 步骤 1: session_init - 会话初始化

1. **创建 workflow 会话目录**

   ```bash
   timestamp=$(date +%s)
   session_id="WFS-docs-${timestamp}"
   mkdir -p ".workflow/active/${session_id}/.task"
   mkdir -p ".workflow/active/${session_id}/.summaries"
   mkdir -p ".workflow/active/${session_id}/.process"
   ```

2. **创建会话元数据文件**

   ```bash
   cat > ".workflow/active/${session_id}/workflow-session.json" <<EOF
   {
     "session_id": "${session_id}",
     "project": "Documentation Generation",
     "goal": "Generate ${type} documentation for ${file_count} files",
     "scope": "Multi-agent parallel documentation workflow",
     "context": "Files: ${files}",
     "status": "active",
     "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
   }
   EOF
   ```

3. **参数验证**
   - 检查 `--files` 和 `--type` 参数是否提供（必需）
   - 验证 `--type` 值是否在有效枚举中
   - 验证 `--ai-model` 值是否为 codex 或 gemini
   - 验证 `--parallel` 值是否在 1-5 范围内（如果超出范围，警告并 clamp 到有效范围）
   - 检查所有源文件是否存在

### 步骤 2: phase_orchestration - Phase 1 委托（docs-prepare）

调用 Phase 1 工具命令进行参数解析和文件分组：

```bash
/workflow:tools:docs-prepare \
  --session "${session_id}" \
  --files "${files}" \
  --type "${type}" \
  --output "${output}" \
  --ai-model "${ai_model}" \
  --skip-type-gen "${skip_type_gen}"
```

**Phase 1 输出**：

- 文件分组配置：`.workflow/active/${session_id}/.process/file-groups.json`
- 包含 N 个 group，每个 group 2-3 个文件
- 每个 group 包含：group_id, files, package_name, output_dir, type_declarations, test_files

### 步骤 3: parallel_coordination - Phase 2 并行执行（docs-generate-single）

**并行协调算法**：

1. **加载文件分组**

   ```bash
   groups=$(jq -r '.groups | length' ".workflow/active/${session_id}/.process/file-groups.json")
   parallel_count=${parallel:-3}  # 默认 3 个并发 generator
   ```

2. **创建 generator 任务队列**
   - 为每个 group 创建 task JSON：`IMPL-002.${group_index}.json`
   - 设置 `cli_execute=true` 标志
   - 包含完整的 CLI 命令（codex 或 gemini）

3. **分批并行执行**

   ```bash
   batch_size=$(( (groups + parallel_count - 1) / parallel_count ))  # ceiling division

   for batch_start in $(seq 0 $parallel_count $groups); do
     batch_end=$((batch_start + parallel_count - 1))
     [ $batch_end -ge $groups ] && batch_end=$((groups - 1))

     # 并行启动当前批次的 generators
     for group_idx in $(seq $batch_start $batch_end); do
       /workflow:tools:docs-generate-single \
         --session "${session_id}" \
         --group-id "group-$(printf '%03d' $group_idx)" &
     done

     # 等待当前批次完成
     wait
   done
   ```

**示例**：10 个文件分组，--parallel=3

- 批次 1: group-000, group-001, group-002（3 个并行）
- 批次 2: group-003, group-004, group-005（3 个并行）
- 批次 3: group-006, group-007, group-008（3 个并行）
- 批次 4: group-009（1 个）

### 步骤 4: phase_orchestration - Phase 3 质量验证（docs-qa）

对每个生成的文档执行独立 QA 验证：

```bash
for group_summary in ".workflow/active/${session_id}/.summaries"/IMPL-002.*.json; do
  group_id=$(jq -r '.group_id' "$group_summary")

  /workflow:tools:docs-qa \
    --session "${session_id}" \
    --group-id "${group_id}"
done
```

**Phase 3 输出**：

- QA 报告：`.workflow/active/${session_id}/.summaries/qa-${group_id}.json`
- 包含：quality_score (0-100), improvement_suggestions[], checklist_results{}

### 步骤 5: phase_orchestration - Phase 4 迭代改进（docs-improve）

对 QA 得分 < 90 的文档执行改进（最多 2 次迭代）：

```bash
for qa_report in ".workflow/active/${session_id}/.summaries"/qa-*.json; do
  score=$(jq -r '.quality_score' "$qa_report")
  group_id=$(jq -r '.group_id' "$qa_report")

  if [ "$score" -lt 90 ]; then
    /workflow:tools:docs-improve \
      --session "${session_id}" \
      --group-id "${group_id}" \
      --max-iterations 2
  fi
done
```

**Phase 4 输出**：

- 改进后的文档（覆盖原文档）
- 改进报告：`.workflow/active/${session_id}/.summaries/improve-${group_id}.json`

### 步骤 6: phase_orchestration - Phase 5 结果汇总（result-summarization）

生成最终报告并归档会话：

```bash
/workflow:tools:docs-result-summary --session "${session_id}"
```

**Phase 5 输出**：

- 最终报告：`.workflow/active/${session_id}/FINAL_REPORT.md`
- 包含：
  - 生成的文档列表（带 VitePress 链接）
  - 质量指标（平均得分、通过率）
  - 改进统计（迭代次数、改进幅度）
  - 执行时间（总时间、并行加速比）
  - 错误日志（如果有）

### 错误处理

**参数验证失败**：

- 缺少 --files 或 --type → 输出 usage 信息并退出
- 无效的 --type 值 → 列出有效选项并退出
- 无效的 --ai-model 值 → 列出有效选项并退出
- --parallel 超出范围 → 警告并 clamp 到 1-5

**Phase 执行失败**：

- CLI 工具超时 → 记录错误，继续其他 groups
- 文件未找到 → 跳过该 group，记录错误
- 类型声明生成失败 → 警告并继续（使用源文件推断类型）

**质量门槛失败**：

- QA 得分 < 90 且已达到最大迭代次数 → 接受文档，记录警告，建议人工审查

---

## 架构说明

### 5 阶段工作流

```
Phase 1: docs-prepare
    ↓ (file-groups.json)
Phase 2: docs-generate-single (parallel × N)
    ↓ (draft docs + self-assessment)
Phase 3: docs-qa (independent verification)
    ↓ (QA reports + improvement suggestions)
Phase 4: docs-improve (if score < 90, max 2 iterations)
    ↓ (improved docs)
Phase 5: result-summarization
    ↓ (FINAL_REPORT.md)
```

### Agent 角色

- **Orchestrator** (@action-planning-agent): 本命令，协调 5 个阶段
- **Generator** (@doc-generator): Phase 2，并行生成文档
- **QA Agent** (@universal-executor): Phase 3，独立质量验证

### 数据流契约

1. **Contract 1**: File Grouping Strategy（2-3 files per group）
2. **Contract 2**: Task JSON Schema（6-field format with cli_execute flag）
3. **Contract 3**: QA Feedback Format（score + improvement_suggestions）
4. **Contract 4**: Improvement Iteration Limit（max 2 cycles）

### 并行执行优势

- **加速比**：对于 5+ 文件，2-3x 加速（取决于 --parallel 值）
- **资源利用**：充分利用多核 CPU 和 API 并发限制
- **错误隔离**：每个 generator 独立会话，失败不影响其他

---

## 与 generate-docs 的区别

| 特性     | generate-docs | workflow:docs-generate       |
| -------- | ------------- | ---------------------------- |
| 执行模式 | 顺序执行      | 并行执行（可配置）           |
| QA 验证  | 内嵌自检      | 独立 QA agent                |
| 改进循环 | 无            | 最多 2 次迭代                |
| 会话管理 | 无            | Workflow 会话（WFS-docs-\*） |
| 错误隔离 | 单点失败      | 独立 agent 会话              |
| 适用场景 | 1-3 个文件    | 5-20 个文件                  |

**向后兼容性**：generate-docs 命令保持不变，workflow:docs-generate 作为增强版本提供。
