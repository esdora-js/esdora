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

  it('性能测试：1000 层深度的树', () => {
    // 构造 1000 层深度的树，每层 1 个节点
    let node: any = { id: 0 }
    for (let i = 1; i <= 1000; i++) {
      node = { id: i, children: [node] }
    }
    const start = Date.now()
    const fn = (item: any) => ({ ...item })
    const result = treeMap([node], fn)
    const duration = Date.now() - start
    // 可以断言必须在 100ms 内完成等
    expect(result[0].id).toBe(1000)
    expect(duration).toBeLessThan(100)
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
})
