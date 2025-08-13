import { describe, expect, it } from 'vitest'
import { isFirefox } from '.'

const firefoxList = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0', // macos Firefox
]
const otherList = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15', // macos safari   // macos mobile safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', // macos chrome
]

describe('is-firefox', () => {
  firefoxList.forEach((ua) => {
    it(ua, () => {
      const result = isFirefox(ua)
      expect(result, 'should be true').toBe(true)
    })
  })
  otherList.forEach((ua) => {
    it(ua, () => {
      const result = isFirefox(ua)
      expect(result, 'should be false').toBe(false)
    })
  })
})
