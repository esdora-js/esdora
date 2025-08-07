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

// 使用函数重载来定义不同的调用签名，这非常清晰
export function checkCircularReference(value: unknown, options: { getPath: true }): string[] | null
export function checkCircularReference(value: unknown, options?: { getPath: false }): boolean
export function checkCircularReference(value: unknown): boolean

/**
 * 检查对象中是否存在循环引用，并可选择性地返回循环路径。
 * 这是一个调度函数，根据选项调用不同的底层实现。
 *
 * @param value 要检查的值。
 * @param options 配置对象。
 * @param options.getPath - 如果为 `true`，返回循环路径或 null。
 *                         - 如果为 `false` 或未提供，返回 boolean。
 * @returns boolean 或 string[] | null。
 */
export function checkCircularReference(value: unknown, options?: { getPath: boolean }): boolean | string[] | null {
  const getPath = options?.getPath ?? false

  if (getPath) {
    return _findPath(value)
  }
  return _hasCircular(value)
}
