---
title: 文档质量验证标准与检查清单
description: 定义文档质量的 6 个通用维度、5 类文档的特定检查项、3 级评分体系和自动化验证方法,确保 Dora Pocket 文档的高质量和一致性。
category: 贡献
---

# 文档质量验证标准与检查清单

本文档定义了 Dora Pocket 文档系统的质量验证标准,包括 **6 个通用质量维度**、**5 类文档的特定检查清单**和 **3 级质量评分体系**。

## 概述

### 质量验证目标

- **确保准确性**: 文档内容与代码实现完全一致
- **保证完整性**: 覆盖所有必需信息,无遗漏
- **提升清晰度**: 表达简洁明了,易于理解
- **维护一致性**: 遵循统一的规范和风格
- **优化可用性**: 提供可执行的示例和实用的指导
- **规范中文表达**: 符合中文技术文档写作习惯

### 验证流程

1. **通用标准检查**: 验证 6 个通用质量维度
2. **类型特定检查**: 根据文档类型验证特定检查项
3. **质量评分**: 使用评分公式计算质量分数
4. **等级判定**: 根据分数确定质量等级(优秀/良好/需改进)
5. **改进建议**: 针对低分项目提供具体改进方向

## 通用质量标准 (6 个维度)

### 1. 准确性 (Accuracy)

**定义**: 文档内容与代码实现、API 签名、测试用例完全一致,无错误或过时信息。

**检查点**:

