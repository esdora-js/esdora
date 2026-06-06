---
title: treeFilter
description: "@esdora/kit 的 treeFilter 函数，对树形结构数组进行过滤和遍历，返回处理后的结果树型结构。"
---

# treeFilter

对树形结构数组进行过滤和遍历，返回处理后的结果树型结构。

## 示例

### 基本用法

```typescript
import { treeFilter } from '@esdora/kit'

const tree = [
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
    children: [
      { id: 7, name: 'child3' },
    ],
  },
]

treeFilter(tree, item => item.id % 2 === 1)
// => [
//      {
//        id: 1,
//        name: 'root1',
//        children: [
//          { id: 5, name: 'child2' },
//        ],
//      },
//    ]
```

### 使用 BFS 模式

```typescript
import { treeFilter } from '@esdora/kit'

treeFilter(tree, item => item.id <= 2, { mode: 'bfs' })
// => [
//      {
//        id: 1,
//        name: 'root1',
//        children: [
//          {
//            id: 2,
//            name: 'child1',
//            children: [],
//          },
//        ],
//      },
//    ]
```

### 自定义子节点键名

```typescript
import { treeFilter } from '@esdora/kit'

const customTree = [
  {
    id: 1,
    name: 'parent',
    items: [
      { id: 2, name: 'child' },
    ],
  },
]

treeFilter(customTree, () => true, { childrenKey: 'items' })
// => [
//      {
//        id: 1,
//        name: 'parent',
//        items: [
//          { id: 2, name: 'child' },
//        ],
//      },
//    ]
```

### 空子节点数组

```typescript
import { treeFilter } from '@esdora/kit'

const tree = [{ id: 1, name: 'test', children: [] }]

treeFilter(tree, () => true)
// => [{ id: 1, name: 'test', children: [] }]
```

## 签名

```typescript
export interface TreeFilterOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}

export function treeFilter<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: TreeFilterOptions,
): T[]
```

## 参数

| 参数      | 类型                   | 描述                                               | 必需 |
| --------- | ---------------------- | -------------------------------------------------- | ---- |
| `array`   | `T[]`                  | 要处理的树形结构数组                               | 是   |
| `fn`      | `(item: T) => boolean` | 对每个节点执行的回调函数，返回 `true` 保留该节点   | 是   |
| `options` | `TreeFilterOptions`    | 可选配置对象，包含遍历模式、遍历顺序、子节点键名等 | 否   |

### TreeFilterOptions

| 字段          | 类型              | 描述                                                             | 默认值       |
| ------------- | ----------------- | ---------------------------------------------------------------- | ------------ |
| `mode`        | `'dfs' \| 'bfs'`  | 遍历模式，`dfs` 为深度优先，`bfs` 为广度优先                     | `'dfs'`      |
| `order`       | `'pre' \| 'post'` | 遍历顺序，仅在 `mode: 'dfs'` 时有效，`pre` 为前序，`post` 为后序 | `'pre'`      |
| `childrenKey` | `string`          | 子节点属性名                                                     | `'children'` |

## 返回值

- **类型**: `T[]`
- **说明**: 过滤后的树形结构数组，保持原有的层级关系，仅包含满足条件的节点。如果父节点被过滤掉，其所有子节点也会被移除。
- **特殊情况**:
  - 输入空数组 `[]` 时，返回 `[]`
  - 没有任何节点满足条件时，返回 `[]`
  - 子节点属性为 `null` 或 `undefined` 时，保持原值不变
  - 子节点属性为空数组 `[]` 时，保持空数组

## 运行逻辑

```mermaid
flowchart TD
    A[输入 tree 数组] --> B{第一个参数是数组?}
    B -->|否| C[抛出 TypeError]
    B -->|是| D{数组为空?}
    D -->|是| E[返回 []]
    D -->|否| F[解析选项 mode/order/childrenKey]
    F --> G{mode === 'bfs'?}
    G -->|是| H[BFS 递归过滤]
    G -->|否| I{order === 'post'?}
    I -->|是| J[DFS 后序递归过滤]
    I -->|否| K[DFS 前序递归过滤]
    H --> L[遍历每个节点]
    J --> L
    K --> L
    L --> M{子节点属性存在且为数组?}
    M -->|是| N[递归处理子节点]
    M -->|否| O{子节点属性为 null/undefined?}
    O -->|是| P[保持原值]
    O -->|否| Q{子节点属性非数组?}
    Q -->|是| R[抛出 TypeError]
    N --> S[应用过滤函数 fn]
    P --> S
    S --> T{fn 返回 true?}
    T -->|是| U[保留节点]
    T -->|否| V[丢弃节点]
    U --> W[返回过滤后的树]
    V --> W
```

函数根据 `mode` 和 `order` 选择对应的遍历策略：

- **DFS 前序（默认）**：先处理当前节点，再递归处理子节点。过滤时子节点已经过过滤，父节点可以看到过滤后的子节点结果。
- **DFS 后序**：先递归处理子节点，再处理当前节点。
- **BFS**：按层级递归处理，实际实现与 DFS 类似，但语义上表示广度优先。

无论哪种模式，核心逻辑一致：对每个节点，先递归处理其子节点，然后用过滤函数判断是否保留该节点。被过滤掉的节点及其子树都会被移除。

## 注意事项

### 输入边界

- 第一个参数必须是数组，否则会抛出 `TypeError`
- 树节点应为对象类型（`Record<string, any>`），否则子节点属性验证可能失败
- 子节点属性（默认 `children`）可以为 `null`、`undefined` 或数组，其他类型会抛出 `TypeError`
- 空数组输入会返回空数组，不会抛出异常

### 错误处理

- 当第一个参数不是数组时，抛出 `TypeError: Expected an array as the first argument`
- 当子节点属性存在但不是数组时，抛出 `TypeError: Expected 'children' to be an array`（包含节点 id 或 name 信息）
- 过滤函数 `fn` 抛出的异常会直接向上传播

### 性能考虑

- **时间复杂度**: `O(n)` — 其中 n 为树中所有节点数量。每个节点恰好访问一次，过滤函数执行一次。
- **空间复杂度**: `O(h)` — 其中 h 为树的最大深度。递归调用栈的深度取决于树的层级。对于极深的树，可能触发栈溢出。
- 每次过滤都会创建新的节点对象（`{ ...item, [childrenKey]: childrenResult }`），不会修改原始树
- 如果过滤函数开销较大，建议在过滤前对树进行扁平化预处理

### 兼容性

- **环境要求**: ES2015+（使用 `Array.isArray`、对象展开运算符 `...`）
- 支持所有现代浏览器和 Node.js 环境

## 相关链接

- [源码](https://github.com/kkfive/esdora/tree/main/packages/kit/src/tree/filter/index.ts)
- [单元测试](https://github.com/kkfive/esdora/tree/main/packages/kit/src/tree/filter/index.test.ts)
