import { REGEX_UA_FIREFOX } from '../../_internal/constant'

export function isFirefox(ua: string): boolean {
  return REGEX_UA_FIREFOX.test(ua)
}
