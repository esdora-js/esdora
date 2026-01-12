---
title: Esdora 文档规范
description: Esdora 项目的文档标准规范，定义文档结构、格式要求、质量标准和自动化生成规则，适用于 @esdora/kit、@esdora/color、@esdora/date、@esdora/biz 和 esdora 主包的所有文档。
---

# Esdora 文档规范

本文档定义 Esdora 项目的文档标准，适用于以下包：

- **@esdora/kit** - 通用工具函数库
- **@esdora/color** - 颜色处理工具库
- **@esdora/date** - 日期时间工具库
- **@esdora/biz** - 业务逻辑工具库
- **esdora** - 主包（聚合所有子包）

## 结构指南 (structure-guidelines)

### 文档层次结构

所有 Esdora 包的文档遵循三层规范体系：

- **Layer 1 (L1)**: 通用文档规范 - 适用于所有文档类型
- **Layer 2 (L2)**: 文档类型规范 - 针对特定文档类型（API、架构、最佳实践等）
- **Layer 3 (L3)**: 包专用规范 - 各包的特殊要求

### 文档类型分类

#### 1. API 参考文档

**适用包**: @esdora/kit, @esdora/color, @esdora/date, @esdora/biz

**必需章节**（按顺序）：

1. **示例** - 基本用法 + 高级场景（至少 2 个）
2. **签名与说明** - 类型签名、参数表格、返回值、泛型约束
3. **注意事项与边界情况** - 输入边界、错误处理、性能考虑、兼容性
4. **相关链接** - 源码路径

**路径规范**：

- @esdora/kit: `docs/api/kit/[category]/[function-name].md`
- @esdora/color: `docs/api/color/[function-name].md`
- @esdora/date: `docs/api/date/[function-name].md`
- @esdora/biz: `docs/api/biz/[module]/[function-name].md`

#### 2. 架构文档

**适用包**: esdora (主包架构), 各子包的内部架构

**必需章节**：

1. **系统概览** - 架构图、核心概念、设计目标
2. **模块划分** - 目录结构、模块职责、依赖关系
3. **技术决策** - 关键设计选择及其理由
4. **数据流** - 组件间的数据传递和处理流程

**路径规范**：

- 文档规范架构: `docs/contributing/documentation/architecture.md`
- 子包架构: `docs/architecture/[package-name].md`

#### 3. 最佳实践文档

**适用包**: 全部包

**必需章节**：

1. **代码规范** - 命名约定、代码格式、注释规范、文件组织
2. **设计模式** - 常用模式、反模式识别、重构建议
3. **性能优化** - 瓶颈识别、优化策略、测量方法
4. **安全实践** - 常见漏洞、防护措施、安全清单

**路径规范**：

- 通用实践: `docs/best-practices/general.md`
- 包专用实践: `docs/best-practices/[package-name].md`

#### 4. 指南文档

**适用包**: 全部包（快速开始、迁移指南、贡献指南）

**必需章节**：

1. **目标与适用场景**
2. **前置要求**
3. **步骤说明**（分步骤展示，每步包含代码示例）
4. **验证与测试**
5. **常见问题**

**路径规范**：

- 快速开始: `docs/guides/quick-start/[package-name].md`
- 迁移指南: `docs/guides/migration/[version].md`
- 贡献指南: `docs/contributing/[topic].md`

### 文件命名规范

- **文件名**: kebab-case（全小写，连字符分隔），如 `is-circular.md`
- **目录名**: kebab-case，如 `best-practices/`, `api/kit/`
- **特殊文件**:
  - README.md - 包根目录说明
  - CHANGELOG.md - 版本变更记录
  - ARCHITECTURE.md - 架构概览

### 跨包引用规范

引用其他包的文档或 API 时使用以下格式：

```markdown
<!-- 引用其他包的 API -->

参见 [@esdora/date 的 format 函数](../../api/date/format.md)

<!-- 引用文档规范架构 -->

参见 [文档规范体系架构](../contributing/documentation/architecture.md)

<!-- 引用同包内文档 -->

参见 [isCircular](./is-circular.md)
```

