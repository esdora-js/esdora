import { validateChildrenProperty } from '../../_internal/validate'

/**
 * TreeFilterOptions 配置项说明：
 *
 * @property mode 遍历模式，可选值：
 *   - 'dfs'：深度优先遍历（默认）
 *   - 'bfs'：广度优先遍历
 * @property order 遍历顺序，仅在深度优先时有效，可选值：
 *   - 'pre'：前序遍历（默认）
 *   - 'post'：后序遍历
 * @property childrenKey 子节点属性名，默认为 'children'
 */
export interface TreeFilterOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}

/**
 * 对树形结构数组进行过滤和遍历，并返回处理后的结果树型结构。
 *
 * @template T 输入数组元素的类型，需为对象类型。
 * @param array 要处理的树形结构数组。
 * @param fn 对每个节点执行的回调函数，返回布尔值，true 保留该节点。
 * @param options 可选参数，包含遍历模式（'dfs'深度优先或'bfs'广度优先）、遍历顺序（'pre'前序或'post'后序）、子节点键名等配置。
 *   - mode: 'dfs' | 'bfs'，遍历模式，默认为 'dfs'
 *   - order: 'pre' | 'post'，遍历顺序，仅在 dfs 时有效，默认为 'pre'
 *   - childrenKey: string，子节点属性名，默认为 'children'
 * @returns 过滤后的树形结构数组，保持原有的层级关系，仅包含满足条件的节点。
 * @throws {TypeError} 如果第一个参数不是数组，则抛出类型错误。
 *
 * @example
 * ```typescript
 * const tree = [
 *   { id: 1, children: [{ id: 2 }] }
 * ];
 * const result = treeFilter(tree, node => node.id > 1);
 * // result: [{ id: 1, children: [{ id: 2 }] }]
 * ```
 */
export function treeFilter<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: TreeFilterOptions,
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array as the first argument')
  }
  if (array.length === 0) {
    return []
  }

  const mode = options?.mode ?? 'dfs'
  const order = options?.order ?? 'pre'
  const childrenKey = options?.childrenKey ?? 'children'

  if (mode === 'bfs') {
    return treeFilterBfs(array, fn, childrenKey)
  }
  else if (order === 'post') {
    return treeFilterDfsPost(array, fn, childrenKey)
  }
  else {
    return treeFilterDfsPre(array, fn, childrenKey)
  }
}

/**
 * 对树结构进行前序深度优先遍历（DFS）过滤。
 *
 * 遍历给定的树节点数组，对每个节点应用过滤函数 `fn`，
 * 递归处理子节点，只有通过过滤的节点及其符合条件的子节点会被保留。
 *
 * @typeParam T - 输入树节点的类型，需继承自 `Record<string, any>`。
 * @param array - 要过滤的树节点数组。
 * @param fn - 节点过滤函数，返回 true 则保留该节点。
 * @param childrenKey - 节点中存放子节点数组的属性名。
 * @returns 过滤后的树结构数组。
 * @throws {TypeError} 当 `childrenKey` 对应的属性存在且不是数组时抛出异常。
 */
function treeFilterDfsPre<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  childrenKey: string,
): T[] {
  const result: T[] = []
  for (const item of array) {
    validateChildrenProperty(item, childrenKey)

    let newItem = item
    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      const childrenResult = treeFilterDfsPre(item[childrenKey], fn, childrenKey)
      newItem = { ...item, [childrenKey]: childrenResult }
    }
    if (fn(newItem)) {
      result.push(newItem)
    }
  }
  return result
}

/**
 * 深度优先后序遍历过滤树结构数组。
 *
 * @template T 输入数组元素类型
 * @param array 要遍历的树结构数组
 * @param fn 处理每个节点的回调函数，返回 true 保留该节点
 * @param childrenKey 子节点属性的键名
 * @returns 过滤后的新数组，结构与原数组一致，仅包含满足条件的节点
 *
 * @throws {TypeError} 如果 childrenKey 对应的属性不是数组，则抛出异常
 */
function treeFilterDfsPost<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  childrenKey: string,
): T[] {
  const result: T[] = []
  for (const item of array) {
    validateChildrenProperty(item, childrenKey)

    let newItem = item
    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      const childrenResult = treeFilterDfsPost(item[childrenKey], fn, childrenKey)
      newItem = { ...item, [childrenKey]: childrenResult }
    }
    if (fn(newItem)) {
      result.push(newItem)
    }
  }
  return result
}

/**
 * 对树形数组结构执行广度优先搜索（BFS）过滤。
 *
 * 遍历树中的每个节点，应用提供的过滤函数 `fn`。
 * 只有当 `fn` 返回 true 时，节点才会被包含在结果中。
 * 子节点通过指定的 `childrenKey` 属性进行遍历。
 *
 * @typeParam T - 输入树节点的类型。
 * @param array - 要过滤的树节点根数组。
 * @param fn - 接收节点并返回 true 以决定是否包含在结果中的函数。
 * @param childrenKey - 每个树节点中包含子节点的属性名。
 * @returns 过滤后的树结构数组，保持原有的层级关系。
 * @throws {TypeError} 如果 `childrenKey` 属性存在但不是数组，则抛出异常。
 */
function treeFilterBfs<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  childrenKey: string,
): T[] {
  const result: T[] = []
  for (const item of array) {
    validateChildrenProperty(item, childrenKey)

    let newItem = item
    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      const childrenResult = treeFilterBfs(item[childrenKey], fn, childrenKey)
      newItem = { ...item, [childrenKey]: childrenResult }
    }
    if (fn(newItem)) {
      result.push(newItem)
    }
  }
  return result
}
