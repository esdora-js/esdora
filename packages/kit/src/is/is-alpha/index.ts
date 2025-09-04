import { REGEX_ALPHA } from '../../_internal/constant'

/**
 * @summary 检查字符串是否完全由英文字母（a-z, A-Z）组成。
 *
 * @description
 * 此函数用于验证一个字符串是否只包含英文字母。
 * 它会检查字符串中的每一个字符是否都是标准的拉丁字母（不区分大小写）。任何非字母字符，如数字、空格、标点符号或特殊字符，都会导致函数返回 `false`。
 * 空字符串也会被视为无效，返回 `false`。
 *
 * @param str 要进行检查的字符串。
 * @returns 如果字符串完全由一个或多个英文字母组成，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 有效的字母字符串
 * isAlpha('HelloWorld');
 * // => true
 * isAlpha('abc');
 * // => true
 *
 * // 包含数字
 * isAlpha('abc1');
 * // => false
 *
 * // 包含空格
 * isAlpha('hello world');
 * // => false
 *
 * // 包含标点
 * isAlpha('hello-world');
 * // => false
 *
 * // 空字符串
 * isAlpha('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-alpha | 官方文档页面}。
 */
export function isAlpha(str: string): boolean {
  return REGEX_ALPHA.test(str)
}
