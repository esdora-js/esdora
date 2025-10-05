import { describe, expect, it } from 'vitest'
import { isMpSchema } from '.'

describe('is-mp-schema', () => {
  it('正确的schema', () => {
    expect(isMpSchema('weixin://dl/business?appid=11')).toBeTruthy()
  })
  it('错误的的schema', () => {
    expect(isMpSchema('https://dl/business?appid=11')).toBeFalsy()
  })
})
