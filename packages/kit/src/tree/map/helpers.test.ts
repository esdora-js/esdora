import { describe, expect, it } from 'vitest'
import { createTreeMapContext, getNodeIdentifier, validateTreeMapConfig } from './helpers'

describe('getNodeIdentifier', () => {
  it('应使用自定义 getNodeId 函数', () => {
    const node = { id: 1, key: 'key1', name: 'name1' }
    const getNodeId = (n: any, idx: number) => `custom-${n.id}-${idx}`

    const result = getNodeIdentifier(node, 0, getNodeId)

    expect(result).toBe('custom-1-0')
  })

  it('应使用 node.id 作为标识符', () => {
    const node = { id: 123, key: 'key1', name: 'name1' }

    const result = getNodeIdentifier(node, 0)

    expect(result).toBe(123)
  })

  it('当没有 id 时应使用 node.key 作为标识符', () => {
    const node = { key: 'my-key', name: 'name1' }

    const result = getNodeIdentifier(node, 0)

    expect(result).toBe('my-key')
  })

  it('当没有 id 和 key 时应使用 node.name 作为标识符', () => {
    const node = { name: 'my-name' }

    const result = getNodeIdentifier(node, 0)

    expect(result).toBe('my-name')
  })

  it('当没有 id、key 和 name 时应使用 index 作为标识符', () => {
    const node = { someOtherProp: 'value' }

    const result = getNodeIdentifier(node, 5)

    expect(result).toBe(5)
  })

  it('应优先使用 id 而非 key 和 name', () => {
    const node = { id: 1, key: 'key1', name: 'name1' }

    const result = getNodeIdentifier(node, 0)

    expect(result).toBe(1)
  })

  it('应优先使用 key 而非 name', () => {
    const node = { key: 'key1', name: 'name1' }

    const result = getNodeIdentifier(node, 0)

    expect(result).toBe('key1')
  })
})

describe('createTreeMapContext', () => {
  it('应创建基础 context', () => {
    const item = { id: 1 }
    const originalChildren = [{ id: 2 }]

    const context = createTreeMapContext(item, originalChildren, 'children', undefined)

    expect(context).toEqual({
      originalChildren,
      childrenKey: 'children',
    })
    expect(Object.isFrozen(context)).toBe(true)
  })

  it('应创建包含 depth 的 context', () => {
    const item = { id: 1 }
    const originalChildren = [{ id: 2 }]
    const config = { depth: true }
    const optionalData = { depth: 2 }

    const context = createTreeMapContext(item, originalChildren, 'children', config, optionalData)

    expect(context).toHaveProperty('depth', 2)
    expect(Object.isFrozen(context)).toBe(true)
  })

  it('应创建包含 index 的 context', () => {
    const item = { id: 1 }
    const config = { index: true }
    const optionalData = { index: 3 }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('index', 3)
  })

  it('应创建包含 parent 的 context', () => {
    const item = { id: 1 }
    const parent = { id: 0 }
    const config = { parent: true }
    const optionalData = { parent }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('parent', parent)
  })

  it('应创建包含 path 的 context', () => {
    const item = { id: 1 }
    const config = { path: true }
    const optionalData = { path: [1, 2, 3] }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('path')
    expect((context as any).path).toEqual([1, 2, 3])
    expect(Object.isFrozen((context as any).path)).toBe(true)
  })

  it('应创建包含 isLeaf 的 context (叶子节点)', () => {
    const item = { id: 1 }
    const config = { isLeaf: true }

    const context = createTreeMapContext(item, undefined, 'children', config)

    expect(context).toHaveProperty('isLeaf', true)
  })

  it('应创建包含 isLeaf 的 context (非叶子节点)', () => {
    const item = { id: 1 }
    const originalChildren = [{ id: 2 }]
    const config = { isLeaf: true }

    const context = createTreeMapContext(item, originalChildren, 'children', config)

    expect(context).toHaveProperty('isLeaf', false)
  })

  it('应创建包含 isLeaf 的 context (空children数组)', () => {
    const item = { id: 1 }
    const originalChildren: any[] = []
    const config = { isLeaf: true }

    const context = createTreeMapContext(item, originalChildren, 'children', config)

    expect(context).toHaveProperty('isLeaf', true)
  })

  it('应创建包含 isRoot 的 context (根节点)', () => {
    const item = { id: 1 }
    const config = { isRoot: true }
    const optionalData = { depth: 0 }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('isRoot', true)
  })

  it('应创建包含 isRoot 的 context (非根节点)', () => {
    const item = { id: 1 }
    const config = { isRoot: true }
    const optionalData = { depth: 1 }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('isRoot', false)
  })

  it('应创建包含 processedChildren 的 context', () => {
    const item = { id: 1 }
    const processedChildren = [{ id: 2, processed: true }]
    const config = { processedChildren: true }
    const optionalData = { processedChildren }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toHaveProperty('processedChildren', processedChildren)
  })

  it('应创建包含多个字段的 context', () => {
    const item = { id: 1 }
    const parent = { id: 0 }
    const config = { depth: true, index: true, parent: true, isLeaf: true, isRoot: true }
    const optionalData = { depth: 1, index: 2, parent }

    const context = createTreeMapContext(item, undefined, 'children', config, optionalData)

    expect(context).toMatchObject({
      originalChildren: undefined,
      childrenKey: 'children',
      depth: 1,
      index: 2,
      parent,
      isLeaf: true,
      isRoot: false,
    })
  })

  it('当 config 为空对象时应只返回基础 context', () => {
    const item = { id: 1 }
    const config = {}

    const context = createTreeMapContext(item, undefined, 'children', config)

    expect(context).toEqual({
      originalChildren: undefined,
      childrenKey: 'children',
    })
  })
})

describe('validateTreeMapConfig', () => {
  it('有效配置不应抛出错误', () => {
    expect(() => {
      validateTreeMapConfig({ mode: 'dfs', order: 'pre' })
    }).not.toThrow()

    expect(() => {
      validateTreeMapConfig({ mode: 'dfs', order: 'post', context: { processedChildren: true } })
    }).not.toThrow()

    expect(() => {
      validateTreeMapConfig({ mode: 'bfs' })
    }).not.toThrow()
  })

  it('在 BFS 模式下使用 processedChildren 应抛出错误', () => {
    expect(() => {
      validateTreeMapConfig({
        mode: 'bfs',
        context: { processedChildren: true },
      })
    }).toThrow('processedChildren is not available in BFS mode')
  })

  it('在非后序遍历中使用 processedChildren 应抛出错误', () => {
    expect(() => {
      validateTreeMapConfig({
        order: 'pre',
        context: { processedChildren: true },
      })
    }).toThrow('processedChildren is only available in post-order traversal')
  })

  it('错误消息应包含正确的提示信息', () => {
    try {
      validateTreeMapConfig({
        mode: 'bfs',
        context: { processedChildren: true },
      })
      expect.fail('应该抛出错误')
    }
    catch (error: any) {
      expect(error.message).toContain('Use { mode: "dfs", order: "post" } instead')
    }

    try {
      validateTreeMapConfig({
        order: 'pre',
        context: { processedChildren: true },
      })
      expect.fail('应该抛出错误')
    }
    catch (error: any) {
      expect(error.message).toContain('Use { order: "post" }')
    }
  })
})
