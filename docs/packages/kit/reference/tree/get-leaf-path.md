# getLeafPath

<!-- 1. 简介：一句话核心功能描述 -->

分析树形结构，找出从根节点到每个叶子节点的所有完整路径。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
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
  ],
}

getLeafPath(tree)
// => [['root', 'A', 'A1'], ['root', 'A', 'A2', 'A2a'], ['root', 'A', 'A2', 'A2b'], ['root', 'B']]
```

### 自定义字段名

```typescript
const customTree = {
  name: 'root',
  items: [
    { name: 'A', items: [{ name: 'A1' }] },
    { name: 'B' },
  ],
}

getLeafPath(customTree, { keyField: 'name', childrenField: 'items' })
// => [['root', 'A', 'A1'], ['root', 'B']]
```

### 处理共享节点

函数能正确处理一个节点被多个父节点引用的情况（钻石结构）。

```typescript
const sharedNode = { id: 'C' }
const tree = {
  id: 'root',
  children: [
    { id: 'A', children: [sharedNode] },
    { id: 'B', children: [sharedNode] },
  ],
}

getLeafPath(tree)
// => [['root', 'A', 'C'], ['root', 'B', 'C']]
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 分析一个树形结构，找出从根节点到每个叶子节点的所有路径。
 *
 * 本函数通过深度优先遍历（DFS）来探索整个树。它设计稳健，能够正确处理包含
 * 共享节点或循环引用的复杂树结构，并安全地返回所有可达的有限路径。
 *
 * @template T 节点的唯一标识符类型（如 `string` 或 `number`），将根据输入树的结构自动推断。
 * @param {TreeNode<T>} root 要分析的树的根节点。
 * @param {TreePathsOptions} [options] 用于指定字段名的可选配置。
 * @param {string} [options.keyField] - 用作节点唯一标识符的字段名。
 * @param {string} [options.childrenField] - 包含子节点数组的字段名。
 * @returns {T[][]} 一个二维数组。每个内部数组都是一条从根节点到叶子节点的完整路径。如果根节点无效或未找到任何路径，则返回空数组。
 */
function getLeafPath<T>(root: TreeNode<T>, options?: TreePathsOptions): T[][]
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效根节点**: 如果传入的 `root` 是 `null`、`undefined` 或非对象类型（如字符串、数字、数组），函数将返回一个空数组 `[]` 并发出警告。
- **关于缺失标识符的节点**: 如果一个节点缺少由 `keyField` 指定的标识符（或其值为 `null`/`undefined`），该节点及其所有子孙节点将被跳过，不会出现在任何路径中。
- **关于循环引用**: 函数能安全地检测并处理循环引用的结构。当检测到循环时，会终止当前路径的探索，防止无限递归。因此，包含循环的路径不会被输出。
- **关于叶子节点的定义**: 如果一个节点的 `childrenField` 属性为 `null`、`undefined`、一个空数组 `[]` 或根本不存在，它将被视为叶子节点。
- **关于无效的子节点**: 子节点数组 (`childrenField`) 中任何非对象、`null` 或 `undefined` 的成员都会被安全地忽略，不会影响其他有效子节点的路径分析。

<!-- 5. 相关链接：提供唯一的、最核心的源码链接 -->

## 相关链接

- **源码**: [`src/tree/get-leaf-path/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/kit/src/tree/get-leaf-path/index.ts)
