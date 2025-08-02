import { describe, expect, it } from 'vitest'
import { isAlpha } from '.'

describe('is-alpha', () => {
  it('仅包含字母', () => {
    expect(isAlpha('abc')).toBe(true)
  })
  it('仅包含数字', () => {
    expect(isAlpha('123')).toBe(false)
  })
  it('包含字母和数字', () => {
    expect(isAlpha('123a')).toBe(false)
  })
  it('包含特殊符号', () => {
    expect(isAlpha('123a@')).toBe(false)
  })
})
