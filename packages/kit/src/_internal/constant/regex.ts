/**
 * 正则验证来源于互联网，包括但不限于以下来源：
 * https://github.com/any86/any-rule/blob/master/packages/www/src/RULES.js
 */

/**
 * @description 严格的中国大陆手机号验证规则
 * @example
 * 008618311006933
 * +8617888829981
 * 19119255642
 * 19519255642
 */
export const REGEX_CN_PHONE_STRICT = /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[0125-9])\d{8}$/

/**
 * 严格的邮箱验证规则
 */
export const REGEX_EMAIL_STRICT = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
/**
 * 简易版邮箱验证
 */
export const REGEX_EMAIL = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

/**
 * UA Safari浏览器
 */
export const REGEX_UA_SAFARI = /version\/[\d._].*safari/i
/**
 * UA Firefox浏览器
 */
export const REGEX_UA_FIREFOX = /^(?!.*Seamonkey)(?=.*Firefox).*/i
