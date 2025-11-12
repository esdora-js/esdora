---
title: treeMap
description: treeMap - 来自 Dora Pocket 的数据结构“道具”，用于对树形结构进行灵活的遍历和映射。
---

# treeMap

<!-- 1. 简介：一句话核心功能描述 -->

一个功能强大的树结构映射函数，支持深度优先（DFS）、广度优先（BFS）遍历，并提供丰富的上下文信息。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3 }] },
  { id: 4, children: [{ id: 5 }] },
]

// 对每个节点的 id 乘以 2
const result = treeMap(tree, item => ({
  ...item,
  id: item.id * 2,
}))

// => [
//   { id: 2, children: [{ id: 4 }, { id: 6 }] },
//   { id: 8, children: [{ id: 10 }] },
// ]
```

### 后序遍历与聚合

后序遍历（`order: 'post'`）先处理子节点，再处理父节点，非常适合进行自下而上的数据聚合。结合 `context.processedChildren`，可以轻松计算依赖于子节点结果的父节点值。

```typescript
const tree = [
  { id: 1, value: 10, children: [
    { id: 2, value: 20 },
    { id: 3, value: 30, children: [{ id: 4, value: 40 }] },
  ] },
]

// 计算每个节点及其所有子节点的 value 总和
const result = treeMap(tree, (item, ctx) => {
  const childSum = ctx?.processedChildren?.reduce((sum, c) => sum + c.totalValue, 0) ?? 0
  return {
    ...item,
    totalValue: item.value + childSum,
    children: ctx?.processedChildren, // 使用已处理过的子节点
  }
}, {
  order: 'post', // 必须是后序遍历
  context: { processedChildren: true }, // 启用 processedChildren
})

// => [
//   {
//     id: 1, value: 10, totalValue: 100, // 10 + 20 + 70
//     children: [
//       { id: 2, value: 20, totalValue: 20 },
//       { id: 3, value: 30, totalValue: 70, // 30 + 40
//         children: [
//           { id: 4, value: 40, totalValue: 40 }
//         ]
//       }
//     ]
//   }
// ]
```

### 使用上下文（Context）获取节点信息

通过 `options.context` 可以按需启用 `depth`、`parent`、`path` 等额外信息，用于复杂的逻辑处理。

```typescript
const tree = [{ id: 1, children: [{ id: 2 }] }]

// 为每个节点添加其在树中的层级
const resultWithDepth = treeMap(tree, (item, ctx) => ({
  ...item,
  level: ctx?.depth,
}), {
  context: { depth: true },
})

// => [
//   { id: 1, children: [{ id: 2, level: 1 }], level: 0 }
// ]
```

### 控制子节点递归

你可以通过返回不同的 `children` 属性来精确控制递归行为。

```typescript
const tree = [
  { id: 1, children: [{ id: 2 }] },
  { id: 3, children: [] },
]

const result = treeMap(tree, (item, ctx) => ({
  ...item,
  // 如果原始 children 存在且不为空，则继续递归，否则设为 null
  children: item.children?.length > 0 ? ctx?.originalChildren : null,
}))

// => [
//   { id: 1, children: [{ id: 2, children: null }] },
//   { id: 3, children: null },
// ]
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 树结构映射函数，可对树形数组进行深度优先或广度优先遍历，并对每个节点应用映射函数。
 *
 * 重要说明:
 * - 映射函数必须返回对象类型（或 null/undefined），不支持返回原始类型（如 number、string）。
 * - 函数会自动处理子节点的递归，除非你显式修改了 children 属性。
 * - 如果返回的对象中 children 引用与原始相同（如通过 `ctx.originalChildren`），会自动进行递归处理。
 * - 如果返回的对象中 children 引用不同（如 `[]` 或 `null`），则不会递归处理，认为你已手动接管。
 *
 * Context 功能:
 * - 第二个参数 `context` 是可选的，它提供了关于当前节点的额外信息。
 * - 默认提供 `originalChildren` 和 `childrenKey` 字段（零开销）。
 * - 通过 `options.context` 配置可以按需启用更多字段（`depth`, `parent`, `path` 等），避免不必要的性能开销。
 *
 * @param array T[] 输入的树形数组。
 * @param fn (item: T, context?: TreeMapContext<T, Config>) => U 映射函数，对每个节点调用，必须返回对象类型或 null/undefined。
 * @param options TreeMapOptions<Config> 遍历选项。
 *   @param options.mode 'dfs' | 'bfs' 遍历模式，默认为 'dfs'（深度优先）。
 *   @param options.order 'pre' | 'post' 遍历顺序（仅限DFS），默认为 'pre'（前序）。'post'（后序）对于自下而上的数据聚合非常有用。
 *   @param options.childrenKey string 子节点数组的属性名，默认为 'children'。
 *   @param options.context TreeMapContextConfig 按需启用上下文信息。
 * @returns U[] 映射后的新树形数组。
 * @throws TypeError 如果输入不是数组、子节点属性不是数组、或映射函数返回非对象类型。
 * @throws Error 如果配置无效（如在非后序遍历中使用 `processedChildren`）。
 */
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

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于返回值类型**: 映射函数 `fn` 的返回值必须是对象、`null` 或 `undefined`。返回任何原始类型（如 `string`, `number`, `boolean`）都会抛出 `TypeError`。
- **关于不可变性**: `treeMap` 是一个纯函数，它不会修改原始的输入数组或其任何节点。所有操作都是在返回的新树上进行的。
- **关于子节点处理**:
  - 如果映射函数返回的对象中**不包含** `childrenKey` 属性，函数会查找原始节点的子节点并自动进行递归。
  - 如果映射函数返回的对象中**包含** `childrenKey` 属性，其值决定了后续行为：
    - 值为 `ctx.originalChildren` 或与原始子节点数组引用相同：继续对原始子节点进行递归。
    - 值为 `null`、`undefined` 或一个**新的**数组：递归将停止，函数会直接使用你提供的值。
- **关于错误处理**:
  - 如果输入第一个参数不是数组，会抛出 `TypeError`。
  - 如果树中任何一个节点的 `childrenKey` 属性存在但不是数组（例如 `null`, `object`, `string`），会抛出 `TypeError`。
- **关于 `processedChildren`**: 此上下文属性仅在 `order: 'post'`（后序遍历）模式下可用，因为它依赖于子节点被完全处理后的结果。在其他模式下启用会抛出错误。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/data-structure/treeMap/index.ts`](https://github.com/esdora/kit/blob/main/packages/data-structure/treeMap/index.ts)
