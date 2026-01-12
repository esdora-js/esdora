import { describe, expect, it } from 'vitest'
import { stringify, stringifySearch } from '.'

describe('stringifySearch', () => {
  it('应该将对象转换为查询字符串', () => {
    const result = stringifySearch({ foo: 'bar', baz: 'qux' })
    expect(result).toBe('foo=bar&baz=qux')
  })

  it('应该处理空对象', () => {
    const result = stringifySearch({})
    expect(result).toBe('')
  })

  it('应该处理数值', () => {
    const result = stringifySearch({ id: 123, count: 456 })
    expect(result).toBe('id=123&count=456')
  })

  it('应该使用默认格式处理数组值', () => {
    const result = stringifySearch({ ids: [1, 2, 3] })
    expect(result).toBe('ids%5B0%5D=1&ids%5B1%5D=2&ids%5B2%5D=3')
  })

  it('应该遵守 arrayFormat 选项', () => {
    const result = stringifySearch({ ids: [1, 2, 3] }, { arrayFormat: 'brackets' })
    expect(result).toBe('ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3')
  })

  it('应该处理 encode 选项', () => {
    const result = stringifySearch({ name: 'John Doe' }, { encode: false })
    expect(result).toBe('name=John Doe')
  })
})

describe('stringify（重新导出）', () => {
  it('应该直接将对象字符串化', () => {
    const result = stringify({ foo: 'bar', baz: 'qux' })
    expect(result).toBe('foo=bar&baz=qux')
  })

  it('应该处理空对象', () => {
    const result = stringify({})
    expect(result).toBe('')
  })
})
