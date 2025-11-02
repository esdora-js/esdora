import type { TreeMapContext, TreeMapContextConfig, TreeMapOptions } from './types'
import { validateChildrenProperty } from '../../_internal/validate'
import { createTreeMapContext, getNodeIdentifier, validateTreeMapConfig } from './helpers'

// 导出类型
export type { TreeMapContext, TreeMapContextBase, TreeMapContextConfig, TreeMapContextOptional, TreeMapOptions } from './types'

/**
 * 树结构映射函数，可对树形数组进行深度优先或广度优先遍历，并对每个节点应用映射函数。
 *
 * **重要说明**:
 * - 映射函数必须返回对象类型（或 null/undefined），不支持返回原始类型（如 number、string）
 * - 函数会自动处理子节点的递归，除非你显式修改了 children 属性
 * - 如果返回的对象中 children 引用与原始相同，会自动递归处理
 * - 如果返回的对象中 children 引用不同，则不会递归处理（认为你已手动处理）
 * - 使用 Context 的 originalChildren 可以明确表示"保留并递归"
 *
 * **Context 功能**:
 * - 第二个参数 context 是可选的，完全向后兼容
 * - 默认提供 originalChildren 和 childrenKey 字段（零开销）
 * - 通过 options.context 配置可以按需启用更多字段（depth, parent, path 等）
 *
 * @param array 输入的树形数组
 * @param fn 映射函数，对每个节点调用，必须返回对象类型或 null/undefined
 * @param options 遍历选项，包括遍历模式（dfs/bfs）、顺序（pre/post）、子节点键名、Context 配置
 * @returns 映射后的树形数组
 * @throws TypeError 如果输入不是数组、子节点不是数组、或映射函数返回非对象类型
 * @throws Error 如果配置无效（如在非后序遍历中使用 processedChildren）
 *
 * @example
 * ```ts
 * // 基础用法（向后兼容）
 * const result = treeMap(tree, (item) => ({ ...item, name: item.name.toUpperCase() }))
 *
 * // 使用 Context 解决条件性 children 问题
 * const result = treeMap(tree, (item, ctx) => ({
 *   ...item,
 *   children: item.children?.length > 0 ? ctx?.originalChildren : null
 * }))
 *
 * // 启用 depth 字段
 * const result = treeMap(tree, (item, ctx) => ({
 *   ...item,
 *   level: ctx?.depth
 * }), {
 *   context: { depth: true }
 * })
 *
 * // 后序遍历聚合
 * const result = treeMap(tree, (item, ctx) => {
 *   const childSum = ctx?.processedChildren?.reduce((sum, c) => sum + c.value, 0) ?? 0
 *   return {
 *     ...item,
 *     totalValue: item.value + childSum,
 *     children: ctx?.processedChildren
 *   }
 * }, {
 *   order: 'post',
 *   context: { processedChildren: true }
 * })
 * ```
 */
export function treeMap<
  T extends Record<string, any>,
  U extends Record<string, any> | null | undefined,
  Config extends TreeMapContextConfig = Record<string, never>,
>(
  array: T[],
  fn: (item: T, context?: TreeMapContext<T, Config>) => U,
  options?: TreeMapOptions<Config>,
): U[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array as the first argument')
  }
  if (array.length === 0) {
    return []
  }

  // 验证配置
  if (options) {
    validateTreeMapConfig(options)
  }

  const mode = options?.mode ?? 'dfs'
  const order = options?.order ?? 'pre'
  const childrenKey = options?.childrenKey ?? 'children'
  const config = options?.context

  if (mode === 'bfs') {
    return treeMapBfs(array, fn, childrenKey, config, options ?? {})
  }
  else if (order === 'post') {
    return treeMapDfsPost(array, fn, childrenKey, config, options ?? {})
  }
  else {
    return treeMapDfsPre(array, fn, childrenKey, config, options ?? {})
  }
}

