/**
 * [底层实现] 使用 WeakSet 高效地判断是否存在循环引用。
 * @internal
 */
function _hasCircular(value: unknown): boolean {
  // 1. 初始检查可以提取到这里，减少递归中的重复判断
  if (value === null || typeof value !== 'object') {
    return false
  }

  const visited = new WeakSet<object>()

  function traverse(current: unknown): boolean {
    // 2. 递归内部也需要检查，因为属性值可能是非对象
    if (current === null || typeof current !== 'object') {
      return false
    }
    if (visited.has(current)) {
      return true
    }

    visited.add(current)

    // 3. (核心优化) 使用 Object.values 替代 for...in
    for (const innerValue of Object.values(current)) {
      if (traverse(innerValue)) {
        return true
      }
    }
    return false
  }

  return traverse(value)
}

/**
 * [底层实现] 使用 Map 查找并返回第一个循环引用的路径。
 * @internal
 */
function _findPath(value: unknown): string[] | null {
  if (value === null || typeof value !== 'object') {
    return null
  }

  const visited = new Map<object, string[]>()

  function traverse(current: unknown, path: string[]): string[] | null {
    if (current === null || typeof current !== 'object') {
      return null
    }
    if (visited.has(current)) {
      const firstSeenPath = visited.get(current)!
      // 优化提示信息，使其更明确
      return [...path, `[Circular Reference -> '${firstSeenPath.join('.') || 'root'}']`]
    }

    visited.set(current, path)

    for (const [key, innerValue] of Object.entries(current)) {
      const result = traverse(innerValue, [...path, key])
      if (result) {
        return result
      }
    }

    visited.delete(current)
    return null
  }

  return traverse(value, [])
}

/**
 * 检查是否存在循环引用，并返回其路径。
 * @param value 要检查的值。
 * @param options 配置对象，必须将 getPath 设为 true。
 * @returns 如果找到循环引用，则返回表示路径的字符串数组；否则返回 null。
 */
export function isCircular(value: unknown, options: { getPath: true }): string[] | null
/**
 * 检查是否存在循环引用，返回布尔值。
 * @param value 要检查的值。
 * @param options 可选的配置对象，getPath 应为 false 或未定义。
 * @returns 如果存在循环引用，则返回 true；否则返回 false。
 */
export function isCircular(value: unknown, options?: { getPath: false }): boolean
/**
 * 检查是否存在循环引用，返回布尔值。
 * @param value 要检查的值。
 * @example isCircular({ a: 1 }) // => false
 * @returns 如果存在循环引用，则返回 true；否则返回 false。
 */
export function isCircular(value: unknown): boolean
/**
 * 检查一个值（通常是对象或数组）中是否存在循环引用，并可选择性地返回第一个检测到的循环路径。
 *
 * @remarks
 * 该函数提供两种操作模式，通过 `options.getPath` 参数来切换：
 *
 * 1.  **布尔检查模式 (默认):** 当 `getPath` 为 `false` 或未提供时，函数仅返回一个布尔值。
 *     此模式性能更高，因为它在内部使用 `WeakSet` 来高效地检测循环，不会记录路径。
 *
 * 2.  **路径查找模式:** 当 `getPath` 为 `true` 时，函数会尝试定位并返回第一个循环引用的路径。
 *     此模式在调试循环引用问题时非常有用，但会比布尔检查消耗更多的内存和时间。
 *
 * @param value - 要检查的值，可以是任何 JavaScript 类型。
 * @param options - 一个可选的配置对象，用于控制函数的行为。
 * @param options.getPath - 一个布尔值，用于决定函数的行为和返回类型。
 *                          - `true`: 启用路径查找模式。
 *                          - `false` (或未提供): 使用默认的布尔检查模式。
 *
 * @returns
 * - 如果 `getPath` 为 `true`，则返回一个字符串数组表示循环路径，如果不存在循环则返回 `null`。
 * - 如果 `getPath` 为 `false` 或未提供，则返回一个布尔值，`true` 表示存在循环，`false` 表示不存在。
 *
 * @example
 * ```typescript
 * // 示例 1: 默认的布尔检查模式
 * const obj1 = { a: {} };
 * obj1.a.b = obj1; // 创建一个循环引用
 *
 * isCircular(obj1);
 * // => true
 *
 * const obj2 = { a: { b: {} } };
 * isCircular(obj2);
 * // => false
 * ```
 *
 * @example
 * ```typescript
 * // 示例 2: 启用路径查找模式
 * const obj = { name: 'Dora', parent: null };
 * const child = { name: 'Pocket', parent: obj };
 * obj.parent = child; // 创建一个父子间的循环引用
 *
 * const path = isCircular(obj, { getPath: true });
 * // path 的值为: ['parent', 'parent', "[Circular Reference -> 'root']"]
 *
 * const nonCircular = { a: 1 };
 * isCircular(nonCircular, { getPath: true });
 * // => null
 * ```
 *
 * @see 若要了解更多信息，请访问 {@link https://esdora.js.org/packages/kit/reference/validate/is-circular | 官方文档页面}。
 */
export function isCircular(value: unknown, options?: { getPath: boolean }): boolean | string[] | null {
  const getPath = options?.getPath ?? false

  if (getPath) {
    return _findPath(value)
  }
  return _hasCircular(value)
}
