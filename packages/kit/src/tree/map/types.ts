/**
 * Context 配置选项
 * 每个字段为 true 时，对应的 Context 字段才会被创建和提供
 */
export interface TreeMapContextConfig {
  /** 是否包含 depth 信息（节点深度） */
  depth?: boolean

  /** 是否包含 index 信息（同级索引） */
  index?: boolean

  /** 是否包含 parent 引用（父节点） */
  parent?: boolean

  /** 是否包含 path 信息（节点路径） */
  path?: boolean

  /** 是否包含 isLeaf 标识（是否叶子节点） */
  isLeaf?: boolean

  /** 是否包含 isRoot 标识（是否根节点） */
  isRoot?: boolean

  /** 是否包含 processedChildren（已处理的子节点，仅后序遍历） */
  processedChildren?: boolean
}

/**
 * 基础 Context（始终包含，零开销）
 */
export interface TreeMapContextBase<T> {
  /** 原始节点的 children 引用（始终可用） */
  readonly originalChildren: T[] | undefined

  /** 子节点的键名（始终可用） */
  readonly childrenKey: string
}

/**
 * 可选 Context 字段（按需包含）
 */
export interface TreeMapContextOptional<T> {
  /** 当前节点在树中的深度（根节点为 0） */
  readonly depth: number

  /** 当前节点在同级节点中的索引（从 0 开始） */
  readonly index: number

  /** 父节点引用（根节点为 undefined） */
  readonly parent: T | undefined

  /** 从根节点到当前节点的路径 */
  readonly path: ReadonlyArray<string | number>

  /** 当前节点是否为叶子节点 */
  readonly isLeaf: boolean

  /** 当前节点是否为根节点 */
  readonly isRoot: boolean

  /** 已递归处理后的 children（仅后序遍历且配置启用时可用） */
  readonly processedChildren: T[] | undefined
}

/**
 * 根据配置推断 Context 类型
 */
type EnabledKeys<Config> = {
  [K in keyof Config]: Config[K] extends true ? K : never
}[keyof Config]

export type TreeMapContext<T, Config extends TreeMapContextConfig = Record<string, never>>
  = TreeMapContextBase<T>
    & Pick<TreeMapContextOptional<T>, EnabledKeys<Config> & keyof TreeMapContextOptional<T>>

/**
 * TreeMap 选项接口
 */
export interface TreeMapOptions<Config extends TreeMapContextConfig = Record<string, never>> {
  /** 遍历模式：'dfs' 深度优先 | 'bfs' 广度优先，默认 'dfs' */
  mode?: 'dfs' | 'bfs'

  /** 遍历顺序：'pre' 前序 | 'post' 后序，默认 'pre'，仅在 dfs 模式下有效 */
  order?: 'pre' | 'post'

  /** 子节点属性的键名，默认 'children' */
  childrenKey?: string

  /** Context 配置（按需启用字段） */
  context?: Config

  /**
   * 自定义节点标识符提取函数
   * 仅在启用 path 时需要
   * 默认优先级：id > key > name > index
   */
  getNodeId?: (node: any, index: number) => string | number
}
