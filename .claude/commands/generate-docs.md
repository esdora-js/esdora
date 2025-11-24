根据文档规范系统自动生成高质量文档。

## 使用方式

```bash
/generate-docs --files "path1,path2,..." --type api [--output "output/path"]
/generate-docs --files "packages/biz/src/query/parse.ts,packages/biz/src/query/stringify.ts" --type api
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

---

## 执行任务

请按以下步骤自动生成文档：

### 步骤 1: 参数解析和验证

1. **解析参数**
   - 提取 `--files` 参数的文件路径列表
   - 提取 `--type` 参数的文档类型
   - 提取 `--output` 参数（如果提供）

2. **验证参数**
   - 检查所有源文件是否存在
   - 验证文档类型是否有效
   - 如果未提供 `--output`，自动推断输出路径：
     - 从文件路径提取包名（如 `packages/biz/src/...` → `biz`）
     - 输出路径为：`docs/packages/[package-name]/reference/[module-name]/`

3. **加载模板规范**
   - 根据 `--type` 加载对应模板：
     - `api` → `docs/contributing/documentation/api-template.md`
     - `architecture` → `docs/contributing/documentation/architecture-template.md`
     - `guide` → `docs/contributing/documentation/guide-template.md`
     - `best-practices` → `docs/contributing/documentation/best-practices-template.md`
     - `contribution` → `docs/contributing/documentation/contribution-template.md`

### 步骤 2: 生成类型声明 + 收集上下文

1. **生成 TypeScript 类型声明**（除非指定 `--skip-type-gen`）
   - 检查是否指定了 `--skip-type-gen` 参数
   - 如果未跳过类型生成，执行以下操作：
     - 从 `--files` 参数提取包名（例如：`packages/kit/src/...` → `kit`）
     - 创建临时目录 `.tmp/types/[package-name]/`（如果不存在）
     - 运行 TypeScript 编译器生成精确类型信息：
       ```bash
       pnpm tsc --declaration --emitDeclarationOnly --outDir .tmp/types/[package-name]
       ```
     - 这确保 AI 获得 100% 准确的类型签名（泛型、联合类型、条件类型）
     - 验证类型声明文件已成功生成（至少存在一个 `.d.ts` 文件）
   - 如果指定了 `--skip-type-gen`：
     - 跳过类型生成步骤
     - 提示：跳过类型生成可能降低类型签名准确性

2. **读取源文件和类型声明**
   - 使用 Read 工具读取所有 `--files` 指定的源文件
   - 如果已生成类型声明，读取对应的 `.d.ts` 声明文件（位于 `.tmp/types/[package-name]/`）
   - 提取 JSDoc 注释和文档字符串

3. **查找测试文件**
   - 自动查找对应的测试文件：
     - 从 `packages/[name]/src/path/file.ts` 推断
     - 可能位置：`packages/[name]/test/`, `packages/[name]/tests/`, `packages/[name]/__tests__/`
   - 读取测试文件，提取真实使用示例

4. **查找相关文件**
   - 类型定义文件（如 `types.ts`）
   - README.md（如果存在）
   - package.json（依赖信息）

### 步骤 3: AI 一体化文档生成

根据文档类型和 `--ai-model` 参数选择 AI 工具（默认 Codex）：

**API 文档（Codex 一体化流程）**：

```bash
# macOS / Linux 示例
codex -C [package-dir] --full-auto exec "
PURPOSE: AI 自主理解源码并生成符合规范的 API 文档
TASK:
• 读取源文件、类型声明文件（.d.ts）和测试文件
• AI 语义理解代码功能和用途
• 基于类型声明提取 100% 准确的类型签名（泛型、联合类型、条件类型）
• 从 JSDoc 提取参数说明、返回值说明、示例代码
• 从测试文件提取真实使用场景（至少 2 个：基本 + 高级）
• AI 自主推断边界情况、错误处理、性能注意事项
• 基于模板约束生成符合 api-template.md 规范的文档
• AI 自检质量（类型准确性、示例完整性、中文表达规范）
MODE: auto
CONTEXT: @[source-files] @.tmp/types/[package-name]/**/*.d.ts @[test-files] @docs/contributing/documentation/api-template.md @docs/doc-standards.md
EXPECTED: 符合 api-template.md 规范的完整 API 文档，AI 自评质量得分 >= 90
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 类型签名必须与 .d.ts 完全一致 | 遵循 doc-standards.md L1+L2+L3 规范 | auto=FULL operations
" --skip-git-repo-check -s danger-full-access
```

```powershell
# Windows / PowerShell 示例（避免 Bash + mise 报错）
$prompt = @'
PURPOSE: AI 自主理解源码并生成符合规范的 API 文档
TASK:
• 读取源文件、类型声明文件（.d.ts）和测试文件
• AI 语义理解代码功能和用途
• 基于类型声明提取 100% 准确的类型签名（泛型、联合类型、条件类型）
• 从 JSDoc 提取参数说明、返回值说明、示例代码
• 从测试文件提取真实使用场景（至少 2 个：基本 + 高级）
• AI 自主推断边界情况、错误处理、性能注意事项
• 基于模板约束生成符合 api-template.md 规范的文档
• AI 自检质量（类型准确性、示例完整性、中文表达规范）
MODE: auto
CONTEXT: @[source-files] @.tmp/types/[package-name]/**/*.d.ts @[test-files] @docs/contributing/documentation/api-template.md @docs/doc-standards.md
EXPECTED: 符合 api-template.md 规范的完整 API 文档，AI 自评质量得分 >= 90
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 类型签名必须与 .d.ts 完全一致 | 遵循 doc-standards.md L1+L2+L3 规范 | auto=FULL operations
'@

