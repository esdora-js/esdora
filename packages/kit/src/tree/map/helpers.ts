import type { TreeMapContext, TreeMapContextBase, TreeMapContextConfig, TreeMapOptions } from './types'

/**
 * 按需创建 Context 对象
 */
export function createTreeMapContext<T, Config extends TreeMapContextConfig>(
  item: T,
  originalChildren: T[] | undefined,
  childrenKey: string,
  config: Config | undefined,
  optionalData?: {
    processedChildren?: T[]
    depth?: number
    index?: number
    parent?: T
    path?: Array<string | number>
  },
): TreeMapContext<T, Config> {
  // 基础 context（始终创建）
  const baseContext: TreeMapContextBase<T> = {
    originalChildren,
    childrenKey,
  }

  // 如果没有配置，冻结并返回基础 context
  if (!config || Object.keys(config).length === 0) {
    return Object.freeze(baseContext) as TreeMapContext<T, Config>
  }

  // 按需添加字段
  const context: any = { ...baseContext }

  if (config.depth && optionalData?.depth !== undefined) {
    context.depth = optionalData.depth
  }

  if (config.index && optionalData?.index !== undefined) {
    context.index = optionalData.index
  }

  if (config.parent) {
    context.parent = optionalData?.parent
  }

  if (config.path && optionalData?.path) {
    context.path = Object.freeze([...optionalData.path])
  }

  if (config.isLeaf) {
    context.isLeaf = !originalChildren || originalChildren.length === 0
  }

  if (config.isRoot && optionalData?.depth !== undefined) {
    context.isRoot = optionalData.depth === 0
  }

  if (config.processedChildren) {
    context.processedChildren = optionalData?.processedChildren
  }

  return Object.freeze(context) as TreeMapContext<T, Config>
}

/**
 * 从节点中提取唯一标识符
 */
export function getNodeIdentifier(
  node: any,
  index: number,
  getNodeId?: (node: any, index: number) => string | number,
): string | number {
  if (getNodeId) {
    return getNodeId(node, index)
  }
  return node.id ?? node.key ?? node.name ?? index
}

/**
 * 验证配置的有效性
 */
export function validateTreeMapConfig<Config extends TreeMapContextConfig>(
  options: TreeMapOptions<Config>,
): void {
  const { order, context, mode } = options

  // BFS 模式下不支持 processedChildren（优先检查）
  if (mode === 'bfs' && context?.processedChildren) {
    throw new Error(
      'Configuration error: processedChildren is not available in BFS mode. '
      + 'Use { mode: "dfs", order: "post" } instead.',
    )
  }

  // 检查 processedChildren 只能在后序遍历中使用
  if (order !== 'post' && context?.processedChildren) {
    throw new Error(
      'Configuration error: processedChildren is only available in post-order traversal. '
      + 'Use { order: "post" } or remove processedChildren from context.',
    )
  }
}