/**
 * 深度优先前序遍历，对每个节点先应用映射函数再递归子节点。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @param config Context 配置
 * @param options 完整选项
 * @param depth 当前深度
 * @param parent 父节点
 * @param parentPath 父节点路径
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapDfsPre<T, U, Config extends TreeMapContextConfig>(
  array: T[],
  fn: (item: T, context?: TreeMapContext<T, Config>) => U,
  childrenKey: string,
  config: Config | undefined,
  options: TreeMapOptions<Config>,
  depth: number = 0,
  parent?: T,
  parentPath: Array<string | number> = [],
): U[] {
  const needsOptionalData = config && Object.keys(config).some(k => config[k as keyof Config])

  return array.map((item, index) => {
    validateChildrenProperty(item, childrenKey)

    const originalChildren = (item as any)[childrenKey]

    // 按需准备可选数据
    let optionalData: any
    let currentPath: Array<string | number> = parentPath

    if (needsOptionalData) {
      optionalData = {}

      if (config!.depth || config!.isRoot) {
        optionalData.depth = depth
      }

      if (config!.index) {
        optionalData.index = index
      }

      if (config!.parent) {
        optionalData.parent = parent
      }

      if (config!.path) {
        const nodeId = getNodeIdentifier(item, index, options.getNodeId)
        currentPath = [...parentPath, nodeId]
        optionalData.path = currentPath
      }
    }

    // 创建 context
    const context = createTreeMapContext(
      item,
      originalChildren,
      childrenKey,
      config,
      optionalData,
    )

    // 调用映射函数，传入可选的 context
    const mapped = fn(item, context)

    // 类型检查
    if (mapped != null && typeof mapped !== 'object') {
      throw new TypeError('Mapping function must return an object, null, or undefined')
    }

    // 处理 children（保持原有逻辑）
    const mappedHasChildren = mapped != null && Object.prototype.hasOwnProperty.call(mapped, childrenKey)

    if (!mappedHasChildren) {
      if (Array.isArray(originalChildren) && originalChildren.length > 0) {
        return {
          ...mapped,
          [childrenKey]: treeMapDfsPre(
            originalChildren,
            fn,
            childrenKey,
            config,
            options,
            depth + 1,
            item,
            currentPath,
          ),
        } as U
      }
      return mapped
    }

    const mappedChildren = (mapped as any)[childrenKey]

    // 如果用户返回 ctx.originalChildren，保留原始引用并递归
    if (mappedChildren === context.originalChildren) {
      if (Array.isArray(originalChildren) && originalChildren.length > 0) {
        return {
          ...mapped,
          [childrenKey]: treeMapDfsPre(
            originalChildren,
            fn,
            childrenKey,
            config,
            options,
            depth + 1,
            item,
            currentPath,
          ),
        } as U
      }
      return mapped
    }

    if (!Array.isArray(mappedChildren)) {
      return mapped
    }

    if (mappedChildren !== originalChildren) {
      return mapped
    }

    if (Array.isArray(originalChildren) && originalChildren.length > 0) {
      return {
        ...mapped,
        [childrenKey]: treeMapDfsPre(
          originalChildren,
          fn,
          childrenKey,
          config,
          options,
          depth + 1,
          item,
          currentPath,
        ),
      } as U
    }
    return mapped
  })
}

/**
 * 深度优先后序遍历，对每个节点先递归子节点再应用映射函数。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @param config Context 配置
 * @param options 完整选项
 * @param depth 当前深度
 * @param parent 父节点
 * @param parentPath 父节点路径
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapDfsPost<T, U, Config extends TreeMapContextConfig>(
  array: T[],
  fn: (item: T, context?: TreeMapContext<T, Config>) => U,
  childrenKey: string,
  config: Config | undefined,
  options: TreeMapOptions<Config>,
  depth: number = 0,
  parent?: T,
  parentPath: Array<string | number> = [],
): U[] {
  const needsOptionalData = config && Object.keys(config).some(k => config[k as keyof Config])

  return array.map((item, index) => {
    validateChildrenProperty(item, childrenKey)

    const originalChildren = (item as any)[childrenKey]

    // 先递归处理子节点
    let childrenMapped: U[] | undefined
    let currentPath: Array<string | number> = parentPath

    if (Array.isArray(originalChildren)) {
      if (needsOptionalData && config!.path) {
        const nodeId = getNodeIdentifier(item, index, options.getNodeId)
        currentPath = [...parentPath, nodeId]
      }
      childrenMapped = treeMapDfsPost(
        originalChildren,
        fn,
        childrenKey,
        config,
        options,
        depth + 1,
        item,
        currentPath,
      )
    }

    // 按需准备可选数据
    let optionalData: any

    if (needsOptionalData) {
      optionalData = {}

      if (config!.depth || config!.isRoot) {
        optionalData.depth = depth
      }

      if (config!.index) {
        optionalData.index = index
      }

      if (config!.parent) {
        optionalData.parent = parent
      }

      if (config!.path) {
        if (currentPath === parentPath) {
          const nodeId = getNodeIdentifier(item, index, options.getNodeId)
          currentPath = [...parentPath, nodeId]
        }
        optionalData.path = currentPath
      }

      if (config!.processedChildren) {
        optionalData.processedChildren = childrenMapped
      }
    }

    // 创建 context
    const context = createTreeMapContext(
      item,
      originalChildren,
      childrenKey,
      config,
      optionalData,
    )

    // 调用映射函数
    const mapped = fn(item, context)

    // 类型检查
    if (mapped != null && typeof mapped !== 'object') {
      throw new TypeError('Mapping function must return an object, null, or undefined')
    }

    // 检查映射后的对象是否定义了 childrenKey
    const mappedHasChildren = mapped != null && Object.prototype.hasOwnProperty.call(mapped, childrenKey)

    if (!mappedHasChildren) {
      // 用户未处理 children，使用递归结果
      if (childrenMapped) {
        return { ...mapped, [childrenKey]: childrenMapped } as U
      }
      return mapped
    }

    const mappedChildren = (mapped as any)[childrenKey]

    // 如果用户返回 ctx.originalChildren，使用递归结果
    if (mappedChildren === context.originalChildren) {
      return childrenMapped
        ? { ...mapped, [childrenKey]: childrenMapped } as U
        : mapped
    }

    // 如果映射后的 children 不是数组（如 null、undefined 等），说明用户明确修改了它
    if (!Array.isArray(mappedChildren)) {
      return mapped
    }

    // 如果映射后的 children 是数组但引用不同，说明用户创建了新数组
    if (mappedChildren !== originalChildren) {
      return mapped
    }

    // 如果 children 引用相同，使用递归处理的结果
    return childrenMapped
      ? { ...mapped, [childrenKey]: childrenMapped } as U
      : mapped
  })
}

/**
 * 广度优先遍历，对每一层节点依次应用映射函数。
 * @param array 输入的树形数组
 * @param fn 映射函数
 * @param childrenKey 子节点键名
 * @param config Context 配置
 * @param options 完整选项
 * @returns 映射后的树形数组
 * @throws TypeError 如果子节点不是数组
 */
