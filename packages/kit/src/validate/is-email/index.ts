import { REGEX_EMAIL, REGEX_EMAIL_STRICT } from '../../_internal/constant'
/**
 * 判断是否是电子邮箱（简易验证,不支持中文和引用类邮箱）
 * @param email 电子邮箱
 * @example
 * a.b.c_1@example.com ✅
 * 中文@example.com ❌
 * "quoted-local-part"@example.com ❌
 */
export function isEmail(email: string): boolean {
  return REGEX_EMAIL.test(email)
}

/**
 * 判断是否是电子邮箱(严格版,支持中文)
 * @param email 电子邮箱
 * @example
 * a.b.c_1@example.com ✅
 * 中文@example.com ✅
 * "quoted-local-part"@example.com ✅
 */
export function isEmailStrict(email: string): boolean {
  return REGEX_EMAIL_STRICT.test(email)
}