- [ ] **类型签名准确**: 函数签名、参数类型、返回值类型与源码完全一致

  ````bash
  # 验证方法: 比对源码和文档中的类型定义
  diff <(rg "function functionName" packages/*/src -A 5) <(rg "```typescript" docs/ -A 5)
  ````

- [ ] **示例输出正确**: 所有 `// =>` 注释的输出结果准确无误

  ```bash
  # 验证方法: 复制示例代码到 TypeScript 文件运行,确保输出一致
  # 示例: node -e "const result = functionName(input); console.log(result)"
  ```

- [ ] **参数说明一致**: 参数表格中的类型和描述与 JSDoc 注释一致
  ```bash
  # 验证方法: 检查 JSDoc 注释与文档参数表格的一致性
  rg "@param" packages/*/src --type ts -C 2
  ```

**自动化验证**:

````bash
# 检查文档中的函数签名数量 (应与源码数量一致)
grep -c "```typescript" docs/packages/kit/reference/**/*.md
rg -c "^export (function|const)" packages/kit/src/**/*.ts
````

### 2. 完整性 (Completeness)

**定义**: 文档包含所有必需的章节、字段和信息,无关键内容遗漏。

**检查点**:

- [ ] **Frontmatter 完整**: `title` 和 `description` 字段存在且非空

  ```bash
  # 验证方法: 检查 frontmatter 必需字段
  rg "^---$" docs/ -A 5 -B 1 | rg "title:|description:" -c
  ```

- [ ] **必需章节存在**: 根据文档类型包含所有必需章节

  ```bash
  # API 文档: 示例、签名与说明、注意事项、相关链接
  rg "## 示例|## 签名与说明|## 注意事项|## 相关链接" docs/packages/*/reference/ -c

  # 架构文档: 概述、设计决策、系统结构、技术栈、权衡分析
  rg "## 概述|## 设计决策|## 系统结构|## 技术栈|## 权衡分析" docs/ -c
  ```

- [ ] **边界情况覆盖**: 文档说明了特殊输入、错误处理和已知限制
  ```bash
  # 验证方法: 检查是否包含边界情况说明
  rg "边界情况|特殊情况|错误处理|已知限制" docs/ --type md -c
  ```

**自动化验证**:

```bash
# 检查文档是否包含必需章节 (以 API 文档为例)
for file in docs/packages/kit/reference/**/*.md; do
  if ! grep -q "## 示例" "$file" || ! grep -q "## 签名与说明" "$file"; then
    echo "Missing required sections: $file"
  fi
done
```

### 3. 清晰度 (Clarity)

**定义**: 文档表达简洁明了,避免冗长和模糊,使用准确的技术术语。

**检查点**:

- [ ] **描述简洁**: 单个句子不超过 30 个中文字符 (或 50 个英文单词)

  ```bash
  # 验证方法: 检查文档中的长句
  # (手动检查,工具辅助识别超长段落)
  awk 'length > 100' docs/**/*.md
  ```

- [ ] **术语准确**: 使用 [术语表](./glossary.md) 中定义的统一术语

  ```bash
  # 验证方法: 检查是否使用规范术语
  rg "Codex|Gemini|Qwen|API 文档|架构文档|用户指南|最佳实践|贡献指南" docs/contributing/documentation/ -c
  ```

- [ ] **示例清晰**: 代码示例包含必要的 import 语句,可独立运行
  ````bash
  # 验证方法: 检查代码块是否包含 import 语句
  rg "```typescript" docs/ -A 5 | rg "^import" -c
  ````

**自动化验证**:

````bash
# 检查示例代码是否包含 import (示例)
rg "```typescript" docs/packages/kit/reference/ -A 3 | grep -c "import.*from"
````

### 4. 一致性 (Consistency)

**定义**: 文档遵循统一的格式、命名、结构和风格,符合 Layer 1-3 规范。

**检查点**:

- [ ] **章节顺序一致**: 同类型文档的章节顺序相同

  ```bash
  # 验证方法: 比对同类型文档的章节结构
  rg "^## " docs/packages/kit/reference/is/*.md | sort | uniq -c
  ```

- [ ] **命名规范统一**: 文件名、函数名、变量名遵循统一规范

  ```bash
  # 验证方法: 检查文件命名是否为 kebab-case
  find docs/packages/ -name "*.md" | grep -v "[a-z-]*\.md"
  ```

- [ ] **代码格式一致**: 所有代码块标注语言,使用相同的缩进风格
  ````bash
  # 验证方法: 检查代码块是否标注语言
  rg "```$" docs/ -c  # 应为 0 (所有代码块都应标注语言)
  ````

**自动化验证**:

````bash
# 检查代码块是否都标注了语言
if rg '```$' docs/ --type md; then
  echo "Found code blocks without language tag"
fi
````

### 5. 可用性 (Usability)

**定义**: 文档提供实用的示例、可执行的命令和清晰的操作指导。

**检查点**:

- [ ] **示例可运行**: 代码示例可以直接复制运行,无需修改

  ```bash
  # 验证方法: 提取示例代码到临时文件,运行测试
  # (需要手动或脚本自动化执行)
  ```

- [ ] **命令完整**: 所有 bash 命令包含必要的上下文和参数说明

  ````bash
  # 验证方法: 检查 bash 代码块是否包含注释
  rg "```bash" docs/contributing/ -A 5 | rg "^#" -c
  ````

- [ ] **链接有效**: 所有内部链接和外部链接可访问
  ```bash
  # 验证方法: 使用链接检查工具 (如 markdown-link-check)
  npx markdown-link-check docs/**/*.md
  ```

**自动化验证**:

```bash
# 检查文档中的链接有效性
npx markdown-link-check docs/contributing/documentation/*.md --quiet
```

### 6. 中文规范 (Chinese Standards)

**定义**: 中文表达符合技术文档写作习惯,无语法错误和生硬翻译。

**检查点**:

- [ ] **术语中文化**: 专业术语使用简体中文且符合术语表

  ```bash
  # 验证方法: 检查是否使用规范的中文术语
  rg "文档规范|质量标准|AI 模型|模板系统" docs/contributing/documentation/ -c
  ```

- [ ] **表达自然**: 避免直译英文的生硬表达,使用主动语态

  ```bash
  # 验证方法: 手动审查,检查表达流畅性
  # 避免: "可以被用来...", 推荐: "用于..."
  ```

- [ ] **标点符号正确**: 使用中文标点符号 (、。！？),英文内容使用英文标点
  ```bash
  # 验证方法: 检查中文句子是否使用中文标点
  rg "[a-zA-Z]。|[a-zA-Z]，" docs/ --type md -c  # 应为 0
  ```

**自动化验证**:

```bash
# 检查是否混用中英文标点 (简单检测)
rg "[a-zA-Z][,.][\u4e00-\u9fa5]|[\u4e00-\u9fa5][,.][\u4e00-\u9fa5]" docs/ --type md
```

## 类型特定检查清单 (5 类文档)

### 1. API 文档检查清单 (4 项)

**适用范围**: 函数、类、接口等编程接口文档 (如 `@esdora/kit` 函数文档)

#### 检查项 1: 类型准确性

- [ ] **函数签名完整**: 包含完整的 TypeScript 类型定义,含泛型、约束、联合类型

  ````bash
  # 验证: 检查签名章节是否存在且包含 TypeScript 代码块
  rg "### 类型签名" docs/packages/ -A 5 | rg "```typescript" -c
  ````

- [ ] **参数表格准确**: 参数名、类型、描述、必需性与源码一致

  ```bash
  # 验证: 检查参数表格格式
  rg "| 参数 | 类型 | 描述 | 必需 |" docs/packages/ -c
  ```

- [ ] **泛型约束说明**: 泛型参数有清晰的约束说明和用途解释
  ```bash
  # 验证: 检查泛型约束章节
  rg "### 泛型约束" docs/packages/ -c
  ```

#### 检查项 2: 边界情况覆盖

- [ ] **边界情况文档化**: 所有测试用例中的边界情况都在文档中说明

  ```bash
  # 验证: 检查是否包含边界情况章节
  rg "### 输入边界|### 边界情况" docs/packages/ -c
  ```

- [ ] **错误处理完整**: 说明可能抛出的异常类型和处理建议
  ```bash
  # 验证: 检查错误处理章节
  rg "### 错误处理" docs/packages/ -c
  ```

#### 检查项 3: 示例完整性

- [ ] **基本用法示例**: 至少包含 1 个基本用法示例,含 import 语句和输出注释

  ```bash
  # 验证: 检查基本用法章节
  rg "### 基本用法" docs/packages/ -A 10 | rg "import.*from|// =>" -c
  ```

- [ ] **高级场景示例**: 复杂 API 包含 2-3 个高级使用场景
  ```bash
  # 验证: 检查是否有多个示例场景
  rg "### [^\n]*场景|### [^\n]*用法" docs/packages/ -c
  ```

#### 检查项 4: 性能说明

- [ ] **复杂度标注**: 标注时间复杂度和空间复杂度 (如适用)
  ```bash
  # 验证: 检查性能考虑章节
  rg "### 性能考虑|时间复杂度|空间复杂度" docs/packages/ -c
  ```

**质量验证命令**:

```bash
# API 文档完整性检查脚本
for file in docs/packages/kit/reference/**/*.md; do
  echo "Checking: $file"

  # 检查必需章节
  grep -q "## 示例" "$file" || echo "  ❌ Missing 示例 section"
  grep -q "## 签名与说明" "$file" || echo "  ❌ Missing 签名与说明 section"
  grep -q "## 注意事项" "$file" || echo "  ❌ Missing 注意事项 section"

  # 检查示例格式
  grep -q "import.*from" "$file" || echo "  ⚠️  Missing import statement"
  grep -q "// =>" "$file" || echo "  ⚠️  Missing output comments"
done
```

### 2. 架构文档检查清单 (4 项)

**适用范围**: 系统设计、技术选型、架构决策文档

#### 检查项 1: 设计决策完整性

- [ ] **ADR 格式**: 使用 ADR (Architecture Decision Record) 格式记录关键决策

  ```bash
  # 验证: 检查 ADR 章节结构
  rg "## 设计决策|### 背景|### 考虑的方案|### 最终决策" docs/ -c
  ```

- [ ] **方案对比**: 每个决策包含至少 2 个备选方案及其优缺点
  ```bash
  # 验证: 检查方案对比内容
  rg "方案A|方案B|优点|缺点" docs/ -c
  ```

#### 检查项 2: 图表清晰度

- [ ] **Mermaid 图表**: 必须包含架构可视化图表 (Mermaid 格式)

  ````bash
  # 验证: 检查 Mermaid 图表存在
  rg "```mermaid" docs/ -c
  ````

- [ ] **图表说明**: 每个图表后有文字解释,节点和边的标签清晰
  ````bash
  # 验证: 检查图表后是否有说明文字
  rg "```mermaid" docs/ -A 20 | rg "^###|^-" -c
  ````

#### 检查项 3: 技术选型论证

- [ ] **选择理由**: 所有技术选择都有明确的理由和权衡说明

  ```bash
  # 验证: 检查技术栈章节
  rg "## 技术栈|选择理由|用途" docs/ -c
  ```

- [ ] **版本要求**: 明确核心依赖的版本要求和兼容性说明
  ```bash
  # 验证: 检查版本信息
  rg "版本|>= \d+\.\d+|Node.js|TypeScript" docs/ -c
  ```

#### 检查项 4: 权衡分析深度

- [ ] **优势和限制**: 诚实说明当前设计的优势和已知限制

  ```bash
  # 验证: 检查权衡分析章节
  rg "## 权衡分析|### 优势|### 限制|### 风险" docs/ -c
  ```

- [ ] **缓解措施**: 对每个风险提供缓解措施或改进方向
  ```bash
  # 验证: 检查缓解措施说明
  rg "缓解|改进方向|替代方案" docs/ -c
  ```

**质量验证命令**:

````bash
# 架构文档质量检查
for file in docs/contributing/documentation/architecture*.md; do
  echo "Checking: $file"

  # 检查 Mermaid 图表
  if ! grep -q '```mermaid' "$file"; then
    echo "  ❌ Missing Mermaid diagram"
  fi

  # 检查设计决策章节
  if ! grep -q "## 设计决策" "$file"; then
    echo "  ⚠️  Missing design decisions section"
  fi
done
````

### 3. 用户指南检查清单 (3 项)

**适用范围**: 快速上手、操作手册、使用教程

#### 检查项 1: 示例可运行性

- [ ] **完整上下文**: 所有示例包含必要的 import、安装命令和环境配置

  ````bash
  # 验证: 检查示例完整性
  rg "```bash.*install|```typescript.*import" docs/guide/ -c
  ````

- [ ] **输出验证**: 示例提供预期结果和验证方法
  ```bash
  # 验证: 检查预期结果说明
  rg "预期结果|应该看到|输出" docs/guide/ -c
  ```

#### 检查项 2: 概念解释清晰度

- [ ] **术语定义**: 关键术语有简明定义,避免过度技术化

  ```bash
  # 验证: 检查核心概念章节
  rg "## 核心概念|### 关键术语|### 工作原理" docs/guide/ -c
  ```

- [ ] **类比辅助**: 使用类比或图表帮助理解复杂概念
  ````bash
  # 验证: 检查是否有辅助说明
  rg "```mermaid|类似于|可以理解为" docs/guide/ -c
  ````

#### 检查项 3: 问题覆盖全面性

- [ ] **常见问题数量**: 至少包含 5 个典型用户疑问

  ```bash
  # 验证: 统计常见问题数量
  rg "^### [如何|为什么|怎么|遇到].*\?" docs/guide/ -c
  ```

- [ ] **解决方案完整**: 每个问题都有直接可行的解决方案或排查步骤
  ```bash
  # 验证: 检查解决方案结构
  rg "解决|步骤|方法" docs/guide/ -c
  ```

**质量验证命令**:

````bash
# 用户指南质量检查
for file in docs/guide/**/*.md; do
  echo "Checking: $file"

  # 检查快速开始章节
  if ! grep -q "## 快速开始" "$file"; then
    echo "  ⚠️  Missing quick start section"
  fi

  # 检查示例代码
  if ! grep -q "```typescript" "$file" && ! grep -q "```bash" "$file"; then
    echo "  ⚠️  Missing code examples"
  fi
done
````

### 4. 最佳实践检查清单 (3 项)

**适用范围**: 设计模式、代码规范、性能优化指南

#### 检查项 1: 规范实用性

- [ ] **条目具体**: 所有规范条目清晰具体,可直接应用于项目

  ```bash
  # 验证: 检查规范章节结构
  rg "## 代码规范|### 命名规范|### 代码格式" docs/ -c
  ```

- [ ] **可操作性**: 避免模糊或抽象的描述,提供明确的指导
  ```bash
  # 验证: 检查是否包含具体规则
  rg "✅ 推荐|❌ 不推荐|规则|要求" docs/ -c
  ```

#### 检查项 2: 示例代码质量

- [ ] **对比示例**: 每个重要实践点都有好/坏实践的对比示例

  ```bash
  # 验证: 检查对比标记
  rg "✅ 推荐|❌ 不推荐|好的实践|不好的实践" docs/ -c
  ```

- [ ] **原因说明**: 对比示例附带详细的原因说明和适用场景
  ```bash
  # 验证: 检查原因说明
  rg "原因|为什么|适用场景|优势" docs/ -c
  ```

#### 检查项 3: 安全建议完整性

- [ ] **漏洞覆盖**: 安全实践章节至少覆盖 3 种常见漏洞类型

  ```bash
  # 验证: 统计安全主题数量
  rg "### 防止.*攻击|### .*安全|### .*验证" docs/ -c
  ```

- [ ] **防护代码**: 每种漏洞都有具体的防护代码示例
  ````bash
  # 验证: 检查安全示例
  rg "```typescript" docs/contributing/best-practices.md -A 10 | rg "XSS|SQL|CSRF" -c
  ````

**质量验证命令**:

```bash
# 最佳实践文档质量检查
for file in docs/contributing/*best-practices*.md; do
  echo "Checking: $file"

  # 检查对比示例
  good_count=$(grep -c "✅ 推荐" "$file" || echo 0)
  bad_count=$(grep -c "❌ 不推荐" "$file" || echo 0)

  if [ "$good_count" -lt 3 ] || [ "$bad_count" -lt 3 ]; then
    echo "  ⚠️  Insufficient comparison examples (good: $good_count, bad: $bad_count)"
  fi
done
```

### 5. 贡献指南检查清单 (3 项)

**适用范围**: CONTRIBUTING.md、开发流程说明、提交规范

#### 检查项 1: 流程完整性

- [ ] **步骤无遗漏**: 从环境搭建到 PR 合并的每个步骤都有清晰指令

  ```bash
  # 验证: 检查完整流程
  rg "## 开始贡献|## 开发流程|## 代码审查|## 提交规范" docs/contributing/ -c
  ```

- [ ] **命令完整**: 所有命令包含必要的上下文、参数和注释
  ````bash
  # 验证: 检查命令示例
  rg "```bash" docs/contributing/ -A 5 | rg "^#|git|pnpm|npm" -c
  ````

#### 检查项 2: Checklist 实用性

- [ ] **检查项具体**: 所有检查清单项目具体可操作,可用于自查

  ```bash
  # 验证: 统计 checklist 数量
  rg "- \[ \]" docs/contributing/ -c
  ```

- [ ] **覆盖全面**: Checklist 覆盖代码质量、测试、文档、格式等方面
  ```bash
  # 验证: 检查 checklist 类型
  rg "- \[ \].*测试|格式|文档|构建" docs/contributing/ -c
  ```

#### 检查项 3: 规范可操作性

- [ ] **提交规范示例**: 包含符合 Conventional Commits 的提交示例

  ```bash
  # 验证: 检查提交示例
  rg "feat\(|fix\(|docs\(|test\(" docs/contributing/ -c
  ```

- [ ] **测试规范明确**: 明确测试覆盖率要求和测试编写指南
  ```bash
  # 验证: 检查测试规范
  rg "覆盖率|>= 80%|测试编写|AAA 模式" docs/contributing/ -c
  ```

**质量验证命令**:

```bash
# 贡献指南质量检查
file="docs/contributing/CONTRIBUTING.md"

if [ -f "$file" ]; then
  echo "Checking: $file"

  # 检查必需章节
  for section in "环境准备" "分支策略" "测试规范" "提交规范"; do
    if ! grep -q "$section" "$file"; then
      echo "  ❌ Missing section: $section"
    fi
  done

  # 检查 Conventional Commits 示例
  if ! grep -q "feat(" "$file" && ! grep -q "fix(" "$file"; then
    echo "  ⚠️  Missing commit message examples"
  fi
fi
```

## 质量评分体系 (3 级)

### 评分公式

**总分计算**:

```
总分 = 通用维度得分 × 60% + 类型特定得分 × 40%
```

**通用维度得分**:

```
通用维度得分 = (准确性 + 完整性 + 清晰度 + 一致性 + 可用性 + 中文规范) / 6
```

- 每个维度满分 100 分
- 每个检查点占该维度的等分权重

**类型特定得分**:

```
类型特定得分 = (检查项1 + 检查项2 + 检查项3 + ...) / 检查项总数
```

- API 文档: 4 个检查项,每项 25 分
- 架构文档: 4 个检查项,每项 25 分
- 用户指南: 3 个检查项,每项 33.33 分
- 最佳实践: 3 个检查项,每项 33.33 分
- 贡献指南: 3 个检查项,每项 33.33 分

### 等级标准

#### 优秀 (90-100 分)

**定义**: 文档质量卓越,所有维度达标,具备创新性、深度和易用性。

**标准**:

- ✅ 6 个通用维度得分均 >= 85 分
- ✅ 类型特定检查项得分均 >= 90 分
- ✅ 具备以下 3 个加分项中的至少 2 个:
  - **创新性**: 提供独特的见解或创新的示例
  - **深度**: 不仅说明"怎么做",更解释"为什么"
  - **易用性**: 提供自动化脚本、工具或交互式示例

**示例**:

- 优秀的 API 文档: [is-circular.md](../packages/kit/reference/is/is-circular.md)
  - 类型签名完整,参数表格准确,边界情况详尽
  - 包含性能复杂度分析 (创新性)
  - 提供多个实际使用场景示例 (易用性)

- 优秀的架构文档: [architecture.md](./architecture.md)
  - Mermaid 图表清晰,设计决策有 ADR 记录
  - 深入说明分层继承理念和设计原则 (深度)
  - 提供完整的继承路径示例 (易用性)

#### 良好 (70-89 分)

**定义**: 文档质量合格,核心维度达标,但存在 2 个可改进项。

**标准**:

- ✅ 6 个通用维度得分均 >= 70 分
- ✅ 类型特定检查项得分均 >= 70 分
- ⚠️ 存在以下 2 个改进方向:
  - **完整性**: 边界情况或性能考虑说明不够详细
  - **示例质量**: 示例数量不足或缺少高级场景

**改进建议**:

1. **补充边界情况**: 参考测试用例,添加特殊输入处理说明
2. **增加示例场景**: 至少提供 2-3 个不同使用场景的示例

**示例**:

- 良好的 API 文档:
  - 基本章节完整,类型签名准确
  - 但缺少性能复杂度说明 (改进项 1)
  - 仅有基本用法示例,缺少高级场景 (改进项 2)

#### 需改进 (<70 分)

**定义**: 文档存在 1+ 个关键问题,影响准确性、完整性或中文规范。

**关键问题**:

1. **准确性问题**: 类型签名错误、示例输出不准确、参数说明与源码不一致
2. **完整性问题**: 缺少必需章节、边界情况未说明、错误处理缺失
3. **中文规范问题**: 术语不统一、表达生硬、标点符号错误

**改进步骤**:

1. **优先修复准确性问题**: 对比源码和测试用例,纠正错误信息
2. **补充缺失章节**: 根据文档类型添加必需章节和内容
3. **规范中文表达**: 参考术语表,使用自然流畅的中文表达

**示例**:

- 需改进的 API 文档:
  - ❌ 类型签名缺少泛型约束 (准确性问题)
  - ❌ 缺少"注意事项与边界情况"章节 (完整性问题)
  - ❌ 使用"可以被用来..."等生硬表达 (中文规范问题)

## 自动化验证脚本

### 完整质量检查脚本

创建 `scripts/check-doc-quality.sh` 脚本:

````bash
#!/bin/bash
# 文档质量自动化检查脚本
# 用法: ./scripts/check-doc-quality.sh <file-path>

set -e

FILE="$1"
if [ -z "$FILE" ]; then
  echo "Usage: $0 <markdown-file>"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "Error: File not found: $FILE"
  exit 1
fi

echo "======================================"
echo "文档质量检查: $FILE"
echo "======================================"

SCORE=0
MAX_SCORE=100

# ============================================
# 通用质量检查 (60 分权重)
# ============================================

echo ""
echo "## 通用质量检查 (60%)"
echo ""

# 1. 准确性检查 (10 分)
echo "### 1. 准确性 (10 分)"
accuracy_score=0

if grep -q "```typescript" "$FILE"; then
  ((accuracy_score+=3))
  echo "  ✅ [+3] 包含 TypeScript 代码块"
fi

if grep -q "// =>" "$FILE"; then
  ((accuracy_score+=4))
  echo "  ✅ [+4] 包含输出注释"
fi

if grep -q "| 参数 | 类型 |" "$FILE"; then
  ((accuracy_score+=3))
  echo "  ✅ [+3] 包含参数表格"
fi

echo "  准确性得分: $accuracy_score / 10"
SCORE=$((SCORE + accuracy_score))

# 2. 完整性检查 (10 分)
echo ""
echo "### 2. 完整性 (10 分)"
completeness_score=0

if grep -q "^title:" "$FILE" && grep -q "^description:" "$FILE"; then
  ((completeness_score+=3))
  echo "  ✅ [+3] Frontmatter 完整"
fi

if grep -q "## 示例" "$FILE"; then
  ((completeness_score+=2))
  echo "  ✅ [+2] 包含示例章节"
fi

if grep -q "## 签名\|## 概述\|## 快速开始" "$FILE"; then
  ((completeness_score+=2))
  echo "  ✅ [+2] 包含核心章节"
fi

if grep -q "注意事项\|边界情况\|错误处理" "$FILE"; then
  ((completeness_score+=3))
  echo "  ✅ [+3] 包含边界情况说明"
fi

echo "  完整性得分: $completeness_score / 10"
SCORE=$((SCORE + completeness_score))

# 3. 清晰度检查 (10 分)
echo ""
echo "### 3. 清晰度 (10 分)"
clarity_score=0

if grep -q "import.*from" "$FILE"; then
  ((clarity_score+=4))
  echo "  ✅ [+4] 示例包含 import 语句"
fi

# 检查是否有过长的段落 (简单启发式)
long_lines=$(awk 'length > 150' "$FILE" | wc -l)
if [ "$long_lines" -lt 5 ]; then
  ((clarity_score+=3))
  echo "  ✅ [+3] 段落长度适中"
else
  echo "  ⚠️  [+0] 存在过长段落 ($long_lines 行)"
fi

if grep -q "Codex\|Gemini\|API 文档\|架构文档" "$FILE"; then
  ((clarity_score+=3))
  echo "  ✅ [+3] 使用规范术语"
fi

echo "  清晰度得分: $clarity_score / 10"
SCORE=$((SCORE + clarity_score))

# 4. 一致性检查 (10 分)
echo ""
echo "### 4. 一致性 (10 分)"
consistency_score=0

# 检查代码块是否标注语言
untagged_blocks=$(grep -c '```$' "$FILE" || echo 0)
if [ "$untagged_blocks" -eq 0 ]; then
  ((consistency_score+=5))
  echo "  ✅ [+5] 所有代码块标注语言"
else
  echo "  ❌ [+0] 存在未标注语言的代码块 ($untagged_blocks 个)"
fi

# 检查章节标题格式
if grep -q "^## " "$FILE"; then
  ((consistency_score+=5))
  echo "  ✅ [+5] 章节标题格式正确"
fi

echo "  一致性得分: $consistency_score / 10"
SCORE=$((SCORE + consistency_score))

# 5. 可用性检查 (10 分)
echo ""
echo "### 5. 可用性 (10 分)"
usability_score=0

if grep -q "```bash" "$FILE"; then
  ((usability_score+=4))
  echo "  ✅ [+4] 包含可执行命令"
fi

if grep -q "\[.*\](\.\/.*\.md)" "$FILE"; then
  ((usability_score+=3))
  echo "  ✅ [+3] 包含内部链接"
fi

if grep -q "预期结果\|输出\|应该" "$FILE"; then
  ((usability_score+=3))
  echo "  ✅ [+3] 提供预期结果说明"
fi

echo "  可用性得分: $usability_score / 10"
SCORE=$((SCORE + usability_score))

# 6. 中文规范检查 (10 分)
echo ""
echo "### 6. 中文规范 (10 分)"
chinese_score=0

# 检查是否使用中文术语
if grep -q "文档规范\|质量标准\|AI 模型" "$FILE"; then
  ((chinese_score+=5))
  echo "  ✅ [+5] 使用规范中文术语"
fi

# 简单检查中英文标点混用 (启发式)
mixed_punct=$(grep -o "[a-zA-Z][,.][\u4e00-\u9fa5]" "$FILE" | wc -l || echo 0)
if [ "$mixed_punct" -lt 3 ]; then
  ((chinese_score+=5))
  echo "  ✅ [+5] 标点符号使用正确"
else
  echo "  ⚠️  [+2] 可能存在中英文标点混用"
  ((chinese_score+=2))
fi

echo "  中文规范得分: $chinese_score / 10"
SCORE=$((SCORE + chinese_score))

# ============================================
# 类型特定检查 (40 分权重)
# ============================================

echo ""
echo "## 类型特定检查 (40%)"
echo ""

# 检测文档类型
DOC_TYPE="unknown"
if grep -q "## 签名与说明" "$FILE"; then
  DOC_TYPE="api"
elif grep -q "## 设计决策\|## 系统结构" "$FILE"; then
  DOC_TYPE="architecture"
elif grep -q "## 快速开始\|## 核心概念" "$FILE"; then
  DOC_TYPE="guide"
elif grep -q "## 代码规范\|## 设计模式" "$FILE"; then
  DOC_TYPE="best-practices"
elif grep -q "## 开始贡献\|## 提交规范" "$FILE"; then
  DOC_TYPE="contribution"
fi

echo "检测到文档类型: $DOC_TYPE"
echo ""

type_score=0

case $DOC_TYPE in
  api)
    echo "### API 文档检查 (40 分)"

    # 检查项 1: 类型准确性 (10 分)
    if grep -q "### 类型签名" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含类型签名"
    fi

    # 检查项 2: 边界情况 (10 分)
    if grep -q "### 输入边界\|### 错误处理" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含边界情况说明"
    fi

    # 检查项 3: 示例完整性 (10 分)
    if grep -q "### 基本用法" "$FILE"; then
      ((type_score+=5))
      echo "  ✅ [+5] 包含基本用法"
    fi

    advanced_examples=$(grep -c "### [^\n]*场景\|### [^\n]*用法" "$FILE" || echo 0)
    if [ "$advanced_examples" -ge 2 ]; then
      ((type_score+=5))
      echo "  ✅ [+5] 包含高级场景示例"
    fi

    # 检查项 4: 性能说明 (10 分)
    if grep -q "时间复杂度\|空间复杂度\|性能考虑" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含性能说明"
    fi
    ;;

  architecture)
    echo "### 架构文档检查 (40 分)"

    # 检查项 1: 设计决策 (10 分)
    if grep -q "## 设计决策" "$FILE" && grep -q "### 背景\|### 方案" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含 ADR 格式决策"
    fi

    # 检查项 2: 图表清晰度 (10 分)
    if grep -q "```mermaid" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含 Mermaid 图表"
    fi

    # 检查项 3: 技术选型 (10 分)
    if grep -q "## 技术栈\|选择理由" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含技术选型论证"
    fi

    # 检查项 4: 权衡分析 (10 分)
    if grep -q "## 权衡分析\|### 优势\|### 限制" "$FILE"; then
      ((type_score+=10))
      echo "  ✅ [+10] 包含权衡分析"
    fi
    ;;

  guide)
    echo "### 用户指南检查 (40 分)"

    # 检查项 1: 示例可运行性 (13 分)
    if grep -q "```bash.*install\|```typescript.*import" "$FILE"; then
      ((type_score+=13))
      echo "  ✅ [+13] 示例包含完整上下文"
    fi

    # 检查项 2: 概念清晰度 (13 分)
    if grep -q "## 核心概念\|### 关键术语" "$FILE"; then
      ((type_score+=13))
      echo "  ✅ [+13] 包含概念解释"
    fi

    # 检查项 3: 问题覆盖 (14 分)
    faq_count=$(grep -c "^### [如何|为什么|怎么|遇到].*?" "$FILE" || echo 0)
    if [ "$faq_count" -ge 5 ]; then
      ((type_score+=14))
      echo "  ✅ [+14] 常见问题覆盖充分 ($faq_count 个)"
    elif [ "$faq_count" -ge 3 ]; then
      ((type_score+=7))
      echo "  ⚠️  [+7] 常见问题覆盖一般 ($faq_count 个)"
    fi
    ;;

  best-practices)
    echo "### 最佳实践检查 (40 分)"

    # 检查项 1: 规范实用性 (13 分)
    if grep -q "## 代码规范\|### 命名规范" "$FILE"; then
      ((type_score+=13))
      echo "  ✅ [+13] 包含具体规范条目"
    fi

    # 检查项 2: 示例质量 (14 分)
    good_count=$(grep -c "✅ 推荐" "$FILE" || echo 0)
    bad_count=$(grep -c "❌ 不推荐" "$FILE" || echo 0)
    if [ "$good_count" -ge 3 ] && [ "$bad_count" -ge 3 ]; then
      ((type_score+=14))
      echo "  ✅ [+14] 包含充足对比示例"
    elif [ "$good_count" -ge 1 ] && [ "$bad_count" -ge 1 ]; then
      ((type_score+=7))
      echo "  ⚠️  [+7] 对比示例较少"
    fi

    # 检查项 3: 安全建议 (13 分)
    security_count=$(grep -c "### 防止.*攻击\|### .*安全\|### .*验证" "$FILE" || echo 0)
    if [ "$security_count" -ge 3 ]; then
      ((type_score+=13))
      echo "  ✅ [+13] 安全建议覆盖充分"
    elif [ "$security_count" -ge 1 ]; then
      ((type_score+=6))
      echo "  ⚠️  [+6] 安全建议覆盖一般"
    fi
    ;;

  contribution)
    echo "### 贡献指南检查 (40 分)"

    # 检查项 1: 流程完整性 (13 分)
    if grep -q "## 开始贡献\|## 开发流程\|## 提交规范" "$FILE"; then
      ((type_score+=13))
      echo "  ✅ [+13] 流程步骤完整"
    fi

    # 检查项 2: Checklist 实用性 (14 分)
    checklist_count=$(grep -c "- \[ \]" "$FILE" || echo 0)
    if [ "$checklist_count" -ge 10 ]; then
      ((type_score+=14))
      echo "  ✅ [+14] Checklist 充足 ($checklist_count 项)"
    elif [ "$checklist_count" -ge 5 ]; then
      ((type_score+=7))
      echo "  ⚠️  [+7] Checklist 一般 ($checklist_count 项)"
    fi

    # 检查项 3: 规范可操作性 (13 分)
    if grep -q "feat(\|fix(\|docs(" "$FILE"; then
      ((type_score+=13))
      echo "  ✅ [+13] 包含提交规范示例"
    fi
    ;;

  *)
    echo "  ⚠️  未识别文档类型,跳过类型特定检查"
    type_score=20  # 给予基础分
    ;;
