import { REGEX_UA_SAFARI } from '../../_internal/constant/regex'

/**
 * 判断是否是Safari
 */
export function isSafari(ua: string): boolean {
  return REGEX_UA_SAFARI.test(ua)
}
