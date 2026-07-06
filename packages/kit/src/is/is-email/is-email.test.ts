import { describe, expect, it } from 'vitest'
import { isEmail } from './is-email'

describe('isEmail', () => {
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
      expect(isEmail(email)).toBe(true)
    })
  })
  it('中文@example.com 应为 false（基本模式不支持中文字符）', () => {
    expect(isEmail('中文@example.com')).toBe(false)
  })
  it('"quoted-local-part"@example.com 应为 false（基本模式不支持引号本地部分）', () => {
    expect(isEmail('"quoted-local-part"@example.com')).toBe(false)
  })
})