## 格式要求 (format-requirements)

### Frontmatter 规范

所有文档必须包含 YAML frontmatter：

```yaml
---
title: '[文档标题]'
description: '[完整描述] - Dora Pocket 中 @esdora/[package] 库提供的[类别]，用于[功能说明]'
---
```

**字段说明**：

- `title`: 清晰简洁的标题（不超过 50 字符）
- `description`: 完整描述（建议 100-200 字符），必须包含包名（@esdora/kit 等）

**可选字段**（根据文档类型添加）：

- `category`: 文档分类（API、架构、实践等）
- `ai_model`: 推荐的 AI 模型（Gemini、Qwen、Codex）
- `package`: 所属包名（@esdora/kit, @esdora/color 等）

### 代码块规范

#### TypeScript 示例

```typescript
import { isCircular } from '@esdora/kit'

const obj = { name: 'test' }
obj.self = obj

isCircular(obj) // => true
```

**要求**：

- ✅ 必须包含 `import` 语句（使用包名，如 `@esdora/kit`）
- ✅ 使用 `// =>` 注释展示输出结果
- ✅ 代码块标注语言类型（typescript, javascript, bash 等）
- ✅ 示例代码可独立运行，不依赖未定义的变量

#### 多包示例

当示例涉及多个 Esdora 包时：

```typescript
import { hexToRgb } from '@esdora/color'
import { formatDate } from '@esdora/date'
import { isCircular } from '@esdora/kit'

const data = {
  timestamp: formatDate(new Date(), 'YYYY-MM-DD'),
  color: hexToRgb('#FF5733')
}

isCircular(data) // => false
```

### Markdown 格式规范

#### 标题层级

- **H1** (`#`): 仅用于文档标题（与 frontmatter 中 `title` 一致）
- **H2** (`##`): 主要章节（示例、签名与说明、注意事项等）
- **H3** (`###`): 子章节（基本用法、参数说明等）
- **H4** (`####`): 详细说明（具体场景、单个参数详解）

#### 表格格式

参数表格使用统一格式：

```markdown
| 参数    | 类型   | 描述       | 必需 |
| ------- | ------ | ---------- | ---- |
| value   | any    | 待检测的值 | 是   |
| options | Object | 配置选项   | 否   |
```

**对齐规则**：

- 表头行使用连字符 `-` 分隔
- 列间使用竖线 `|` 分隔
- 左对齐（默认）

#### 列表格式

- **无序列表**: 使用 `-` 或 `*`（全文统一）
- **有序列表**: 使用数字 `1.`, `2.`, `3.`
- **嵌套**: 使用 2 空格缩进

#### 强调标记

- **加粗**: `**重要术语**` - 用于强调关键概念
- **斜体**: `*变量名*` - 用于参数名、占位符
- **行内代码**: `` `functionName` `` - 用于代码标识符
- **对比标记**:
  - ✅ 推荐做法
  - ❌ 不推荐做法
  - ⚠️ 注意事项

### 语言与表达规范

- **主语言**: 简体中文
- **代码注释**: 英文或中文均可，输出说明使用中文 `// => 返回 true`
- **技术术语**: 参考 [术语表](./contributing/documentation/glossary.md)
- **表达风格**:
  - 使用主动语态："该函数用于..." 而非 "可以用来..."
  - 清晰简洁，避免冗长和重复
  - 使用准确的技术术语，避免口语化

### 包名引用规范

文档中引用包时必须使用完整包名：

- @esdora/kit
- @esdora/color
- @esdora/date
- @esdora/biz
- esdora（仅指主包）

**错误示例**：

- ❌ kit 包
- ❌ color 库
- ❌ @esdora/\* 的所有函数

**正确示例**：

- ✅ @esdora/kit 提供的工具函数
- ✅ @esdora/color 的颜色转换功能
- ✅ esdora 主包聚合了所有子包

