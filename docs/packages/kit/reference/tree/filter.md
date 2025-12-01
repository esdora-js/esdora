---
title: treeFilter
description: treeFilter - 来自 Dora Pocket 的树结构“道具”，用于对树形数组按条件进行深度或广度优先过滤。
---

# treeFilter

<!-- 1. 简介：一句话核心功能描述 -->

对树形数组执行深度优先（DFS）或广度优先（BFS）遍历，并根据回调函数结果返回一个仅包含目标节点的新树。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法（默认 DFS 前序遍历）

```typescript
import { treeFilter } from '@esdora/kit'

interface TreeNode {
  id: number
  name: string
  children?: TreeNode[]
}

const tree: TreeNode[] = [
  {
    id: 1,
    name: 'root1',
    children: [
      {
        id: 2,
        name: 'child1',
        children: [
          { id: 3, name: 'grandchild1' },
          { id: 4, name: 'grandchild2' },
        ],
      },
      { id: 5, name: 'child2' },
    ],
  },
  {
    id: 6,
    name: 'root2',
    children: [{ id: 7, name: 'child3' }],
  },
]

// 过滤出 id 为奇数的节点
const result = treeFilter(tree, node => node.id % 2 === 1)
// => [
//   {
//     id: 1,
//     name: 'root1',
//     children: [
//       {
//         id: 5,
//         name: 'child2',
//       },
//     ],
//   },
// ]
```

### 后序遍历过滤子树（DFS post）

```typescript
import { treeFilter } from '@esdora/kit'

const result = treeFilter(
  tree,
  node => node.id % 2 === 1,
  { mode: 'dfs', order: 'post' },
)
// => [
//   {
//     id: 1,
//     name: 'root1',
//     children: [
//       { id: 5, name: 'child2' },
//     ],
//   },
// ]
```

### 广度优先遍历（BFS）

```typescript
import { treeFilter } from '@esdora/kit'

const bfsResult = treeFilter(
  tree,
  node => node.id <= 2,
  { mode: 'bfs' },
)
// => [
//   {
//     id: 1,
//     name: 'root1',
//     children: [
//       {
//         id: 2,
//         name: 'child1',
//         children: [],
//       },
//     ],
//   },
// ]
```

### 自定义子节点属性名

```typescript
import { treeFilter } from '@esdora/kit'

interface Category {
  id: number
  name: string
  subcategories?: Category[]
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Category 1',
    subcategories: [
      { id: 2, name: 'Subcategory 1' },
      { id: 3, name: 'Subcategory 2' },
    ],
  },
]

const resultWithCustomChildren = treeFilter(
  categories,
  item => item.id !== 2,
  { childrenKey: 'subcategories' },
)
// => [
//   {
//     id: 1,
//     name: 'Category 1',
//     subcategories: [
//       { id: 3, name: 'Subcategory 2' },
//     ],
//   },
// ]
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

### 类型签名

```typescript
export interface TreeFilterOptions {
  /**
   * 遍历模式：
   * - 'dfs'：深度优先遍历（默认）
   * - 'bfs'：广度优先遍历
   */
  mode?: 'dfs' | 'bfs'

  /**
   * 遍历顺序，仅在深度优先时有效：
   * - 'pre'：前序遍历（默认）
   * - 'post'：后序遍历
   */
  order?: 'pre' | 'post'

  /**
   * 子节点属性名，默认为 'children'
   */
  childrenKey?: string
}

export function treeFilter<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: TreeFilterOptions,
): T[]
```

### 参数说明

| 参数     | 类型                              | 描述                                                   | 必需 |
| -------- | --------------------------------- | ------------------------------------------------------ | ---- |
| array    | `T[]`                             | 要过滤的树形数组，每一项代表一个树节点                | 是   |
| fn       | `(item: T) => boolean`           | 节点过滤函数，返回 `true` 表示保留该节点              | 是   |
| options  | `TreeFilterOptions`              | 遍历和子节点配置项                                     | 否   |

**配置项 TreeFilterOptions**

| 字段        | 类型                 | 描述                                                                 | 默认值      |
| ----------- | -------------------- | -------------------------------------------------------------------- | ----------- |
| mode        | `'dfs' \| 'bfs'`     | 遍历模式：`'dfs'` 深度优先，`'bfs'` 广度优先                         | `'dfs'`     |
| order       | `'pre' \| 'post'`    | 深度优先遍历的顺序：`'pre'` 前序、`'post'` 后序，仅在 `mode='dfs'` 时有效 | `'pre'`     |
| childrenKey | `string`             | 子节点数组所在的属性名                                               | `'children'` |

### 返回值

- **类型**: `T[]`
- **说明**:
  - 返回一个新的树形数组，结构与输入树保持一致，仅包含过滤函数返回 `true` 的节点
  - 返回结果为浅拷贝，不会修改原始树结构

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

### 输入边界

- 当第一个参数 `array` 不是数组（例如 `null`、`undefined`、字符串等）时，会抛出 `TypeError('Expected an array as the first argument')`。
- 当输入为空数组时，会直接返回空数组 `[]`，不会调用回调函数 `fn`。
- 当子节点属性（默认 `children` 或自定义 `childrenKey`）存在且不是数组时，会抛出 `TypeError('Expected \'<childrenKey>\' to be an array')`。

### 行为细节

- 仅当过滤函数 `fn` 对某个节点返回 `true` 时，该节点才会出现在返回结果中。
- 所有遍历模式（DFS 前序、DFS 后序、BFS）都会保持原有的层级结构，只是移除了不满足条件的节点。
- 在 BFS 模式下，过滤后的结果树结构与 DFS 模式保持一致（测试用例中对比了同一条件的 BFS 与 DFS 结果）。
- 自定义 `childrenKey` 时，过滤逻辑与默认 `children` 完全一致，可用于适配各种字段命名的树结构。

### 错误处理

- 不会静默忽略错误输入：
  - 非数组的根节点会立即抛出 `TypeError`。
  - 非数组类型的子节点属性会在访问时抛出 `TypeError`。
- 建议在外层使用 `try/catch` 包裹潜在不可信数据源，捕获这些类型错误并给出友好提示。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/tree/filter/index.ts)
- [单元测试](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/tree/filter/index.test.ts)
