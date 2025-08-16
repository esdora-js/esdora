import { describe, expect, it } from 'vitest'
import { _unstable_getVersion } from '.'

describe('get version', () => {
  it('应返回字符串', () => {
    const version = _unstable_getVersion()
    expect(typeof version).toBe('string')
  })
})
