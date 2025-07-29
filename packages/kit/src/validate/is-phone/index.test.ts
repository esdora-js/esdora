import { describe, expect, it } from 'vitest'
import { isPhone } from '.'

describe('is-phone', () => {
  const success = ['008618311006933', '+8617888829981', '19119255642', '19519255642']
  const error = ['12345678901', '123456789012']
  success.forEach((phone) => {
    it(phone, () => {
      const result = isPhone(phone)
      expect(result, 'should be true').toBe(true)
    })
  })
  error.forEach((phone) => {
    it(phone, () => {
      const result = isPhone(phone)
      expect(result, 'should be false').toBe(false)
    })
  })
})