esac

echo "  类型特定得分: $type_score / 40"
SCORE=$((SCORE + type_score))

# ============================================
# 最终评分和等级判定
# ============================================

echo ""
echo "======================================"
echo "## 质量评分结果"
echo "======================================"
echo ""
echo "总分: $SCORE / 100"
echo ""

# 判定等级
if [ "$SCORE" -ge 90 ]; then
  echo "质量等级: ✅ 优秀 (90-100 分)"
  echo ""
  echo "恭喜! 文档质量卓越,符合所有标准。"
elif [ "$SCORE" -ge 70 ]; then
  echo "质量等级: ⚠️  良好 (70-89 分)"
  echo ""
  echo "文档质量合格,建议改进以下方面:"
  echo "  1. 补充边界情况和性能考虑说明"
  echo "  2. 增加高级场景示例"
else
  echo "质量等级: ❌ 需改进 (<70 分)"
  echo ""
  echo "文档存在关键问题,请优先修复:"
  echo "  1. 修复准确性问题 (类型签名、示例输出)"
  echo "  2. 补充缺失章节 (注意事项、边界情况)"
  echo "  3. 规范中文表达 (术语统一、表达自然)"
fi

echo ""
echo "======================================"

# 返回状态码
if [ "$SCORE" -ge 70 ]; then
  exit 0
