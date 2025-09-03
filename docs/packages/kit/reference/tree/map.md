---
title: treeMap
description: "treeMap - Dora Pocket 中 @esdora/kit 库提供的树结构处理工具函数，用于对树形数据结构进行深度优先或广度优先遍历，并对每个节点应用映射函数。"
---

# treeMap

对树形数组进行遍历并映射的函数，支持深度优先（DFS）和广度优先（BFS）两种遍历模式，可自定义子节点键名和访问顺序。

## 示例

### 基础用法

```typescript
import { treeMap } from '@esdora/kit'

const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4, children: [{ id: 5 }] }
]

// 将每个节点的 id 乘以 2
const result = treeMap(tree, item => ({
  ...item,
  id: item.id * 2
}))

console.log(result)
// [
//   { id: 2, children: [{ id: 4 }, { id: 6 }] },
//   { id: 8, children: [{ id: 10 }] }
// ]
```

### 深度优先后序遍历

```typescript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4, children: [{ id: 5 }] }
]

// 使用后序遍历，先处理子节点再处理父节点
const result = treeMap(tree, item => ({
  ...item,
  id: item.id * 2
}), {
  mode: 'dfs',
  order: 'post'
})

// 访问顺序：2 -> 3 -> 1 -> 5 -> 4
```

### 广度优先遍历

```typescript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4, children: [{ id: 5 }] }
]

// 使用广度优先遍历，逐层处理节点
const result = treeMap(tree, item => ({
  ...item,
  id: item.id * 2
}), {
  mode: 'bfs'
})

// 访问顺序：1 -> 4 -> 2 -> 3 -> 5
```

### 自定义子节点键名

```typescript
const tree = [
  { id: 1, subItems: [{ id: 2 }, { id: 3 }] },
  { id: 4, subItems: [{ id: 5 }] }
]

const result = treeMap(tree, item => ({
  ...item,
  id: item.id * 2
}), {
  childrenKey: 'subItems'
})

console.log(result)
// [
//   { id: 2, subItems: [{ id: 4 }, { id: 6 }] },
//   { id: 8, subItems: [{ id: 10 }] }
// ]
```

### 复杂数据转换

```typescript
interface TreeNode {
  id: number
  name: string
  children?: TreeNode[]
}

const orgTree: TreeNode[] = [
  {
    id: 1,
    name: 'CEO',
    children: [
      { id: 2, name: 'CTO' },
      { id: 3, name: 'CFO' }
    ]
  }
]

// 为每个节点添加层级信息
let level = 0
const result = treeMap(orgTree, (node) => {
  return {
    ...node,
    level: level++,
    displayName: `[${node.id}] ${node.name}`
  }
})
```

## 签名与说明

```typescript
function treeMap<T extends Record<string, any>, U>(
  array: T[],
  fn: (item: T) => U,
  options?: TreeMapOptions
): U[]

interface TreeMapOptions {
  mode?: 'dfs' | 'bfs' // 遍历模式：深度优先 | 广度优先，默认 'dfs'
  order?: 'pre' | 'post' // 访问顺序：前序 | 后序，默认 'pre'
  childrenKey?: string // 子节点属性键名，默认 'children'
}
```

### 参数

- **array** (`T[]`): 输入的树形数组
- **fn** (`(item: T) => U`): 映射函数，对每个节点调用，返回转换后的节点
- **options** (`TreeMapOptions?`): 可选的遍历配置
  - **mode**: 遍历模式
    - `'dfs'` (默认): 深度优先遍历，先遍历子节点再遍历兄弟节点
    - `'bfs'`: 广度优先遍历，先遍历同层节点再遍历下一层
  - **order**: 节点访问顺序（仅在 DFS 模式下有效）
    - `'pre'` (默认): 前序遍历，先处理父节点再处理子节点
    - `'post'`: 后序遍历，先处理子节点再处理父节点
  - **childrenKey**: 指定子节点数组的属性名，默认为 `'children'`

### 返回值

- **U[]**: 映射后的树形数组，保持原有的树形结构

## 注意事项与边界情况

### 输入验证

- 第一个参数必须是数组，否则抛出 `TypeError`
- 子节点属性如果存在且不为 `null/undefined`，必须是数组类型，否则抛出 `TypeError`

```typescript
// ❌ 错误：非数组输入
treeMap(null, fn) // TypeError: Expected an array as the first argument
treeMap({}, fn) // TypeError: Expected an array as the first argument

// ❌ 错误：子节点不是数组
const invalidTree = [{ id: 1, children: 'invalid' }]
treeMap(invalidTree, fn) // TypeError: Expected children to be an array
```

### 数据不变性

- 函数不会修改原始输入数据，返回全新的树形结构
- 映射函数应当返回新的对象，避免意外的引用共享

```typescript
const originalTree = [{ id: 1, children: [{ id: 2 }] }]
const result = treeMap(originalTree, item => ({ ...item, id: item.id * 2 }))

console.log(originalTree) // 原始数据保持不变
// [{ id: 1, children: [{ id: 2 }] }]
```

### 特殊值处理

- 空数组输入返回空数组
- `children` 为 `null` 或 `undefined` 会被保留
- 映射函数可以返回任何类型的值，包括 `undefined`

```typescript
// 空数组处理
treeMap([], fn) // 返回 []

// null/undefined children 处理
const tree = [{ id: 1, children: null }]
treeMap(tree, item => ({ ...item, id: item.id * 2 }))
// [{ id: 2, children: null }]
```

### 错误处理

- 如果映射函数抛出异常，整个 `treeMap` 调用会中断并抛出该异常
- 建议在映射函数中处理可能的错误情况

```typescript
treeMap(tree, (item) => {
  if (!item.id) {
    throw new Error('Missing id property')
  }
  return { ...item, id: item.id * 2 }
})
```

## 相关链接

- 源码: [`packages/packages/kit/src/tree/map/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/kit/src/tree/map/index.ts)
