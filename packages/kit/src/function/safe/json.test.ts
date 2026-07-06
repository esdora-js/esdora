import { describe, expect, it } from 'vitest'
import { _JSON } from './json'

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
