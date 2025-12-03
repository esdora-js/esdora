import { isDigit } from '@esdora/kit'
import { biz, kit } from 'esdora'
// eslint-disable-next-line no-console
console.log(isDigit('123'))
// eslint-disable-next-line no-console
console.log(kit.isDigit('123'))
// eslint-disable-next-line no-console
console.log(biz.parseSearch('https://example.com?foo=bar'))
