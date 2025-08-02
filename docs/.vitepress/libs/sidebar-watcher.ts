import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 侧边栏文件监听插件
 * 监听文档文件的变化，自动触发侧边栏配置重新加载
 */
export function sidebarWatcherPlugin(): Plugin {
  return {
    name: 'sidebar-watcher',
    configureServer(server) {
      const currentDir = path.dirname(fileURLToPath(import.meta.url))
      const docsDir = path.resolve(currentDir, '../../')
      const configPath = path.resolve(currentDir, '../config.ts')

      // 需要监听的文档目录
      const watchDirs = [
        path.join(docsDir, 'kit/reference/validate'),
        path.join(docsDir, 'kit/reference/web'),
        path.join(docsDir, 'kit/reference/promise'),
        path.join(docsDir, 'kit/reference/function'),
      ]

      // 添加目录到 Vite 监听器
      watchDirs.forEach((dir) => {
        server.watcher.add(dir)
      })

      // 处理文件变化的函数
      const handleFileChange = (filePath: string, action: string): void => {
        if (!filePath.endsWith('.md') || !watchDirs.some(dir => filePath.startsWith(dir))) {
          return
        }

        console.warn(`[Sidebar Watcher] File ${action}: ${path.basename(filePath)}`)

        // 延迟执行确保文件操作完成
        setTimeout(() => {
          console.warn('[Sidebar Watcher] Triggering configuration reload...')

          try {
            // 更新配置文件时间戳以触发重新加载
            const now = new Date()
            fs.utimesSync(configPath, now, now)
            console.warn('[Sidebar Watcher] Config file timestamp updated')

            // 发送完整重载消息作为备用方案
            server.ws.send({
              type: 'full-reload',
            })
          }
          catch (error) {
            console.error('[Sidebar Watcher] Failed to update config timestamp:', error)

            // 如果更新时间戳失败，仍然尝试发送重载消息
            server.ws.send({
              type: 'full-reload',
            })
          }
        }, 300)
      }

      // 监听文件添加事件
      server.watcher.on('add', (filePath) => {
        handleFileChange(filePath, 'added')
      })

      // 监听文件删除事件
      server.watcher.on('unlink', (filePath) => {
        handleFileChange(filePath, 'removed')
      })
    },
  }
}
