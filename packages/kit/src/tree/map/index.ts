import { validateChildrenProperty } from '../../_internal/validate'

/**
 * 配置 treeMap 函数行为的选项。
 *
 * @property mode 遍历树的方式，可选 'dfs'（深度优先）或 'bfs'（广度优先）。默认为 'dfs'。
 * @property order 节点访问顺序，可选 'pre'（前序）或 'post'（后序）。默认为 'pre'。
 * @property childrenKey 指定子节点属性的键名。默认为 'children'。
 */
interface TreeMapOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}
/**
 * 树结构映射函数，可对树形数组进行深度优先或广度优先遍历，并对每个节点应用映射函数。
 * @param array 输入的树形数组
 * @param fn 映射函数，对每个节点调用
 * @param options 遍历选项，包括遍历模式（dfs/bfs）、顺序（pre/post）、子节点键名
 * @returns 映射后的树形数组
 * @throws TypeError 如果输入不是数组或子节点不是数组
 */
export function treeMap<T extends Record<string, any>, U>(
  array: T[],
  fn: (item: T) => U,
  options?: TreeMapOptions,
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
    return treeMapBfs(array, fn, childrenKey)
  }
  else if (order === 'post') {
    return treeMapDfsPost(array, fn, childrenKey)
  }
  else {
    return treeMapDfsPre(array, fn, childrenKey)
  }
}

/**
 * 深度优先前序遍历，对每个节点先应用映射函数再递归子节点。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapDfsPre<T, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  return array.map((item) => {
    // 类型检查
    validateChildrenProperty(item, childrenKey)

    let mapped = fn(item)
    if (Array.isArray((item as any)[childrenKey])) {
      mapped = {
        ...mapped,
        [childrenKey]: treeMapDfsPre((item as any)[childrenKey], fn, childrenKey),
      }
    }
    return mapped
  })
}

/**
 * 深度优先后序遍历，对每个节点先递归子节点再应用映射函数。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapDfsPost<T, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  return array.map((item) => {
    // 类型检查
    validateChildrenProperty(item, childrenKey)

    let childrenMapped: U[] | undefined
    if (Array.isArray((item as any)[childrenKey])) {
      childrenMapped = treeMapDfsPost((item as any)[childrenKey], fn, childrenKey)
    }
    let mapped = fn(item)
    if (childrenMapped) {
      mapped = { ...mapped, [childrenKey]: childrenMapped }
    }
    return mapped
  })
}

/**
 * 广度优先遍历，对每一层节点依次应用映射函数。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapBfs<T, U>(
  array: T[],
  fn: (item: T) => U,
  childrenKey: string,
): U[] {
  const result: U[] = []
  const queue: Array<{ node: any, parentList: U[] }> = []

  for (const node of array) {
    queue.push({ node, parentList: result })
  }
  while (queue.length) {
    const { node, parentList } = queue.shift()!

    validateChildrenProperty(node, childrenKey)

    const mapped = fn(node)
    parentList.push(mapped)
    if (node[childrenKey] && Array.isArray(node[childrenKey])) {
      (mapped as any)[childrenKey] = []
      for (const child of node[childrenKey]) {
        queue.push({ node: child, parentList: (mapped as any)[childrenKey] })
      }
    }
  }
  return result
}
