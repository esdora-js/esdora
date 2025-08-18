import { REGEX_DIGIT } from '../../_internal/constant'

/**
 * @summary 检查字符串是否完全由数字字符（0-9）组成。
 *
 * @description
 * 此函数用于验证一个字符串是否只包含数字字符。
 * 它会检查字符串中的每一个字符是否都是 0 到 9 之间的数字。任何非数字字符，如小数点、负号、空格或字母，都会导致函数返回 `false`。
 * 此函数不进行类型转换或数值解析，它只对字符串的构成进行纯粹的字符级检查。空字符串也会返回 `false`。
 *
 * @param str 要进行检查的字符串。
 * @returns 如果字符串完全由一个或多个数字字符组成，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 有效的数字字符串
 * isDigit('123');
 * // => true
 * isDigit('0');
 * // => true
 *
 * // 包含非数字字符
 * isDigit('123a');
 * // => false
 *
 * // 包含小数点
 * isDigit('12.3');
 * // => false
 *
 * // 包含负号
 * isDigit('-123');
 * // => false
 *
 * // 空字符串
 * isDigit('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/kit/reference/validate/is-digit | 官方文档页面}。
 */
export function isDigit(str: string): boolean {
  return REGEX_DIGIT.test(str)
}
