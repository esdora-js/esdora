/**
 * 将 Promise 转换为一个元组，包含错误和数据。
 * @param { Promise } promise
 * @param {object=} errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 * @Reference https://github.com/scopsy/await-to-js
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}
