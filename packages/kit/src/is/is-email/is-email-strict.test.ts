import { describe, expect, it } from 'vitest'
import { isEmailStrict } from './is-email-strict'

describe('isEmailStrict', () => {
  const emailList = [
    'normal@example.com',
    'user.name@example.co.uk',
    'user_name+tag123@example.io',
    'user-name@sub.domain.com',
    'u1234567@example.org',
    'USER@EXAMPLE.COM',
    'user%example@example.org',
    'user.name+tag@xn--exmple-cua.com',
    'user@localhost.localdomain',
  ]
  emailList.forEach((email) => {
    it(email, () => {
      expect(isEmailStrict(email)).toBe(true)
    })
  })
  it('中文@example.com 应为 true（严格模式支持中文字符）', () => {
    expect(isEmailStrict('中文@example.com')).toBe(true)
  })
  it('"quoted-local-part"@example.com 应为 true（严格模式支持引号本地部分）', () => {
    expect(isEmailStrict('"quoted-local-part"@example.com')).toBe(true)
  })
})
