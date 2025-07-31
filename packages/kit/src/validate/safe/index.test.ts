import { describe, expect, it, vi } from 'vitest'
import { _JSON, createSafe, safe } from '.'

describe('safe function', () => {
  const fn = (a: number, b: number) => a + b
  const fnError = (a: number, b: number) => {
    if (a < 0 || b < 0) {
      throw new Error('Negative numbers are not allowed')
    }
    return a + b
  }
  const fnThrow = (a: number, b: number) => {
    if (a < 0 || b < 0) {
      // 这里故意抛出一个非 Error 的异常
      // eslint-disable-next-line no-throw-literal
      throw 'Negative numbers are not allowed'
    }
    return a + b
  }
  const fnAsync = async (a: number, b: number) => {
    if (a < 0 || b < 0) {
      throw new Error('Negative numbers are not allowed')
    }
    return a + b
  }
  const fnAsyncError = async (a: number, b: number) => {
    if (a < 0 || b < 0) {
      // 这里故意抛出一个非 Error 的异常
      // eslint-disable-next-line no-throw-literal
      throw 'Negative numbers are not allowed'
    }
    return a + b
  }
  it('传入一个正确的方法', () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fn, errorHandler)
    expect(safeFn(1, 2)).toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个抛出错误的方法', () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fnError, errorHandler)
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(-1, 2)).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('传入一个抛出非 Error 的异常', () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fnThrow, errorHandler)
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(-1, 2)).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith('Negative numbers are not allowed')
  })

  it('不传入 errorHandler', () => {
    const safeFn = safe(fnError) // 不传入 errorHandler
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(-1, 2)).toBeUndefined() // 返回 undefined
  })

  it('传入一个没有参数的方法', () => {
    const fnNoArgs = () => 'no args'
    const errorHandler = vi.fn()
    const safeFn = safe(fnNoArgs, errorHandler)
    expect(safeFn()).toBe('no args')
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个没有参数的方法，抛出错误', () => {
    const fnNoArgsError = () => {
      throw new Error('This method does not accept arguments')
    }
    const errorHandler = vi.fn()
    const safeFn = safe(fnNoArgsError, errorHandler)
    expect(safeFn()).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('This method does not accept arguments'))
  })

  it('传入一个 null 方法', () => {
    const errorHandler = vi.fn()
    const safeFn = safe(null, errorHandler)
    expect(safeFn).toBeTypeOf('function')
    expect(safeFn()).toBeUndefined() // 返回 undefined
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个 Function', () => {
    const errorHandler = vi.fn()
    const safeFn = safe(Function, errorHandler)
    expect(safeFn).toBeTypeOf('function')
    expect(safeFn()).toBeTypeOf('function')
    const result = safeFn()
    if (typeof result === 'function') {
      expect(result()).toBeUndefined()
    }
    else {
      expect(result).toBeUndefined()
    }
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个异步方法', async () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fnAsync, errorHandler)
    await expect(safeFn(1, 2)).resolves.toBe(3)
    await expect(safeFn(-1, 2)).resolves.toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('传入一个异步方法，抛出非 Error 的异常', async () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fnAsyncError, errorHandler)
    await expect(safeFn(1, 2)).resolves.toBe(3)
    await expect(safeFn(-1, 2)).resolves.toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith('Negative numbers are not allowed')
  })

  it('传入一个异步方法，不传入 errorHandler', async () => {
    const safeFn = safe(fnAsync) // 不传入 errorHandler
    await expect(safeFn(1, 2)).resolves.toBe(3)
    await expect(safeFn(-1, 2)).resolves.toBeUndefined() // 返回 undefined
  })

  it('传入一个异步方法，返回 Promise', async () => {
    const errorHandler = vi.fn()
    const safeFn = safe(fnAsync, errorHandler)
    const result = safeFn(1, 2)
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个高阶方法', () => {
    const highOrderFn = (a: number, b: number) => (c: number) => a + b + c
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFn, errorHandler)
    const result = safeFn(1, 2)
    expect(typeof result).toBe('function')
    if (typeof result === 'function') {
      expect(result(3)).toBe(6)
    }
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个高阶方法，抛出错误', () => {
    const highOrderFnError = (a: number, b: number) => (c: number) => {
      if (a < 0 || b < 0 || c < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b + c
    }
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFnError, errorHandler)
    const result = safeFn(1, 2)
    expect(typeof result).toBe('function')
    if (typeof result === 'function') {
      expect(result(3)).toBe(6)
      expect(result(-1)).toBeUndefined()
      expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
    }
  })

  it('传入一个高阶方法，抛出非 Error 的异常', () => {
    const highOrderFnError = (a: number, b: number) => (c: number) => {
      if (a < 0 || b < 0 || c < 0) {
        // 这里故意抛出一个非 Error 的异常
        // eslint-disable-next-line no-throw-literal
        throw 'Negative numbers are not allowed'
      }
      return a + b + c
    }
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFnError, errorHandler)
    const result = safeFn(1, 2)
    expect(typeof result).toBe('function')
    if (typeof result === 'function') {
      expect(result(3)).toBe(6)
      expect(result(-1)).toBeUndefined()
      expect(errorHandler).toHaveBeenCalledWith('Negative numbers are not allowed')
    }
  })

  it('传入一个高阶方法，不传入 errorHandler', () => {
    const highOrderFnError = (a: number, b: number) => (c: number) => {
      if (a < 0 || b < 0 || c < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b + c
    }
    const safeFn = safe(highOrderFnError) // 不传入 errorHandler
    const result = safeFn(1, 2)
    expect(typeof result).toBe('function')
    if (typeof result === 'function') {
      expect(result(3)).toBe(6)
      expect(result(-1)).toBeUndefined() // 返回 undefined
    }
  })

  it('传入一个高阶方法，参数是一个方法', () => {
    const highOrderFn = (c: (a: number, b: number) => any) => c(1, 2)
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFn, errorHandler)
    const result = safeFn((a: number, b: number) => a + b)
    expect(result).toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个高阶方法，参数是一个抛出错误的方法', () => {
    const highOrderFnError = (c: (a: number, b: number) => any) => c(1, -2)
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFnError, errorHandler)
    const result = safeFn((a: number, b: number) => {
      if (a < 0 || b < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b
    })
    expect(result).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('传入一个高阶函数，参数是异步方法', async () => {
    const highOrderFn = (c: (a: number, b: number) => Promise<any>) => c(1, 2)
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFn, errorHandler)
    const result = await safeFn(async (a: number, b: number) => {
      if (a < 0 || b < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b
    })
    expect(result).toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个高阶函数，参数是抛出错误的异步方法', async () => {
    const highOrderFnError = (c: (a: number, b: number) => Promise<any>) => c(1, -2)
    const errorHandler = vi.fn()
    const safeFn = safe(highOrderFnError, errorHandler)
    const result = await safeFn(async (a: number, b: number) => {
      if (a < 0 || b < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return a + b
    })
    expect(result).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('将被包裹的方法作为对象的一个参数，this 的行为', () => {
    const obj = {
      a: 1,
      b: 2,
      method: safe(function (this: { a: number, b: number }) { return this.a + this.b }),
    }

    expect(obj.method()).toBe(3)
  })

  it('将被包裹的方法作为对象的一个参数，this 的行为，抛出一个错误', () => {
    const errorHandler = vi.fn()
    const obj = {
      a: -1,
      b: 2,
      method: safe(function (this: any) {
        if (this.a < 0 || this.b < 0) {
          throw new Error('Negative numbers are not allowed')
        }
        return this.a + this.b
      }, errorHandler),
    }

    expect(obj.method()).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })

  it('将被包裹的方法作为对象的一个参数，this 的行为，抛出一个非 Error 的异常', () => {
    const errorHandler = vi.fn()
    const obj = {
      a: -1,
      b: 2,
      method: safe(function (this: any) {
        if (this.a < 0 || this.b < 0) {
          // 这里故意抛出一个非 Error 的异常
          // eslint-disable-next-line no-throw-literal
          throw 'Negative numbers are not allowed'
        }
        return this.a + this.b
      }, errorHandler),
    }

    expect(obj.method()).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith('Negative numbers are not allowed')
  })

  it('将被包裹的方法作为对象的一个参数，this 的行为，不传入 errorHandler', () => {
    const obj = {
      a: -1,
      b: 2,
      method: safe(function (this: any) {
        if (this.a < 0 || this.b < 0) {
          throw new Error('Negative numbers are not allowed')
        }
        return this.a + this.b
      }),
    }

    expect(obj.method()).toBeUndefined() // 返回 undefined
  })

  it('将被包裹的方法作为对象的一个参数，this 的行为，异步方法', async () => {
    const obj = {
      a: 1,
      b: 2,
      method: safe(async function (this: any) { return this.a + this.b }),
    }

    await expect(obj.method()).resolves.toBe(3)
  })

  it('传入一个返回 Promise 的方法', async () => {
    const fnPromise = (a: number, b: number) => Promise.resolve(a + b)
    const errorHandler = vi.fn()
    const safeFn = safe(fnPromise, errorHandler)
    await expect(safeFn(1, 2)).resolves.toBe(3)
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('传入一个返回 Promise 的方法，抛出错误', async () => {
    const fnPromiseError = (a: number, b: number) => {
      if (a < 0 || b < 0) {
        throw new Error('Negative numbers are not allowed')
      }
      return Promise.resolve(a + b)
    }
    const errorHandler = vi.fn()
    const safeFn = safe(fnPromiseError, errorHandler)
    await expect(safeFn(1, 2)).resolves.toBe(3)
    await expect(safeFn(-1, 2)).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(new Error('Negative numbers are not allowed'))
  })
})

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

describe('_JSON safe function', () => {
  it('safe JSON.parse', () => {
    const validJson = '{"name": "John", "age": 30}'
    const invalidJson = '{"name": "John", "age": }'

    expect(_JSON.parse(validJson)).toEqual({ name: 'John', age: 30 })
    expect(_JSON.parse(invalidJson)).toBeUndefined()
  })

  it('safe JSON.stringify', () => {
    const validObject = { name: 'John', age: 30 }
    const circularObject: any = { name: 'John' }
    circularObject.self = circularObject // 创建循环引用

    expect(_JSON.stringify(validObject)).toBe('{"name":"John","age":30}')
    expect(_JSON.stringify(circularObject)).toBeUndefined()
  })
})
