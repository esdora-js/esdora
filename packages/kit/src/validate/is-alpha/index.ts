import { REGEX_ALPHA } from '../../_internal/constant'
/**
 * 判断是否是字母
 * @param str 需要判断的字符串
 */
export function isAlpha(str: string): boolean {
  return REGEX_ALPHA.test(str)
}