else
  exit 1
fi
````

### 批量检查脚本

创建 `scripts/check-all-docs.sh` 批量检查脚本:

```bash
#!/bin/bash
# 批量检查所有文档质量
# 用法: ./scripts/check-all-docs.sh

set -e

echo "======================================"
echo "批量文档质量检查"
echo "======================================"
echo ""

TOTAL_FILES=0
EXCELLENT_FILES=0
GOOD_FILES=0
NEED_IMPROVEMENT=0

# 检查所有 Markdown 文档
for file in docs/**/*.md; do
  if [ -f "$file" ]; then
    ((TOTAL_FILES++))

    # 运行质量检查脚本
    if ./scripts/check-doc-quality.sh "$file" > /tmp/check-result.txt 2>&1; then
      score=$(grep "总分:" /tmp/check-result.txt | awk '{print $2}' | cut -d'/' -f1)

      if [ "$score" -ge 90 ]; then
        ((EXCELLENT_FILES++))
        echo "✅ $file: $score 分 (优秀)"
      elif [ "$score" -ge 70 ]; then
        ((GOOD_FILES++))
        echo "⚠️  $file: $score 分 (良好)"
      else
        ((NEED_IMPROVEMENT++))
        echo "❌ $file: $score 分 (需改进)"
      fi
    else
      ((NEED_IMPROVEMENT++))
      echo "❌ $file: 检查失败"
    fi
  fi
done

echo ""
echo "======================================"
echo "## 汇总统计"
echo "======================================"
echo ""
echo "总文档数: $TOTAL_FILES"
echo "优秀: $EXCELLENT_FILES (>= 90 分)"
echo "良好: $GOOD_FILES (70-89 分)"
echo "需改进: $NEED_IMPROVEMENT (< 70 分)"
echo ""

# 计算通过率
if [ "$TOTAL_FILES" -gt 0 ]; then
  PASS_RATE=$(( (EXCELLENT_FILES + GOOD_FILES) * 100 / TOTAL_FILES ))
  echo "质量通过率: $PASS_RATE%"
fi

echo ""
echo "======================================"
```