function treeMapBfs<T, U, Config extends TreeMapContextConfig>(
  array: T[],
  fn: (item: T, context?: TreeMapContext<T, Config>) => U,
  childrenKey: string,
  config: Config | undefined,
  options: TreeMapOptions<Config>,
): U[] {
  const result: U[] = []
  const queue: Array<{
    node: any
    parentList: U[]
    depth: number
    parent?: T
    path: Array<string | number>
  }> = []

  const needsOptionalData = config && Object.keys(config).some(k => config[k as keyof Config])

  for (let i = 0; i < array.length; i++) {
    queue.push({
      node: array[i],
      parentList: result,
      depth: 0,
      parent: undefined,
      path: [],
    })
  }

  // 使用索引代替 shift() 以提升性能（O(1) vs O(n)）
  let queueIndex = 0
  while (queueIndex < queue.length) {
    const { node, parentList, depth, parent, path } = queue[queueIndex++]

    validateChildrenProperty(node, childrenKey)

    const originalChildren = node[childrenKey]
    const index = parentList.length

    // 按需准备可选数据
    let optionalData: any
    let currentPath = path

    if (needsOptionalData) {
      optionalData = {}

      if (config!.depth || config!.isRoot) {
        optionalData.depth = depth
      }

      if (config!.index) {
        optionalData.index = index
      }

      if (config!.parent) {
        optionalData.parent = parent
      }

      if (config!.path) {
        const nodeId = getNodeIdentifier(node, index, options.getNodeId)
        currentPath = [...path, nodeId]
        optionalData.path = currentPath
      }
    }

    // 创建 context
    const context = createTreeMapContext(
      node,
      originalChildren,
      childrenKey,
      config,
      optionalData,
    )

    // 调用映射函数
    const mapped = fn(node, context)

    // 类型检查
    if (mapped != null && typeof mapped !== 'object') {
      throw new TypeError('Mapping function must return an object, null, or undefined')
    }

    parentList.push(mapped)
    const currentIndex = parentList.length - 1

    // 检查映射后的对象是否定义了 childrenKey
    const mappedHasChildren = mapped != null && Object.prototype.hasOwnProperty.call(mapped, childrenKey)

    if (!mappedHasChildren) {
      // 用户未处理 children，自动递归
      if (originalChildren && Array.isArray(originalChildren)) {
        const newChildren: U[] = []
        const newMapped = { ...mapped, [childrenKey]: newChildren } as U
        parentList[currentIndex] = newMapped
        for (const child of originalChildren) {
          queue.push({
            node: child,
            parentList: newChildren,
            depth: depth + 1,
            parent: node,
            path: currentPath,
          })
        }
      }
      continue
    }

    const mappedChildren = (mapped as any)[childrenKey]

    // 如果用户返回 ctx.originalChildren，递归处理
    if (mappedChildren === context.originalChildren) {
      if (originalChildren && Array.isArray(originalChildren)) {
        const newChildren: U[] = []
        const newMapped = { ...mapped, [childrenKey]: newChildren } as U
        parentList[currentIndex] = newMapped
        for (const child of originalChildren) {
          queue.push({
            node: child,
            parentList: newChildren,
            depth: depth + 1,
            parent: node,
            path: currentPath,
          })
        }
      }
      continue
    }

    // 如果映射后的 children 不是数组（如 null、undefined 等），说明用户明确修改了它
    if (!Array.isArray(mappedChildren)) {
      continue
    }

    // 如果映射后的 children 是数组但引用不同，说明用户创建了新数组
    if (mappedChildren !== originalChildren) {
      continue
    }

    // 如果 children 引用相同且是数组，继续递归处理
    const newChildren: U[] = []
    const newMapped = { ...mapped, [childrenKey]: newChildren } as U
    parentList[currentIndex] = newMapped
    for (const child of originalChildren) {
      queue.push({
        node: child,
        parentList: newChildren,
        depth: depth + 1,
        parent: node,
        path: currentPath,
      })
    }
  }
  return result
}
