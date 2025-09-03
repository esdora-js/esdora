import { REGEX_ALNUM } from '../../_internal/constant'

/**
 * @summary 检查字符串是否完全由英文字母和数字组成。
 *
 * @description
 * 此函数用于验证一个字符串是否只包含英文字母（a-z, A-Z）和数字（0-9）。
 * 它会检查字符串中的每一个字符是否都属于字母或数字。任何其他类型的字符，例如空格、标点符号、下划线等，都会导致函数返回 `false`。
 * 空字符串也被视为无效，将返回 `false`。
 *
 * @param str 要进行检查的字符串。
 * @returns 如果字符串完全由一个或多个字母或数字组成，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 包含字母和数字
 * isAlnum('abc123XYZ');
 * // => true
 *
 * // 只包含字母
 * isAlnum('HelloWorld');
 * // => true
 *
 * // 包含空格
 * isAlnum('abc 123');
 * // => false
 *
 * // 包含标点
 * isAlnum('user-name');
 * // => false
 *
 * // 空字符串
 * isAlnum('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-alnum | 官方文档页面}。
 */
export function isAlnum(str: string): boolean {
  return REGEX_ALNUM.test(str)
}