## 质量标准 (quality-criteria)

### API 文档质量检查点

生成或更新 API 文档后，必须通过以下 4 个检查点：

#### 检查点 1: 类型准确性检查

- [ ] 函数签名与源码完全一致（包括泛型、约束、可选参数）
- [ ] 参数表格中的类型与签名一致
- [ ] 返回值类型准确（包括联合类型、条件类型）
- [ ] 泛型约束的说明准确且完整

**验证方法**: 将文档中的类型签名复制到 TypeScript 文件，确保通过类型检查。

**适用包**: @esdora/kit, @esdora/color, @esdora/date, @esdora/biz

#### 检查点 2: 边界情况覆盖检查

- [ ] 所有测试用例中的边界情况都已记录（null、undefined、空值、边界数值）
- [ ] 错误处理部分包含所有可能的异常类型
- [ ] 输入边界部分完整且准确
- [ ] 特殊情况的返回值已明确说明

**验证方法**: 对比测试文件中的 `expect` 断言，确保所有边界情况在"注意事项"章节中体现。

**适用包**: 全部包

#### 检查点 3: 示例完整性检查

- [ ] 基本用法示例存在且可运行（包含 import 语句）
- [ ] 所有示例使用 `// =>` 注释展示输出
- [ ] 高级场景覆盖主要使用场景（至少 2-3 个）
- [ ] 示例代码与测试用例一致或源于测试用例

**验证方法**: 复制示例代码到 TypeScript 项目，确保成功运行且输出与注释一致。

**适用包**: 全部包

#### 检查点 4: 中文表达规范检查

- [ ] 所有技术术语使用简体中文且符合术语表
- [ ] 描述清晰简洁，无语法错误
- [ ] 代码注释使用中文说明（如 `// => 返回 true`）
- [ ] 避免直译英文的生硬表达

**验证方法**: 通读全文，确保表达自然流畅，符合中文技术文档习惯。

**适用包**: 全部包

### 架构文档质量检查点

- [ ] **系统图准确性**: 架构图反映实际代码结构，无过时信息
- [ ] **技术决策清晰**: 每个关键设计选择都有明确的理由说明
- [ ] **模块职责明确**: 模块划分清晰，职责边界无重叠或遗漏
- [ ] **依赖关系准确**: 模块间依赖关系与实际代码一致

**适用包**: esdora（主包）, 各子包的内部架构

### 最佳实践文档质量检查点

- [ ] **规范实用性**: 所有规范条目清晰具体，可直接应用于项目
- [ ] **示例代码质量**: 对比示例准确反映好/坏实践的差异，附带详细原因说明
- [ ] **安全建议完整性**: 安全实践章节覆盖至少 3 种常见漏洞及防护方法
- [ ] **性能建议可验证**: 性能优化建议包含测量方法和预期效果

**适用包**: 全部包

### 一致性检查

跨文档检查，确保整个项目文档的一致性：

- [ ] **术语一致**: 相同概念使用相同术语（参考术语表）
- [ ] **包名一致**: 所有包名使用完整名称（@esdora/kit 等）
- [ ] **链接有效**: 所有内部链接可访问，无死链
- [ ] **格式统一**: 代码块、表格、列表格式符合规范
- [ ] **版本同步**: CHANGELOG 与实际版本变更一致

## 示例标准 (example-standards)

### 基本用法示例

每个 API 函数必须包含基本用法示例，展示核心功能。

#### @esdora/kit 示例

```typescript
import { isCircular } from '@esdora/kit'

const obj = { name: 'test' }
obj.self = obj

isCircular(obj) // => true
isCircular({ a: 1, b: 2 }) // => false
```

#### @esdora/color 示例

```typescript
import { hexToRgb } from '@esdora/color'

hexToRgb('#FF5733') // => { r: 255, g: 87, b: 51 }
hexToRgb('#F57') // => { r: 255, g: 85, b: 119 }
```

#### @esdora/date 示例

