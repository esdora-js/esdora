/**
 * 树路径分析工具
 *
 * 提供树结构路径分析功能，支持：
 * - 自定义字段名配置
 * - 类型安全的路径操作
 * - 纯函数式的路径分析
 * - 最长/最短路径过滤
 */

/**
 * 树节点的通用类型
 *
 * 支持任意字段名的对象结构，用于表示具有动态字段名的树节点
 */
type TreeNodeLike = Record<string, unknown>

/**
 * 树路径分析配置选项
 */
interface TreePathsOptions {
  /** 用作节点标识的字段名（默认：'id'） */
  keyField?: string
  /** 子节点数组的字段名（默认：'children'） */
  childrenField?: string
}

/**
 * 分析树结构中的所有路径（纯分析函数）
 *
 * 遍历树结构，返回从根节点到每个叶子节点的所有路径。
 * 每个路径以数组形式表示，包含从根到叶的节点标识符序列。
 *
 * @template T - 节点标识符的类型（如 string、number 等）
 * @param root - 树的根节点对象
 * @param options - 分析配置选项
 * @param options.keyField - 节点标识符字段名，默认为 'id'
 * @param options.childrenField - 子节点数组字段名，默认为 'children'
 * @returns 二维数组，每个子数组代表一条从根到叶的路径
 *
 * @example
 * ```typescript
 * // 基本用法（使用默认字段名 'id' 和 'children'）
 * const tree = {
 *   id: 'root',
 *   children: [
 *     {
 *       id: 'A',
 *       children: [
 *         { id: 'A1' },
 *         { id: 'A2', children: [{ id: 'A2a' }] }
 *       ]
 *     },
 *     { id: 'B' }
 *   ]
 * }
 *
 * const paths = treePathAnalyze(tree)
 * console.log(paths)
 * // 输出: [['root','A','A1'], ['root','A','A2','A2a'], ['root','B']]
 *
 * // 自定义字段名
 * const customTree = {
 *   name: 'root',
 *   items: [
 *     { name: 'A', items: [{ name: 'A1' }] },
 *     { name: 'B' }
 *   ]
 * }
 *
 * const customPaths = treePathAnalyze(customTree, {
 *   keyField: 'name',
 *   childrenField: 'items'
 * })
 * console.log(customPaths)
 * // 输出: [['root','A','A1'], ['root','B']]
 * ```
 */
export function treePathAnalyze<T = number | string>(
  root: TreeNodeLike,
  options: TreePathsOptions = {},
): T[][] {
  const { keyField = 'id', childrenField = 'children' } = options

  const allPaths: T[][] = []

  /**
   * 深度优先搜索遍历树节点
   * @param node - 当前遍历的节点
   * @param currentPath - 从根节点到当前节点的路径
   */
  function dfs(node: TreeNodeLike, currentPath: T[]): void {
    // 验证节点有效性
    if (!node || typeof node !== 'object') {
      return
    }

    // 获取当前节点的标识符并构建新路径
    const nodeKey = node[keyField] as T

    // 如果nodeKey为undefined或null，跳过该节点
    if (nodeKey === undefined || nodeKey === null) {
      return
    }

    const newPath = [...currentPath, nodeKey]

    // 获取当前节点的子节点数组
    const children = node[childrenField]

    // 判断是否为叶子节点
    if (!children || !Array.isArray(children) || children.length === 0) {
      // 叶子节点：将完整路径添加到结果中
      allPaths.push(newPath)
    }
    else {
      // 非叶子节点：递归遍历所有子节点
      for (const child of children) {
        if (child && typeof child === 'object') {
          dfs(child as TreeNodeLike, newPath)
        }
      }
    }
  }

  // 从根节点开始遍历
  dfs(root, [])
  return allPaths
}
