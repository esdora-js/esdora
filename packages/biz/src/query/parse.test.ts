import { describe, expect, it } from 'vitest'
// 从主入口导入以测试 src/index.ts 的导出
import * as mainExports from '../'
import { mergeQueryParams, parse, parseSearch } from './'

describe('主入口导出', () => {
  it('应该从主入口导出所有查询工具', () => {
    expect(mainExports.parse).toBeDefined()
    expect(mainExports.stringify).toBeDefined()
    expect(mainExports.parseSearch).toBeDefined()
    expect(mainExports.stringifySearch).toBeDefined()
    expect(mainExports.mergeQueryParams).toBeDefined()
  })

  it('从主入口导入时应该正常工作', () => {
    const result = mainExports.parseSearch('https://example.com?foo=bar')
    expect(result).toEqual({ foo: 'bar' })
  })
})

describe('parseSearch', () => {
  it('应该正确从 URL 中提取并解析查询参数', () => {
    const result = parseSearch('https://example.com?foo=bar&baz=qux')
    expect(result).toEqual({ foo: 'bar', baz: 'qux' })
  })

  it('应该处理没有查询参数的 URL', () => {
    const result = parseSearch('https://example.com')
    expect(result).toEqual({})
  })

  it('应该处理带空查询字符串的 URL', () => {
    const result = parseSearch('https://example.com?')
    expect(result).toEqual({})
  })

  it('应该解析带特殊字符的查询参数', () => {
    const result = parseSearch('/path?name=John%20Doe&email=test%40example.com')
    expect(result).toEqual({ name: 'John Doe', email: 'test@example.com' })
  })

  it('应该解析查询参数中的嵌套对象', () => {
    const result = parseSearch('/path?user[name]=John&user[age]=30')
    expect(result).toEqual({ user: { name: 'John', age: '30' } })
  })
})

describe('mergeQueryParams', () => {
  it('应该将参数合并到现有 URL', () => {
    const result = mergeQueryParams('https://example.com?foo=bar', { baz: 'qux' })
    expect(result).toBe('https://example.com?foo=bar&baz=qux')
  })

  it('默认应该覆盖现有参数', () => {
    const result = mergeQueryParams('/path?id=1', { id: 2, name: 'test' })
    expect(result).toBe('/path?id=2&name=test')
  })

  it('当 override=false 时应该保留现有参数', () => {
    const result = mergeQueryParams('/path?id=1', { id: 2, name: 'test' }, { override: false })
    expect(result).toBe('/path?id=1&name=test')
  })

  it('应该处理没有现有查询参数的 URL', () => {
    const result = mergeQueryParams('https://example.com', { foo: 'bar' })
    expect(result).toBe('https://example.com?foo=bar')
  })

  it('应该处理空参数对象', () => {
    const result = mergeQueryParams('https://example.com?foo=bar', {})
    expect(result).toBe('https://example.com?foo=bar')
  })

  it('应该遵守 encode 选项', () => {
    const result = mergeQueryParams('/path', { name: 'John Doe' }, { encode: false })
    expect(result).toBe('/path?name=John Doe')
  })

  it('应该处理复杂的合并场景', () => {
    const result = mergeQueryParams(
      '/path?id=1&status=active',
      { id: 2, page: 1 },
      { override: true },
    )
    expect(result).toBe('/path?id=2&status=active&page=1')
  })

  it('当不存在参数且提供空参数时应该返回不带查询字符串的 URL', () => {
    const result = mergeQueryParams('https://example.com', {})
    expect(result).toBe('https://example.com')
  })
})

describe('parse（重新导出）', () => {
  it('应该直接解析查询字符串', () => {
    const result = parse('foo=bar&baz=qux')
    expect(result).toEqual({ foo: 'bar', baz: 'qux' })
  })

  it('应该处理空字符串', () => {
    const result = parse('')
    expect(result).toEqual({})
  })
})
