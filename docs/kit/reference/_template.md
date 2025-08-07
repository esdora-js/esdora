# 函数名

<!-- 1. 简介：一句话核心功能描述 -->
<!-- 示例：分析一个树形结构，找出从根节点到每个叶子节点的所有路径。 -->

<!-- 2. 示例：统一的示例章节，根据输出复杂度选择不同风格 -->

## 示例

### 基本用法 (多行输出)

```typescript
import { treePathAnalyze } from '@esdora/kit'

const tree = {
  id: 'root',
  children: [{ id: 'A' }, { id: 'B' }]
}

const paths = treePathAnalyze(tree)
console.log(paths)
```

**输出:**

```json
[
  ["root", "A"],
  ["root", "B"]
]
```

### [场景描述] (单行输出)

```typescript
import { someSimpleFunction } from '@esdora/kit'

const result = someSimpleFunction('input')
// => 'output'
```

<!-- 3. 签名与参数：技术核心 -->

## 签名与参数

```typescript
function functionName(
  /** 参数1的描述。 */
  param1: Type1,

  /** 可选的配置对象。 */
  options?: {
    /**
     * 选项1的描述。
     * @default 'defaultValue'
     */
    option1?: string
  }
): ReturnType
```

<!-- 4. 返回值：解释返回值的语义 -->

## 返回值

函数返回一个 `ReturnType`，它代表了...。在特定情况下，例如...，会返回...。

<!-- 5. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于[情况A]**: 当...时，函数的行为是...。
- **关于[情况B]**: 函数会优雅地处理...，具体表现为...。

<!-- 6. 相关链接：提供源码和其他导航 -->

## 相关链接

- **源码**: [`packages/function/src/functionName/index.ts`](https://github.com/your-repo/your-project/blob/main/path/to/function.ts)
- **相关函数**: [`anotherFunction`](../category/anotherFunction.md)
- **指南**: [`开发模式特性`](../../guide/development-mode.md)
