import { safe } from './safe'

/**
 * 创建一个高阶函数，用于将目标函数包装为带有错误处理逻辑的安全函数。
 *
 * @param handler - 处理执行过程中发生错误的函数。
 * @returns 一个函数，该函数接收目标函数 `fn` 和可选的 `errorHandler`。
 *          返回的函数会用错误处理包装 `fn`，优先使用传入的 `errorHandler`（接收错误和原始 handler），否则使用默认的 `handler`。
 *
 * @typeParam T - 需要包装的函数类型。
 *
 * @example
 * ```typescript
 * const safeHandler = createSafe(console.error);
 * const safeFn = safeHandler((x: number) => x * 2);
 * safeFn(2); // 返回 4
 * ```
 */
export function createSafe(handler: (err: any) => void): (...args: any[]) => any | undefined {
  return function <T extends (...args: any[]) => any>(fn: T, errorHandler?: (err: any, handler: (err: any) => void) => void): (...args: Parameters<T>) => ReturnType<T> | undefined {
    if (errorHandler) {
      return safe(fn, err => errorHandler(err, handler))
    }
    return safe(fn, handler)
  }
}
