const LIB_PREFIX = '[@esdora/kit]'

/**
 * 在开发环境下输出警告信息。
 * 在生产构建中，此函数及其调用会被完全移除，以避免性能影响。
 * @param message 警告消息。
 * @param details 附加的调试信息，如出错的节点对象。
 * @internal
 */
export function devWarn(message: string, ...details: unknown[]): void {
  // 这是一个标准的模式，用于确保警告只在开发时出现。
  // 现代打包工具（如 Vite, Webpack）会在生产构建时将 `process.env.NODE_ENV`
  // 替换为 "production"，使得此 if 语句块被识别为死代码并被移除。
  // eslint-disable-next-line node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`${LIB_PREFIX} ${message}`, ...details)
  }
}
