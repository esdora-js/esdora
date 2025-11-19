---
title: 贡献指南模板
description: 用于生成项目贡献指南的标准模板,定义开始贡献、开发流程、代码审查、测试规范和提交规范的规范结构。适用于 CONTRIBUTING.md 和开发协作文档。
---

# 贡献指南模板

本模板用于生成**项目贡献指南**,适用于 CONTRIBUTING.md、开发流程说明、提交规范等场景。遵循 **Layer 1 通用规范** + **Layer 2 贡献指南规范**。

## 文档结构模板

### Frontmatter

```yaml
---
title: [项目名称] 贡献指南
description: [项目贡献的完整说明和流程要求]
category: 贡献
ai_model: Codex  # 推荐使用 Codex 进行工作流程生成
---
```

### 章节结构

#### 1. 开始贡献

**目的**: 指导新贡献者快速搭建开发环境并了解项目结构。

**内容要求**:
- **环境准备**: 必需的软件和工具版本要求
- **仓库克隆**: 获取代码的详细步骤
- **依赖安装**: 安装项目依赖的命令
- **验证环境**: 确认开发环境配置正确
- **项目结构**: 简要说明项目目录组织

**示例结构**:
```markdown
## 开始贡献

感谢你对 [项目名称] 的关注! 我们欢迎所有形式的贡献,包括但不限于:

- 🐛 报告 Bug 和问题
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 修复 Bug 和实现新功能
- ✅ 编写和改进测试

### 环境准备

在开始之前,请确保你的开发环境满足以下要求:

**必需软件**:
- **Node.js**: >= 18.0.0 (推荐使用最新 LTS 版本)
- **pnpm**: >= 8.0.0 (包管理器)
- **Git**: >= 2.30.0

**检查版本**:
\`\`\`bash
node --version   # 应显示 v18.x.x 或更高
pnpm --version   # 应显示 8.x.x 或更高
git --version    # 应显示 2.30.x 或更高
\`\`\`

**安装 pnpm** (如果未安装):
\`\`\`bash
npm install -g pnpm
\`\`\`

### 获取代码

#### 1. Fork 仓库

访问 [项目仓库地址] 并点击右上角的 "Fork" 按钮,将仓库复制到你的 GitHub 账户。

#### 2. 克隆你的 Fork

\`\`\`bash
# 克隆你 fork 的仓库
git clone https://github.com/YOUR_USERNAME/[repo-name].git

# 进入项目目录
cd [repo-name]

# 添加上游仓库 (用于同步最新代码)
git remote add upstream https://github.com/ORIGINAL_OWNER/[repo-name].git

# 验证远程仓库配置
git remote -v
# 应显示:
# origin    https://github.com/YOUR_USERNAME/[repo-name].git (fetch)
# origin    https://github.com/YOUR_USERNAME/[repo-name].git (push)
# upstream  https://github.com/ORIGINAL_OWNER/[repo-name].git (fetch)
# upstream  https://github.com/ORIGINAL_OWNER/[repo-name].git (push)
\`\`\`

### 安装依赖

\`\`\`bash
# 使用 pnpm 安装所有依赖
pnpm install

# 构建项目
pnpm run build

# 运行测试验证环境
pnpm run test
\`\`\`

**预期结果**:
- ✅ 依赖安装成功,无错误信息
- ✅ 构建完成,生成 `dist/` 目录
- ✅ 测试全部通过

如果遇到问题,请参考 [常见问题](#常见问题) 或在 [Issue](项目 Issue 地址) 中寻求帮助。

### 项目结构

\`\`\`
[repo-name]/
├── packages/              # Monorepo 包目录
│   ├── kit/              # @esdora/kit 工具函数库
│   ├── color/            # @esdora/color 颜色处理库
│   └── ...               # 其他包
├── docs/                 # VitePress 文档网站
│   ├── packages/         # API 文档
│   └── guide/            # 用户指南
├── scripts/              # 构建和工具脚本
├── .github/              # GitHub 配置 (CI/CD, Issue 模板)
├── package.json          # 根 package.json (Monorepo 配置)
├── pnpm-workspace.yaml   # pnpm workspace 配置
└── turbo.json            # Turbo 构建配置
\`\`\`

**核心目录说明**:
- `packages/[name]/src/`: 包源代码
- `packages/[name]/tests/`: 单元测试
- `docs/packages/[name]/`: 包文档
```

