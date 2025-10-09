import { describe, expect, it } from 'vitest'
import { isIos } from '.'

const iosList = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1',
]
const otherList = [
  'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
]

describe('is-ios', () => {
  iosList.forEach((ua) => {
    it(ua, () => {
      const result = isIos(ua)
      expect(result, 'should be true').toBe(true)
    })
  })
  otherList.forEach((ua) => {
    it(ua, () => {
      const result = isIos(ua)
      expect(result, 'should be false').toBe(false)
    })
  })
})
