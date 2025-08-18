---
title: treeFilter
---

# treeFilter

树结构过滤函数，可对树形数组进行深度优先或广度优先遍历，并过滤出满足条件的节点。

## 函数签名

```typescript
function treeFilter<T extends Record<string, any>, U>(
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
- `fn`：对每个节点应用的过滤函数（必填）。
- `options`：配置项（可选）：
  - `mode`：遍历方式，`'dfs'`（深度优先，默认）或 `'bfs'`（广度优先）。
  - `order`：节点访问顺序，`'pre'`（前序，默认）或 `'post'`（后序，仅对 `dfs` 有效）。
  - `childrenKey`：子节点属性名，默认为 `'children'`。

## 返回值

返回过滤后的树形数组，只包含通过过滤条件的节点，保持原有的树形结构。

## 用法示例

```typescript
import { treeFilter } from '@esdora/kit'

const tree = [
  {
    id: 1,
    name: 'Root 1',
    children: [
      { id: 2, name: 'Child 1' },
      { id: 3, name: 'Child 2' }
    ]
  },
  {
    id: 4,
    name: 'Root 2',
    children: [
      { id: 5, name: 'Child 3' }
    ]
  }
]

// 示例1：深度优先前序遍历（默认）- 过滤出 id 为奇数的节点
const result1 = treeFilter(tree, item => item.id % 2 === 1)

// 示例2：深度优先后序遍历
const result2 = treeFilter(tree, item => item.id <= 3, { order: 'post' })

// 示例3：广度优先遍历
const result3 = treeFilter(tree, item => item.id <= 3, { mode: 'bfs' })

// 示例4：自定义子节点属性名
const customTree = [
  {
    id: 1,
    name: 'Category 1',
    subcategories: [
      { id: 2, name: 'Subcategory 1' },
      { id: 3, name: 'Subcategory 2' }
    ]
  }
]
const result4 = treeFilter(customTree, item => item.id !== 2, { childrenKey: 'subcategories' })
```

## 注意事项

- 输入的 `array` 必须为数组，否则抛出 `TypeError`。
- 如果节点的子节点属性存在且不为数组，也会抛出 `TypeError`。
- 只有过滤函数返回真值的节点才会被保留在结果中。
- 返回的新树不会修改原始树结构。
