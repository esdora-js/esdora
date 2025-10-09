import { REGEX_UA_HARMONY } from '../../_internal/constant'

/**
 * @summary 检查用户代理（User Agent）字符串是否表明客户端是鸿蒙（HarmonyOS）设备。
 *
 * @description
 * 此函数通过测试给定的用户代理（User Agent）字符串中是否包含 "HarmonyOS" 关键字来判断客户端环境是否为鸿蒙系统。
 * 这是检测华为鸿蒙系统的一种直接方式。请注意，用户代理字符串可以被修改或伪造，因此该检测方法不能保证绝对准确。
 *
 * @param ua 要进行检查的用户代理（User Agent）字符串，通常是 `navigator.userAgent`。
 * @returns 如果用户代理字符串表明是鸿蒙设备，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 典型的鸿蒙 User Agent
 * const harmonyUA = 'Mozilla/5.0 (Linux; Android 10; TAS-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 HuaweiBrowser/11.1.1.301 Mobile Safari/537.36 HarmonyOS/2.0.0';
 * isHarmony(harmonyUA);
 * // => true
 *
 * // 安卓 User Agent
 * const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36';
 * isHarmony(androidUA);
 * // => false
 *
 * // iOS User Agent
 * const iosUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1';
 * isHarmony(iosUA);
 * // => false
 *
 * // 空字符串
 * isHarmony('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/kit/reference/validate/is-harmony | 官方文档页面}。
 */
export function isHarmony(ua: string): boolean {
  return REGEX_UA_HARMONY.test(ua)
}
