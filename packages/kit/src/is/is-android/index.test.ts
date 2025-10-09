import { describe, expect, it } from 'vitest'
import { isAndroid } from '.'

const androidList = [
  'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
]
const otherList = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
]

describe('is-android', () => {
  androidList.forEach((ua) => {
    it(ua, () => {
      const result = isAndroid(ua)
      expect(result, 'should be true').toBe(true)
    })
  })
  otherList.forEach((ua) => {
    it(ua, () => {
      const result = isAndroid(ua)
      expect(result, 'should be false').toBe(false)
    })
  })
})
