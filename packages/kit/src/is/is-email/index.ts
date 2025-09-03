import { REGEX_EMAIL, REGEX_EMAIL_STRICT } from '../../_internal/constant'

/**
 * @summary 检查字符串是否为符合基本格式的电子邮件地址。
 *
 * @description
 * 此函数使用一个简化的正则表达式来快速验证常见的电子邮件格式。
 * 它主要针对标准的 ASCII 字符集邮箱，性能较高，但不支持一些复杂或现代的格式，例如包含中文字符或引号的本地部分（local-part）。
 * 对于需要覆盖更广泛邮件格式的场景，请使用 `isEmailStrict`。
 *
 * @param email 要验证的电子邮件字符串。
 * @returns 如果字符串是格式基本的电子邮件地址，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 常见的有效格式
 * isEmail('a.b.c_1@example.com');
 * // => true
 *
 * // 不支持的格式
 * isEmail('中文@example.com');
 * // => false
 * isEmail('"quoted-local-part"@example.com');
 * // => false
 * isEmail('invalid-email');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-email | 官方文档页面}。
 */
export function isEmail(email: string): boolean {
  return REGEX_EMAIL.test(email)
}

/**
 * @summary 检查字符串是否为符合 RFC 标准的电子邮件地址（严格模式）。
 *
 * @description
 * 此函数使用一个更全面、更严格的正则表达式来验证电子邮件地址，旨在更接近 RFC 5322 规范。
 * 与 `isEmail` 不同，此版本支持国际化域名（IDN）、包含中文字符的本地部分（local-part）以及使用引号的本地部分。
 * 由于正则表达式更复杂，其性能可能略低于简化版的 `isEmail`，但验证的准确性和覆盖范围更广。
 *
 * @param email 要进行严格验证的电子邮件字符串。
 * @returns 如果字符串是格式有效的电子邮件地址，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 标准格式
 * isEmailStrict('a.b.c_1@example.com');
 * // => true
 *
 * // 支持中文及国际化字符
 * isEmailStrict('中文@example.com');
 * // => true
 *
 * // 支持带引号的本地部分
 * isEmailStrict('"quoted-local-part"@example.com');
 * // => true
 *
 * // 无效格式
 * isEmailStrict('plainaddress');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-email | 官方文档页面}。
 */
export function isEmailStrict(email: string): boolean {
  return REGEX_EMAIL_STRICT.test(email)
}