#### 2. 开发流程

**目的**: 定义从需求到提交的完整开发流程。

**内容要求**:
- **分支策略**: 分支命名规范和用途
- **开发步骤**: 编码、测试、文档的完整流程
- **同步上游**: 如何保持 Fork 仓库最新
- **本地验证**: 提交前的检查清单

**示例结构**:
```markdown
## 开发流程

### 分支策略

我们使用 **Git Flow** 分支模型:

- **`main`**: 主分支,始终保持稳定,用于发布
- **`develop`**: 开发分支,集成所有新功能
- **`feature/*`**: 功能分支,用于开发新功能
- **`fix/*`**: 修复分支,用于修复 Bug
- **`docs/*`**: 文档分支,用于文档更新

#### 分支命名规范

\`\`\`bash
# 功能开发
feature/add-user-authentication
feature/implement-search-filter

# Bug 修复
fix/resolve-memory-leak
fix/correct-validation-logic

# 文档更新
docs/update-api-reference
docs/add-getting-started-guide
\`\`\`

### 开发步骤

#### 1. 同步上游仓库

在开始新工作前,确保你的 Fork 仓库是最新的:

\`\`\`bash
# 切换到主分支
git checkout main

# 拉取上游仓库的最新代码
git fetch upstream

# 合并上游的 main 分支
git merge upstream/main

# 推送到你的 Fork
git push origin main
\`\`\`

#### 2. 创建功能分支

\`\`\`bash
# 从最新的 main 创建功能分支
git checkout -b feature/your-feature-name

# 或从 develop 创建 (取决于项目分支策略)
git checkout -b feature/your-feature-name develop
\`\`\`

#### 3. 进行开发

**编码规范**:
- 遵循项目的代码风格 (参考 [代码规范](#代码规范))
- 保持函数简洁,单一职责
- 添加必要的注释和 JSDoc

**示例工作流**:
\`\`\`bash
# 编辑代码
# ...

# 运行开发服务器 (如适用)
pnpm run dev

# 实时查看文档变更
pnpm run docs:dev
\`\`\`

#### 4. 编写测试

所有新功能和 Bug 修复都必须包含测试:

\`\`\`bash
# 运行所有测试
pnpm run test

# 运行特定包的测试
pnpm --filter @esdora/kit test

# 运行测试并查看覆盖率
pnpm run test:coverage
\`\`\`

**测试要求**:
- ✅ 单元测试覆盖率 >= 80%
- ✅ 所有边界情况都有测试
- ✅ 测试命名清晰,说明测试意图

**测试示例**:
\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { functionName } from '../src'

describe('functionName', () => {
  it('should handle normal input correctly', () => {
    expect(functionName(normalInput)).toBe(expectedOutput)
  })

  it('should handle edge case: empty input', () => {
    expect(functionName('')).toBe('')
  })

  it('should throw error for invalid input', () => {
    expect(() => functionName(invalidInput)).toThrow('Invalid input')
  })
})
\`\`\`

#### 5. 更新文档

如果你的更改影响 API 或用户体验,请更新相应文档:

\`\`\`bash
# 添加或修改文档文件
# docs/packages/[package-name]/reference/[function-name].md

# 预览文档网站
pnpm run docs:dev
# 访问 http://localhost:5173
\`\`\`

**文档要求**:
- 遵循 [文档模板](./kit-template.md)
- 提供完整的代码示例
- 说明参数、返回值和边界情况

#### 6. 本地验证

提交前运行以下检查:

\`\`\`bash
# 1. 代码格式化
pnpm run format

# 2. 代码检查
pnpm run lint

# 3. 类型检查
pnpm run typecheck

# 4. 运行所有测试
pnpm run test

# 5. 构建项目
pnpm run build
\`\`\`

**检查清单**:
- [ ] 所有测试通过
- [ ] 代码格式符合规范
- [ ] 无 TypeScript 类型错误
- [ ] 构建成功,无错误
- [ ] 文档已更新 (如适用)

#### 7. 提交代码

遵循 [提交规范](#提交规范):

\`\`\`bash
# 添加修改的文件
git add .

# 提交 (遵循 Conventional Commits 规范)
git commit -m "feat(kit): add isCircular function"

# 推送到你的 Fork
git push origin feature/your-feature-name
\`\`\`
```

#### 3. 代码审查

**目的**: 定义 Code Review 流程和审查标准。

**内容要求**:
- **提交 PR**: 如何创建 Pull Request
- **PR 模板**: 必需的 PR 信息
- **审查标准**: 代码审查的检查要点
- **反馈处理**: 如何响应审查意见

**示例结构**:
```markdown
## 代码审查

### 提交 Pull Request

#### 1. 创建 PR

在你的功能分支完成并推送后:

1. 访问你的 Fork 仓库页面
2. 点击 "Compare & pull request" 按钮
3. 填写 PR 信息 (参考 [PR 模板](#pr-模板))
4. 提交 PR

#### 2. PR 标题格式

PR 标题应遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

\`\`\`
<type>(<scope>): <description>
\`\`\`

**类型 (type)**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具配置

**示例**:
\`\`\`
feat(kit): add isCircular function to detect circular references
fix(color): resolve incorrect hex to rgb conversion
docs(guide): update getting started section with pnpm instructions
\`\`\`

### PR 模板

提交 PR 时,请填写以下信息:

\`\`\`markdown
## 描述

[简要描述这个 PR 解决了什么问题或添加了什么功能]

## 相关 Issue

Closes #[issue-number]

## 更改类型

- [ ] 新功能 (feat)
- [ ] Bug 修复 (fix)
- [ ] 文档更新 (docs)
- [ ] 代码重构 (refactor)
- [ ] 测试 (test)
- [ ] 其他 (chore)

## 更改内容

- [更改点 1]
- [更改点 2]
- [更改点 3]

## 测试

- [ ] 添加了单元测试
- [ ] 所有测试通过
- [ ] 测试覆盖率 >= 80%

## 文档

- [ ] 更新了 API 文档 (如适用)
- [ ] 更新了用户指南 (如适用)
- [ ] 添加了代码注释

## 检查清单

- [ ] 代码遵循项目规范
- [ ] 通过了所有 CI 检查
- [ ] 更新了 CHANGELOG (如适用)
- [ ] 自我审查了代码变更

## 截图/示例 (如适用)

[如果是 UI 变更或新功能,提供截图或使用示例]
\`\`\`

### 审查标准

Code Reviewer 会检查以下方面:

#### 代码质量
- [ ] 代码清晰易懂,命名规范
- [ ] 遵循项目的代码风格和最佳实践
- [ ] 无明显的性能问题或安全隐患
- [ ] 错误处理完善

#### 功能完整性
- [ ] 实现了 Issue 中描述的所有功能
- [ ] 边界情况处理正确
- [ ] 无明显的逻辑错误

#### 测试覆盖
- [ ] 测试覆盖率达标 (>= 80%)
- [ ] 测试用例全面,包含正常和异常场景
- [ ] 测试命名清晰,易于理解

#### 文档完整性
- [ ] API 文档准确反映代码实现
- [ ] 示例代码可运行
- [ ] 重要变更在 CHANGELOG 中记录

#### 兼容性
- [ ] 不破坏现有 API (除非是 Breaking Change)
- [ ] TypeScript 类型定义正确
- [ ] 构建和测试在 CI 中通过

### 处理审查反馈

当收到审查意见时:

1. **理解反馈**: 仔细阅读审查意见,如有疑问及时沟通
2. **修改代码**: 根据反馈修改代码
3. **更新提交**:
   \`\`\`bash
   # 修改代码后
   git add .
   git commit -m "fix: address review comments"
   git push origin feature/your-feature-name
   \`\`\`
4. **回复评论**: 在 PR 中回复每条审查意见,说明你的修改
5. **请求重新审查**: 完成修改后,请求 Reviewer 重新审查

**沟通原则**:
- 保持开放和友好的态度
- 审查意见是为了提高代码质量,不是针对个人
- 如有不同意见,礼貌地讨论和说明理由
```

#### 4. 测试规范

**目的**: 定义测试的编写标准和覆盖率要求。

**内容要求**:
- **测试框架**: 项目使用的测试工具
- **测试类型**: 单元测试、集成测试、E2E 测试
- **测试编写**: 测试文件组织和命名规范
- **覆盖率要求**: 最低测试覆盖率标准

**示例结构**:
```markdown
## 测试规范

### 测试框架

本项目使用以下测试工具:

- **Vitest**: 快速的单元测试框架
- **@vitest/coverage-v8**: 代码覆盖率工具

### 测试类型

#### 单元测试

**目的**: 测试单个函数或模块的行为。

**位置**: `packages/[package-name]/tests/`

**命名**: `[function-name].test.ts` 或 `[module-name].test.ts`

**示例结构**:
\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { sum } from '../src/math/sum'

describe('sum', () => {
  it('should return sum of positive numbers', () => {
    expect(sum([1, 2, 3])).toBe(6)
  })

  it('should return 0 for empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('should handle negative numbers', () => {
    expect(sum([-1, -2, -3])).toBe(-6)
  })

  it('should handle mixed numbers', () => {
    expect(sum([1, -2, 3])).toBe(2)
  })
})
\`\`\`

#### 集成测试 (如适用)

**目的**: 测试多个模块的协作。

**示例**:
\`\`\`typescript
describe('Color Conversion Pipeline', () => {
  it('should convert hex to rgb to hsl correctly', () => {
    const hex = '#FF5733'
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb)

    expect(hsl).toEqual({ h: 9, s: 100, l: 60 })
  })
})
\`\`\`

### 测试编写指南

#### 测试命名

使用清晰的描述性名称:

\`\`\`typescript
// ✅ 推荐: 清晰说明测试意图
it('should throw error when input is null', () => { })
it('should return cached result for repeated calls', () => { })

// ❌ 不推荐: 命名模糊
it('handles null', () => { })
it('works correctly', () => { })
\`\`\`

#### 测试结构 (AAA 模式)

遵循 **Arrange-Act-Assert** 模式:

\`\`\`typescript
it('should format user display name', () => {
  // Arrange: 准备测试数据
  const user = { firstName: 'John', lastName: 'Doe' }

  // Act: 执行被测试的函数
  const displayName = formatDisplayName(user)

  // Assert: 验证结果
  expect(displayName).toBe('John Doe')
})
\`\`\`

#### 边界情况测试

确保测试覆盖所有边界情况:

\`\`\`typescript
describe('divide', () => {
  it('should divide two positive numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero')
  })

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })

  it('should handle decimal results', () => {
    expect(divide(10, 3)).toBeCloseTo(3.333, 2)
  })
})
\`\`\`

### 覆盖率要求

**最低覆盖率标准**:
- **语句覆盖率 (Statements)**: >= 80%
- **分支覆盖率 (Branches)**: >= 75%
- **函数覆盖率 (Functions)**: >= 80%
- **行覆盖率 (Lines)**: >= 80%

**查看覆盖率报告**:
\`\`\`bash
# 生成覆盖率报告
pnpm run test:coverage

# 查看 HTML 报告
open coverage/index.html
\`\`\`

**覆盖率豁免**:
以下情况可适当降低覆盖率要求:
- 错误处理代码 (难以触发的异常)
- 类型守卫函数 (TypeScript 已提供类型安全)
- 简单的 getter/setter

**使用注释标记豁免**:
\`\`\`typescript
/* istanbul ignore next */
function unreachableCode() {
  // 不会被覆盖率统计
}
\`\`\`

### 运行测试

\`\`\`bash
# 运行所有测试
pnpm run test

# 监听模式 (开发时使用)
pnpm run test:watch

# 运行特定包的测试
pnpm --filter @esdora/kit test

# 查看覆盖率
pnpm run test:coverage
\`\`\`
```

