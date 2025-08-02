import { describe, expect, it } from 'vitest'
import { to } from '.'

describe('await to test', async () => {
  it('当promise被解决后应返回值', async () => {
    const testInput = 41
    const promise = Promise.resolve(testInput)

    const [err, data] = await to<number>(promise)

    expect(err).toBeNull()
    expect(data).toEqual(testInput)
  })

  it('当promise被拒绝时应该返回错误', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    const promise = Promise.reject('Error')

    const [err, data] = await to<number>(promise)

    expect(err).toEqual('Error')
    expect(data).toBeUndefined()
  })

  it('应该将外部属性添加到错误对象', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    const promise = Promise.reject({ error: 'Error message' })

    const [err] = await to<string, { error: string, extraKey: number }>(promise, {
      extraKey: 1,
    })

    expect(err).toBeTruthy()
    expect((err as any).extraKey).toEqual(1)
    expect((err as any).error).toEqual('Error message')
  })

  it('如果没有传递类型，则应接收父节点的类型', async () => {
    const [_, user] = await to<{ name: string }>(Promise.resolve({ name: '123' }))

    expect(user?.name).toEqual('123')
  })
})
