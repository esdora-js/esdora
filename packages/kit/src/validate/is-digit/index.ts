import { REGEX_DIGIT } from '../../_internal/constant'
/**
 * 判断是否是数字
 * @param str 需要判断的字符串
 */
export function isDigit(str: string): boolean {
  return REGEX_DIGIT.test(str)
}
