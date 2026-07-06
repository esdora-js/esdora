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