## 使用指南

### 1. 手动检查流程

**步骤**:

1. **选择文档类型**: 确定文档属于哪一类 (API/架构/指南/实践/贡献)
2. **通用标准检查**: 依次检查 6 个通用质量维度的检查点
3. **类型特定检查**: 根据文档类型检查相应的特定检查项
4. **计算质量分数**: 使用评分公式计算总分
5. **判定质量等级**: 根据分数确定等级并提供改进建议

**示例: 检查 API 文档**

````bash
# 1. 通用标准检查
file="docs/packages/kit/reference/is/is-circular.md"

# 检查准确性
grep -q "```typescript" "$file" && echo "✅ 包含类型签名"
grep -q "// =>" "$file" && echo "✅ 包含输出注释"

# 检查完整性
grep -q "^title:" "$file" && grep -q "^description:" "$file" && echo "✅ Frontmatter 完整"
grep -q "## 示例" "$file" && echo "✅ 包含示例章节"

# 检查清晰度
grep -q "import.*from" "$file" && echo "✅ 示例包含 import"

# 检查一致性
! grep -q '```$' "$file" && echo "✅ 代码块标注语言"

# 检查可用性
grep -q "\[.*\](\.\/.*\.md)" "$file" && echo "✅ 包含内部链接"

# 检查中文规范
grep -q "文档规范\|质量标准" "$file" && echo "✅ 使用规范术语"

