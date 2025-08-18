export interface TreeFilterOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}

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
 * 对树形数组结构执行广度优先搜索（BFS）过滤。
 *
 * 遍历树中的每个节点，应用提供的过滤函数 `fn`。
 * 只有当 `fn` 返回真值时，节点才会被包含在结果中。
 * 子节点通过指定的 `childrenKey` 属性进行遍历。
 *
 * @typeParam T - 输入树节点的类型。
 * @typeParam U - 过滤函数返回的类型，也是结果数组的类型。
 * @param array - 要过滤的树节点根数组。
 * @param fn - 接收节点并返回真值以决定是否包含在结果中的函数。
 * @param childrenKey - 每个树节点中包含子节点的属性名。
 * @returns 过滤后的节点数组，每个节点的子节点数组为空。
 * @throws {TypeError} 如果 `childrenKey` 属性存在但不是数组，则抛出异常。
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
