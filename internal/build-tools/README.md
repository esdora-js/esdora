# @esdora/build-tools

内部构建工具包，用于统一管理 Esdora 项目中各个包的构建脚本、配置文件和测试配置。

## 🏗️ **架构设计**

这是一个**基础设施包**，位于 `internal/` 目录下，通过正式的包依赖关系为产物包提供构建能力。

### 核心原则

- ✅ **包依赖引用**：通过 `devDependencies` 正式依赖，而非相对路径
- ✅ **独立构建脚本**：每个包有自己的 `scripts/build.js`
- ✅ **正确的 stub 使用**：只有基础设施包使用 stub，产物包不需要
- ✅ **构建产物管理**：CLI 等工具通过构建过程生成，不直接提交源码

## 功能特性

- 🚀 **统一构建流程**：标准化的构建步骤，包括 unbuild、类型文件整理和浏览器版本构建
- 📦 **配置生成器**：提供 `build.config.ts` 和 `vitest.config.ts` 的配置生成函数
- 🔧 **构建后 CLI**：通过构建过程生成可执行的 CLI 工具
- 🌐 **浏览器支持**：自动构建 IIFE 格式的浏览器版本（如果包配置了 `browser` 字段）

## 使用方法

### 1. 添加依赖关系

```json
{
  "devDependencies": {
    "@esdora/build-tools": "workspace:*"
  }
}
```

### 2. 创建独立构建脚本

```javascript
// scripts/build.js
import { buildPackage } from '@esdora/build-tools'

async function main() {
  await buildPackage({
    packageName: '@esdora/your-package',
    buildBrowser: false, // 根据需要设置
    cwd: process.cwd()
  })
}

main().catch(console.error)
```

### 3. 配置 package.json

```json
{
  "scripts": {
    "build": "node scripts/build.js"
  }
}
```

### 2. 使用配置生成器

#### build.config.ts

```typescript
import { defineBuildConfig } from 'unbuild'
import { createBuildConfig } from '../build-tools/src/configs'

export default defineBuildConfig(createBuildConfig({
  entries: ['src/index'],
  externals: [],
  sourcemap: true,
}))
```

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import { createTestConfig } from '../build-tools/src/configs'

export default defineConfig(createTestConfig({
  environment: 'node',
  coverageThresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}))
```

### 3. 浏览器版本构建

如果你的包需要构建浏览器版本，在 `package.json` 中添加 `browser` 字段：

```json
{
  "browser": "./dist/your-package.min.js"
}
```

构建工具会自动：

- 检测 `browser` 字段的存在
- 根据包名生成合适的全局变量名（如 `@esdora/kit` → `esdoraKit`）
- 生成 IIFE 格式的 `.js` 和 `.min.js` 文件

## API 参考

### buildPackage(options)

执行完整的构建流程。

```typescript
interface BuildOptions {
  packageName: string
  buildBrowser?: boolean
  globalName?: string
  browserFileName?: string
  cwd?: string
}
```

### createBuildConfig(options)

生成 unbuild 配置。

```typescript
interface PackageBuildOptions {
  entries?: string[]
  externals?: string[]
  sourcemap?: boolean
  target?: string
}
```

### createTestConfig(options)

生成 vitest 配置。

```typescript
interface PackageTestOptions {
  coverageThresholds?: {
    branches?: number
    functions?: number
    lines?: number
    statements?: number
  }
  environment?: 'node' | 'jsdom' | 'happy-dom'
  excludeFiles?: string[]
  includeFiles?: string[]
}
```

## 构建流程

1. **运行 unbuild**：编译 TypeScript 代码并生成类型定义
2. **整理类型文件**：将 `.d.mts` 和 `.d.cts` 文件移动到 `dist/types/` 目录
3. **构建浏览器版本**（可选）：使用 esbuild 生成 IIFE 格式的浏览器版本

## 迁移指南

从旧的构建脚本迁移到新的构建工具包：

1. 删除 `scripts/` 目录中的构建脚本
2. 更新 `package.json` 中的构建命令
3. 使用配置生成器简化 `build.config.ts` 和 `vitest.config.ts`
4. 测试构建和测试功能是否正常

## 优势

- **减少重复代码**：所有包共享相同的构建逻辑
- **统一维护**：构建工具的更新会自动应用到所有包
- **简化配置**：通过配置生成器减少样板代码
- **自动化**：CLI 工具自动检测包配置并执行相应流程
