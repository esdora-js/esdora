import { REGEX_UA_FIREFOX } from '../../_internal/constant'

/**
 * 检查给定的用户代理 (User Agent, UA) 字符串是否代表 Firefox 浏览器。
 *
 * @remarks
 * 此函数通过一个简单的正则表达式来测试传入的 UA 字符串。无论是在桌面还是移动端，
 * 这都是一种检测 Firefox 的可靠方式。
 *
 * @param ua - 需要被检测的用户代理字符串。在浏览器环境中，这个值通常是 `navigator.userAgent`。
 * @returns 如果 UA 字符串匹配 Firefox，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```typescript
 * // 示例 1: 使用一个真实的 Firefox UA 字符串
 * const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0';
 * isFirefox(firefoxUA);
 * // => true
 *
 * // 示例 2: 使用一个非 Firefox 的 UA 字符串
 * const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36';
 * isFirefox(chromeUA);
 * // => false
 *
 * // 示例 3: 在浏览器环境中的常见用法
 * if (isFirefox(navigator.userAgent)) {
 *   console.log('欢迎你，火狐用户！');
 *   // 可以在这里应用针对 Firefox 的特定逻辑
 * }
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/kit/reference/validate/is-firefox | 官方文档页面}。
 */
export function isFirefox(ua: string): boolean {
  return REGEX_UA_FIREFOX.test(ua)
}
