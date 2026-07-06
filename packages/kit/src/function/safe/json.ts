import { safe } from './safe'

/**
 * 提供安全版本的 JSON 解析和序列化方法。
 *
 * @property parse - 安全解析 JSON 字符串，自动捕获解析错误。
 * @property stringify - 安全地将 JavaScript 值序列化为 JSON 字符串，自动捕获序列化错误。
 */
export const _JSON = {
  parse: safe(JSON.parse),
  stringify: safe(JSON.stringify),
}