# 2. API 文档特定检查
grep -q "### 类型签名" "$file" && echo "✅ 包含类型签名章节"
grep -q "### 输入边界\|### 错误处理" "$file" && echo "✅ 包含边界情况"
grep -q "### 基本用法" "$file" && echo "✅ 包含基本用法示例"
grep -q "时间复杂度\|空间复杂度" "$file" && echo "✅ 包含性能说明"

# 3. 计算分数和判定等级 (使用自动化脚本)
./scripts/check-doc-quality.sh "$file"
````

### 2. 自动化检查流程

**单个文档检查**:

```bash
# 检查单个文档
./scripts/check-doc-quality.sh docs/packages/kit/reference/is/is-circular.md

# 查看详细报告
./scripts/check-doc-quality.sh docs/contributing/documentation/architecture.md
```

**批量文档检查**:

```bash
# 检查所有文档
./scripts/check-all-docs.sh

# 检查特定目录
for file in docs/packages/kit/reference/**/*.md; do
  ./scripts/check-doc-quality.sh "$file"
done
```

**集成到 CI/CD**:

```yaml
# .github/workflows/doc-quality.yml
name: Documentation Quality Check

on:
  pull_request:
    paths:
      - 'docs/**/*.md'

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check documentation quality
        run: |
          chmod +x scripts/check-doc-quality.sh
          chmod +x scripts/check-all-docs.sh
          ./scripts/check-all-docs.sh

      - name: Fail if quality < 70%
        run: |
          PASS_RATE=$(grep "质量通过率:" /tmp/summary.txt | awk '{print $2}' | cut -d'%' -f1)
          if [ "$PASS_RATE" -lt 70 ]; then
            echo "Documentation quality too low: $PASS_RATE%"
            exit 1
          fi
```

