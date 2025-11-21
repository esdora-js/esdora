import type { QueryObject, StringifyOptions } from './types'
import { stringify as qsStringify } from 'qs'

/**
 * 重新导出 qs.stringify 以供直接访问
 * 将对象转换为查询字符串
 */
export { stringify } from 'qs'

/**
 * qs.stringify 的便捷包装器，带有常用默认值
 * 使用合理的选项简化查询字符串生成
 *
 * @param params - 要转换为查询字符串的对象
 * @param options - qs 的字符串化选项
 * @returns 查询字符串（不含前导 ?）
 *
 * @example
 * ```ts
 * stringifySearch({ foo: 'bar', baz: 'qux' })
 * // => 'foo=bar&baz=qux'
 *
 * stringifySearch({ id: 123, name: 'test' }, { encode: false })
 * // => 'id=123&name=test'
 *
 * stringifySearch({ arr: [1, 2, 3] }, { arrayFormat: 'brackets' })
 * // => 'arr[]=1&arr[]=2&arr[]=3'
 * ```
 */
export function stringifySearch(
  params: QueryObject,
  options?: StringifyOptions,
): string {
  return qsStringify(params, options)
}
