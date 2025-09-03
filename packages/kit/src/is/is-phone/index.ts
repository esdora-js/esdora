import { REGEX_CN_PHONE_STRICT } from '../../_internal/constant'

/**
 * @summary 检查给定的字符串是否为一个有效的中国大陆手机号码。
 *
 * @description
 * 此函数通过一个严格的正则表达式来验证输入值是否符合中国大陆手机号的格式。
 * 它主要验证号码是否为 11 位数字，并以中国大陆通用的手机号段开头（如 13x, 15x, 18x, 19x 等）。
 * 与宽松的验证不同，此函数不接受包含国家代码、分隔符或任何非数字字符的格式。
 *
 * @param phone 要进行验证的字符串。预期为一个纯 11 位数字的手机号码。
 * @returns 如果字符串是有效的中国大陆手机号码，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 有效的手机号码
 * isPhone('13812345678');
 * // => true
 * isPhone('19900001111');
 * // => true
 *
 * // 无效的手机号码
 * isPhone('1381234567');   // 长度不足
 * // => false
 * isPhone('20012345678');  // 无效的号段
 * // => false
 * isPhone('138-1234-5678'); // 包含非数字字符
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-phone | 官方文档页面}。
 */
export function isPhone(phone: string): boolean {
  return REGEX_CN_PHONE_STRICT.test(phone)
}
