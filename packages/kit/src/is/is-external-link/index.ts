/**
 * @summary 检查链接是否为外部链接（智能模式）。
 *
 * @description
 * 此函数使用智能逻辑判断一个链接是否指向外部资源。
 * 它会识别多种链接格式，包括完整 URL、协议相对 URL、特殊协议链接等。
 * 相对路径（以 `/`、`#`、`./`、`../` 开头）和查询参数（以 `?` 开头）被视为内部链接。
 * 协议相对 URL（以 `//` 开头）和完整 URL（`http://`、`https://`）被视为外部链接。
 * 特殊协议如 `mailto:`、`tel:` 被视为外部链接，而 `javascript:`、`data:` 被视为内部链接（安全考虑）。
 *
 * @param href 要检查的链接字符串。
 * @returns 如果链接是外部链接，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // 完整 URL（外部链接）
 * isExternalLink('https://example.com');
 * // => true
 * isExternalLink('http://example.com/path');
 * // => true
 *
 * // 协议相对 URL（外部链接）
 * isExternalLink('//cdn.example.com/script.js');
 * // => true
 *
 * // 特殊协议（外部链接）
 * isExternalLink('mailto:test@example.com');
 * // => true
 * isExternalLink('tel:1234567890');
 * // => true
 *
 * // 相对路径（内部链接）
 * isExternalLink('/path/to/page');
 * // => false
 * isExternalLink('#section');
 * // => false
 * isExternalLink('./page.html');
 * // => false
 * isExternalLink('../parent/page');
 * // => false
 *
 * // 查询参数和特殊协议（内部链接）
 * isExternalLink('?query=value');
 * // => false
 * isExternalLink('javascript:void(0)');
 * // => false
 * isExternalLink('data:text/plain,Hello');
 * // => false
 *
 * // 边缘情况
 * isExternalLink('');
 * // => false
 * isExternalLink('   ');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-external-link | 官方文档页面}。
 */
export function isExternalLink(href: string): boolean {
  // 处理空字符串和空白字符串
  if (!href || !href.trim())
    return false

  const trimmed = href.trim()

  // 外部链接：协议相对 URL（必须在 / 检查之前）
  if (trimmed.startsWith('//'))
    return true

  // 内部链接：相对路径
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('?'))
    return false

  // 内部链接：危险协议（安全考虑）
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:'))
    return false

  // 外部链接：完整 URL 协议
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
    return true

  // 外部链接：特殊协议
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('ftp:') || trimmed.startsWith('ftps:'))
    return true

  // 默认：不包含协议的字符串视为内部链接（如 "page.html"）
  return false
}

/**
 * @summary 检查链接是否为外部链接（严格模式）。
 *
 * @description
 * 此函数使用严格的验证逻辑，仅识别以 `http://` 或 `https://` 开头的完整 URL 为外部链接。
 * 所有其他格式（包括协议相对 URL、特殊协议、相对路径等）均被视为内部链接。
 * 适用于需要明确区分 HTTP/HTTPS 外部资源的场景。
 *
 * @param href 要检查的链接字符串。
 * @returns 如果链接是 HTTP/HTTPS 完整 URL，则返回 `true`，否则返回 `false`。
 *
 * @example
 * ```ts
 * // HTTP/HTTPS 完整 URL（外部链接）
 * isExternalLinkStrict('https://example.com');
 * // => true
 * isExternalLinkStrict('http://example.com/path');
 * // => true
 *
 * // 协议相对 URL（内部链接）
 * isExternalLinkStrict('//cdn.example.com/script.js');
 * // => false
 *
 * // 特殊协议（内部链接）
 * isExternalLinkStrict('mailto:test@example.com');
 * // => false
 * isExternalLinkStrict('tel:1234567890');
 * // => false
 *
 * // 相对路径（内部链接）
 * isExternalLinkStrict('/path/to/page');
 * // => false
 * isExternalLinkStrict('#section');
 * // => false
 *
 * // 边缘情况
 * isExternalLinkStrict('');
 * // => false
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-external-link | 官方文档页面}。
 */
export function isExternalLinkStrict(href: string): boolean {
  // 处理空字符串和空白字符串
  if (!href || !href.trim())
    return false

  const trimmed = href.trim()

  // 仅识别 HTTP/HTTPS 完整 URL
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
}