#### 5. 提交规范

**目的**: 定义 Commit Message 格式和 PR 提交流程。

**内容要求**:
- **Commit Message 格式**: 遵循 Conventional Commits
- **提交粒度**: 如何组织提交
- **Rebase vs Merge**: 合并策略
- **签名要求**: DCO 或 GPG 签名 (如适用)

**示例结构**:
```markdown
## 提交规范

### Commit Message 格式

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

#### Type (必需)

**功能和修复**:
- `feat`: 新功能
- `fix`: Bug 修复
- `perf`: 性能优化

**代码质量**:
- `refactor`: 代码重构 (不改变功能)
- `style`: 代码格式调整 (不影响逻辑)

**文档和测试**:
- `docs`: 文档更新
- `test`: 测试相关

**工具和配置**:
- `build`: 构建系统或外部依赖变更
- `ci`: CI 配置文件和脚本变更
- `chore`: 其他不修改 src 或 test 的变更

**Breaking Change**:
- 在 type 后添加 `!` 标记: `feat!:` 或 `fix!:`

#### Scope (可选)

指定变更影响的范围:

\`\`\`
feat(kit): add isCircular function
fix(color): correct rgb to hex conversion
docs(guide): update installation steps
\`\`\`

**常用 scope**:
- `kit`: @esdora/kit 包
- `color`: @esdora/color 包
- `docs`: 文档网站
- `ci`: CI/CD 配置
- `deps`: 依赖更新

#### Subject (必需)

简短描述 (50 字符以内):

- 使用祈使句,现在时 ("add" 而非 "added")
- 不要首字母大写
- 不要以句号结尾

\`\`\`bash
# ✅ 推荐
feat(kit): add isCircular function

# ❌ 不推荐
feat(kit): Added isCircular function.  # 过去时 + 句号
feat(kit): Adds isCircular function    # 第三人称
\`\`\`

#### Body (可选)

详细说明变更的原因和影响:

\`\`\`
feat(kit): add isCircular function

Implements circular reference detection for objects and arrays.
Uses a WeakSet to track visited objects for optimal performance.

This solves the issue where deep cloning would hang on circular structures.
\`\`\`

#### Footer (可选)

关闭 Issue 或说明 Breaking Change:

\`\`\`
fix(color): correct rgb to hex conversion

The previous implementation incorrectly handled values < 16.

Closes #42
\`\`\`

**Breaking Change 示例**:
\`\`\`
feat(kit)!: change isCircular return type to boolean

BREAKING CHANGE: isCircular now returns boolean instead of throwing errors.
Migration: Replace try-catch blocks with if-else checks.

Before:
try { isCircular(obj) } catch { /* handle */ }

After:
if (isCircular(obj)) { /* handle */ }
\`\`\`

### 提交粒度

**原则**: 每个 commit 应该是一个独立的逻辑单元。

#### ✅ 推荐: 原子性提交

\`\`\`bash
# 每个 commit 专注一个变更
git commit -m "feat(kit): add isCircular function"
git commit -m "test(kit): add tests for isCircular"
git commit -m "docs(kit): add isCircular documentation"
\`\`\`

#### ❌ 不推荐: 混杂多个变更

\`\`\`bash
# 一个 commit 包含多个不相关的变更
git commit -m "add isCircular, fix bug, update docs"
\`\`\`

### 提交前检查

使用 Git Hooks (通过 Husky + lint-staged) 自动检查:

\`\`\`bash
# 提交时自动运行
git commit -m "feat(kit): add new function"

# Husky 会自动执行:
# 1. lint-staged: 格式化和检查暂存的文件
# 2. commitlint: 验证 commit message 格式
# 3. test: 运行相关测试
\`\`\`

### Rebase 策略

**提交 PR 前**:

\`\`\`bash
# 同步上游最新代码
git fetch upstream
git rebase upstream/main

# 如遇冲突,解决后继续
git add .
git rebase --continue

# 强制推送到你的分支 (仅自己的分支)
git push origin feature/your-feature-name --force
\`\`\`

**交互式 Rebase** (整理提交历史):

\`\`\`bash
# 合并最近 3 个 commit
git rebase -i HEAD~3

# 编辑器中将除第一个外的 commit 改为 squash
pick abc1234 feat(kit): add function
squash def5678 fix typo
squash ghi9012 update tests

# 保存后合并为一个 commit
\`\`\`

**注意**: 仅在自己的分支上使用 rebase,不要 rebase 已推送到共享分支的提交。

### Commit 示例

#### 新功能

\`\`\`
feat(kit): add debounce function

Implements a debounce utility that delays function execution until
after a specified wait time has elapsed since the last call.

Useful for optimizing event handlers like scroll, resize, and input.
\`\`\`

#### Bug 修复

\`\`\`
fix(color): handle edge case in hexToRgb

Previously failed when hex string had uppercase letters.
Now normalizes input to lowercase before processing.

Closes #123
\`\`\`

#### Breaking Change

\`\`\`
feat(kit)!: remove deprecated compose function

BREAKING CHANGE: The compose function has been removed.
Use the pipe function instead for better readability.

Migration guide:
- Before: compose(f, g, h)(x)
- After: pipe(x, h, g, f)
\`\`\`

## 常见问题

### 依赖安装失败

**问题**: `pnpm install` 报错

**解决**:
1. 确认 Node.js 版本 >= 18.0.0
2. 清除缓存: `pnpm store prune`
3. 删除 `node_modules` 和 `pnpm-lock.yaml`,重新安装

### 测试失败

**问题**: 本地测试通过,但 CI 失败

**原因**: 环境差异或测试顺序问题

**解决**:
1. 检查 Node.js 版本是否一致
2. 确保测试之间无依赖,使用 `beforeEach` 重置状态
3. 本地运行 `pnpm run test --run` (禁用监听模式)

### PR 被拒绝

**原因**: 可能因为不符合规范或质量问题

**建议**:
1. 仔细阅读审查意见
2. 根据反馈修改代码
3. 确保通过所有 CI 检查
4. 如有疑问,礼貌地与 Reviewer 沟通
```

