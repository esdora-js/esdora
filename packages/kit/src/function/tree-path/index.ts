/**
 * @file 树路径分析工具模块
 * @module TreePathAnalyzer
 * @description
 * 提供一个通用的树路径分析函数，用于处理各类树形数据结构。
 * 主要功能包括：
 * - 提取从根节点到所有叶子节点的完整路径。
 * - 支持通过配置选项自定义节点的关键字段和子节点字段。
 * - 能够稳健地处理包含共享节点或循环引用的复杂结构。
 */

import { devWarn } from '../../_internal/log/dev-warn'

/**
 * 代表树结构中的一个通用节点。
 * @template T 节点唯一标识符的类型。
 */
interface TreeNode<T> {
  /**
   * 允许节点拥有其他任意属性，以提供最大的灵活性。
   */
  [key: string]: unknown

  /**
   * 可选的子节点数组，其成员也应符合 TreeNode<T> 结构。
   */
  children?: TreeNode<T>[]
}

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

/**
 * 分析一个树形结构，找出从根节点到每个叶子节点的所有路径。
 *
 * 本函数通过深度优先遍历（DFS）来探索整个树。它设计稳健，能够正确处理包含
 * 共享节点或循环引用的复杂树结构，并安全地返回所有可达的有限路径。
 *
 * @template T 节点的唯一标识符类型（如 `string` 或 `number`），将根据输入树的结构自动推断。
 * @param {TreeNode<T>} root 要分析的树的根节点。
 * @param {TreePathsOptions} [options] 用于指定字段名的可选配置。
 * @returns {T[][]} 一个二维数组。每个内部数组都是一条从根节点到叶子节点的完整路径。
 *                  如果根节点无效或未找到任何路径，则返回空数组。
 *
 * @example
 * // 基本用法
 * const tree = {
 *   id: 'root',
 *   children: [
 *     { id: 'A', children: [{ id: 'A1' }, { id: 'A2' }] },
 *     { id: 'B' }
 *   ]
 * };
 * const paths = treePathAnalyze(tree);
 * // 输出: [['root', 'A', 'A1'], ['root', 'A', 'A2'], ['root', 'B']]
 *
 * @example
 * // 自定义字段名
 * const customTree = {
 *   uuid: 1,
 *   items: [
 *     { uuid: 10, items: [{ uuid: 100 }] },
 *     { uuid: 20 }
 *   ]
 * };
 * const customPaths = treePathAnalyze(customTree, { keyField: 'uuid', childrenField: 'items' });
 * // 输出: [[1, 10, 100], [1, 20]]
 *
 * @example
 * // 处理包含循环引用的结构
 * const nodeA = { id: 'A', children: [] };
 * const nodeB = { id: 'B', children: [nodeA] };
 * nodeA.children.push(nodeB); // 构造一个 A -> B -> A 的循环
 * const circularTree = { id: 'root', children: [nodeA] };
 * const safePaths = treePathAnalyze(circularTree);
 * // 函数会安全终止。由于不存在通往叶子的有限路径，因此结果为空数组。
 * // 输出: []
 */
export function treePathAnalyze<T>(
  root: TreeNode<T>,
  options: TreePathsOptions = {},
): T[][] {
  const { keyField = 'id', childrenField = 'children' } = options

  const allPaths: T[][] = []
  // 用于跟踪遍历过程中已访问的节点，以处理共享或循环结构。
  const visited = new WeakSet<TreeNode<T>>()

  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    devWarn('无效的根节点。期望一个对象，但收到了：', root)
    return []
  }

  /**
   * 内部使用的深度优先搜索（DFS）遍历函数。
   * @param node 当前正在访问的节点。
   * @param currentPath 从根到当前节点的路径（通过引用传递）。
   */
  function dfs(node: TreeNode<T>, currentPath: T[]): void {
    // --- 递归终止与边界条件 ---
    // 如果当前节点已在当前探索路径上被访问过，则终止，以避免无限循环。
    if (visited.has(node)) {
      devWarn(
        '检测到循环引用，将终止此路径的探索。',
        `路径: [${[...currentPath].join(' -> ')}]`,
        '循环节点:',
        node,
      )
      return
    }

    const nodeKey = node[keyField] as T
    // 如果节点没有有效的标识符，则跳过该节点。
    if (nodeKey === undefined || nodeKey === null) {
      devWarn(
        `节点缺少有效的标识符 (key: "${keyField}")，将跳过此节点及其所有子节点。`,
        '问题节点:',
        node,
      )
      return
    }

    // --- 路径构建与状态更新 ---
    // 将当前节点标识推入路径，并标记节点为已访问。
    currentPath.push(nodeKey)
    visited.add(node)

    const children = node[childrenField] as TreeNode<T>[] | undefined

    // --- 递归探索 ---
    // 如果节点是叶子节点（没有子节点或子节点数组为空），则记录当前路径。
    if (!children || !Array.isArray(children) || children.length === 0) {
      // 必须存储路径的副本，因为 currentPath 会在回溯时被修改。
      allPaths.push([...currentPath])
    }
    else {
      // 如果是非叶子节点，则继续遍历其所有子节点。
      for (const child of children) {
        if (child && typeof child === 'object') {
          dfs(child, currentPath)
        }
        else if (child !== null && child !== undefined) {
          // 只对确实存在但类型不对的值告警
          devWarn(
            `在 "${childrenField}" 数组中发现无效的子节点，已跳过。`,
            '无效子节点:',
            child,
            '父节点:',
            node,
          )
        }
      }
    }

    // --- 回溯 ---
    // 在探索完一个节点的所有子孙后，将其从当前路径和访问记录中移除。
    // 这是为了能够正确地构建后续兄弟节点的路径。
    visited.delete(node)
    currentPath.pop()
  }

  // 从根节点启动遍历。
  dfs(root, [])

  return allPaths
}
