import { describe, expect, it } from 'vitest'
import { treePathAnalyze } from './index'

describe('tree-path', () => {
  // 简单树
  const simpleTree = {
    id: 'root',
    children: [
      { id: 'A' },
      { id: 'B' },
    ],
  }

  // 复杂树
  const complexTree = {
    id: 'root',
    children: [
      {
        id: 'A',
        children: [
          { id: 'A1' },
          {
            id: 'A2',
            children: [
              { id: 'A2a' },
              { id: 'A2b' },
            ],
          },
        ],
      },
      { id: 'B' },
      {
        id: 'C',
        children: [
          {
            id: 'C1',
            children: [
              {
                id: 'C1a',
                children: [
                  { id: 'C1a1' },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  // 单节点
  const singleNodeTree = {
    id: 'alone',
  }

  // 自定义字段的树
  const customTree = {
    name: 'root',
    items: [
      { name: 'A', items: [{ name: 'A1' }] },
      { name: 'B' },
    ],
  }

  describe('treePathAnalyze', () => {
    it('树层级只有一级的情况', () => {
      const paths = treePathAnalyze(simpleTree)

      expect(paths).toHaveLength(2)
      expect(paths).toEqual([
        ['root', 'A'],
        ['root', 'B'],
      ])
    })

    it('树层级有多级', () => {
      const paths = treePathAnalyze(complexTree)

      expect(paths).toHaveLength(5) // A1, A2a, A2b, B, C1a1
      expect(paths).toEqual([
        ['root', 'A', 'A1'],
        ['root', 'A', 'A2', 'A2a'],
        ['root', 'A', 'A2', 'A2b'],
        ['root', 'B'],
        ['root', 'C', 'C1', 'C1a', 'C1a1'],
      ])
    })

    it('树只有单个节点', () => {
      const paths = treePathAnalyze(singleNodeTree)

      expect(paths).toHaveLength(1)
      expect(paths[0]).toEqual(['alone'])
    })

    it('自定义字段名', () => {
      const paths = treePathAnalyze(customTree, {
        keyField: 'name',
        childrenField: 'items',
      })

      expect(paths).toEqual([
        ['root', 'A', 'A1'],
        ['root', 'B'],
      ])
    })
  })

  describe('treePathAnalyze 边缘情况', () => {
    it('字树节点为空的情况', () => {
      const treeWithEmptyChildren = {
        id: 'root',
        children: [],
      }

      const paths = treePathAnalyze(treeWithEmptyChildren)
      expect(paths).toHaveLength(1)
      expect(paths[0]).toEqual(['root'])
    })

    it('如果key对应的无值', () => {
      const treeWithoutData = {
        value: 'root',
        children: [{ value: 'child' }],
      }

      const paths = treePathAnalyze(treeWithoutData)
      expect(paths).toEqual([])
    })

    it('如果key对应的值为null', () => {
      const treeWithNullData = {
        id: null,
        children: [{ id: 'child' }],
      }

      const paths = treePathAnalyze(treeWithNullData)
      expect(paths).toEqual([]) // 根节点key为null，整个树被跳过
    })
    it('传入非对象', () => {
      const path1 = treePathAnalyze([] as any)
      const path2 = treePathAnalyze(null as any)
      expect(path1).toEqual([])
      expect(path2).toEqual([])
    })
  })
})
