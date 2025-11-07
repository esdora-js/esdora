import { beforeEach, describe, expect, it, vi } from 'vitest'
import { devWarn } from './dev-warn'

describe('devWarn', () => {
  beforeEach(() => {
    // 清除之前的 mock
    vi.restoreAllMocks()
  })

  it('应在开发环境下输出警告信息', () => {
    // 模拟 console.warn
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    devWarn('测试警告消息')

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith('[@esdora/kit] 测试警告消息')

    warnSpy.mockRestore()
  })

  it('应输出带有详细信息的警告', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const details = { id: 123, name: 'test' }

    devWarn('发现问题', details)

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith('[@esdora/kit] 发现问题', details)

    warnSpy.mockRestore()
  })

  it('应输出带有多个详细信息的警告', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const detail1 = { id: 1 }
    const detail2 = { name: 'test' }
    const detail3 = [1, 2, 3]

    devWarn('多个详细信息', detail1, detail2, detail3)

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(
      '[@esdora/kit] 多个详细信息',
      detail1,
      detail2,
      detail3,
    )

    warnSpy.mockRestore()
  })

  it('警告消息应包含库前缀', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    devWarn('测试')

    const callArgs = warnSpy.mock.calls[0]
    expect(callArgs[0]).toContain('[@esdora/kit]')

    warnSpy.mockRestore()
  })
})
