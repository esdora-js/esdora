---
title: treePathAnalyzer
---

# treePathAnalyzer

该方法用于分析树形结构数据中的路径。它可以帮助我们理解从根节点到特定节点的路径信息。

## 类型定义

```typescript
/**
 * 用于配置树路径分析的选项对象。
 */
interface TreePathsOptions {
  /**
   * 用作节点唯一标识符的字段名。
   * @default 'id'
   */
  keyField?: string

  /**
   * 包含子节点数组的字段名。
   * @default 'children'
   */
  childrenField?: string
}

function treePathAnalyze<T>(root: TreeNode<T>, options: TreePathsOptions = {}): T[][] {}
```

## 示例

```typescript
const simpleTree = {
  id: 'root',
  children: [{ id: 'A' }, { id: 'B' }],
}
const paths = treePathAnalyze(simpleTree) // [['root', 'A'], ['root', 'B']]
```
