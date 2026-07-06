import { describe, expect, it } from 'vitest'
import { isExternalLink } from './is-external-link'

describe('isExternalLink (智能模式)', () => {
  it('应识别完整 URL 为外部链接', () => {
    expect(isExternalLink('https://example.com')).toBe(true)
    expect(isExternalLink('http://example.com/path')).toBe(true)
    expect(isExternalLink('https://sub.example.com/path?query=1')).toBe(true)
  })

  it('应识别协议相对 URL 为外部链接', () => {
    expect(isExternalLink('//cdn.example.com/script.js')).toBe(true)
    expect(isExternalLink('//example.com')).toBe(true)
  })

  it('应识别特殊协议为外部链接', () => {
    expect(isExternalLink('mailto:test@example.com')).toBe(true)
    expect(isExternalLink('tel:1234567890')).toBe(true)
    expect(isExternalLink('ftp://files.example.com')).toBe(true)
    expect(isExternalLink('ftps://secure.example.com')).toBe(true)
  })

  it('应识别相对路径为内部链接', () => {
    expect(isExternalLink('/path/to/page')).toBe(false)
    expect(isExternalLink('/about')).toBe(false)
    expect(isExternalLink('#section')).toBe(false)
    expect(isExternalLink('#')).toBe(false)
    expect(isExternalLink('./page.html')).toBe(false)
    expect(isExternalLink('../parent/page')).toBe(false)
    expect(isExternalLink('?query=value')).toBe(false)
  })

  it('应识别危险协议为内部链接（安全考虑）', () => {
    expect(isExternalLink('javascript:void(0)')).toBe(false)
    expect(isExternalLink('javascript:alert(1)')).toBe(false)
    expect(isExternalLink('data:text/plain,Hello')).toBe(false)
    expect(isExternalLink('data:image/png;base64,abc')).toBe(false)
  })

  it('应识别不含协议的字符串为内部链接', () => {
    expect(isExternalLink('page.html')).toBe(false)
    expect(isExternalLink('about.html')).toBe(false)
    expect(isExternalLink('folder/page')).toBe(false)
  })

  it('应正确处理边缘情况', () => {
    expect(isExternalLink('')).toBe(false)
    expect(isExternalLink('   ')).toBe(false)
    expect(isExternalLink('  https://example.com  ')).toBe(true)
    expect(isExternalLink('  /path  ')).toBe(false)
  })
})
