import { describe, expect, it } from 'vitest'
import { validateChildrenProperty } from './index'

describe('validateChildrenProperty', () => {
  it('当子节点属性是有效数组时不应抛出异常', () => {
    const node = { id: 1, children: [{ id: 2 }, { id: 3 }] }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('当子节点属性是空数组时不应抛出异常', () => {
    const node = { id: 1, children: [] }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('当子节点属性为 undefined 时不应抛出异常', () => {
    const node = { id: 1, children: undefined }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('当子节点属性为 null 时不应抛出异常', () => {
    const node = { id: 1, children: null }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('当子节点属性不存在时不应抛出异常', () => {
    const node = { id: 1 }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('当子节点属性是字符串时应抛出 TypeError', () => {
    const node = { id: 1, children: 'invalid' }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/Expected 'children' to be an array/)
  })

  it('当子节点属性是数字时应抛出 TypeError', () => {
    const node = { id: 1, children: 123 }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/Expected 'children' to be an array/)
  })

  it('当子节点属性是对象时应抛出 TypeError', () => {
    const node = { id: 1, children: { invalid: true } }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/Expected 'children' to be an array/)
  })

  it('当子节点属性是布尔值时应抛出 TypeError', () => {
    const node = { id: 1, children: false }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/Expected 'children' to be an array/)
  })

  it('应支持自定义子节点属性名', () => {
    const node = { id: 1, items: [{ id: 2 }] }

    expect(() => {
      validateChildrenProperty(node, 'items')
    }).not.toThrow()
  })

  it('当自定义子节点属性名无效时应抛出异常', () => {
    const node = { id: 1, items: 'invalid' }

    expect(() => {
      validateChildrenProperty(node, 'items')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'items')
    }).toThrow(/Expected 'items' to be an array/)
  })

  it('应支持不同的对象类型', () => {
    interface CustomNode {
      name: string
      children?: CustomNode[]
    }

    const node: CustomNode = {
      name: 'root',
      children: [{ name: 'child1' }, { name: 'child2' }],
    }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('应处理嵌套数组结构', () => {
    const node = {
      id: 1,
      children: [
        { id: 2, children: [{ id: 4 }] },
        { id: 3, children: [] },
      ],
    }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).not.toThrow()
  })

  it('错误信息应包含节点的 name（当没有 id 时）', () => {
    const node = { name: 'test-node', children: 'invalid' }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/node with name: test-node/)
  })

  it('错误信息应该不包含节点信息（当既没有 id 也没有 name 时）', () => {
    const node = { someOtherProp: 'value', children: 'invalid' }

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(TypeError)

    expect(() => {
      validateChildrenProperty(node, 'children')
    }).toThrow(/Expected 'children' to be an array, but got string/)
  })
})
