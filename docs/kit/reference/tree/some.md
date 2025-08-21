---
title: treeSome
---

# treeSome

用于遍历树形结构数组，判断是否存在满足指定条件的节点。支持深度优先（DFS）和广度优先（BFS）两种遍历模式，并可自定义子节点属性名和遍历顺序（前序/后序）。

## 示例

```typescript
import { treeSome } from '@esdora/kit/tree/some'

const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4 }
]

// 检查是否存在 id 为偶数的节点
const hasEvenId = treeSome(tree, node => node.id % 2 === 0)
// hasEvenId: true

// 使用广度优先遍历
const found = treeSome(tree, node => node.id === 3, { mode: 'bfs' })
// found: true

// 指定子节点属性名
const customTree = [
  { id: 1, nodes: [{ id: 2 }] }
]
const exists = treeSome(customTree, node => node.id === 2, { childrenKey: 'nodes' })
// exists: true
```

## 签名与说明

```typescript
function treeSome<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: {
    mode?: 'dfs' | 'bfs'
    order?: 'pre' | 'post'
    childrenKey?: string
  }
): boolean
```

- **array**: 待遍历的树形结构数组，元素需为对象类型。
- **fn**: 节点检测函数，返回 `true` 表示该节点满足条件。
- **options**: 可选配置项：
  - `mode`: 遍历模式，'dfs'（深度优先，默认）或 'bfs'（广度优先）。
  - `order`: 遍历顺序，仅在 'dfs' 时有效，'pre'（前序，默认）或 'post'（后序）。
  - `childrenKey`: 子节点属性名，默认为 `'children'`。

返回值：如果存在满足条件的节点则返回 `true`，否则返回 `false`。

## 注意事项与边界情况

- 若 `array` 不是数组类型，将抛出 `TypeError`。
- 若树为空数组，始终返回 `false`。
- 若指定的 `childrenKey` 属性存在但不是数组类型，将抛出异常。
- 仅在深度优先遍历时可指定 `order`（前序/后序），广度优先遍历不支持顺序选项。
- 检测函数 `fn` 应避免副作用，建议只用于条件判断。

## 相关链接

- 源码: [`packages/kit/src/tree/some/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/tree/some/index.ts)