## AI 生成提示词

以下提示词适用于使用 **Codex** 生成贡献指南 (推荐模型: `gpt-5.1-codex`)。

### 角色定义

你是一位**开源项目维护者和开发流程专家**,擅长设计高效的协作流程、编写清晰的贡献指南并生成可执行的工作流程脚本。

### 任务说明

基于提供的项目结构、CI/CD 配置或开发流程需求,生成一份完整的贡献指南,符合以下规范:

1. **遵循规范**:
   - Layer 1 通用文档规范 (Frontmatter、标题结构、语言、链接格式、代码示例、注意事项)
   - Layer 2 贡献指南规范 (工作流程说明、规范和标准、协作指南)
   - 本模板的 5 个章节结构

2. **内容要求**:
   - **开始贡献章节**: 提供完整的环境搭建步骤、仓库克隆和依赖安装命令,包含验证步骤和项目结构说明
   - **开发流程章节**: 定义分支策略、同步上游、开发步骤和本地验证清单,提供完整的 Git 命令示例
   - **代码审查章节**: 说明 PR 提交流程、PR 模板、审查标准和反馈处理方式
   - **测试规范章节**: 定义测试框架、测试类型、编写指南和覆盖率要求,提供测试示例代码
   - **提交规范章节**: 定义 Commit Message 格式 (Conventional Commits)、提交粒度和 Rebase 策略,提供提交示例