## 常见问题

### 如何处理多种文档类型混合的文档?

**问题**: 一个文档同时包含 API 说明和架构设计,如何检查?

**解决方案**:

1. **主要类型判定**: 确定文档的主要类型 (占比最大的内容)
2. **分块检查**: 对不同部分分别应用对应的检查清单
3. **综合评分**: 使用加权平均计算最终分数
   ```
   总分 = 主要类型得分 × 70% + 次要类型得分 × 30%
   ```

### 自动化脚本误判怎么办?

**问题**: 脚本报告缺少某章节,但实际存在。

**原因**: 章节命名不完全匹配检测模式。

**解决方案**:

1. **规范命名**: 使用模板中定义的标准章节名称
2. **扩展模式**: 修改脚本中的 grep 模式,增加备选名称
   ```bash
   # 原: grep -q "## 签名与说明" "$file"
   # 改: grep -q "## 签名\|## API 签名\|## 函数签名" "$file"
   ```

### 如何提高文档质量分数?

**问题**: 文档得分 75 分 (良好),想提升到优秀等级。

**优化方向**:

1. **补充性能说明**: 添加时间复杂度和空间复杂度分析 (+5-10 分)
2. **增加高级示例**: 提供 2-3 个实际使用场景的高级示例 (+5 分)
3. **完善边界情况**: 从测试用例中提取所有边界情况并说明 (+5 分)
4. **优化中文表达**: 使用自然流畅的中文,避免生硬翻译 (+3-5 分)

