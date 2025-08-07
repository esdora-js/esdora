import { describe, expect, it } from 'vitest'
import { checkCircularReference } from './index'

describe('checkCircularReference 循环引用检测函数', () => {
  describe('基础类型测试', () => {
    it('应该对 null 返回 false', () => {
      expect(checkCircularReference(null)).toBe(false)
    })

    it('应该对 undefined 返回 false', () => {
      expect(checkCircularReference(undefined)).toBe(false)
    })

    it('应该对字符串返回 false', () => {
      expect(checkCircularReference('hello')).toBe(false)
    })

    it('应该对数字返回 false', () => {
      expect(checkCircularReference(42)).toBe(false)
    })

    it('应该对布尔值返回 false', () => {
      expect(checkCircularReference(true)).toBe(false)
      expect(checkCircularReference(false)).toBe(false)
    })

    it('应该对 Symbol 返回 false', () => {
      expect(checkCircularReference(Symbol('test'))).toBe(false)
    })

    it('应该对 BigInt 返回 false', () => {
      expect(checkCircularReference(BigInt(123))).toBe(false)
    })
  })

  describe('无循环引用的对象测试', () => {
    it('应该对空对象返回 false', () => {
      expect(checkCircularReference({})).toBe(false)
    })

    it('应该对空数组返回 false', () => {
      expect(checkCircularReference([])).toBe(false)
    })

    it('应该对简单对象返回 false', () => {
      const obj = { a: 1, b: 'hello', c: true }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该对嵌套对象（无循环）返回 false', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该对包含数组的对象返回 false', () => {
      const obj = {
        a: [1, 2, 3],
        b: {
          c: [4, 5, { d: 6 }],
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该对包含基础类型属性的复杂对象返回 false', () => {
      const obj = {
        str: 'hello',
        num: 42,
        bool: true,
        nullVal: null,
        undefinedVal: undefined,
        nested: {
          arr: [1, 'two', { three: 3 }],
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })
  })

  describe('循环引用检测测试', () => {
    it('应该检测到直接的自引用', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      expect(checkCircularReference(obj)).toBe(true)
    })

    it('应该检测到深层的循环引用', () => {
      const obj: any = {
        a: {
          b: {
            c: {},
          },
        },
      }
      obj.a.b.c.ref = obj
      expect(checkCircularReference(obj)).toBe(true)
    })

    it('应该检测到数组中的循环引用', () => {
      const arr: any = [1, 2, {}]
      arr[2].ref = arr
      expect(checkCircularReference(arr)).toBe(true)
    })

    it('应该检测到复杂的循环引用', () => {
      const obj1: any = { name: 'obj1' }
      const obj2: any = { name: 'obj2' }
      obj1.ref = obj2
      obj2.ref = obj1
      expect(checkCircularReference(obj1)).toBe(true)
    })

    it('应该检测到多层嵌套中的循环引用', () => {
      const obj: any = {
        level1: {
          level2: {
            level3: {
              level4: {},
            },
          },
        },
      }
      obj.level1.level2.level3.level4.back = obj.level1
      expect(checkCircularReference(obj)).toBe(true)
    })
  })

  describe('getPath 选项测试', () => {
    it('基础类型使用 getPath 选项应该返回 null', () => {
      expect(checkCircularReference(null, { getPath: true })).toBeNull()
      expect(checkCircularReference('hello', { getPath: true })).toBeNull()
      expect(checkCircularReference(42, { getPath: true })).toBeNull()
    })

    it('无循环引用的对象使用 getPath 选项应该返回 null', () => {
      const obj = { a: 1, b: { c: 2 } }
      expect(checkCircularReference(obj, { getPath: true })).toBeNull()
    })

    it('应该返回直接自引用的路径', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['self', '[Circular Reference -> \'root\']'])
    })

    it('应该返回深层循环引用的路径', () => {
      const obj: any = {
        a: {
          b: {
            c: {},
          },
        },
      }
      obj.a.b.c.ref = obj
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['a', 'b', 'c', 'ref', '[Circular Reference -> \'root\']'])
    })

    it('应该返回复杂循环引用的路径', () => {
      const obj: any = {
        level1: {
          level2: {},
        },
      }
      obj.level1.level2.back = obj.level1
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['level1', 'level2', 'back', '[Circular Reference -> \'level1\']'])
    })

    it('应该返回数组中循环引用的路径', () => {
      const arr: any = [1, { nested: {} }]
      arr[1].nested.ref = arr
      const path = checkCircularReference(arr, { getPath: true })
      expect(path).toEqual(['1', 'nested', 'ref', '[Circular Reference -> \'root\']'])
    })
  })

  describe('getPath: false 选项测试', () => {
    it('显式设置 getPath: false 应该返回布尔值', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      expect(checkCircularReference(obj, { getPath: false })).toBe(true)
    })

    it('无循环引用时 getPath: false 应该返回 false', () => {
      const obj = { a: 1, b: { c: 2 } }
      expect(checkCircularReference(obj, { getPath: false })).toBe(false)
    })
  })

  describe('边界情况测试', () => {
    it('应该处理包含基础类型属性的循环引用对象', () => {
      const obj: any = {
        str: 'hello',
        num: 42,
        bool: true,
        nullVal: null,
        nested: {
          arr: [1, 2, 3],
        },
      }
      obj.nested.circular = obj
      expect(checkCircularReference(obj)).toBe(true)

      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['nested', 'circular', '[Circular Reference -> \'root\']'])
    })

    it('应该处理多个可能的循环路径（返回第一个找到的）', () => {
      const obj: any = {
        path1: {},
        path2: {},
      }
      obj.path1.ref = obj
      obj.path2.ref = obj

      expect(checkCircularReference(obj)).toBe(true)
      const path = checkCircularReference(obj, { getPath: true })
      // 应该返回第一个找到的路径（Object.entries 的顺序）
      expect(path).toBeDefined()
      expect(Array.isArray(path)).toBe(true)
    })

    it('应该处理深度嵌套且包含多种数据类型的对象', () => {
      const obj: any = {
        a: 1,
        b: 'string',
        c: [1, 2, { d: null }],
        e: {
          f: {
            g: {
              h: undefined,
              i: true,
            },
          },
        },
      }
      obj.e.f.g.circular = obj.e

      expect(checkCircularReference(obj)).toBe(true)
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['e', 'f', 'g', 'circular', '[Circular Reference -> \'e\']'])
    })

    it('应该正确处理空对象作为属性值', () => {
      const obj: any = {
        empty1: {},
        empty2: {},
        nested: {
          empty3: {},
        },
      }
      obj.nested.empty3.ref = obj

      expect(checkCircularReference(obj)).toBe(true)
    })

    it('应该处理递归中遇到基础类型的情况', () => {
      const obj: any = {
        a: {
          b: 'string', // 基础类型
          c: 42, // 基础类型
          d: null, // null
          e: undefined, // undefined
        },
      }
      obj.a.circular = obj

      expect(checkCircularReference(obj)).toBe(true)
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['a', 'circular', '[Circular Reference -> \'root\']'])
    })

    it('应该测试 _findPath 中的 visited.delete 逻辑', () => {
      // 创建一个不会产生循环引用的深层对象，确保 visited.delete 被调用
      const obj = {
        a: {
          b: {
            c: {
              d: 'end',
            },
          },
        },
        x: {
          y: {
            z: 'another end',
          },
        },
      }

      expect(checkCircularReference(obj)).toBe(false)
      expect(checkCircularReference(obj, { getPath: true })).toBeNull()
    })

    it('应该测试 options 参数为 undefined 的情况', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      // 不传递 options 参数
      expect(checkCircularReference(obj)).toBe(true)

      // 传递 undefined
      expect(checkCircularReference(obj, undefined)).toBe(true)
    })

    it('应该测试 options.getPath 为 undefined 的情况', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      // getPath 为 undefined，应该默认为 false
      expect(checkCircularReference(obj, { getPath: undefined as any })).toBe(true)
    })

    it('应该测试函数重载的类型安全性', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      // 测试不同的重载签名
      const result1: boolean = checkCircularReference(obj)
      const result2: boolean = checkCircularReference(obj, { getPath: false })
      const result3: string[] | null = checkCircularReference(obj, { getPath: true })

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toEqual(['self', '[Circular Reference -> \'root\']'])
    })
  })

  describe('性能和内存测试', () => {
    it('应该能处理大型对象而不出现性能问题', () => {
      const obj: any = {}
      let current = obj

      // 创建一个深度为100的嵌套对象
      for (let i = 0; i < 100; i++) {
        current.next = { level: i }
        current = current.next
      }

      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该能处理包含大量属性的对象', () => {
      const obj: any = {}

      // 创建一个有100个属性的对象
      for (let i = 0; i < 100; i++) {
        obj[`prop${i}`] = { value: i }
      }

      expect(checkCircularReference(obj)).toBe(false)

      // 添加循环引用
      obj.prop50.circular = obj
      expect(checkCircularReference(obj)).toBe(true)
    })
  })

  describe('特殊对象类型测试', () => {
    it('应该处理 Date 对象', () => {
      const obj = {
        date: new Date(),
        nested: {
          anotherDate: new Date(),
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该处理 RegExp 对象', () => {
      const obj = {
        regex: /test/g,
        nested: {
          anotherRegex: /hello/i,
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该处理函数对象', () => {
      const obj = {
        func() { return 'test' },
        nested: {
          arrow: () => 'arrow',
        },
      }
      expect(checkCircularReference(obj)).toBe(false)
    })

    it('应该处理包含循环引用的特殊对象', () => {
      const obj: any = {
        date: new Date(),
        regex: /test/,
        func: () => 'test',
      }
      obj.circular = obj

      expect(checkCircularReference(obj)).toBe(true)
      const path = checkCircularReference(obj, { getPath: true })
      expect(path).toEqual(['circular', '[Circular Reference -> \'root\']'])
    })
  })
})
