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

### 步骤 2: 收集上下文材料

1. **读取源文件**
   - 使用 Read 工具读取所有 `--files` 指定的源文件
   - 提取类型定义、函数签名、JSDoc 注释

2. **查找测试文件**
   - 自动查找对应的测试文件：
     - 从 `packages/[name]/src/path/file.ts` 推断
     - 可能位置：`packages/[name]/test/`, `packages/[name]/tests/`, `packages/[name]/__tests__/`
   - 读取测试文件，提取真实使用示例

3. **查找相关文件**
   - 类型定义文件（如 `types.ts`）
   - README.md（如果存在）
   - package.json（依赖信息）

### 步骤 3: 调用 Codex 生成文档

根据文档类型选择合适的 AI 模型和提示词：

**API 文档（推荐 Codex）**：

```bash
codex -C [package-dir] --full-auto exec "
PURPOSE: 为指定源文件生成符合规范的 API 文档
TASK:
• 读取源文件和测试文件
• 提取完整的 TypeScript 类型签名（包括泛型参数）
• 生成参数表格、返回值说明
• 从测试中提取至少 2 个真实示例（基本用法 + 高级场景）
• 添加边界情况说明、错误处理、性能考虑
• 执行 4 个质量检查点验证
MODE: auto
CONTEXT: @[source-files] @[test-files] @[template-file]
EXPECTED: 符合 api-template.md 规范的完整 API 文档，质量得分 >= 90
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循 L1+L2+L3 规范 | auto=FULL operations
" --skip-git-repo-check -s danger-full-access
```

**架构文档（推荐 Gemini）**：

```bash
cd [package-dir] && gemini -p "
PURPOSE: 为模块生成架构设计文档
TASK:
• 分析模块结构和组件关系
• 绘制 Mermaid 架构图
• 说明设计决策（ADR 格式）
• 分析技术栈选择和权衡
MODE: write
CONTEXT: @[source-files] @[template-file]
EXPECTED: 符合 architecture-template.md 规范的完整架构文档，包含 5 个必需章节
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循架构模板规范 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
```

**用户指南（推荐 Gemini）**：

```bash
cd [package-dir] && gemini -p "
PURPOSE: 为模块生成用户指南
TASK:
• 编写快速开始（安装、基础示例）
• 解释核心概念
• 提供使用说明和配置选项
• 整理常见问题和故障排查
MODE: write
CONTEXT: @[source-files] @README.md @[template-file]
EXPECTED: 符合 guide-template.md 规范的完整用户指南，包含 4 个章节
RULES: \$(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 示例代码可直接运行 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo --include-directories ../../docs/contributing/documentation
```

### 步骤 4: 质量验证

1. **运行自动化验证脚本**

   ```bash
   ./scripts/check-doc-quality.sh [output-file]
   ```

2. **检查质量得分**
   - 如果得分 >= 90：文档完成 ✅
   - 如果得分 70-89：提供改进建议
   - 如果得分 < 70：标记需要重大修订

3. **验证文档结构**
   - 检查是否包含所有必需章节
   - 验证 frontmatter 完整性
   - 检查代码示例语法高亮

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
