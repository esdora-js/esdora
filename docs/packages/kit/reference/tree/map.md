---
title: treeMap
description: "treeMap - Dora Pocket 中 @esdora/kit 库提供的树结构工具函数，用于对树形数组进行类型安全的映射与结构转换。"
---

# treeMap

对树形数组执行深度优先（DFS）或广度优先（BFS）遍历，为每个节点应用映射函数并返回新的树形结构，支持丰富的上下文信息和类型安全的控制。

## 示例

### 基本用法

```typescript
import { treeMap } from '@esdora/kit'

interface Node {
  id: number
  children?: Node[]
}

const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4, children: [{ id: 5 }] },
]

const result = treeMap<Node, Node>(tree, (item) => ({
  ...item,
  id: item.id * 2,
}))

// => [
//   { id: 2, children: [{ id: 4 }, { id: 6 }] },
//   { id: 8, children: [{ id: 10 }] },
// ]
```

### 后序遍历进行聚合计算

```typescript
import { treeMap } from '@esdora/kit'

interface Node {
  id: number
  value: number
  totalValue?: number
  children?: Node[]
}

const tree = [
  {
    id: 1,
    value: 10,
    children: [
      { id: 2, value: 20 },
      { id: 3, value: 30, children: [{ id: 4, value: 40 }] },
    ],
  },
]

const result = treeMap<Node, Node>(tree, (item, ctx) => {
  const childSum =
    ctx?.processedChildren?.reduce(
      (sum, child) => sum + (child.totalValue ?? 0),
      0,
    ) ?? 0

  return {
    ...item,
    totalValue: item.value + childSum,
    children: ctx?.processedChildren,
  }
}, {
  order: 'post',
  context: { processedChildren: true },
})

// => [
//   {
//     id: 1,
//     value: 10,
//     totalValue: 100,
//     children: [
//       { id: 2, value: 20, totalValue: 20 },
//       {
//         id: 3,
//         value: 30,
//         totalValue: 70,
//         children: [{ id: 4, value: 40, totalValue: 40 }],
//       },
//     ],
//   },
// ]
```

### 使用上下文访问节点位置信息

```typescript
import { treeMap } from '@esdora/kit'

interface Node {
  id: number
  name: string
  children?: Node[]
}

const tree: Node[] = [
  {
    id: 1,
    name: 'root',
    children: [
      { id: 2, name: 'child1' },
      { id: 3, name: 'child2' },
    ],
  },
]

const result = treeMap<Node, Node>(tree, (item, ctx) => ({
  ...item,
  level: ctx?.depth,
  index: ctx?.index,
  path: ctx?.path,
  isLeaf: ctx?.isLeaf,
  isRoot: ctx?.isRoot,
}), {
  context: {
    depth: true,
    index: true,
    path: true,
    isLeaf: true,
    isRoot: true,
  },
})

// => [
//   {
//     id: 1,
//     name: 'root',
//     level: 0,
//     index: 0,
//     path: [1],
//     isLeaf: false,
//     isRoot: true,
//     children: [
//       {
//         id: 2,
//         name: 'child1',
//         level: 1,
//         index: 0,
//         path: [1, 2],
//         isLeaf: true,
//         isRoot: false,
//       },
//       {
//         id: 3,
//         name: 'child2',
//         level: 1,
//         index: 1,
//         path: [1, 3],
//         isLeaf: true,
//         isRoot: false,
//       },
//     ],
//   },
// ]
```

### 控制子节点递归行为

```typescript
import { treeMap } from '@esdora/kit'

interface Node {
  id: number
  children?: Node[] | null
}

const tree: Node[] = [
  { id: 1, children: [{ id: 2 }] },
  { id: 3, children: [] },
]

const result = treeMap<Node, Node | null>(tree, (item, ctx) => ({
  ...item,
  children: item.children?.length > 0 ? ctx?.originalChildren : null,
}))

// => [
//   { id: 1, children: [{ id: 2, children: null }] },
//   { id: 3, children: null },
// ]
```

## 签名与说明

```typescript
export function treeMap<
  T extends Record<string, any>,
  U extends Record<string, any> | null | undefined,
  Config extends TreeMapContextConfig = Record<string, never>,
>(
  array: T[],
  fn: (item: T, context?: TreeMapContext<T, Config>) => U,
  options?: TreeMapOptions<Config>,
): U[]
```

### 参数说明

| 参数     | 类型                                            | 描述                                                                 | 必需 |
| -------- | ----------------------------------------------- | -------------------------------------------------------------------- | ---- |
| `array`  | `T[]`                                           | 输入的树形数组，数组元素必须是对象类型。                             | 是   |
| `fn`     | `(item: T, context?: TreeMapContext<T, Config>) => U` | 对每个节点调用的映射函数，必须返回对象、`null` 或 `undefined`。     | 是   |
| `options` | `TreeMapOptions<Config>`                       | 遍历与上下文配置，支持遍历模式、遍历顺序、子节点键名和 Context 配置。 | 否   |

