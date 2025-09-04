import { REGEX_UA_SAFARI } from '../../_internal/constant/regex'

/**
 * @summary 检查给定的用户代理（User-Agent）字符串是否表示 Safari 浏览器。
 *
 * @description
 * 此函数通过正则表达式匹配来判断传入的 `ua` 字符串是否属于 Safari 浏览器。
 * 该检测逻辑会特别处理一个常见问题：许多基于 Chromium 的浏览器（如 Chrome）为了兼容性，其 User-Agent 中也包含 "Safari" 字符串。
 * 因此，此函数会排除这些情况，确保只在检测到真正的 Safari 浏览器时才返回 `true`。
 *
 * @param ua 要检查的用户代理（User-Agent）字符串。
 * @returns 如果用户代理字符串表示是 Safari 浏览器，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 典型的 Safari 用户代理
 * const safariUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15';
 * isSafari(safariUA);
 * // => true
 *
 * // Chrome 用户代理（也包含 "Safari" 字符串，但会被正确识别为 false）
 * const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
 * isSafari(chromeUA);
 * // => false
 *
 * // Firefox 用户代理
 * const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
 * isSafari(firefoxUA);
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-safari | 官方文档页面}。
 */
export function isSafari(ua: string): boolean {
  return REGEX_UA_SAFARI.test(ua)
}
