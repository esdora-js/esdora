---
title: treeGetLeafPath
description: "@esdora/kit 的 treeGetLeafPath 函数，通过深度优先遍历（DFS）分析树形结构，提取从根节点到每个叶子节点的所有完整路径。"
---

# treeGetLeafPath

通过深度优先遍历（DFS）分析树形结构，提取从根节点到每个叶子节点的所有完整路径。

## 示例

### 基本用法

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const tree = {
  id: 'root',
  children: [
    { id: 'A' },
    { id: 'B' },
  ],
}

treeGetLeafPath(tree)
// => [['root', 'A'], ['root', 'B']]
```

### 多级嵌套树

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const tree = {
  id: 'root',
  children: [
    {
      id: 'A',
      children: [
        { id: 'A1' },
        {
          id: 'A2',
          children: [{ id: 'A2a' }, { id: 'A2b' }],
        },
      ],
    },
    { id: 'B' },
    {
      id: 'C',
      children: [
        {
          id: 'C1',
          children: [
            {
              id: 'C1a',
              children: [{ id: 'C1a1' }],
            },
          ],
        },
      ],
    },
  ],
}

treeGetLeafPath(tree)
// => [
//      ['root', 'A', 'A1'],
//      ['root', 'A', 'A2', 'A2a'],
//      ['root', 'A', 'A2', 'A2b'],
//      ['root', 'B'],
//      ['root', 'C', 'C1', 'C1a', 'C1a1'],
//    ]
```

### 自定义字段名

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const tree = {
  name: 'root',
  items: [
    { name: 'A', items: [{ name: 'A1' }] },
    { name: 'B' },
  ],
}

treeGetLeafPath(tree, { keyField: 'name', childrenField: 'items' })
// => [['root', 'A', 'A1'], ['root', 'B']]
```

### 单节点树

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const tree = { id: 'alone' }

treeGetLeafPath(tree)
// => [['alone']]
```

### 处理共享节点（钻石结构）

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const sharedNode = { id: 'C' }
const tree = {
  id: 'root',
  children: [
    { id: 'A', children: [sharedNode] },
    { id: 'B', children: [sharedNode] },
  ],
}

treeGetLeafPath(tree)
// => [['root', 'A', 'C'], ['root', 'B', 'C']]
```

### 处理循环引用

```typescript
import { treeGetLeafPath } from '@esdora/kit'

const nodeA = { id: 'A', children: [] as any[] }
const nodeB = { id: 'B', children: [nodeA] }
nodeA.children.push(nodeB) // 创建 A -> B -> A 的循环

const tree = { id: 'root', children: [nodeA] }

treeGetLeafPath(tree)
// => []
```

## 签名

```typescript
interface TreePathsOptions {
  keyField?: string
  childrenField?: string
}

export function treeGetLeafPath<T>(
  root: TreeNode<T>,
  options?: TreePathsOptions,
): T[][]
```

## 参数

| 参数      | 类型               | 描述                                           | 必需 |
| --------- | ------------------ | ---------------------------------------------- | ---- |
| `root`    | `TreeNode<T>`      | 要分析的树的根节点                             | 是   |
| `options` | `TreePathsOptions` | 可选配置对象，用于指定节点标识字段和子节点字段 | 否   |

### TreePathsOptions

| 字段            | 类型     | 描述                       | 默认值       |
| --------------- | -------- | -------------------------- | ------------ |
| `keyField`      | `string` | 用作节点唯一标识符的字段名 | `'id'`       |
| `childrenField` | `string` | 包含子节点数组的字段名     | `'children'` |

## 返回值

- **类型**: `T[][]`
- **说明**: 一个二维数组，每个内部数组表示一条从根节点到叶子节点的完整路径，路径元素为各节点的标识符（由 `keyField` 指定）。
- **特殊情况**:
  - 根节点无效（`null`、`undefined`、非对象、数组）时，返回 `[]`
  - 根节点为叶子节点（无子节点）时，返回 `[[rootKey]]`
  - 子节点数组为空 `[]` 时，当前节点被视为叶子节点，路径被记录
  - 检测到循环引用时，该路径的探索终止，不产生路径
  - 节点缺少有效标识符（`null` 或 `undefined`）时，跳过该节点及其子树

## 运行逻辑

```mermaid
flowchart TD
    A[输入 root 节点] --> B{根节点有效?}
    B -->|否| C[devWarn 警告] --> D[返回 []]
    B -->|是| E[初始化 allPaths 数组] --> F[初始化 visited WeakSet] --> G[启动 DFS]
    G --> H{当前节点已在 visited 中?}
    H -->|是| I[devWarn 循环引用警告] --> J[终止此路径探索]
    H -->|否| K{节点标识符有效?}
    K -->|否| L[devWarn 跳过警告] --> M[跳过该节点及其子树]
    K -->|是| N[将节点标识加入 currentPath] --> O[将节点加入 visited]
    O --> P{子节点存在且为数组?}
    P -->|否| Q[记录当前路径副本到 allPaths]
    P -->|是| R{子节点数组为空?}
    R -->|是| Q
    R -->|否| S[遍历子节点数组]
    S --> T{子节点为有效对象?}
    T -->|是| G
    T -->|否| U{子节点为 null/undefined?}
    U -->|是| V[静默跳过]
    U -->|否| W[devWarn 无效子节点警告] --> V
    Q --> X[从 visited 移除当前节点] --> Y[从 currentPath 弹出当前标识]
    M --> Z[返回 allPaths]
    J --> Z
    Y --> S
    V --> S
    S -->|遍历完成| X
