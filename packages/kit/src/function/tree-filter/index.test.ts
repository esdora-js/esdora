import { describe, expect, it } from 'vitest'
import { treeFilter } from './index'

describe('树过滤器 (treeFilter)', () => {
  const sampleTree = [
    {
      id: 1,
      name: 'root1',
      children: [
        {
          id: 2,
          name: 'child1',
          children: [
            { id: 3, name: 'grandchild1' },
            { id: 4, name: 'grandchild2' },
          ],
        },
        { id: 5, name: 'child2' },
      ],
    },
    {
      id: 6,
      name: 'root2',
      children: [
        { id: 7, name: 'child3' },
      ],
    },
  ]

  describe('基础功能', () => {
    it('当第一个参数不是数组时应该抛出 TypeError', () => {
      expect(() => treeFilter(null as any, () => true)).toThrow('Expected an array as the first argument')
      expect(() => treeFilter(undefined as any, () => true)).toThrow('Expected an array as the first argument')
      expect(() => treeFilter('string' as any, () => true)).toThrow('Expected an array as the first argument')
    })

    it('当输入为空数组时应该返回空数组', () => {
      const result = treeFilter([], () => true)
      expect(result).toEqual([])
    })

    it('使用默认选项过滤树 (DFS 前序遍历)', () => {
      const result = treeFilter(sampleTree, item => item.id % 2 === 1)
      expect(result).toEqual([
        {
          id: 1,
          name: 'root1',
          children: [
            {
              id: 5,
              name: 'child2',
            },
          ],
        },
      ])
    })
  })

  describe('dFS 前序遍历模式 (深度优先搜索 - 前序)', () => {
    it('应该在 DFS 前序遍历模式下过滤树', () => {
      const result = treeFilter(sampleTree, item => item.id <= 3, { mode: 'dfs', order: 'pre' })
      expect(result).toEqual([
        {
          id: 1,
          name: 'root1',
          children: [
            {
              id: 2,
              name: 'child1',
              children: [
                { id: 3, name: 'grandchild1' },
              ],
            },
          ],
        },
      ])
    })

    it('应该处理空的子节点数组', () => {
      const tree = [{ id: 1, name: 'test', children: [] }]
      const result = treeFilter(tree, () => true)
      expect(result).toEqual([{ id: 1, name: 'test', children: [] }])
    })
  })

  describe('dFS 后序遍历模式 (深度优先搜索 - 后序)', () => {
    it('应该在 DFS 后序遍历模式下过滤树', () => {
      const result = treeFilter(sampleTree, item => item.id % 2 === 1, { mode: 'dfs', order: 'post' })
      expect(result).toEqual([
        {
          id: 1,
          name: 'root1',
          children: [
            { id: 5, name: 'child2' },
          ],
        },
      ])
    })
  })

  describe('bFS 模式 (广度优先搜索)', () => {
    it('应该在 BFS 模式下过滤树', () => {
      const result = treeFilter(sampleTree, item => item.id <= 2, { mode: 'bfs' })
      expect(result).toEqual([
        { id: 1, name: 'root1', children: [] },
        { id: 2, name: 'child1', children: [] },
      ])
    })
  })

  describe('自定义子节点键名', () => {
    it('应该支持自定义子节点键名', () => {
      const customTree = [
        {
          id: 1,
          name: 'parent',
          items: [
            { id: 2, name: 'child' },
          ],
        },
      ]
      const result = treeFilter(customTree, () => true, { childrenKey: 'items' })
      expect(result).toEqual([
        {
          id: 1,
          name: 'parent',
          items: [
            { id: 2, name: 'child' },
          ],
        },
      ])
    })
  })

  describe('错误处理', () => {
    it('在 DFS 前序遍历中当子节点不是数组时应该抛出错误', () => {
      const invalidTree = [{ id: 1, children: 'invalid' }]
      expect(() => treeFilter(invalidTree, () => true)).toThrow('Expected children to be an array')
    })

    it('在 DFS 后序遍历中当子节点不是数组时应该抛出错误', () => {
      const invalidTree = [{ id: 1, children: 'invalid' }]
      expect(() => treeFilter(invalidTree, () => true, { order: 'post' })).toThrow('Expected children to be an array')
    })

    it('在 BFS 中当子节点不是数组时应该抛出错误', () => {
      const invalidTree = [{ id: 1, children: 'invalid' }]
      expect(() => treeFilter(invalidTree, () => true, { mode: 'bfs' })).toThrow('Expected children to be an array')
    })

    it('应该处理 null 子节点', () => {
      const treeWithNull = [{ id: 1, children: null }]
      const result = treeFilter(treeWithNull, () => true)
      expect(result).toEqual([{ id: 1, children: null }])
    })

    it('应该处理 undefined 子节点', () => {
      const treeWithUndefined = [{ id: 1, children: undefined }]
      const result = treeFilter(treeWithUndefined, () => true)
      expect(result).toEqual([{ id: 1, children: undefined }])
    })
  })

  describe('过滤函数行为', () => {
    it('当过滤函数返回假值时应该过滤掉项目', () => {
      const result = treeFilter(sampleTree, item => item.id !== 2)
      expect(result).toEqual([
        {
          id: 1,
          name: 'root1',
          children: [
            { id: 5, name: 'child2' },
          ],
        },
        {
          id: 6,
          name: 'root2',
          children: [
            { id: 7, name: 'child3' },
          ],
        },
      ])
    })

    it('当所有项目都通过过滤器时应该保持结构', () => {
      const result = treeFilter(sampleTree, () => true)
      expect(result).toEqual(sampleTree)
    })

    it('当没有项目通过过滤器时应该返回空数组', () => {
      const result = treeFilter(sampleTree, () => false)
      expect(result).toEqual([])
    })
  })

  describe('深层嵌套', () => {
    it('应该处理深层嵌套结构', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [
                    { id: 4 },
                  ],
                },
              ],
            },
          ],
        },
      ]
      const result = treeFilter(deepTree, item => item.id <= 3)
      expect(result).toEqual([
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [],
                },
              ],
            },
          ],
        },
      ])
    })
  })
})