codex exec --full-auto `
  --cd [package-dir] `
  --skip-git-repo-check `
  -s danger-full-access `
  $prompt
```

**注意**：

- CONTEXT 字段中的 `@.tmp/types/[package-name]/**/*.d.ts` 引用了步骤 2 生成的类型声明文件
- 替换 `[package-name]` 为实际的包名（如 `kit`、`color`、`date`、`biz`）
- 如果使用了 `--skip-type-gen` 参数，则从 CONTEXT 中移除 `@.tmp/types/[package-name]/**/*.d.ts` 引用

**架构文档（Gemini 一体化流程）**：

```bash
cd [package-dir] && gemini -p "
PURPOSE: AI 自主分析架构并生成设计文档
TASK:
• AI 深度理解模块结构、组件关系、数据流
• 自主推断架构模式（分层、微服务、事件驱动等）
• 生成 Mermaid 架构图（系统级 + 模块级）
• 提取设计决策并以 ADR 格式说明
• 分析技术栈选择的权衡和理由
• 基于模板约束生成符合 architecture-template.md 的文档
MODE: write
CONTEXT: @[source-files] @docs/contributing/documentation/architecture-template.md @docs/doc-standards.md
EXPECTED: 符合 architecture-template.md 规范的完整架构文档，包含 5 个必需章节，AI 自评完整性 >= 90%
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循架构模板规范 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
```

**用户指南（Gemini 一体化流程）**：

```bash
cd [package-dir] && gemini -p "
PURPOSE: AI 自主理解功能并生成用户指南
TASK:
• AI 理解模块核心功能和使用场景
• 编写快速开始（安装、最小可运行示例）
• 解释核心概念和关键术语
• 从代码和测试提取使用模式和配置选项
• 推断常见问题和故障排查方案
• 基于模板约束生成符合 guide-template.md 的文档
MODE: write
CONTEXT: @[source-files] @README.md @docs/contributing/documentation/guide-template.md @docs/doc-standards.md
EXPECTED: 符合 guide-template.md 规范的完整用户指南，包含 4 个章节，示例代码可直接运行
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 示例代码必须可执行 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
```

### 步骤 4: AI 智能质量验证

1. **AI 自检（主要）**
   - AI 自评生成文档的质量得分（0-100）

   - **4 个质量检查项**（基于 `docs/doc-standards.md` L259-L307）：

     **检查项 1: 类型准确性检查**
     - [ ] 函数签名与源码 .d.ts 文件完全一致（100% 准确性）
     - [ ] 包括泛型、约束、可选参数、联合类型、条件类型
     - [ ] 参数表格中的类型与签名一致
     - [ ] 泛型约束的说明准确且完整
     - **验证方法**: 对比 `.d.ts` 文件中的类型声明，确保文档中的类型签名完全一致

     **检查项 2: 边界情况覆盖检查**
     - [ ] 所有测试用例中的边界情况都已记录（null、undefined、空值、边界数值）
     - [ ] 错误处理部分包含所有可能的异常类型
     - [ ] 输入边界部分完整且准确
     - [ ] 特殊情况的返回值已明确说明
     - **验证方法**: 对比测试文件中的 `expect` 断言，确保所有边界情况在"注意事项"章节中体现

     **检查项 3: 示例完整性检查**
     - [ ] 基本用法示例存在且可运行（包含 import 语句）
     - [ ] 所有示例使用 `// =>` 注释展示输出
     - [ ] 高级场景覆盖主要使用场景（至少 2-3 个）
     - [ ] 示例代码与测试用例一致或源于测试用例
     - **验证方法**: 确保示例代码可直接复制运行且输出与注释一致

     **检查项 4: 中文表达规范检查**
     - [ ] 所有技术术语使用简体中文且符合术语表
     - [ ] 描述清晰简洁，无语法错误
     - [ ] 代码注释使用中文说明（如 `// => 返回 true`）
     - [ ] 避免直译英文的生硬表达
     - [ ] Frontmatter 元数据完整性（title、description）
     - **验证方法**: 通读全文，确保表达自然流畅，符合中文技术文档习惯

   - **3 级质量阈值处理**：
     - **>= 90 分**：通过 ✅，文档符合高质量标准
     - **70-89 分**：AI 给出具体改进建议，并可选择自动修正以达到 >= 90 分
     - **< 70 分**：AI 标记具体问题，重新生成文档直到达到 >= 70 分

