import { REGEX_UA_ANDROID } from '../../_internal/constant'
/**
 * @summary 检查用户代理（User Agent）字符串是否表明客户端是安卓（Android）设备。
 *
 * @description
 * 此函数通过测试给定的用户代理（User Agent）字符串中是否包含 "Android" 关键字来判断客户端环境是否为安卓系统。
 * 这是一种常用且快速的检测方法，但请注意，用户代理字符串可以被伪造。
 *
 * @param ua 要进行检查的用户代理（User Agent）字符串，通常是 `navigator.userAgent`。
 * @returns 如果用户代理字符串表明是安卓设备，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 典型的安卓 User Agent
 * const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36';
 * isAndroid(androidUA);
 * // => true
 *
 * // iOS User Agent
 * const iosUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1';
 * isAndroid(iosUA);
 * // => false
 *
 * // 桌面浏览器 User Agent
 * const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
 * isAndroid(desktopUA);
 * // => false
 *
 * // 空字符串
 * isAndroid('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/kit/reference/validate/is-android | 官方文档页面}。
 */
export function isAndroid(ua: string): boolean {
  return REGEX_UA_ANDROID.test(ua)
}
