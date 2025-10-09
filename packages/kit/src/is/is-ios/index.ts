import { REGEX_UA_IPAD, REGEX_UA_IPHONE, REGEX_UA_IPOD } from '../../_internal/constant'

/**
 * @summary 检查用户代理（User Agent）字符串是否表明客户端是 iOS 设备。
 *
 * @description
 * 此函数通过测试给定的用户代理（User Agent）字符串中是否包含 "iPhone"、"iPad" 或 "iPod" 关键字来判断客户端环境是否为 iOS 系统。
 * 它覆盖了苹果公司的主要移动设备。请注意，用户代理字符串存在被伪造的可能，因此该检测方法不能保证 100% 的准确性。
 *
 * @param ua 要进行检查的用户代理（User Agent）字符串，通常是 `navigator.userAgent`。
 * @returns 如果用户代理字符串表明是 iOS 设备（iPhone, iPad, 或 iPod），则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // iPhone User Agent
 * const iphoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1';
 * isIos(iphoneUA);
 * // => true
 *
 * // iPad User Agent
 * const ipadUA = 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1';
 * isIos(ipadUA);
 * // => true
 *
 * // Android User Agent
 * const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36';
 * isIos(androidUA);
 * // => false
 *
 * // 桌面浏览器 User Agent
 * const desktopUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
 * isIos(desktopUA);
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/kit/reference/validate/is-ios | 官方文档页面}。
 */
export function isIos(ua: string): boolean {
  return REGEX_UA_IPHONE.test(ua) || REGEX_UA_IPAD.test(ua) || REGEX_UA_IPOD.test(ua)
}
