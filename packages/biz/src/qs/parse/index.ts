import type { MergeOptions, ParsedQuery, ParseOptions, QueryObject } from '../types'
import { parse as qsParse } from 'qs'
import { stringify } from '../stringify'

/**
 * 重新导出 qs.parse 以供直接访问
 * 将查询字符串解析为对象
 */
export { parse } from 'qs'

/**
 * 从 URL 中提取并解析查询字符串
 * 处理 URL 解析的便捷包装器
 *
 * @param url - 完整 URL 或带查询字符串的路径
 * @param options - qs 的解析选项
 * @returns 解析后的查询对象
 *
 * @example
 * ```ts
 * parseSearch('https://example.com?foo=bar&baz=qux')
 * // => { foo: 'bar', baz: 'qux' }
 *
 * parseSearch('/path?id=123&name=test', { decoder: customDecoder })
 * // => { id: 123, name: 'test' }
 * ```
 */
export function parseSearch<T = QueryObject>(
  url: string,
  options?: ParseOptions,
): ParsedQuery<T> {
  // 从 URL 中提取查询字符串（? 之后的所有内容）
  const queryIndex = url.indexOf('?')
  const queryString = queryIndex >= 0 ? url.slice(queryIndex + 1) : ''

  return qsParse(queryString, options) as ParsedQuery<T>
}

/**
 * 将查询参数合并到现有 URL
 * 智能组合现有和新的查询参数
 *
 * @param url - 基础 URL（可带或不带现有查询字符串）
 * @param params - 要合并的查询参数
 * @param options - 合并行为选项
 * @returns 包含合并查询参数的 URL
 *
 * @example
 * ```ts
 * mergeQueryParams('https://example.com?foo=bar', { baz: 'qux' })
 * // => 'https://example.com?foo=bar&baz=qux'
 *
 * mergeQueryParams('/path?id=1', { id: 2, name: 'test' }, { override: true })
 * // => '/path?id=2&name=test'
 *
 * mergeQueryParams('/path?id=1', { name: 'test' }, { override: false })
 * // => '/path?id=1&name=test'
 * ```
 */
export function mergeQueryParams(
  url: string,
  params: QueryObject,
  options: MergeOptions = {},
): string {
  const { override = true, encode = true } = options

  // 将 URL 分割为基础部分和查询部分
  const queryIndex = url.indexOf('?')
  const baseUrl = queryIndex >= 0 ? url.slice(0, queryIndex) : url
  const existingQuery = queryIndex >= 0 ? url.slice(queryIndex + 1) : ''

  // 解析现有查询字符串
  const existingParams = existingQuery ? qsParse(existingQuery) : {}

  // 根据 override 选项合并参数
  const mergedParams = override
    ? { ...existingParams, ...params }
    : { ...params, ...existingParams }

  // 字符串化合并后的参数
  const queryString = stringify(mergedParams, { encode })

  // 返回组合后的 URL
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
