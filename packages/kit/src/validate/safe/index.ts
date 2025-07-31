/**
 * 用错误处理包装一个函数，确保任何抛出的错误都被捕获并传递给可选的错误处理器。
 *
 * - 如果传入的 `fn` 不是函数，则使用一个返回 `undefined` 的默认函数。
 * - 如果 `fn` 的任何参数本身是函数，则递归地用 `safe` 包装它。
 * - 如果 `fn` 的返回值是 Promise，则捕获错误并传递给错误处理器。
 * - 如果 `fn` 的返回值是函数，则递归地用 `safe` 包装它。
 *
 * @template T - 要包装的函数类型。
 * @param fn - 需要安全包装的函数。
 * @param errorHandler - 可选的错误处理函数，接收错误和一个可选的处理器。
 * @returns 一个新函数，参数与 `fn` 相同，返回类型与 `fn` 相同，出错时返回 `undefined`。
 */
export function safe<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any, handler?: (err: any) => void) => void,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  if (typeof fn !== 'function') {
    console.warn('safe: fn is not a function, returning a default function')
    fn = ((..._args: any[]) => undefined) as T // 如果 fn 不是函数，返回一个默认的函数
  }

  return function (this: any, ...args: Parameters<T>) {
    try {
      const safeArgs = args.some(arg => typeof arg === 'function')
        ? args.map(arg => (typeof arg === 'function' ? safe(arg, errorHandler) : arg)) as Parameters<T>
        : args
      const result = fn.call(this, ...safeArgs)

      if (result instanceof Promise) {
        return result.catch((err: any) => {
          errorHandler?.(err)
        })
      }

      if (typeof result === 'function') {
        return safe(result, errorHandler) as ReturnType<T>
      }

      return result
    }
    catch (err) {
      errorHandler?.(err)
    }
  }
}

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
