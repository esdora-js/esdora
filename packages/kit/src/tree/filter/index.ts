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
 * @template U 过滤函数返回的结果类型。
 * @param array 要处理的树形结构数组。
 * @param fn 对每个节点执行的回调函数，返回处理结果。
 * @param options 可选参数，包含遍历模式（'dfs'深度优先或'bfs'广度优先）、遍历顺序（'pre'前序或'post'后序）、子节点键名等配置。
 *   - mode: 'dfs' | 'bfs'，遍历模式，默认为 'dfs'
 *   - order: 'pre' | 'post'，遍历顺序，仅在 dfs 时有效，默认为 'pre'
 *   - childrenKey: string，子节点属性名，默认为 'children'
 * @returns 处理后的结果数组。
 * @throws {TypeError} 如果第一个参数不是数组，则抛出类型错误。
 *
 * @example
 * ```typescript
 * const tree = [
 *   { id: 1, children: [{ id: 2 }] }
 * ];
 * const result = treeFilter(tree, node => node.id);
 * // result: [1, 2]
 * ```
 */
export function treeFilter<T extends Record<string, any>, U>(
  array: T[],
  fn: (item: T) => U,
  options?: TreeFilterOptions,
): U[] {
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
 * 构建一个仅包含过滤函数返回真值节点的新树结构。
 * 通过递归处理子节点，只有通过过滤的节点及其符合条件的子节点会被保留。
 *
 * @typeParam T - 输入树节点的类型，需继承自 `Record<string, any>`。
 * @typeParam U - 过滤函数返回的类型，也是输出树节点的类型。
 * @param array - 要过滤的树节点数组。
 * @param fn - 节点过滤函数，返回真值则保留该节点。
 * @param childrenKey - 节点中存放子节点数组的属性名。
 * @returns 过滤后的树结构数组。
 * @throws {TypeError} 当 `childrenKey` 对应的属性存在且不是数组时抛出异常。
 */
function treeFilterDfsPre<T extends Record<string, any>, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  const result: U[] = []

  for (const item of array) {
    const keep = fn(item)
    let newItem = item

    if (!keep) {
      continue // Skip items that do not pass the filter
    }

    if (
      (item as any)[childrenKey] !== undefined
      && (item as any)[childrenKey] !== null
      && !Array.isArray((item as any)[childrenKey])
    ) {
      throw new TypeError(`Expected ${childrenKey} to be an array`)
    }

    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      const childrenResult = treeFilterDfsPre(item[childrenKey], fn, childrenKey)
      newItem = { ...item, [childrenKey]: childrenResult }
    }

    result.push(newItem as unknown as U) // Assuming fn returns a truthy value for items to include
  }
  return result
}

/**
 * 深度优先后序遍历过滤树结构数组。
 *
 * @template T 输入数组元素类型
 * @template U 输出数组元素类型
 * @param array 要遍历的树结构数组
 * @param fn 处理每个节点的回调函数，返回值用于判断是否保留该节点
 * @param childrenKey 子节点属性的键名
 * @returns 过滤后的新数组，结构与原数组一致，仅包含满足条件的节点
 *
 * @throws {TypeError} 如果 childrenKey 对应的属性不是数组，则抛出异常
 */
function treeFilterDfsPost<T, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  const result: U[] = []

  for (const item of array) {
    let newItem = item

    if (
      (item as any)[childrenKey] !== undefined
      && (item as any)[childrenKey] !== null
      && !Array.isArray((item as any)[childrenKey])
    ) {
      throw new TypeError(`Expected ${childrenKey} to be an array`)
    }

    if ((item as Record<string, any>)[childrenKey] && Array.isArray((item as Record<string, any>)[childrenKey])) {
      const childrenResult = treeFilterDfsPost((item as Record<string, any>)[childrenKey], fn, childrenKey)
      newItem = { ...item, [childrenKey]: childrenResult }
    }

    const keep = fn(newItem)
    if (keep) {
      result.push(newItem as unknown as U) // Assuming fn returns a truthy value for items to include
    }
  }
  return result
}

/**
 * 广度优先遍历树结构并过滤节点。
 *
 * @template T 输入数组元素的类型。
 * @template U 过滤后返回元素的类型。
 * @param array 要遍历的树形结构数组。
 * @param fn 用于判断节点是否保留的过滤函数，返回真值则保留该节点。
 * @param childrenKey 子节点属性的键名，通常为 'children'。
 * @returns 过滤后的节点数组，按广度优先顺序排列。
 *
 * @throws {TypeError} 如果 childrenKey 对应的属性不是数组，则抛出异常。
 */
function treeFilterBfs<T, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  const result: U[] = []
  const queue: T[] = [...array]

  while (queue.length > 0) {
    const item = queue.shift()!

    let newItem = item
    const keep = fn(item)

    if (!keep) {
      continue // Skip items that do not pass the filter
    }

    if (
      (item as any)[childrenKey] !== undefined
      && (item as any)[childrenKey] !== null
      && !Array.isArray((item as any)[childrenKey])
    ) {
      throw new TypeError(`Expected ${childrenKey} to be an array`)
    }

    if ((item as Record<string, any>)[childrenKey] && Array.isArray((item as Record<string, any>)[childrenKey])) {
      queue.push(...(item as Record<string, any>)[childrenKey])
      newItem = { ...item, [childrenKey]: [] } // Initialize children to empty array
    }

    result.push(newItem as unknown as U) // Assuming fn returns a truthy value for items to include
  }
  return result
}