3. **质量检查点**:
   - **流程完整性**: 从环境搭建到 PR 合并的每个步骤都有清晰的指令和命令示例,无遗漏环节
   - **Checklist 实用性**: 所有检查清单项目具体可操作,可直接用于自查,避免模糊或抽象的描述
   - **规范可操作性**: 提交规范和测试规范包含具体示例,开发者可直接参考执行

### 输入要求

- **项目结构**: 提供项目目录结构和主要文件路径
- **CI/CD 配置**: 如有 GitHub Actions 或其他 CI 配置文件
- **开发工具**: 说明使用的包管理器、测试框架、构建工具

### 输出格式

- **格式**: Markdown 文件,包含 YAML frontmatter
- **语言**: 简体中文 (命令和代码可使用英文)
- **代码块**: 使用三反引号 (\`\`\`) 包裹,标注语言类型
- **命令示例**: 提供完整可执行的命令,包含注释说明

## 推荐模型

- **首选**: **Codex** (`gpt-5.1-codex`) - 工作流程生成能力强,擅长编写配置脚本和命令示例
- **备选**: **Gemini** (`gemini-2.5-pro`) - 当侧重规范说明和协作指南时使用

### 使用示例

```bash
# 使用 Codex 生成贡献指南
codex -C . --full-auto exec "
PURPOSE: 生成 Dora Pocket 项目的贡献指南
TASK:
• 提取现有的工作流程 (Git 分支策略、PR 流程)
• 生成开发环境配置步骤和脚本示例
• 定义 Commit Message 规范和测试覆盖率要求
• 创建 PR 模板和代码审查检查清单
MODE: auto
CONTEXT: @.github/**/* @package.json @pnpm-workspace.yaml @CLAUDE.md | Memory: Monorepo 结构,pnpm + Turbo 工具链,Vitest 测试框架,VitePress 文档系统
EXPECTED: 完整的贡献指南,包含 5 个章节、可执行命令示例和 3 个质量检查点的验证
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/development/02-implement-feature.txt) | 遵循 L1+L2 贡献指南规范,使用 Conventional Commits,提供完整工作流程 | auto=FULL operations
" --skip-git-repo-check -s danger-full-access
```

## 核心指令与规范

1. **继承规范**:
   - ✅ Layer 1 通用文档规范 (参见 [architecture.md](./architecture.md#layer-1-通用文档规范层))
   - ✅ Layer 2 贡献指南规范 (参见 [architecture.md](./architecture.md#类型-5-贡献指南规范))

2. **必需章节**:
   - 开始贡献 (环境搭建、仓库说明、项目结构)
   - 开发流程 (分支策略、开发步骤、本地验证)
   - 代码审查 (PR 提交、审查标准、反馈处理)
   - 测试规范 (测试框架、编写指南、覆盖率要求)
   - 提交规范 (Commit Message、提交粒度、Rebase 策略)

3. **命令示例要求**:
   - 所有命令都包含注释说明
   - 提供完整的 Git 工作流命令序列
   - 包含验证步骤和预期结果

4. **质量检查要点**:
   - **流程完整性**: 验证所有开发步骤都有清晰指令
   - **Checklist 实用性**: 确保检查清单具体可操作
   - **规范可操作性**: 检查规范包含具体示例和参考

## 相关文档

- [术语表](./glossary.md) - 文档类型和 AI 模型定义
- [文档规范体系架构](./architecture.md) - 3 层规范体系设计
- [AI 模型调度策略](./ai-model-strategy.md) - 模型选择和使用规范
- [Kit 工具函数模板](./kit-template.md) - API 文档模板参考
- [文档编写指南: 总览](./overview.md) - 文档哲学和核心理念

## 版本历史

- **v1.0** (2025-11-19): 初始版本,定义贡献指南的 5 个章节结构和 AI 生成提示词
