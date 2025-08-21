import { describe, expect, it } from 'vitest'
import { treeSome } from './index'

// 测试数据
const simpleTree = [
  { id: 1, value: 'a', children: [{ id: 2, value: 'b' }, { id: 3, value: 'c' }] },
  { id: 4, value: 'd' },
]

const complexTree = [
  {
    id: 1,
    value: 'root1',
    children: [
      {
        id: 2,
        value: 'child1',
        children: [
          { id: 5, value: 'grandchild1' },
          { id: 6, value: 'grandchild2' },
        ],
      },
      { id: 3, value: 'child2' },
    ],
  },
  {
    id: 4,
    value: 'root2',
    children: [
      { id: 7, value: 'child3' },
    ],
  },
]

const treeWithCustomChildren = [
  {
    id: 1,
    name: 'root',
    items: [
      { id: 2, name: 'child1' },
      { id: 3, name: 'child2', items: [{ id: 4, name: 'grandchild' }] },
    ],
  },
]

const nullTree = [
  null,
  undefined,
  { id: 1, children: [null, { id: 2 }] },
] as any[]

describe('treeSome', () => {
  describe('基本功能', () => {
    it('应该在找到满足条件的节点时返回 true', () => {
      const result = treeSome(simpleTree, node => node.id === 2)
      expect(result).toBe(true)
    })

    it('应该在没有找到满足条件的节点时返回 false', () => {
      const result = treeSome(simpleTree, node => node.id === 999)
      expect(result).toBe(false)
    })

    it('应该在根节点满足条件时返回 true', () => {
      const result = treeSome(simpleTree, node => node.id === 1)
      expect(result).toBe(true)
    })

    it('应该在叶子节点满足条件时返回 true', () => {
      const result = treeSome(simpleTree, node => node.value === 'b')
      expect(result).toBe(true)
    })
    it('广度优先搜索（BFS）时应跳过所有假值项', () => {
      // 构造 childrenKey 下有 falsy 节点
      // 检查 id === 2 是否能被找到
      const result = treeSome(nullTree, node => node && node.id === 2, { mode: 'bfs' })
      expect(result).toBe(true)
    })
  })

  describe('遍历模式', () => {
    describe('深度优先前序遍历 (默认)', () => {
      it('应该使用默认的深度优先前序遍历', () => {
        const visitOrder: number[] = []
        treeSome(complexTree, (node) => {
          visitOrder.push(node.id)
          return node.id === 6 // 找到 grandchild2 时停止
        })

        // 前序遍历：根 -> 左子树 -> 右子树
        expect(visitOrder).toEqual([1, 2, 5, 6])
      })

      it('应该明确指定深度优先前序遍历', () => {
        const visitOrder: number[] = []
        treeSome(complexTree, (node) => {
          visitOrder.push(node.id)
          return node.id === 3
        }, { mode: 'dfs', order: 'pre' })

        expect(visitOrder).toEqual([1, 2, 5, 6, 3])
      })
    })

    describe('深度优先后序遍历', () => {
      it('应该进行深度优先后序遍历', () => {
        const visitOrder: number[] = []
        treeSome(complexTree, (node) => {
          visitOrder.push(node.id)
          return node.id === 2 // 在 child1 处停止
        }, { mode: 'dfs', order: 'post' })

        // 后序遍历：左子树 -> 右子树 -> 根
        expect(visitOrder).toEqual([5, 6, 2])
      })

      it('后序遍历中应该先检查子节点再检查父节点', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2 },
            ],
          },
        ]

        const visitOrder: number[] = []
        const result = treeSome(tree, (node) => {
          visitOrder.push(node.id)
          return node.id === 1
        }, { order: 'post' })

        expect(result).toBe(true)
        expect(visitOrder).toEqual([2, 1]) // 子节点先访问
      })
    })

    describe('广度优先遍历', () => {
      it('应该进行广度优先遍历', () => {
        const visitOrder: number[] = []
        treeSome(complexTree, (node) => {
          visitOrder.push(node.id)
          return node.id === 5 // 在 grandchild1 处停止
        }, { mode: 'bfs' })

        // 广度优先：按层级遍历
        expect(visitOrder).toEqual([1, 4, 2, 3, 7, 5])
      })

      it('广度优先遍历应该逐层访问节点', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2, children: [{ id: 5 }] },
              { id: 3, children: [{ id: 6 }] },
            ],
          },
          {
            id: 4,
            children: [{ id: 7 }],
          },
        ]

        const visitOrder: number[] = []
        treeSome(tree, (node) => {
          visitOrder.push(node.id)
          return false // 遍历所有节点
        }, { mode: 'bfs' })

        expect(visitOrder).toEqual([1, 4, 2, 3, 7, 5, 6])
      })
    })
  })

  describe('自定义子节点键名', () => {
    it('应该支持自定义子节点键名', () => {
      const result = treeSome(treeWithCustomChildren, node => node.id === 4, {
        childrenKey: 'items',
      })
      expect(result).toBe(true)
    })

    it('应该在使用自定义键名时正确遍历', () => {
      const visitOrder: number[] = []
      treeSome(treeWithCustomChildren, (node) => {
        visitOrder.push(node.id)
        return false
      }, { childrenKey: 'items' })

      expect(visitOrder).toEqual([1, 2, 3, 4])
    })
  })

  describe('边界情况', () => {
    it('应该处理空数组', () => {
      const result = treeSome([], _node => true)
      expect(result).toBe(false)
    })

    it('应该处理没有子节点的树', () => {
      const flatTree = [{ id: 1 }, { id: 2 }]
      const result = treeSome(flatTree, node => node.id === 2)
      expect(result).toBe(true)
    })

    it('应该处理子节点为空数组的情况', () => {
      const treeWithEmptyChildren = [
        { id: 1, children: [] },
        { id: 2 },
      ]
      const result = treeSome(treeWithEmptyChildren, node => node.id === 2)
      expect(result).toBe(true)
    })

    it('应该处理子节点为 null 的情况', () => {
      const treeWithNullChildren = [
        { id: 1, children: null },
        { id: 2 },
      ]
      const result = treeSome(treeWithNullChildren, node => node.id === 2)
      expect(result).toBe(true)
    })

    it('应该处理子节点为 undefined 的情况', () => {
      const treeWithUndefinedChildren = [
        { id: 1, children: undefined },
        { id: 2 },
      ]
      const result = treeSome(treeWithUndefinedChildren, node => node.id === 2)
      expect(result).toBe(true)
    })

    it('应该处理深层嵌套的树结构', () => {
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

      const result = treeSome(deepTree, node => node.id === 4)
      expect(result).toBe(true)
    })
  })

  describe('性能优化', () => {
    it('应该在找到第一个满足条件的节点时立即停止', () => {
      let callCount = 0
      const result = treeSome(complexTree, (node) => {
        callCount++
        return node.id === 2 // 第二个访问的节点
      })

      expect(result).toBe(true)
      expect(callCount).toBe(2) // 只调用了两次
    })

    it('广度优先搜索应该在找到节点时立即停止', () => {
      let callCount = 0
      treeSome(complexTree, (node) => {
        callCount++
        return node.id === 4 // 第二个根节点
      }, { mode: 'bfs' })

      expect(callCount).toBe(2) // 访问 id=1 和 id=4 后停止
    })
  })

  describe('错误处理', () => {
    it('应该在第一个参数不是数组时抛出 TypeError', () => {
      expect(() => {
        // @ts-expect-error 故意传入非数组类型用于测试
        treeSome(null, () => true)
      }).toThrow(TypeError)

      expect(() => {
        // @ts-expect-error 故意传入非数组类型用于测试
        treeSome({}, () => true)
      }).toThrow(TypeError)

      expect(() => {
        // @ts-expect-error 故意传入非数组类型用于测试
        treeSome('string', () => true)
      }).toThrow(TypeError)
    })

    it('应该在子节点不是数组时抛出错误', () => {
      const invalidTree = [
        { id: 1, children: 'invalid' },
      ]

      expect(() => {
        treeSome(invalidTree, () => false)
      }).toThrow()
    })

    it('应该在使用自定义键名且值不是数组时抛出错误', () => {
      const invalidTree = [
        { id: 1, items: 'invalid' },
      ]

      expect(() => {
        treeSome(invalidTree, () => false, { childrenKey: 'items' })
      }).toThrow()
    })
  })

  describe('复杂场景', () => {
    it('应该正确处理复合条件检测', () => {
      const result = treeSome(complexTree, node =>
        node.value?.includes('child') && node.id > 2)
      expect(result).toBe(true) // child2 (id=3) 或 child3 (id=7)
    })

    it('应该处理节点值为各种类型的情况', () => {
      const mixedTree = [
        { id: 1, value: 'string', children: [{ id: 2, value: 42 }] },
        { id: 3, value: true },
        { id: 4, value: null },
      ]

      const hasNumber = treeSome(mixedTree, node => typeof node.value === 'number')
      const hasBoolean = treeSome(mixedTree, node => typeof node.value === 'boolean')
      const hasNull = treeSome(mixedTree, node => node.value === null)

      expect(hasNumber).toBe(true)
      expect(hasBoolean).toBe(true)
      expect(hasNull).toBe(true)
    })

    it('应该在不同遍历模式下产生不同的停止点', () => {
      const tree = [
        {
          id: 1,
          children: [
            { id: 2, target: true },
            { id: 3 },
          ],
        },
        { id: 4, target: true },
      ]

      const dfsVisits: number[] = []
      const bfsVisits: number[] = []

      // DFS 前序遍历
      treeSome(tree, (node) => {
        dfsVisits.push(node.id)
        return node.target === true
      }, { mode: 'dfs', order: 'pre' })

      // BFS 遍历
      treeSome(tree, (node) => {
        bfsVisits.push(node.id)
        return node.target === true
      }, { mode: 'bfs' })

      expect(dfsVisits).toEqual([1, 2]) // DFS 先找到 id=2
      expect(bfsVisits).toEqual([1, 4]) // BFS 先找到 id=4
    })
  })
})
describe('分支覆盖', () => {
  it('should skip falsy item in bfs', () => {
    // 构造 childrenKey 下有 falsy 节点
    const tree: any[] = [
      null,
      undefined,
      { id: 1, children: [null, { id: 2 }] },
    ]
    // 检查 id === 2 是否能被找到
    const result = treeSome(tree, node => node && node.id === 2, { mode: 'bfs' })
    expect(result).toBe(true)
  })
})
