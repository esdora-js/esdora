import { REGEX_CN_PHONE_STRICT } from '../../_internal/constant'
/**
 * 判断是否是手机（中国大陆手机号）
 * @param phone 手机号
 */
export function isPhone(phone: string): boolean {
  return REGEX_CN_PHONE_STRICT.test(phone)
}
