import { describe, expect, it } from 'vitest'
import { isDigit } from '.'

describe('is-digit', () => {
  it('仅包含数字', () => {
    expect(isDigit('123')).toBe(true)
  })
  it('仅包含字母', () => {
    expect(isDigit('123a')).toBe(false)
  })
  it('包含字母和数字', () => {
    expect(isDigit('123a')).toBe(false)
  })
  it('包含特殊符号', () => {
    expect(isDigit('123a@')).toBe(false)
  })
})
