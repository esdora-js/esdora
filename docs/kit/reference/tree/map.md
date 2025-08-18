---
title: treeMap
---

# treeMap

树结构映射函数，可对树形数组进行深度优先或广度优先遍历，并对每个节点应用映射函数。

## 函数签名

```typescript
function treeMap<T extends Record<string, any>, U>(
  array: T[],
  fn: (item: T) => U,
  options?: {
    mode?: 'dfs' | 'bfs'
    order?: 'pre' | 'post'
    childrenKey?: string
  }
): U[]
```

## 参数说明

- `array`：树形结构的数组（必填）。
- `fn`：对每个节点应用的映射函数（必填）。
- `options`：配置项（可选）：
  - `mode`：遍历方式，`'dfs'`（深度优先，默认）或 `'bfs'`（广度优先）。
  - `order`：节点访问顺序，`'pre'`（前序，默认）或 `'post'`（后序，仅对 `dfs` 有效）。
  - `childrenKey`：子节点属性名，默认为 `'children'`。

## 返回值

返回映射后的树形数组，结构与原树一致，但每个节点经过 `fn` 处理。

## 用法示例

```typescript
import { treeMap } from './index'

const tree = [
  { id: 1, value: 'A', children: [
    { id: 2, value: 'B' },
    { id: 3, value: 'C', children: [
      { id: 4, value: 'D' }
    ] }
  ] }
]

// 示例1：深度优先前序遍历（默认）
const result1 = treeMap(tree, node => ({ ...node, value: node.value.toLowerCase() }))

// 示例2：深度优先后序遍历
const result2 = treeMap(tree, node => ({ ...node, value: `${node.value}!` }), { order: 'post' })

// 示例3：广度优先遍历
const result3 = treeMap(tree, node => ({ ...node, id: node.id * 10 }), { mode: 'bfs' })

// 示例4：自定义子节点属性名
const customTree = [
  { id: 1, nodes: [{ id: 2 }] }
]
const result4 = treeMap(customTree, node => ({ ...node, id: node.id + 1 }), { childrenKey: 'nodes' })
```

## 注意事项

- 输入的 `array` 必须为数组，否则抛出 `TypeError`。
- 如果节点的子节点属性存在且不为数组，也会抛出 `TypeError`。
- 返回的新树不会修改原始树结构。