`options` 中的常用配置项：

- `mode`: `'dfs' | 'bfs'`，遍历模式，默认为 `'dfs'`（深度优先）。
- `order`: `'pre' | 'post'`，遍历顺序，仅在 `mode: 'dfs'` 时生效，默认为 `'pre'`（前序）。
- `childrenKey`: `string`，子节点数组的属性名，默认为 `'children'`。
- `context`: `TreeMapContextConfig`，按需启用 `depth`、`index`、`parent`、`path`、`isLeaf`、`isRoot`、`processedChildren` 等上下文字段。

### 返回值

- **类型**: `U[]`
- **说明**: 返回与输入结构对应的新树形数组，每个节点是映射函数 `fn` 的返回结果；当输入为空数组时返回空数组。
- **特殊情况**:
  - 映射函数返回 `null` 或 `undefined` 时，结果数组中对应元素也为 `null` 或 `undefined`。
  - 如果映射函数未显式返回 `childrenKey` 属性且原始节点包含合法子节点数组，函数会自动对其子节点递归调用 `fn`。
  - 如果映射函数返回的对象中包含 `childrenKey`，则完全尊重该值：
    - 返回 `ctx.originalChildren` 或原始子节点数组引用时，会在递归处理后填充处理结果。
    - 返回新的数组、`null` 或 `undefined` 时，不会再递归处理该数组。

### 泛型约束（如适用）

- **`T`**: 输入树节点的类型，必须是 `Record<string, any>`；通常是业务节点类型（如 `Node` 接口）。
- **`U`**: 映射后节点的类型，必须是对象类型或 `null`/`undefined`，用于保证结果树的结构安全。
- **`Config extends TreeMapContextConfig`**: 控制 Context 中可用字段的配置类型；默认值 `Record<string, never>` 表示不启用任何额外上下文字段，仅提供基础的 `originalChildren` 和 `childrenKey`。

## 注意事项与边界情况

### 输入边界

- 当 `array` 不是数组（如 `null`、`undefined`、数字、对象、字符串）时，会立即抛出 `TypeError`，不会调用映射函数。
- 当树中某个节点的 `childrenKey` 属性存在但不是数组（例如字符串、对象、数字），会抛出 `TypeError`，错误信息会包含该节点的 `id` 或 `name` 以便定位问题。
- 支持 `childrenKey` 对应值为 `undefined`、`null` 或空数组 `[]`，这些情况不会抛出异常：
  - 空数组会被视为叶子节点，但会保留在结果中。
  - `null` 与 `undefined` 会被原样保留。
- 对深度嵌套的树结构（如递归深度接近 1000）也能安全处理，不会因递归过深导致错误。

### 错误处理

- **异常类型**:
  - `TypeError`：
    - 第一个参数不是数组。
    - 某个节点的 `childrenKey` 属性存在但不是数组。
    - 映射函数返回原始类型（如 `string`、`number`、`boolean`）而非对象、`null` 或 `undefined`。
  - `Error`：
    - 在 BFS 模式下启用 `context.processedChildren`：`Configuration error: processedChildren is not available in BFS mode. Use { mode: "dfs", order: "post" } instead.`
    - 在非后序遍历中启用 `context.processedChildren`：`Configuration error: processedChildren is only available in post-order traversal. Use { order: "post" } or remove processedChildren from context.`
- **处理建议**:
  - 在调试阶段，可以在外层使用 `try/catch` 捕获错误并打印错误消息，快速定位配置或数据问题。
  - 对于产品代码，建议保证输入数据结构可靠（如通过类型定义和静态检查约束树结构），通常无需在调用处额外包裹 `try/catch`。
  - 如果映射函数内部抛出异常（例如业务逻辑错误），`treeMap` 会原样向上抛出该异常，不会拦截或吞掉。

### 性能考虑

- **时间复杂度**: O(n)——遍历过程中每个节点最多访问一次，无论是 DFS 还是 BFS。
- **空间复杂度**:
  - DFS 模式：O(n)，主要由返回的新树结构和递归调用栈构成。
  - BFS 模式：O(n)，使用队列保存当前层和后续层节点。
- **优化建议**:
  - 大型树结构建议优先使用默认的 DFS 前序遍历；当需要按层级处理（例如逐层渲染 UI）时可以选择 BFS。
  - Context 配置采用按需启用模式，未启用的字段不会产生额外开销；在性能敏感场景中，可只开启必要的字段（如 `depth` 或 `path`）。
  - 映射函数应保持轻量，避免在内部做昂贵的同步操作或产生不必要的副作用。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/tree/map/index.ts)