**示例改进**:

```markdown
## 性能考虑 (新增章节 +10 分)

### 时间复杂度

- **复杂度**: O(n) - 其中 n 为对象属性数量
- **说明**: 使用 WeakSet 追踪访问过的对象,每个对象仅访问一次

### 空间复杂度

- **复杂度**: O(n) - WeakSet 存储访问过的对象引用
- **优化**: WeakSet 允许垃圾回收,不影响内存管理

### 优化建议

- 大型对象图 (>1000 个节点) 时,建议分批检测
- 高频调用场景可考虑缓存检测结果
```

### 评分体系是否适用于所有项目?

**问题**: 我的项目不需要性能说明,是否可以调整评分权重?

**解决方案**:

1. **调整评分公式**: 根据项目需求修改权重分配

   ```
   # 原: 总分 = 通用维度 × 60% + 类型特定 × 40%
   # 改: 总分 = 通用维度 × 70% + 类型特定 × 30%
   ```

2. **定制检查项**: 移除或替换不适用的检查项

   ```bash
   # 移除性能检查,增加兼容性检查
   # 原: 检查项 4: 性能说明
   # 改: 检查项 4: 兼容性说明
   ```

3. **创建项目专用清单**: 基于本文档创建项目特定的质量清单

   ```markdown
   ## [项目名称] 文档质量清单

   ### 通用标准 (5 个维度,移除"性能考虑")

   1. 准确性
   2. 完整性
   3. 清晰度
   4. 一致性
   5. 中文规范

   ### API 文档检查 (3 项,移除"性能说明",增加"兼容性")

   1. 类型准确性
   2. 边界情况覆盖
   3. 兼容性说明
   ```

## 相关文档

- [术语表](./glossary.md) - 核心术语和命名规范
- [文档规范体系架构](./architecture.md) - 3 层规范体系设计
- [API 文档模板](./api-template.md) - API 文档的增强规范和检查点
- [架构文档模板](./architecture-template.md) - 架构文档的规范和检查点
- [用户指南模板](./guide-template.md) - 用户指南的规范和检查点
- [最佳实践模板](./best-practices-template.md) - 最佳实践的规范和检查点
- [贡献指南模板](./contribution-template.md) - 贡献指南的规范和检查点
- [AI 模型调度策略](./ai-model-strategy.md) - AI 模型选择和使用规范

## 版本历史

- **v1.0** (2025-11-19): 初始版本,定义 6 个通用质量维度、5 类文档检查清单、3 级评分体系和自动化验证方法
