import { describe, expect, it, vi } from 'vitest'
import { createSafe } from './create-safe'

describe('createSafe function', () => {
  const errorHandler = vi.fn()
  const safe = createSafe(errorHandler)

  it('传入一个正确的方法', () => {
    const fn = (a: number, b: number) => a + b
    const safeFn = safe(fn)
    expect(safeFn(1, 2)).toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个抛出错误的方法', () => {
    const fnError = (a: number, b: number) => {
      if (a < 0 || b < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b
    }
    const safeFn = safe(fnError)
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(-1, 2)).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('传入一个抛出非 Error 的异常的方法', () => {
    const fnThrow = (a: number, b: number) => {
      if (a < 0 || b < 0) {
        // 这里故意抛出一个非 Error 的异常
        // eslint-disable-next-line no-throw-literal
        throw 'Negative numbers are not allowed'
      }
      return a + b
    }
    const safeFn = safe(fnThrow)
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(-1, 2)).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith('Negative numbers are not allowed')
  })

  it('再次设置 errorHandler', () => {
    const newErrorHandler = vi.fn((_, handler) => {
      expect(handler).toBeInstanceOf(Function)
      expect(handler).toBe(errorHandler)
    })
    const fnThrow = (a: number, b: number) => {
      if (a < 0 || b < 0) {
        // 这里故意抛出一个非 Error 的异常
        // eslint-disable-next-line no-throw-literal
        throw 'Negative numbers are not allowed'
      }
      return a + b
    }
    const safeFn = safe(fnThrow, newErrorHandler)

    expect(safeFn(1, 2)).toBe(3)
    expect(newErrorHandler).not.toHaveBeenCalled()
  })
})
