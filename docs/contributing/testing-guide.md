---
title: 测试指南
description: 了解如何为 Dora Pocket 项目编写和运行单元测试，以及必须遵守的测试规范，以确保代码的健壮性和可靠性。
---

# 测试指南

在 `Dora Pocket`，我们相信测试是保证每个“道具”都可靠、耐用的基石。我们力求达到 100% 的测试覆盖率，并要求所有新功能或 Bug 修复都必须附带相应的单元测试。

## 测试框架

我们使用 [**Vitest**](https://vitest.dev/) 作为我们的测试框架，它拥有快速的性能和与 Vite 无缝集成的优秀体验。

## 如何运行测试

你可以使用以下 `pnpm` 脚本来运行测试：

- **运行全量测试**:

  ```sh
  pnpm test
  ```

  这个命令会运行项目中的所有测试用例。

- **在监视模式下运行**:
  在开发过程中，使用监视模式会非常高效。它会自动重新运行与你修改文件相关的测试。

  ```sh
  pnpm test --watch
  ```

- **检查测试覆盖率**:
  ```sh
  pnpm coverage
  ```
  这个命令会在 `coverage/` 目录下生成一份详细的测试覆盖率报告，你可以在浏览器中打开 `index.html` 查看。

## 如何编写测试

当你添加一个新功能或修复一个 Bug 时，请遵循以下步骤编写测试：

1.  **文件位置**: 测试文件应与源文件放在**同一目录**下，并以 **`.test.ts`** 结尾。

    ```
    - /packages/packages/kit/src/function/clamp/
      - index.ts      (源文件)
      - index.test.ts (测试文件)
    ```

2.  **编写结构**: 使用 `describe` 来组织测试套件，`it` (或 `test`) 来定义单个测试用例。

3.  **测试内容**: 一个好的测试用例应该覆盖：
    - **常规情况**: 测试函数在典型输入下的表现。
    - **边界情况**: 测试临界值、`null`、`undefined`、空数组/对象等。
    - **异常情况**: 测试无效输入是否能被优雅处理。

**示例 (`clamp.test.ts`):**

```typescript
import { describe, expect, it } from 'vitest'
import { clamp } from '.'

describe('clamp', () => {
  it('should clamp a number within the bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  // ... 其他测试用例
})
```

---

## ⚠️ 必须遵守的测试规范

在提交 Pull Request 之前，请务必确保你的贡献满足以下所有要求：

### 1. 更新导出文件快照

**如果你新增了一个导出的函数**，你需要更新测试快照，以确保它被正确地包含在包的入口文件中。

运行以下命令来自动更新快照：

```sh
pnpm test -- -u
```

### 2. 在本地执行构建

部分构建流程（如修改 `package.json` 的 `exports` 字段）是在 `pnpm run build` 过程中动态完成的。请在提交代码前，务必在本地成功执行一次构建。

```sh
pnpm build
```

### 3. 测试覆盖率必须达到 100%

你的 Pull Request **必须**保证你修改或新增的代码行、函数和分支都被单元测试完全覆盖。

- 在本地运行 `pnpm coverage` 来检查你的覆盖率报告。
- CI 流程会自动使用 [**Codecov**](https://app.codecov.io/gh/esdora-js/esdora) 进行覆盖率检查，任何未达到 100% 的 PR 都将无法合并。
- 你可以访问我们的 [Codecov 配置](https://github.com/esdora-js/esdora/blob/main/codecov.yml)来了解具体的忽略规则和阈值设置。
