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
