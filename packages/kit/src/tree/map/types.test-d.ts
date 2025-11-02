import type { TreeMapContext } from './types'
import { describe, expectTypeOf, it } from 'vitest'
import { treeMap } from './index'

describe('treeMap 类型推断测试', () => {
  interface Node {
    id: number
    children?: Node[]
  }

  it('默认 context 只有基础字段', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx).toHaveProperty('originalChildren')
        expectTypeOf(ctx).toHaveProperty('childrenKey')

        // @ts-expect-error - depth 不存在
        expectTypeOf(ctx).not.toHaveProperty('depth')
        // @ts-expect-error - index 不存在
        expectTypeOf(ctx).not.toHaveProperty('index')
        // @ts-expect-error - parent 不存在
        expectTypeOf(ctx).not.toHaveProperty('parent')
      }
      return item
    })
  })

  it('启用 depth 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.depth).toEqualTypeOf<number>()
      }
      return item
    }, {
      context: { depth: true },
    })
  })

  it('启用 index 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.index).toEqualTypeOf<number>()
      }
      return item
    }, {
      context: { index: true },
    })
  })

  it('启用 parent 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.parent).toEqualTypeOf<Node | undefined>()
      }
      return item
    }, {
      context: { parent: true },
    })
  })

  it('启用 path 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.path).toEqualTypeOf<ReadonlyArray<string | number>>()
      }
      return item
    }, {
      context: { path: true },
    })
  })

  it('启用 isLeaf 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.isLeaf).toEqualTypeOf<boolean>()
      }
      return item
    }, {
      context: { isLeaf: true },
    })
  })

  it('启用 isRoot 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.isRoot).toEqualTypeOf<boolean>()
      }
      return item
    }, {
      context: { isRoot: true },
    })
  })

  it('启用 processedChildren 后可以访问', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.processedChildren).toEqualTypeOf<Node[] | undefined>()
      }
      return item
    }, {
      order: 'post',
      context: { processedChildren: true },
    })
  })

  it('多个字段同时启用', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.depth).toEqualTypeOf<number>()
        expectTypeOf(ctx.index).toEqualTypeOf<number>()
        expectTypeOf(ctx.parent).toEqualTypeOf<Node | undefined>()
        expectTypeOf(ctx.isLeaf).toEqualTypeOf<boolean>()
      }
      return item
    }, {
      context: {
        depth: true,
        index: true,
        parent: true,
        isLeaf: true,
      },
    })
  })

  it('向后兼容：不使用 context 参数', () => {
    const tree: Node[] = [{ id: 1 }]

    const result = treeMap(tree, (item) => {
      expectTypeOf(item).toEqualTypeOf<Node>()
      return { ...item, id: item.id * 2 }
    })

    expectTypeOf(result).toEqualTypeOf<Array<{ id: number, children?: Node[] }>>()
  })

  it('context 参数是可选的', () => {
    const tree: Node[] = [{ id: 1 }]

    // 不使用 context
    treeMap(tree, item => item)

    // 使用 context
    treeMap(tree, (item, ctx) => {
      expectTypeOf(ctx).toEqualTypeOf<TreeMapContext<Node, Record<string, never>> | undefined>()
      return item
    })
  })

  it('originalChildren 类型正确', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.originalChildren).toEqualTypeOf<Node[] | undefined>()
      }
      return item
    })
  })

  it('childrenKey 类型正确', () => {
    const tree: Node[] = [{ id: 1 }]

    treeMap(tree, (item, ctx) => {
      if (ctx) {
        expectTypeOf(ctx.childrenKey).toEqualTypeOf<string>()
      }
      return item
    })
  })
})
