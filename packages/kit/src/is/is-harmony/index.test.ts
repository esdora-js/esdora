import { describe, expect, it } from 'vitest'
import { isHarmony } from '.'

const harmonyList = [
  'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile HuaweiBrowser/5.1.9.301',
  'Mozilla/5.0 (Linux; Android 10; HarmonyOS; VOG-AL00; HMSCore 6.14.0.302; GMSCore 20.15.16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 HuaweiBrowser/15.0.4.312 Mobile Safari/537.36',
]
const otherList = [
  'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1',
]

describe('is-ios', () => {
  harmonyList.forEach((ua) => {
    it(ua, () => {
      const result = isHarmony(ua)
      expect(result, 'should be true').toBe(true)
    })
  })
  otherList.forEach((ua) => {
    it(ua, () => {
      const result = isHarmony(ua)
      expect(result, 'should be false').toBe(false)
    })
  })
})
