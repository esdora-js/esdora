import { describe, expect, it } from 'vitest'
import { isAlnum } from '.'

describe('is-alpha', () => {
  it('仅包含字母', () => {
    expect(isAlnum('abc')).toBe(true)
  })
  it('仅包含数字', () => {
    expect(isAlnum('123')).toBe(true)
  })
  it('包含字母和数字', () => {
    expect(isAlnum('123a')).toBe(true)
  })
  it('包含特殊符号', () => {
    expect(isAlnum('123a@')).toBe(false)
  })
})