```

函数采用 **DFS（深度优先搜索）** 配合 **回溯** 策略：

1. **访问节点**：将当前节点标记为已访问（`visited.add`），并将节点标识推入当前路径（`currentPath.push`）
2. **判断叶子**：若节点无子节点、子节点字段非数组、或子节点数组为空，则记录当前路径的副本
3. **递归探索**：若非叶子节点，遍历所有有效子节点并递归调用 DFS
4. **回溯清理**：探索完所有子节点后，从 `visited` 中移除当前节点（允许共享节点被其他路径访问），并从 `currentPath` 弹出当前标识（为兄弟节点路径做准备）

`visited` 使用 `WeakSet` 存储，确保：

- 循环引用检测基于对象引用而非值比较
- 共享节点在单条路径中只被访问一次，但可通过回溯被其他路径重新访问
- 不会阻止内存回收

## 注意事项

### 输入边界

- 根节点必须是对象类型，不能是 `null`、`undefined`、数组或原始值
- 节点标识符（`keyField` 对应的值）不能为 `null` 或 `undefined`，否则该节点及其子树会被跳过
- 子节点数组中的 `null`、`undefined` 会被静默跳过；其他非对象值会触发 `devWarn` 警告
- 子节点字段（`childrenField`）可以为 `null` 或 `undefined`，此时节点被视为叶子节点
- 支持数字 `0` 作为有效的节点标识符

### 错误处理

- 函数**不会抛出异常**，所有错误情况都通过 `devWarn` 输出警告并返回安全值
- 无效根节点 → 返回 `[]`
- 循环引用 → 终止该路径探索，不产生路径
- 无效子节点 → 跳过该子节点，继续处理其他子节点
- 节点缺少标识符 → 跳过该节点及其整个子树

### 性能考虑

- **时间复杂度**: `O(n)` — 其中 n 为树中所有节点数量。每个有效节点恰好访问一次，循环引用节点在首次访问后即被拦截。
- **空间复杂度**: `O(h + n)` — 其中 h 为树的最大深度（`currentPath` 和递归调用栈的空间），n 为返回结果中所有路径的总长度。`visited` WeakSet 的空间为 O(k)，k 为当前路径上的节点数。
- 对于极深的树，递归调用栈可能触发栈溢出。此时建议将树扁平化后处理，或改用迭代实现。
- 每次记录路径时创建数组副本（`[...currentPath]`），避免回溯修改已记录的路径。

### 兼容性

- **环境要求**: ES2015+（使用 `WeakSet`、对象类型检查 `typeof`、数组展开运算符）
- 支持所有现代浏览器和 Node.js 环境
- `WeakSet` 的使用确保循环引用检测不会阻止垃圾回收

## 相关链接

- [源码](https://github.com/kkfive/esdora/tree/main/packages/kit/src/tree/get-leaf-path/index.ts)
- [单元测试](https://github.com/kkfive/esdora/tree/main/packages/kit/src/tree/get-leaf-path/index.test.ts)
