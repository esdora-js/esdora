#!/usr/bin/env tsx

import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 将类型定义文件移动到 types 目录
 */
function organizeTypes() {
  const distPath = join(__dirname, '../dist')
  const typesPath = join(distPath, 'types')

  if (!existsSync(distPath)) {
    console.log('❌ dist 目录不存在')
    return
  }

  // 创建 types 目录
  if (!existsSync(typesPath)) {
    mkdirSync(typesPath, { recursive: true })
  }

  console.log('🔄 正在整理类型定义文件...')

  // 递归移动类型文件
  function moveTypeFiles(currentPath: string, relativePath = '') {
    const items = readdirSync(currentPath)

    for (const item of items) {
      const itemPath = join(currentPath, item)
      const stat = statSync(itemPath)

      if (stat.isDirectory() && item !== 'types') {
        // 递归处理子目录
        const newRelativePath = relativePath ? join(relativePath, item) : item
        moveTypeFiles(itemPath, newRelativePath)
      }
      else if (item.endsWith('.d.mts') || item.endsWith('.d.cts')) {
        // 移动类型文件
        const targetDir = relativePath ? join(typesPath, relativePath) : typesPath
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true })
        }

        const targetPath = join(targetDir, item)
        renameSync(itemPath, targetPath)

        const relativeTargetPath = relativePath ? join('types', relativePath, item) : join('types', item)
        console.log(`  ✅ ${relativePath ? join(relativePath, item) : item} → ${relativeTargetPath}`)
      }
    }
  }

  moveTypeFiles(distPath)
  console.log('🎉 类型文件整理完成！')
}

// 直接执行
organizeTypes()

export { organizeTypes }
