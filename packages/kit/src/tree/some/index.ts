import { validateChildrenProperty } from '../../_internal/validate'

/**
 * TreeSomeOptions 配置项说明：
 *
 * @property mode 遍历模式，可选值：
 *   - 'dfs'：深度优先遍历（默认）
 *   - 'bfs'：广度优先遍历
 * @property order 遍历顺序，仅在深度优先时有效，可选值：
 *   - 'pre'：前序遍历（默认）
 *   - 'post'：后序遍历
 * @property childrenKey 子节点属性名，默认为 'children'
 */
export interface TreeSomeOptions {
  mode?: 'dfs' | 'bfs'
  order?: 'pre' | 'post'
  childrenKey?: string
}

/**
 * 对树形结构数组进行遍历，检测是否存在满足条件的节点。
 *
 * @template T 输入数组元素的类型，需为对象类型。
 * @param array 要处理的树形结构数组。
 * @param fn 对每个节点执行的检测函数，返回 true 表示满足条件。
 * @param options 可选参数，包含遍历模式（'dfs'深度优先或'bfs'广度优先）、遍历顺序（'pre'前序或'post'后序）、子节点键名等配置。
 *   - mode: 'dfs' | 'bfs'，遍历模式，默认为 'dfs'
 *   - order: 'pre' | 'post'，遍历顺序，仅在 dfs 时有效，默认为 'pre'
 *   - childrenKey: string，子节点属性名，默认为 'children'
 * @returns 如果存在满足条件的节点返回 true，否则返回 false。
 * @throws {TypeError} 如果第一个参数不是数组，则抛出类型错误。
 *
 * @example
 * ```typescript
 * const tree = [
 *   { id: 1, children: [{ id: 2 }] }
 * ];
 * const hasEvenId = treeSome(tree, node => node.id % 2 === 0);
 * // hasEvenId: true (因为存在 id 为 2 的节点)
 * ```
 */
export function treeSome<T extends Record<string, any>>(
  array: T[],
  fn: (item: T) => boolean,
  options?: TreeSomeOptions,
): boolean {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array as the first argument')
  }
  if (array.length === 0) {
    return false
  }

  const mode = options?.mode ?? 'dfs'
  const order = options?.order ?? 'pre'
  const childrenKey = options?.childrenKey ?? 'children'

  if (mode === 'bfs') {
    return treeSomeBfs(array, fn, childrenKey)
  }
  else if (order === 'post') {
    return treeSomeDfsPost(array, fn, childrenKey)
  }
  else {
    return treeSomeDfsPre(array, fn, childrenKey)
  }
}
/**
 * 对树形数组结构执行广度优先搜索（BFS）检测。
 *
 * 遍历树中的每个节点，应用提供的检测函数 `fn`。
 * 当 `fn` 返回 true 时，立即返回 true 表示找到满足条件的节点。
 * 子节点通过指定的 `childrenKey` 属性进行遍历。
 *
 * @typeParam T - 输入树节点的类型。
 * @param array - 要检测的树节点根数组。
 * @param fn - 接收节点并返回布尔值以决定是否满足条件的函数。
 * @param childrenKey - 每个树节点中包含子节点的属性名。
 * @returns 如果找到满足条件的节点返回 true，否则返回 false。
 * @throws {TypeError} 如果 `childrenKey` 属性存在但不是数组，则抛出异常。
 */
function treeSomeBfs<T extends Record<string, any>>(array: T[], fn: (item: T) => boolean, childrenKey: string): boolean {
  const queue = [...array]
  while (queue.length > 0) {
    const item = queue.shift()!
    if (!item) {
      continue
    }

    if (fn(item)) {
      return true
    }

    validateChildrenProperty(item, childrenKey)

    if (Array.isArray(item[childrenKey])) {
      queue.push(...item[childrenKey])
    }
  }
  return false
}

/**
 * 深度优先后序遍历检测树结构数组。
 *
 * 先递归检测子节点，再检测当前节点。
 * 当找到满足条件的节点时立即返回 true。
 *
 * @template T 输入数组元素类型
 * @param array 要遍历的树结构数组
 * @param fn 检测每个节点的回调函数，返回 true 表示满足条件
 * @param childrenKey 子节点属性的键名
 * @returns 如果找到满足条件的节点返回 true，否则返回 false
 *
 * @throws {TypeError} 如果 childrenKey 对应的属性不是数组，则抛出异常
 */
function treeSomeDfsPost<T extends Record<string, any>>(array: T[], fn: (item: T) => boolean, childrenKey: string): boolean {
  for (const item of array) {
    validateChildrenProperty(item, childrenKey)

    if (Array.isArray(item[childrenKey]) && treeSomeDfsPost(item[childrenKey], fn, childrenKey)) {
      return true
    }
    if (fn(item)) {
      return true
    }
  }
  return false
}

/**
 * 对树结构进行前序深度优先遍历（DFS）检测。
 *
 * 遍历给定的树节点数组，对每个节点应用检测函数 `fn`，
 * 先检测当前节点，再递归检测子节点。
 * 当找到满足条件的节点时立即返回 true。
 *
 * @typeParam T - 输入树节点的类型，需继承自 `Record<string, any>`。
 * @param array - 要检测的树节点数组。
 * @param fn - 节点检测函数，返回 true 表示满足条件。
 * @param childrenKey - 节点中存放子节点数组的属性名。
 * @returns 如果找到满足条件的节点返回 true，否则返回 false。
 * @throws {TypeError} 当 `childrenKey` 对应的属性存在且不是数组时抛出异常。
 */
function treeSomeDfsPre<T extends Record<string, any>>(array: T[], fn: (item: T) => boolean, childrenKey: string): boolean {
  for (const item of array) {
    if (fn(item)) {
      return true
    }

    validateChildrenProperty(item, childrenKey)

    if (Array.isArray(item[childrenKey]) && treeSomeDfsPre(item[childrenKey], fn, childrenKey)) {
      return true
    }
  }
  return false
}
