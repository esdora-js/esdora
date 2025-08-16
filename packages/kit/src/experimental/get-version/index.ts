import { version } from '../../../package.json'

/**
 * @experimental
 *
 * 这是一个实验性的函数**示例**，用于获取当前包的版本号。
 *
 * @returns 当前包的版本号
 */
export function _unstable_getVersion(): string {
  return version
}