2. **必要的客观验证**（补充检查）
   - 检查文件是否成功创建
   - 验证 Markdown 语法有效性（无未闭合的代码块、列表格式正确）
   - 检查内部链接可达性（所有 `[text](path)` 链接指向存在的文件）
   - 确认代码块语法高亮标记（TypeScript 代码块使用 `typescript 或 `ts）

3. **可选的人工审核**
   - 对于关键 API 文档，可选择人工复核
   - AI 输出审核检查清单（基于上述 4 个检查项）

### 步骤 5: 报告结果

输出生成报告，包含：

- ✅ 生成的文档路径列表
- 📊 每个文档的质量得分
- 📝 改进建议（如果得分 < 90）
- 🔗 查看文档的 VitePress 链接

## 示例输出

```
✅ 文档生成完成

生成的文档：
- docs/packages/biz/reference/query/parse.md (质量得分: 95/100 - 优秀)
- docs/packages/biz/reference/query/stringify.md (质量得分: 92/100 - 优秀)

质量验证：
✅ 所有文档通过质量检查
✅ 类型签名准确
✅ 示例代码完整
✅ 中文表达规范

查看文档：
npm run docs:dev
访问 http://localhost:5173/packages/biz/reference/query/
```

---

## 常见使用场景

### 场景 1: 生成单个文件的 API 文档

```bash
/generate-docs --files "packages/kit/src/is/is-circular/index.ts" --type api
```

### 场景 2: 批量生成模块的 API 文档

```bash
/generate-docs --files "packages/biz/src/query/parse.ts,packages/biz/src/query/stringify.ts" --type api
```

### 场景 3: 生成架构文档并指定输出路径

```bash
/generate-docs --files "packages/kit/src/**/*.ts" --type architecture --output "docs/packages/kit/ARCHITECTURE.md"
```

### 场景 4: 生成用户指南

```bash
/generate-docs --files "packages/color/src/**/*.ts" --type guide --output "docs/packages/color/guide.md"
```

---

现在请根据用户提供的参数执行上述任务，自动生成高质量文档。
