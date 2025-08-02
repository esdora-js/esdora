import { REGEX_ALNUM } from '../../_internal/constant'
/**
 * 判断是否是字母和数字
 * @param str 需要判断的字符串
 */
export function isAlnum(str: string): boolean {
  return REGEX_ALNUM.test(str)
}
