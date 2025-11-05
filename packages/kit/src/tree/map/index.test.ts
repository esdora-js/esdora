import { describe, expect, it, vi } from 'vitest'
import { treeMap } from '.'

describe('treeMap 树结构映射函数', () => {
  interface Item {
    id: number
    children?: Item[]
  }
  it('仅有根节点', () => {
    const tree = [{ id: 1 }]
    const tree2 = [{ id: 2 }]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(1)
  })
  it('多个根节点', () => {
    const tree = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const tree2 = [{ id: 2 }, { id: 4 }, { id: 6 }]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(
      tree2,
    )
    expect(fn).toHaveBeenCalledTimes(3)
  })
  it('嵌套结构', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: [{ id: 5 }] },
    ]

    const tree2 = [
      { id: 2, children: [{ id: 4 }, { id: 6 }] },
      { id: 8, children: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
  })
  it('空数组', () => {
    const tree: Item[] = []
    const fn = vi.fn((item: Item) => item)
    const result = treeMap(tree, fn)
    expect(result).toEqual([])
    expect(fn).toHaveBeenCalledTimes(0)
  })

  it('非数组输入抛出异常', () => {
    expect(() => treeMap(null as any, (item: Item) => item)).toThrow(TypeError)
    expect(() => treeMap(undefined as any, (item: Item) => item)).toThrow(TypeError)
    expect(() => treeMap(123 as any, (item: Item) => item)).toThrow(TypeError)
  })

  it('children 节点为 []', () => {
    const tree = [{ id: 1, children: [] }]
    const tree2 = [{ id: 2, children: [] }]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('children 节点为 undefined', () => {
    const tree = [{ id: 1, children: undefined }]
    const tree2 = [{ id: 2, children: undefined }]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('children 节点为 null', () => {
    const tree: Item[] = [{ id: 1, children: null }] as unknown as Item[]
    const tree2: Item[] = [{ id: 2, children: null }] as unknown as Item[]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('children 节点为非数组时抛出异常', () => {
    const tree: Item[] = [{ id: 1, children: {} as any }] as unknown as Item[]
    const fn = vi.fn((item: Item) => item)
    expect(() => treeMap(tree, fn)).toThrow(TypeError)
    expect(fn).toHaveBeenCalledTimes(0)
  })

  it('改变children', () => {
    const tree = [{ id: 1, children: [{ id: 2 }] }, { id: 2, children: [] }]
    const result = treeMap(tree, (item, ctx) => {
      return {
        ...item,
        children: item.children?.length > 0 ? ctx?.originalChildren : null,
      }
    })
    // 子节点也会被递归处理，所以 id: 2 的节点也会有 children: null
    expect(result).toEqual([{ id: 1, children: [{ id: 2, children: null }] }, { id: 2, children: null }])
  })

  it('原始数据不变', () => {
    const tree = [{ id: 1, children: [{ id: 2 }] }]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn)
    expect(result).toEqual([{ id: 2, children: [{ id: 4 }] }])
    expect(fn).toHaveBeenCalledTimes(2)
    expect(tree).toEqual([{ id: 1, children: [{ id: 2 }] }]) // 原始数据未改变
  })

  it('广度优先遍历', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: [{ id: 5 }] },
    ]
    const tree2 = [
      { id: 2, children: [{ id: 4 }, { id: 6 }] },
      { id: 8, children: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn, {
      mode: 'bfs',
    })
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
    expect(fn.mock.calls[0][0].id).toBe(1) // 根节点1
    expect(fn.mock.calls[1][0].id).toBe(4) // 根节点4
    expect(fn.mock.calls[2][0].id).toBe(2) // 1 的子节点2
    expect(fn.mock.calls[3][0].id).toBe(3) // 1 的子节点3
    expect(fn.mock.calls[4][0].id).toBe(5) // 4 的子节点5
  })
  it('深度优先遍历', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: [{ id: 5 }] },
    ]
    const tree2 = [
      { id: 2, children: [{ id: 4 }, { id: 6 }] },
      { id: 8, children: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn, {
      mode: 'dfs',
    })
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
    expect(fn.mock.calls[0][0].id).toBe(1) // 根节点1
    expect(fn.mock.calls[1][0].id).toBe(2) // 根节点1 的子节点2
    expect(fn.mock.calls[2][0].id).toBe(3) // 根节点1 的子节点3
    expect(fn.mock.calls[3][0].id).toBe(4) // 根节点4
    expect(fn.mock.calls[4][0].id).toBe(5) // 根节点4 的子节点5
  })

  it('深度优先遍历，后序遍历', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: [{ id: 5 }] },
    ]
    const tree2 = [
      { id: 2, children: [{ id: 4 }, { id: 6 }] },
      { id: 8, children: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn, {
      mode: 'dfs',
      order: 'post',
    })
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
    expect(fn.mock.calls[0][0].id).toBe(2) // 根节点1 的子节点2
    expect(fn.mock.calls[1][0].id).toBe(3) // 根节点1 的子节点3
    expect(fn.mock.calls[2][0].id).toBe(1) // 根节点1
    expect(fn.mock.calls[3][0].id).toBe(5) // 根节点4 的子节点5
    expect(fn.mock.calls[4][0].id).toBe(4) // 根节点4
  })

  it('深度优先遍历，自定义 childrenKey', () => {
    const tree = [
      { id: 1, subItems: [{ id: 2 }, { id: 3 }] },
      { id: 4, subItems: [{ id: 5 }] },
    ]
    const tree2 = [
      { id: 2, subItems: [{ id: 4 }, { id: 6 }] },
      { id: 8, subItems: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn, {
      childrenKey: 'subItems',
    })
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
  })
  it('广度优先遍历，自定义 childrenKey', () => {
    const tree = [
      { id: 1, subItems: [{ id: 2 }, { id: 3 }] },
      { id: 4, subItems: [{ id: 5 }] },
    ]
    const tree2 = [
      { id: 2, subItems: [{ id: 4 }, { id: 6 }] },
      { id: 8, subItems: [{ id: 10 }] },
    ]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })
    const result = treeMap(tree, fn, {
      mode: 'bfs',
      childrenKey: 'subItems',
    })
    expect(result).toEqual(tree2)
    expect(fn).toHaveBeenCalledTimes(5)
  })

  it('递归极深的树结构', () => {
    let node: any = { id: 0 }
    for (let i = 1; i < 1000; i++) {
      node = { id: i, children: [node] }
    }
    const fn = vi.fn((item: any) => ({ ...item }))
    expect(() => treeMap([node], fn)).not.toThrow()
  })

  it('fn 抛出异常', () => {
    const tree = [{ id: 1 }]
    const fn = vi.fn(() => {
      throw new Error('test')
    })
    expect(() => treeMap(tree, fn)).toThrow('test')
  })

  it('fn 返回 undefined', () => {
    const tree = [{ id: 1 }]
    const fn = vi.fn(() => undefined as any)
    const result = treeMap(tree, fn)
    expect(result).toEqual([undefined])
  })

  it('测试广度优先遍历的顺序，传递错误的children', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: 'this is the error type children' },
    ] as Item[]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })

    expect(() => treeMap(tree, fn, {
      mode: 'bfs',
    })).toThrow(TypeError)
  })

  it('测试深度优先遍历的顺序，传递错误的children', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: 'this is the error type children' },
    ] as Item[]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })

    expect(() => treeMap(tree, fn, {
      mode: 'dfs',
    })).toThrow(TypeError)
  })

  it('测试深度优先后序遍历的顺序，传递错误的children', () => {
    const tree = [
      { id: 1, children: [{ id: 2 }, { id: 3 }] },
      { id: 4, children: 'this is the error type children' },
    ] as Item[]
    const fn = vi.fn((item: Item) => {
      return {
        ...item,
        id: item.id * 2,
      }
    })

    expect(() => treeMap(tree, fn, {
      mode: 'dfs',
      order: 'post',
    })).toThrow(TypeError)
  })

  describe('bFS 副作用修复测试', () => {
    it('bFS 模式不应修改映射函数返回的对象', () => {
      const sharedObject = { id: 1, name: 'shared' }
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      treeMap(tree, () => sharedObject, { mode: 'bfs' })

      // 验证共享对象没有被修改
      expect(sharedObject).toEqual({ id: 1, name: 'shared' })
      expect(sharedObject).not.toHaveProperty('children')
    })
  })

  describe('类型安全测试', () => {
    it('映射函数返回原始类型应抛出错误 - number', () => {
      const tree = [{ id: 1 }]
      expect(() => treeMap(tree, () => 42 as any)).toThrow(TypeError)
      expect(() => treeMap(tree, () => 42 as any)).toThrow('must return an object')
    })

    it('映射函数返回原始类型应抛出错误 - string', () => {
      const tree = [{ id: 1 }]
      expect(() => treeMap(tree, () => 'string' as any)).toThrow(TypeError)
    })

    it('映射函数返回原始类型应抛出错误 - boolean', () => {
      const tree = [{ id: 1 }]
      expect(() => treeMap(tree, () => true as any)).toThrow(TypeError)
    })

    it('映射函数返回 null 应该正常工作', () => {
      const tree = [{ id: 1 }]
      const result = treeMap(tree, () => null)
      expect(result).toEqual([null])
    })

    it('映射函数返回 undefined 应该正常工作', () => {
      const tree = [{ id: 1 }]
      const result = treeMap(tree, () => undefined)
      expect(result).toEqual([undefined])
    })

    it('bFS 模式下返回原始类型应抛出错误', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      expect(() => treeMap(tree, () => 123 as any, { mode: 'bfs' })).toThrow(TypeError)
    })

    it('后序遍历返回原始类型应抛出错误', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      expect(() => treeMap(tree, () => 'test' as any, { order: 'post' })).toThrow(TypeError)
    })
  })

  describe('后序遍历逻辑一致性测试', () => {
    it('后序遍历中返回原始对象（包括原始 children 引用）会使用递归结果', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]

      // 返回原始对象，包括原始 children 引用
      const result = treeMap(tree, item => item, { order: 'post' })

      // 后序遍历会创建新对象来包含递归处理的 children
      expect(result[0]).not.toBe(tree[0]) // 创建了新对象
      expect(result[0].children).not.toBe(tree[0].children) // children 是递归结果
      expect(result[0]).toEqual({ id: 1, children: [{ id: 2 }, { id: 3 }] })
    })

    it('后序遍历中返回新对象但保留原始 children 引用会使用递归结果', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]

      const result = treeMap(tree, item => ({ ...item }), { order: 'post' })

      // 验证返回了新对象，且 children 被递归处理
      expect(result[0]).not.toBe(tree[0])
      expect(result[0].children).not.toBe(tree[0].children)
      expect(result[0].children?.[0]).not.toBe(tree[0].children?.[0])
    })

    it('后序遍历中不设置 children 应自动使用递归结果', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        id: item.id * 2,
      }), { order: 'post' })

      expect(result).toEqual([
        { id: 2, children: [{ id: 4 }] },
      ])
    })
  })

  describe('增强错误信息测试', () => {
    it('错误信息应包含节点 id', () => {
      const tree = [{ id: 123, children: 'invalid' as any }]

      try {
        treeMap(tree, item => item)
        expect.fail('应该抛出错误')
      }
      catch (error: any) {
        expect(error.message).toContain('id: 123')
        expect(error.message).toContain('children')
      }
    })

    it('错误信息应包含节点 name（如果没有 id）', () => {
      const tree = [{ name: 'test-node', children: 'invalid' as any }]

      try {
        treeMap(tree, item => item)
        expect.fail('应该抛出错误')
      }
      catch (error: any) {
        expect(error.message).toContain('name: test-node')
      }
    })

    it('错误信息应包含实际类型', () => {
      const tree = [{ id: 1, children: 'string-value' as any }]

      try {
        treeMap(tree, item => item)
        expect.fail('应该抛出错误')
      }
      catch (error: any) {
        expect(error.message).toContain('string')
      }
    })

    it('错误信息应包含对象类型详情', () => {
      const tree = [{ id: 1, children: { nested: 'object' } as any }]

      try {
        treeMap(tree, item => item)
        expect.fail('应该抛出错误')
      }
      catch (error: any) {
        expect(error.message).toContain('object')
      }
    })
  })

  describe('bFS 性能优化测试', () => {
    it('大型树结构 BFS 遍历应该高效完成', () => {
      // 创建一个宽而浅的树（1000个根节点，每个有10个子节点）
      const tree = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        children: Array.from({ length: 10 }, (_, j) => ({
          id: i * 10 + j + 1000,
        })),
      }))

      const startTime = Date.now()
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }), { mode: 'bfs' })
      const endTime = Date.now()

      expect(result).toHaveLength(100)
      expect(result[0].children).toHaveLength(10)
      // 应该在合理时间内完成（< 100ms）
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('边界情况测试', () => {
    it('空 children 数组应该被保留', () => {
      const tree = [{ id: 1, children: [] }]
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }))
      expect(result).toEqual([{ id: 2, children: [] }])
    })

    it('多层嵌套的空 children', () => {
      const tree = [{
        id: 1,
        children: [
          { id: 2, children: [] },
          { id: 3, children: [] },
        ],
      }]
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }))
      expect(result).toEqual([{
        id: 2,
        children: [
          { id: 4, children: [] },
          { id: 6, children: [] },
        ],
      }])
    })

    it('用户显式设置 children 为 null', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, children: null }))
      expect(result).toEqual([{ id: 1, children: null }])
    })

    it('用户显式设置 children 为 undefined', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, children: undefined }))
      expect(result).toEqual([{ id: 1, children: undefined }])
    })

    it('用户显式设置 children 为空数组', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, children: [] }))
      expect(result).toEqual([{ id: 1, children: [] }])
    })

    it('用户创建新的 children 数组', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({
        ...item,
        children: [{ id: 999 }],
      }))
      // 不应该递归处理新数组
      expect(result).toEqual([{ id: 1, children: [{ id: 999 }] }])
    })

    it('所有遍历模式下的原始数据不变性', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const originalTree = JSON.parse(JSON.stringify(tree))

      treeMap(tree, item => ({ ...item, id: item.id * 2 }), { mode: 'dfs' })
      expect(tree).toEqual(originalTree)

      treeMap(tree, item => ({ ...item, id: item.id * 2 }), { mode: 'bfs' })
      expect(tree).toEqual(originalTree)

      treeMap(tree, item => ({ ...item, id: item.id * 2 }), { order: 'post' })
      expect(tree).toEqual(originalTree)
    })
  })

  describe('自定义 childrenKey 完整测试', () => {
    it('dfs 前序遍历使用自定义 key', () => {
      const tree = [{ id: 1, items: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }), {
        childrenKey: 'items',
      })
      expect(result).toEqual([{ id: 2, items: [{ id: 4 }] }])
    })

    it('dfs 后序遍历使用自定义 key', () => {
      const tree = [{ id: 1, items: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }), {
        order: 'post',
        childrenKey: 'items',
      })
      expect(result).toEqual([{ id: 2, items: [{ id: 4 }] }])
    })

    it('bfs 使用自定义 key', () => {
      const tree = [{ id: 1, items: [{ id: 2 }] }]
      const result = treeMap(tree, item => ({ ...item, id: item.id * 2 }), {
        mode: 'bfs',
        childrenKey: 'items',
      })
      expect(result).toEqual([{ id: 2, items: [{ id: 4 }] }])
    })
  })

  describe('context 功能测试', () => {
    it('默认只提供基础 Context', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const contexts: any[] = []

      treeMap(tree, (item, ctx) => {
        contexts.push(ctx)
        return item
      })

      contexts.forEach((ctx) => {
        expect(ctx).toHaveProperty('originalChildren')
        expect(ctx).toHaveProperty('childrenKey')
        expect(ctx).not.toHaveProperty('depth')
        expect(ctx).not.toHaveProperty('index')
        expect(ctx).not.toHaveProperty('parent')
      })
    })

    it('使用 Context 解决条件性 children 问题', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3, children: [] },
      ]

      const result = treeMap(tree, (item, ctx) => ({
        ...item,
        children: item.children?.length > 0 ? ctx?.originalChildren : null,
      }))

      // 子节点也会被递归处理
      expect(result[0].children).toEqual([{ id: 2, children: null }])
      expect(result[1].children).toBeNull()
    })

    it('启用 depth 后可以访问', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
      ]
      const depths: number[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.depth !== undefined) {
          depths.push(ctx.depth)
        }
        return item
      }, {
        context: { depth: true },
      })

      expect(depths).toEqual([0, 1, 1, 2])
    })

    it('启用 index 后可以访问', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }, { id: 3 }] },
        { id: 4 },
      ]
      const indices: number[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.index !== undefined) {
          indices.push(ctx.index)
        }
        return item
      }, {
        context: { index: true },
      })

      expect(indices).toEqual([0, 0, 1, 1])
    })

    it('启用 parent 后可以访问', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const parents: any[] = []

      treeMap(tree, (item, ctx) => {
        parents.push(ctx?.parent)
        return item
      }, {
        context: { parent: true },
      })

      expect(parents[0]).toBeUndefined() // 根节点没有父节点
      expect(parents[1]).toEqual({ id: 1, children: [{ id: 2 }] })
    })

    it('启用 path 后可以访问', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }, { id: 3 }] },
      ]
      const paths: any[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.path) {
          paths.push([...ctx.path])
        }
        return item
      }, {
        context: { path: true },
      })

      expect(paths).toEqual([
        [1],
        [1, 2],
        [1, 3],
      ])
    })

    it('启用 isLeaf 后可以访问', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3 },
      ]
      const leafFlags: boolean[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.isLeaf !== undefined) {
          leafFlags.push(ctx.isLeaf)
        }
        return item
      }, {
        context: { isLeaf: true },
      })

      expect(leafFlags).toEqual([false, true, true])
    })

    it('启用 isRoot 后可以访问', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }] },
      ]
      const rootFlags: boolean[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.isRoot !== undefined) {
          rootFlags.push(ctx.isRoot)
        }
        return item
      }, {
        context: { isRoot: true },
      })

      expect(rootFlags).toEqual([true, false])
    })

    it('后序遍历启用 processedChildren', () => {
      interface Node {
        id: number
        value: number
        totalValue?: number
        children?: Node[]
      }

      const tree: Node[] = [
        {
          id: 1,
          value: 10,
          children: [
            { id: 2, value: 20 },
            { id: 3, value: 30, children: [{ id: 4, value: 40 }] },
          ],
        },
      ]

      const result = treeMap(tree, (item, ctx) => {
        const childSum = ctx?.processedChildren?.reduce((sum: number, c: Node) => sum + (c.totalValue ?? 0), 0) ?? 0
        return {
          ...item,
          totalValue: item.value + childSum,
          children: ctx?.processedChildren,
        }
      }, {
        order: 'post',
        context: { processedChildren: true },
      })

      expect(result[0].totalValue).toBe(100) // 10 + 20 + (30 + 40)
      expect(result[0].children?.[0].totalValue).toBe(20)
      expect(result[0].children?.[1].totalValue).toBe(70) // 30 + 40
    })

    it('processedChildren 在非后序遍历中抛出错误', () => {
      const tree = [{ id: 1 }]

      expect(() => {
        treeMap(tree, item => item, {
          order: 'pre',
          context: { processedChildren: true },
        })
      }).toThrow('processedChildren is only available in post-order traversal')
    })

    it('processedChildren 在 BFS 模式中抛出错误', () => {
      const tree = [{ id: 1 }]

      expect(() => {
        treeMap(tree, item => item, {
          mode: 'bfs',
          context: { processedChildren: true },
        })
      }).toThrow('processedChildren is not available in BFS mode')
    })

    it('自定义 getNodeId 用于 path', () => {
      const tree = [
        { name: 'root', children: [{ name: 'child1' }, { name: 'child2' }] },
      ]
      const paths: any[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.path) {
          paths.push([...ctx.path])
        }
        return item
      }, {
        context: { path: true },
        getNodeId: node => node.name,
      })

      expect(paths).toEqual([
        ['root'],
        ['root', 'child1'],
        ['root', 'child2'],
      ])
    })

    it('多个 Context 字段同时启用', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const contexts: any[] = []

      treeMap(tree, (item, ctx) => {
        contexts.push({
          depth: ctx?.depth,
          index: ctx?.index,
          isLeaf: ctx?.isLeaf,
          isRoot: ctx?.isRoot,
        })
        return item
      }, {
        context: {
          depth: true,
          index: true,
          isLeaf: true,
          isRoot: true,
        },
      })

      expect(contexts).toEqual([
        { depth: 0, index: 0, isLeaf: false, isRoot: true },
        { depth: 1, index: 0, isLeaf: true, isRoot: false },
      ])
    })

    it('context 在 BFS 模式下正常工作', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const depths: number[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.depth !== undefined) {
          depths.push(ctx.depth)
        }
        return item
      }, {
        mode: 'bfs',
        context: { depth: true },
      })

      expect(depths).toEqual([0, 1])
    })

    it('向后兼容：不使用 Context 参数', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        id: item.id * 2,
      }))

      expect(result).toEqual([{ id: 2, children: [{ id: 4 }] }])
    })

    it('context 对象是冻结的', () => {
      const tree = [{ id: 1 }]

      treeMap(tree, (item, ctx) => {
        // 验证 context 对象被冻结
        expect(Object.isFrozen(ctx)).toBe(true)
        return item
      })
    })

    it('path 数组是冻结的', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      treeMap(tree, (item, ctx) => {
        if (ctx?.path) {
          // 验证 path 数组被冻结
          expect(Object.isFrozen(ctx.path)).toBe(true)
        }
        return item
      }, {
        context: { path: true },
      })
    })
  })

  describe('bFS 模式下缺失覆盖的测试用例', () => {
    it('bFS 模式下启用 path context', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }, { id: 3 }] },
        { id: 4, children: [{ id: 5 }] },
      ]
      const paths: any[] = []

      treeMap(tree, (item, ctx) => {
        if (ctx?.path) {
          paths.push([...ctx.path])
        }
        return item
      }, {
        mode: 'bfs',
        context: { path: true },
      })

      // 验证 path 被正确设置
      expect(paths).toEqual([
        [1], // 根节点1
        [4], // 根节点4
        [1, 2], // 节点1的子节点2
        [1, 3], // 节点1的子节点3
        [4, 5], // 节点4的子节点5
      ])
    })

    it('bFS 模式下用户设置 children 为非数组值', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        children: 'not-an-array' as any,
      }), {
        mode: 'bfs',
      })

      expect(result).toEqual([{ id: 1, children: 'not-an-array' }])
    })

    it('bFS 模式下用户设置 children 为新数组', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        children: [{ id: 999 }], // 新数组，不递归处理
      }), {
        mode: 'bfs',
      })

      expect(result).toEqual([{ id: 1, children: [{ id: 999 }] }])
    })

    it('bFS 模式下用户设置 children 为 null', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        children: null,
      }), {
        mode: 'bfs',
      })

      expect(result).toEqual([{ id: 1, children: null }])
    })

    it('bFS 模式下用户设置 children 为 undefined', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        children: undefined,
      }), {
        mode: 'bfs',
      })

      expect(result).toEqual([{ id: 1, children: undefined }])
    })

    it('bFS 模式下用户设置 children 为空数组', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, item => ({
        ...item,
        children: [],
      }), {
        mode: 'bfs',
      })

      expect(result).toEqual([{ id: 1, children: [] }])
    })

    it('bFS 模式下复杂场景：children 引用相同但用户已处理', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, (item, ctx) => {
        if (item.id === 1) {
          return {
            ...item,
            children: ctx?.originalChildren, // 保持原始引用
          }
        }
        return item
      }, {
        mode: 'bfs',
      })

      // 由于返回了 ctx.originalChildren，应该递归处理子节点
      expect(result).toEqual([{ id: 1, children: [{ id: 2 }] }])
    })

    it('bFS 模式下启用 parent context', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]
      const parents: any[] = []

      treeMap(tree, (item, ctx) => {
        parents.push(ctx?.parent)
        return item
      }, {
        mode: 'bfs',
        context: { parent: true },
      })

      // 验证 parent 被正确设置
      expect(parents[0]).toBeUndefined() // 根节点没有父节点
      expect(parents[1]).toEqual({ id: 1, children: [{ id: 2 }] })
    })

    it('bFS 模式下用户返回原始children引用（相同引用）', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }]

      const result = treeMap(tree, (item) => {
        // 返回原始对象，包括原始children引用
        return item
      }, {
        mode: 'bfs',
      })

      // 应该递归处理子节点
      expect(result).toEqual([{ id: 1, children: [{ id: 2 }] }])
    })
  })
})