```typescript
import { formatDate } from '@esdora/date'

const date = new Date('2024-01-15')
formatDate(date, 'YYYY-MM-DD') // => '2024-01-15'
formatDate(date, 'MM/DD/YYYY') // => '01/15/2024'
```

#### @esdora/biz 示例

```typescript
import { validateEmail } from '@esdora/biz/qs'

validateEmail('user@example.com') // => true
validateEmail('invalid-email') // => false
```

### 高级场景示例

至少提供 2 个高级场景，展示复杂用法或特殊情况。

#### 泛型函数示例（@esdora/kit）

```typescript
import { deepClone } from '@esdora/kit'

interface User {
  id: number
  name: string
  metadata: Record<string, any>
}

const original: User = {
  id: 1,
  name: 'Alice',
  metadata: { role: 'admin' }
}

const cloned = deepClone(original)
cloned.metadata.role = 'user'

console.log(original.metadata.role) // => 'admin'
console.log(cloned.metadata.role) // => 'user'
```

#### 错误处理示例（@esdora/date）

```typescript
import { parseDate } from '@esdora/date'

try {
  parseDate('invalid-date', 'YYYY-MM-DD')
}
catch (error) {
  console.error(error.message) // => 'Invalid date format'
}

// 使用默认值处理错误
const result = parseDate('invalid', 'YYYY-MM-DD', { defaultValue: null })
console.log(result) // => null
```

#### 性能优化示例（@esdora/color）

```typescript
import { createColorConverter, rgbToHex } from '@esdora/color'

// ❌ 低效：每次调用重复创建转换函数
function processColors(colors: RGB[]) {
  return colors.map(c => rgbToHex(c.r, c.g, c.b))
}

// ✅ 高效：复用转换器实例
const converter = createColorConverter()
function processColorsOptimized(colors: RGB[]) {
  return colors.map(c => converter.rgbToHex(c.r, c.g, c.b))
}
```

### 跨包集成示例（esdora 主包）

展示多个 Esdora 包协同使用的场景：

```typescript
import { validateEmail } from '@esdora/biz/qs'
import { hexToRgb } from '@esdora/color'
import { formatDate } from '@esdora/date'
import { isCircular } from '@esdora/kit'

interface UserProfile {
  email: string
  createdAt: Date
  themeColor: string
  preferences: Record<string, any>
}

function processUserProfile(profile: UserProfile) {
  // 验证邮箱（@esdora/biz）
  if (!validateEmail(profile.email)) {
    throw new Error('Invalid email address')
  }

  // 检测循环引用（@esdora/kit）
  if (isCircular(profile.preferences)) {
    console.warn('Circular reference detected in preferences')
  }

  // 格式化日期（@esdora/date）
  const formattedDate = formatDate(profile.createdAt, 'YYYY-MM-DD HH:mm:ss')

  // 转换颜色（@esdora/color）
  const rgb = hexToRgb(profile.themeColor)

  return {
    ...profile,
    createdAt: formattedDate,
    themeColorRgb: rgb
  }
}
```

### 示例编写规则

1. **完整性**: 所有示例必须包含 import 语句，使用包名（@esdora/kit 等）
2. **输出注释**: 使用 `// =>` 展示结果，避免使用 `console.log`
3. **可运行性**: 示例代码可独立运行，不依赖未定义的变量或函数
4. **类型标注**: TypeScript 示例包含必要的类型标注（interface, type 等）
5. **真实场景**: 示例基于真实使用场景，避免 `foo`, `bar` 等无意义命名
6. **渐进式**: 从简单到复杂，先展示基本用法，再展示高级场景

## 自动化规则 (automation-rules)

### AI 模型选择策略

根据文档类型和包特性选择合适的 AI 模型：

#### Gemini (`gemini-2.5-pro`)

**优势**: 大上下文窗口、模式识别能力强

**适用场景**:

- @esdora/kit 的 API 文档生成（复杂泛型、类型推断）
- 架构文档生成（跨模块依赖分析）
- 最佳实践提取（从代码库识别模式）
- @esdora/biz 的业务逻辑文档（复杂业务规则）

