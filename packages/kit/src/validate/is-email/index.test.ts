import { describe, expect, it } from 'vitest'
import { isEmail, isEmailStrict } from '.'

describe('is-email', () => {
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
      const result = isEmail(email)
      const resultStrict = isEmailStrict(email)
      expect(result, 'should be true').toBe(true)
      expect(resultStrict, 'should be true').toBe(true)
    })
  })
  it('中文@example.com', () => {
    const email = '中文@example.com'
    const result = isEmail(email)
    const resultStrict = isEmailStrict(email)
    expect(result, 'should be false').toBe(false)
    expect(resultStrict, 'should be true').toBe(true)
  })
  it('"quoted-local-part"@example.com', () => {
    const email = '"quoted-local-part"@example.com'
    const result = isEmail(email)
    const resultStrict = isEmailStrict(email)
    expect(result, 'should be false').toBe(false)
    expect(resultStrict, 'should be true').toBe(true)
  })
})
