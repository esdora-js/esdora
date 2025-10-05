import { describe, expect, it } from 'vitest'
import { getQueryParams } from './index'

describe('getQueryParams', () => {
  it('当传入一个包含查询参数的自定义协议 URL 时, 必须正确返回参数对象', () => {
    const input = 'weixin://dl/business/?appid=abc&path=pages/articles/detail&query=url%3Dhttps%3A%2F%2Fbaidu.com'
    const expected = { appid: 'abc', path: 'pages/articles/detail', query: 'url=https://baidu.com' }
    expect(getQueryParams(input)).toEqual(expected)
  })

  it('当传入一个包含查询参数的标准 HTTP URL 时, 必须正确返回参数对象', () => {
    const input = 'https://esdora.dev/path?user=test&id=123'
    const expected = { user: 'test', id: '123' }
    expect(getQueryParams(input)).toEqual(expected)
  })

  it('当传入的 URL 包含 URL 编码的字符时, 必须自动解码并返回正确的对象', () => {
    const input = 'https://example.com?data=%7B%22key%22%3A%22value%22%7D'
    const expected = { data: '{"key":"value"}' }
    expect(getQueryParams(input)).toEqual(expected)
  })

  it('当传入一个没有查询参数的有效 URL 时, 必须返回一个空对象', () => {
    const input = 'https://example.com/some/path'
    const expected = {}
    expect(getQueryParams(input)).toEqual(expected)
  })

  // --- 测试无效的用户输入 (返回 null) ---

  it('当传入一个完全无效的 URL 字符串时, 必须返回 null', () => {
    const input = 'I am not a URL'
    expect(getQueryParams(input)).toBeNull()
  })

  it('当传入一个空字符串时, 必须返回 null', () => {
    const input = ''
    expect(getQueryParams(input)).toBeNull()
  })

  it('当传入 null 时, 必须返回 null', () => {
    const input = null
    expect(getQueryParams(input as any)).toBeNull()
  })

  it('当传入 undefined 时, 必须返回 null', () => {
    const input = undefined
    expect(getQueryParams(input as any)).toBeNull()
  })

  it('当传入数字时, 必须返回 null', () => {
    const input = 12345
    expect(getQueryParams(input as any)).toBeNull()
  })

  it('当传入普通对象时, 必须返回 null', () => {
    const input = { url: 'https://example.com' }
    expect(getQueryParams(input as any)).toBeNull()
  })

  it('当 URL 字符串包含一个 null 字符 (\\0) 时, 必须返回 null', () => {
    const input = 'https://example.com\0/path'
    // 这个输入会导致 new URL() 构造函数直接抛出 TypeError
    // 我们的 catch 块会捕获它，并返回 null
    expect(getQueryParams(input)).toBeNull()
  })
})