**使用示例**:

```bash
cd packages/kit && gemini -p "
PURPOSE: 为 isCircular 函数生成 API 文档
TASK:
• 读取源码和测试文件
• 提取类型签名、参数说明、返回值
• 生成示例代码（基本用法 + 高级场景）
• 执行 4 个质量检查点验证
MODE: write
CONTEXT: @src/is/is-circular/**/* @tests/is/is-circular.test.ts @../../docs/contributing/documentation/api-template.md
EXPECTED: 完整的 API 文档，符合 doc-standards.md 规范，通过 4 个质量检查点
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循 Esdora 文档规范，使用 api-template.md 提示词 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo
```

#### Qwen (`qwen-coder`)

**优势**: 代码理解能力强、执行速度快

**适用场景**:

- @esdora/color 的算法文档（颜色转换算法说明）
- @esdora/date 的格式化文档（日期格式规则）
- 简单 API 函数的文档生成
- Gemini 不可用时的备选方案

**使用示例**:

```bash
cd packages/color && qwen -p "
PURPOSE: 为 hexToRgb 函数生成 API 文档
TASK:
• 分析颜色转换算法实现
• 生成类型签名和参数说明
• 提供多种输入格式的示例
MODE: write
CONTEXT: @src/hex-to-rgb/**/* @tests/hex-to-rgb.test.ts
EXPECTED: 符合 doc-standards.md 的 API 文档
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循 Esdora 文档规范 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo
```

#### Codex (`gpt-5.1-codex`)

**优势**: 精确的类型签名生成、测试用例理解深入

**适用场景**:

- 单函数 API 文档（类型复杂度高的函数）
- 测试驱动的文档生成（从测试用例提取示例）
- 快速生成小型文档
- 需要严格类型检查的文档

**使用示例**:

```bash
codex -C packages/kit --full-auto exec "
PURPOSE: 为 @esdora/kit 的 deepClone 函数生成 API 文档
TASK:
• 提取完整的 TypeScript 类型签名（包括泛型约束）
• 从测试用例生成示例代码
• 添加边界情况和错误处理说明
MODE: auto
CONTEXT: @src/function/deep-clone/**/* @tests/function/deep-clone.test.ts @../../docs/doc-standards.md
EXPECTED: 符合 doc-standards.md 规范的 API 文档，通过 4 个质量检查点
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循 Esdora 文档规范 | auto=FULL operations
" --skip-git-repo-check -s danger-full-access
```

### 批量生成工作流

#### 为整个包生成 API 文档

```bash
# 为 @esdora/kit 生成所有 API 文档
cd packages/kit && gemini -p "
PURPOSE: 为 @esdora/kit 的所有 is 类函数生成 API 文档
TASK:
• 扫描 src/is/ 目录下的所有函数
• 为每个函数生成符合规范的 API 文档
• 确保跨文档的术语一致性
MODE: write
CONTEXT: @src/is/**/* @tests/is/**/* @../../docs/doc-standards.md @../../docs/contributing/documentation/api-template.md
EXPECTED: 完整的 API 文档集，所有文档符合 doc-standards.md 规范
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 批量生成，保持一致性 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo
```

#### 更新现有文档

```bash
# 更新 @esdora/date 的过时文档
cd packages/date && qwen -p "
PURPOSE: 更新 @esdora/date 的 API 文档以符合最新规范
TASK:
• 检查现有文档与 doc-standards.md 的差异
• 更新 frontmatter、代码示例、质量检查点
• 确保包名引用使用完整名称（@esdora/date）
MODE: write
CONTEXT: @../../docs/api/date/**/* @src/**/* @tests/**/* @../../docs/doc-standards.md
EXPECTED: 所有文档符合 doc-standards.md 规范，通过一致性检查
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-refactor-codebase.txt) | 保持内容准确性，仅更新格式 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo
```

### 自动化验证脚本

#### 验证文档质量

