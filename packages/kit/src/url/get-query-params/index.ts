/**
 * @category URL
 * @description 从一个 URL 字符串中安全地解析出查询参数，并以对象形式返回。该实现基于 Web 标准 URL API，确保了最高的健壮性和安全性。
 * @param url 一个标准的或自定义协议的 URL 字符串。
 * @returns {Record<string, string> | null} 如果 URL 格式有效，则返回一个包含所有查询参数的键值对对象（即使没有参数，也会返回空对象 `{}`）；如果 URL 字符串无法被解析为有效的 URL，则返回 `null`。
 *
 * @example
 * // 解析一个自定义 schema URL
 * const weixinUrl = 'weixin://dl/business?appid=11&path=some_path&query=a%3D1';
 * getQueryParams(weixinUrl);
 * // => { appid: '11', path: 'some_path', query: 'a=1' }
 *
 * @example
 * // 解析一个标准的 HTTP URL
 * const httpUrl = 'https://example.com?name=esdora&version=1.0';
 * getQueryParams(httpUrl);
 * // => { name: 'esdora', version: '1.0' }
 *
 * @example
 * // 处理一个没有查询参数的有效 URL
 * getQueryParams('https://example.com/path');
 * // => {}
 *
 * @example
 * // 处理一个格式无效的 URL 字符串 (无效的用户输入)
 * getQueryParams('this is not a valid url');
 * // => null
 *
 * @example
 * // 处理 null 或 undefined (无效的用户输入)
 * getQueryParams(null);
 * // => null
 */
export function getQueryParams(url: unknown): Record<string, string> | null {
  if (typeof url !== 'string' || url.length === 0) {
    return null
  }
  try {
    const BASE = 'http://a.b'
    const urlObject = new URL(url, BASE)
    if (
      urlObject.protocol === 'http:'
      && urlObject.pathname === `/${encodeURI(url)}`
      && urlObject.search === '' // 并且没有解析出任何查询参数
      && urlObject.hostname === 'a.b' // 并且主机名未被改变
    ) {
      return null
    }
    const searchParams = urlObject.searchParams
    return Object.fromEntries(searchParams.entries())
  }
  catch {
    return null
  }
}
