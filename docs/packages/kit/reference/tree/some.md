---
title: treeSome
description: "treeSome - Dora Pocket 中 @esdora/kit 库提供的树结构工具函数，用于检测树形数组中是否存在满足条件的节点。"
---

# treeSome

遍历树形结构数组，检测是否存在满足给定条件的节点，支持深度优先（DFS）与广度优先（BFS）两种遍历方式，并可按需自定义子节点键名和遍历顺序。

## 示例

```typescript
import { treeSome } from '@esdora/kit'

interface Node {
  id: number
  children?: Node[]
}

const tree: Node[] = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4 },
]

// 检查是否存在 id 为偶数的节点
const hasEvenId = treeSome(tree, node => node.id % 2 === 0)
// => true

// 使用广度优先遍历
const found = treeSome(tree, node => node.id === 3, { mode: 'bfs' })
// => true

// 指定子节点属性名
const customTree = [
  { id: 1, nodes: [{ id: 2 }] },
]
const exists = treeSome(customTree, node => node.id === 2, { childrenKey: 'nodes' })
// => true

// 不存在满足条件的节点时返回 false
const notExists = treeSome(tree, node => node.id > 100)
// => false
```

### 控制遍历顺序（DFS 前序 / 后序）

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  {
    id: 1,
    children: [
      { id: 2 },
      { id: 3 },
    ],
  },
]

const dfsPreOrder: number[] = []
treeSome(tree, (node) => {
  dfsPreOrder.push(node.id)
  return false
}, { mode: 'dfs', order: 'pre' })

// => dfsPreOrder 为 [1, 2, 3]

const dfsPostOrder: number[] = []
treeSome(tree, (node) => {
  dfsPostOrder.push(node.id)
  return false
}, { mode: 'dfs', order: 'post' })

// => dfsPostOrder 为 [2, 3, 1]
```

### 广度优先遍历（BFS）

```typescript
import { treeSome } from '@esdora/kit'

const tree = [
  {
    id: 1,
    children: [
      { id: 2, children: [{ id: 5 }] },
      { id: 3, children: [{ id: 6 }] },
    ],
  },
  {
    id: 4,
    children: [{ id: 7 }],
  },
]

const visitOrder: number[] = []
treeSome(tree, (node) => {
  visitOrder.push(node.id)
  return false
}, { mode: 'bfs' })

// => visitOrder 为 [1, 4, 2, 3, 7, 5, 6]
```

## 签名与说明

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

### 参数说明

| 参数      | 类型                   | 描述                                                                  | 必需 |
| --------- | ---------------------- | --------------------------------------------------------------------- | ---- |
| `array`   | `T[]`                  | 待遍历的树形结构数组，数组元素必须为对象类型。                        | 是   |
| `fn`      | `(item: T) => boolean` | 节点检测函数，返回 `true` 表示该节点满足条件，立即停止并返回 `true`。 | 是   |
| `options` | `TreeSomeOptions`      | 遍历配置项，可控制遍历模式、遍历顺序以及子节点属性名。                | 否   |

`options` 中的常用配置项：

- `mode`: `'dfs' | 'bfs'`，遍历模式，默认为 `'dfs'`（深度优先）。
- `order`: `'pre' | 'post'`，遍历顺序，仅在 `mode: 'dfs'` 时有效，默认为 `'pre'`（前序），`'post'`（后序）会先检查子节点再检查父节点。
- `childrenKey`: `string`，子节点属性名，默认为 `'children'`。

### 返回值

- **类型**: `boolean`
- **说明**: 若存在至少一个节点使得检测函数 `fn` 返回 `true`，则立即返回 `true`；否则在遍历完整棵树后返回 `false`。
- **特殊情况**:
  - 当传入空数组时，直接返回 `false`，不会调用检测函数。
  - 当树中某些节点为 `null` 或 `undefined` 时，只要检测函数在访问前进行判空即可安全跳过这些节点。

### 泛型约束（如适用）

- **`T`**: 树节点的类型，必须是 `Record<string, any>`，通常对应业务中的节点结构类型（例如 `Node` 接口），确保在回调函数中拥有类型安全的属性访问。

## 注意事项与边界情况

### 输入边界

- 当 `array` 不是数组（如 `null`、`undefined`、对象、字符串）时，会抛出 `TypeError`，不会调用检测函数。
- 当 `array` 为空数组时，直接返回 `false`。
- 子节点属性（默认 `children` 或自定义的 `childrenKey`）可以为：
  - 合法数组：会继续遍历子节点。
  - `undefined`、`null` 或空数组：被视为叶子节点，不会抛出错误。
- 在广度优先遍历（BFS）时，队列中可能包含 `null`、`undefined` 等假值节点；实现会跳过这些节点，调用方可在检测函数内部进行判空。

### 错误处理

- **异常类型**:
  - `TypeError`：
    - 第一个参数 `array` 不是数组时抛出。
  - 通用错误（`Error` 或其子类，具体类型取决于内部实现）：
    - 某个节点的 `childrenKey` 属性存在但不是数组（例如字符串或对象）时抛出。
    - 使用自定义 `childrenKey` 且对应属性值不是数组时抛出。
- **处理建议**:
  - 一般情况下只要保证输入数据结构正确即可，不需要在调用处额外添加 `try/catch`。
  - 若数据来源不可靠（如来自外部接口），可在调用前对树结构做预验证，或在最外层捕获异常并记录日志。

### 性能考虑

- **时间复杂度**: O(n)——无论是 DFS 还是 BFS，每个节点最多被访问一次。
- **空间复杂度**:
  - DFS 模式：O(h)，其中 `h` 为树的高度（递归调用栈），加上常量级别的额外状态。
  - BFS 模式：O(w)，其中 `w` 为最大层宽，需要在队列中同时保存同一层的多个节点。
- **优化建议**:
  - 当只关心是否存在某个节点时，`treeSome` 比先用 `treeMap` 再在结果上查找更高效，因为它在找到第一个满足条件的节点后会立即停止。
  - 在大树结构中，合理选择遍历模式：DFS 更适合深层结构，BFS 更适合关注节点层级关系的场景。
  - 检测函数 `fn` 应保持无副作用并尽量简单，避免在其中执行昂贵的计算或 I/O 操作。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/tree/some/index.ts)
