---
title: treeFilter
---

# treeFilter

树结构过滤函数，可对树形数组进行深度优先或广度优先遍历，并过滤出满足条件的节点。

## 函数签名

```typescript
function treeFilter<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: {
    mode?: 'dfs' | 'bfs'
    order?: 'pre' | 'post'
    childrenKey?: string
  }
): T[]
```

## 参数说明

- `array`：树形结构的数组（必填）。
- `fn`：对每个节点应用的过滤函数（必填）。
- `options`：配置项（可选）：
  - `mode`：遍历方式，`'dfs'`（深度优先，默认）或 `'bfs'`（广度优先）。
  - `order`：节点访问顺序，`'pre'`（前序，默认）或 `'post'`（后序，仅对 `dfs` 有效）。
  - `childrenKey`：子节点属性名，默认为 `'children'`。

## 返回值

返回过滤后的树形数组，只包含通过过滤条件的节点，保持原有的树形结构。结果为浅拷贝，不影响原始数据。

## 示例

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
// result1: [
//   {
//     id: 1,
//     name: 'Root 1',
//     children: [
//       { id: 3, name: 'Child 2' }
//     ]
//   }
// ]

// 示例2：深度优先后序遍历
const result2 = treeFilter(tree, item => item.id <= 3, { order: 'post' })
// result2: [
//   {
//     id: 1,
//     name: 'Root 1',
//     children: [
//       { id: 2, name: 'Child 1' },
//       { id: 3, name: 'Child 2' }
//     ]
//   }
// ]

// 示例3：广度优先遍历
const result3 = treeFilter(tree, item => item.id <= 3, { mode: 'bfs' })
// result3: [
//   {
//     id: 1,
//     name: 'Root 1',
//     children: [
//       { id: 2, name: 'Child 1' },
//       { id: 3, name: 'Child 2' }
//     ]
//   }
// ]

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
// result4: [
//   {
//     id: 1,
//     name: 'Category 1',
//     subcategories: [
//       { id: 3, name: 'Subcategory 2' }
//     ]
//   }
// ]
```

## 注意事项与边界情况

- 输入参数 `array` 必须为数组，否则会抛出 `TypeError`。
- 节点的子节点属性（如 `children` 或自定义属性）如果存在且不是数组，也会抛出 `TypeError`。
- 仅当过滤函数返回真值时，节点才会被保留在结果中。
- 返回的新树不会修改原始树结构，所有节点均为浅拷贝。
- 所有遍历模式（深度优先、广度优先）都保持原有的树形结构和层级关系。
- 支持自定义子节点属性名，适配多样化树结构。

## 相关链接

- 源码: [`packages/packages/kit/src/tree/filter/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/kit/src/tree/filter/index.ts)