```bash
# 验证所有 API 文档是否包含必需章节
function verify-api-docs() {
  local package=$1
  echo "Verifying API docs for @esdora/$package..."

  for doc in docs/api/$package/**/*.md; do
    # 检查必需章节
    grep -q "^## 示例" "$doc" || echo "Missing '示例' section in $doc"
    grep -q "^## 签名与说明" "$doc" || echo "Missing '签名与说明' section in $doc"
    grep -q "^## 注意事项与边界情况" "$doc" || echo "Missing '注意事项' section in $doc"

    # 检查包名引用
    grep -q "@esdora/$package" "$doc" || echo "Missing package name reference in $doc"
  done
}

# 使用
verify-api-docs kit
verify-api-docs color
verify-api-docs date
verify-api-docs biz
```

#### 检查文档一致性

```bash
# 检查术语一致性
rg "工具函数库|utility library" docs/ --type md -n

# 检查包名使用是否规范
rg "(?<!@esdora/)(kit|color|date|biz)(?!\s|$)" docs/ --type md -n

# 检查死链
find docs/ -name "*.md" -exec grep -H "](.*\.md)" {} \; | while read line; do
  file=$(echo $line | cut -d: -f1)
  link=$(echo $line | sed 's/.*](\(.*\.md\)).*/\1/')
  target=$(realpath -m "$(dirname $file)/$link")
  [ ! -f "$target" ] && echo "Dead link in $file: $link"
done
```

### 文档生成模板变量

在自动化生成文档时，使用以下变量占位符：

- `[package]`: 包名（kit, color, date, biz）
- `[category]`: 函数分类（is, function, tree, url 等）
- `[function-name]`: 函数名（kebab-case）
- `[FunctionName]`: 函数名（PascalCase）
- `[functionName]`: 函数名（camelCase）

**示例替换**:

```markdown
---
title: [FunctionName]
description: "[FunctionName] - Dora Pocket 中 @esdora/[package] 库提供的[category]工具函数，用于[功能描述]。"
---

# [FunctionName]

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/[package]/src/[category]/[function-name]/index.ts)
```

### 持续集成规则

#### 文档构建检查（CI Pipeline）

```yaml
# .github/workflows/docs-check.yml
name: Documentation Check

on: [pull_request]

jobs:
  verify-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check required sections
        run: |
          ./scripts/verify-api-docs.sh kit
          ./scripts/verify-api-docs.sh color
          ./scripts/verify-api-docs.sh date
          ./scripts/verify-api-docs.sh biz

      - name: Check consistency
        run: |
          ./scripts/check-terminology.sh
          ./scripts/check-dead-links.sh

      - name: Build docs
        run: |
          npm run docs:build
```

#### 自动更新文档（版本发布时）

```bash
# 在版本发布时自动生成 CHANGELOG
function generate-changelog() {
  local version=$1
  local package=$2

  echo "Generating CHANGELOG for @esdora/$package v$version..."

  git log --pretty=format:"- %s (%h)" "v$version-$package"^.."v$version-$package" \
    > "packages/$package/CHANGELOG_$version.md"

  # 合并到主 CHANGELOG
  cat "packages/$package/CHANGELOG_$version.md" >> "packages/$package/CHANGELOG.md"
}
```

## 相关文档

- [术语表](./contributing/documentation/glossary.md) - 核心术语和命名规范
- [文档规范体系架构](./contributing/documentation/architecture.md) - 3 层规范体系设计
- [API 文档模板](./contributing/documentation/api-template.md) - API 文档增强版模板
- [最佳实践模板](./contributing/documentation/best-practices-template.md) - 最佳实践文档模板
- [AI 模型调度策略](./contributing/documentation/ai-model-strategy.md) - 模型选择和使用规范

## 版本历史

- **v1.0** (2025-11-21): 初始版本，定义 Esdora 项目的文档标准规范，涵盖 @esdora/kit、@esdora/color、@esdora/date、@esdora/biz 和 esdora 主包的文档要求
