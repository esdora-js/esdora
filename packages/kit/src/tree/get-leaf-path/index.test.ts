import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLeafPath } from '.'

// --- 测试数据 ---
// 简单树
const simpleTree = {
  id: 'root',
  children: [{ id: 'A' }, { id: 'B' }],
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
          children: [{ id: 'A2a' }, { id: 'A2b' }],
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
              children: [{ id: 'C1a1' }],
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

describe('getLeafPath', () => {
  describe('常规功能测试', () => {
    it('应正确处理只有一级的树', () => {
      const paths = getLeafPath(simpleTree)
      expect(paths).toEqual([['root', 'A'], ['root', 'B']])
    })

    it('应正确处理具有多级嵌套的复杂树', () => {
      const paths = getLeafPath(complexTree)
      expect(paths).toHaveLength(5)
      expect(paths).toEqual([
        ['root', 'A', 'A1'],
        ['root', 'A', 'A2', 'A2a'],
        ['root', 'A', 'A2', 'A2b'],
        ['root', 'B'],
        ['root', 'C', 'C1', 'C1a', 'C1a1'],
      ])
    })

    it('应正确处理只有单个节点的树', () => {
      const paths = getLeafPath(singleNodeTree)
      expect(paths).toEqual([['alone']])
    })

    it('应支持自定义 keyField 和 childrenField', () => {
      const paths = getLeafPath(customTree, {
        keyField: 'name',
        childrenField: 'items',
      })
      expect(paths).toEqual([
        ['root', 'A', 'A1'],
        ['root', 'B'],
      ])
    })
  })

  describe('边缘情况与容错性测试', () => {
    it('应将 children 为空数组的节点视为叶子节点', () => {
      const tree = { id: 'root', children: [] }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([['root']])
    })

    it('应将 children 字段为 null 或 undefined 的节点视为叶子节点', () => {
      const treeWithNullChildren = { id: 'root', children: null }
      const treeWithUndefinedChildren = { id: 'root', children: undefined }
      expect(getLeafPath(treeWithNullChildren as any)).toEqual([['root']])
      expect(getLeafPath(treeWithUndefinedChildren)).toEqual([['root']])
    })

    it('应能忽略子节点数组中的无效值 (null, undefined, 非对象)', () => {
      const tree = {
        id: 'root',
        children: [{ id: 'A' }, null, { id: 'B' }, undefined, 'a string', 123],
      }
      const paths = getLeafPath(tree as any)
      expect(paths).toEqual([
        ['root', 'A'],
        ['root', 'B'],
      ])
    })

    it('应跳过中间 key 缺失或为 null/undefined 的节点及其子树', () => {
      const tree = {
        id: 'root',
        children: [
          { /* id missing */ children: [{ id: 'A1' }] },
          { id: null, children: [{ id: 'B1' }] },
          { id: 'C', children: [{ id: 'C1' }] },
        ],
      }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([['root', 'C', 'C1']])
    })

    it('当传入的根节点无效时应返回空数组', () => {
      expect(getLeafPath(null as any)).toEqual([])
      expect(getLeafPath(undefined as any)).toEqual([])
      expect(getLeafPath('a string' as any)).toEqual([])
      expect(getLeafPath(123 as any)).toEqual([])
      expect(getLeafPath([] as any)).toEqual([]) // 数组作为根节点，但没有keyField
    })

    it('应正确处理数字和 0 作为 key', () => {
      const tree = {
        id: 0,
        children: [
          { id: 1 },
          { id: 2, children: [{ id: 20 }] },
        ],
      }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([
        [0, 1],
        [0, 2, 20],
      ])
    })
  })

  describe('复杂引用场景测试', () => {
    it('应正确处理共享节点 (钻石结构)，以验证回溯逻辑', () => {
      const sharedNode = { id: 'C' }
      const tree = {
        id: 'root',
        children: [
          { id: 'A', children: [sharedNode] },
          { id: 'B', children: [sharedNode] },
        ],
      }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([
        ['root', 'A', 'C'],
        ['root', 'B', 'C'],
      ])
    })

    it('应能安全处理循环引用并不产生路径', () => {
      const nodeA = { id: 'A', children: [] as any[] }
      const nodeB = { id: 'B', children: [nodeA] }
      nodeA.children.push(nodeB) // 创建 A -> B -> A 的循环

      const tree = { id: 'root', children: [nodeA] }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([])
    })

    it('应能安全处理节点自我引用', () => {
      const nodeA = { id: 'A', children: [] as any[] }
      nodeA.children.push(nodeA) // 创建 A -> A 的循环

      const tree = { id: 'root', children: [nodeA] }
      const paths = getLeafPath(tree)
      expect(paths).toEqual([])
    })
  })

  describe('开发者警告(devWarn)行为测试', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>

    // 在每个测试用例运行前设置 spy
    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    // 在每个测试用例运行后恢复 console.warn 的原始实现
    afterEach(() => {
      warnSpy.mockRestore()
    })

    // 这个测试用例将 100% 覆盖你缺失的分支！
    it('当子节点数组中包含非对象值时，应发出警告', () => {
      const treeWithInvalidChildren = {
        id: 'root',
        children: [
          'a string' as any, // 触发警告
          123 as any, // 触发警告
        ],
      }

      getLeafPath(treeWithInvalidChildren)

      // 断言 console.warn 被调用了两次
      expect(warnSpy).toHaveBeenCalledTimes(2)

      // 还可以精确断言警告的内容
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('在 "children" 数组中发现无效的子节点'),
        expect.anything(), // "无效子节点:"
        'a string',
        expect.anything(), // "父节点:"
        expect.any(Object),
      )
    })

    it('当节点缺少 keyField 时应发出警告', () => {
      const tree = { id: 'root', children: [{ name: 'no-id' }] }
      getLeafPath(tree)
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[@esdora/kit] 节点缺少有效的标识符 (key: "id")'),
        expect.stringContaining('问题节点:'),
        expect.objectContaining({ name: 'no-id' }),
      )
    })

    it('当检测到循环引用时应发出警告', () => {
      const nodeA = { id: 'A', children: [] as any[] }
      nodeA.children.push(nodeA)
      const tree = { id: 'root', children: [nodeA] }

      getLeafPath(tree)
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[@esdora/kit] 检测到循环引用'),
        expect.stringContaining('路径:'),
        expect.stringContaining('循环节点:'),
        expect.objectContaining({ id: 'A' }),
      )
    })

    it('当根节点无效时应发出警告', () => {
      getLeafPath(null as any)
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[@esdora/kit] 无效的根节点'),
        null,
      )
    })
  })
})
