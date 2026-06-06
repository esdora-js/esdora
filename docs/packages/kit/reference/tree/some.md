---
title: treeSome
description: '@esdora/kit 的 treeSome 函数，对树形结构数组进行遍历，检测是否存在满足条件的节点'
---

# treeSome

对树形结构数组进行遍历，检测是否存在满足条件的节点。支持深度优先（DFS）和广度优先（BFS）两种遍历模式，以及前序/后序遍历顺序。一旦找到满足条件的节点，立即返回 `true`，不再继续遍历。

## 示例

### 基本用法

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  { id: 1, value: 'a', children: [{ id: 2, value: 'b' }, { id: 3, value: 'c' }] },
  { id: 4, value: 'd' },
]

treeSome(tree, node => node.id === 2) // => true
treeSome(tree, node => node.id === 999) // => false
```

### 使用广度优先遍历（BFS）

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  {
    id: 1,
    children: [
      { id: 2, target: true },
      { id: 3 },
    ],
  },
  { id: 4, target: true },
]

// BFS 按层级遍历，先找到 id=4
treeSome(tree, node => node.target === true, { mode: 'bfs' }) // => true
```

### 使用后序遍历

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  {
    id: 1,
    children: [
      { id: 2 },
    ],
  },
]

// 后序遍历：先访问子节点，再访问父节点
treeSome(tree, node => node.id === 1, { mode: 'dfs', order: 'post' }) // => true
```

### 自定义子节点键名

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  {
    id: 1,
    name: 'root',
    items: [
      { id: 2, name: 'child1' },
      { id: 3, name: 'child2', items: [{ id: 4, name: 'grandchild' }] },
    ],
  },
]

treeSome(tree, node => node.id === 4, { childrenKey: 'items' }) // => true
```

### 空数组与边界情况

```typescript
import { treeSome } from '@esdora/kit'

// 空数组直接返回 false
treeSome([], node => true) // => false

// 子节点为 null 或 undefined 的情况
const treeWithNullChildren = [
  { id: 1, children: null },
  { id: 2 },
]
treeSome(treeWithNullChildren, node => node.id === 2) // => true
```

## 签名

```typescript
export interface TreeSomeOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}

export function treeSome<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: TreeSomeOptions,
): boolean
```

## 参数

| 参数      | 类型                   | 描述                                               | 必需 |
| --------- | ---------------------- | -------------------------------------------------- | ---- |
| `array`   | `T[]`                  | 要处理的树形结构数组                               | 是   |
| `fn`      | `(item: T) => boolean` | 对每个节点执行的检测函数，返回 `true` 表示满足条件 | 是   |
| `options` | `TreeSomeOptions`      | 可选配置对象，控制遍历行为                         | 否   |

### TreeSomeOptions

| 字段          | 类型              | 描述                                                             | 默认值       |
| ------------- | ----------------- | ---------------------------------------------------------------- | ------------ |
| `mode`        | `'dfs' \| 'bfs'`  | 遍历模式：`dfs` 为深度优先，`bfs` 为广度优先                     | `'dfs'`      |
| `order`       | `'pre' \| 'post'` | 遍历顺序，仅在 `mode: 'dfs'` 时有效：`pre` 为先序，`post` 为后序 | `'pre'`      |
| `childrenKey` | `string`          | 子节点属性名                                                     | `'children'` |

## 返回值

- **类型**: `boolean`
- **说明**: 如果树中存在至少一个节点使 `fn` 返回 `true`，则返回 `true`；否则返回 `false`
- **特殊情况**:
  - 传入空数组 `[]` 时，直接返回 `false`
  - 一旦找到满足条件的节点，立即停止遍历并返回 `true`
  - 子节点属性为 `null` 或 `undefined` 时，视为无子节点，不会抛出异常

## 运行逻辑

```mermaid
flowchart TD
    A[输入 tree 数组] --> B{第一个参数是数组?}
    B -->|否| C[抛出 TypeError]
    B -->|是| D{数组为空?}
    D -->|是| E[返回 false]
    D -->|否| F[解析配置项 mode / order / childrenKey]
    F --> G{mode === 'bfs'?}
    G -->|是| H[BFS 遍历]
    G -->|否| I{order === 'post'?}
    I -->|是| J[DFS 后序遍历]
    I -->|否| K[DFS 前序遍历]
    H --> L{fn(node) === true?}
    J --> L
    K --> L
    L -->|是| M[立即返回 true]
    L -->|否| N{还有更多节点?}
    N -->|是| H
    N -->|否| O[返回 false]
```

函数首先校验输入参数类型，然后解析配置项。根据 `mode` 选择遍历策略：

- **DFS 前序（默认）**：先检测当前节点，再递归检测子节点
- **DFS 后序**：先递归检测子节点，再检测当前节点
- **BFS**：使用队列按层级逐层检测节点

无论哪种模式，一旦 `fn` 返回 `true`，遍历立即停止并返回 `true`。

## 注意事项

### 输入边界

- 第一个参数必须是数组，否则会抛出 `TypeError`
- 数组元素应为对象类型，且子节点属性（默认 `children`）应为数组、`null` 或 `undefined`
- 子节点属性存在但为非数组类型（如字符串、数字）时，会抛出 `TypeError`
- 节点本身可以为 `null` 或 `undefined`（BFS 模式下会自动跳过）

### 错误处理

- 当第一个参数不是数组时，抛出 `TypeError: Expected an array as the first argument`
- 当子节点属性存在但不是数组时，抛出 `TypeError`，并附带节点标识信息（如 `id` 或 `name`）和实际类型

### 性能考虑

- **时间复杂度**: O(n)，其中 n 为节点数量。最坏情况下需要遍历所有节点
- **空间复杂度**:
  - DFS: O(h)，h 为树的最大深度（递归栈空间）
  - BFS: O(w)，w 为树的最大宽度（队列空间）
- **短路优化**: 一旦找到满足条件的节点，立即停止遍历，不会访问后续节点

### 兼容性

- **环境要求**: ES2015+，依赖 `Array.isArray` 和基本对象操作
- 使用递归实现 DFS，极深的树结构可能导致栈溢出

## 相关链接

- [源码](/packages/kit/src/tree/some/index.ts)
- [单元测试](/packages/kit/src/tree/some/index.test.ts)
