import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import yaml from 'yaml'

/**
 * 获取模块的导出信息，直接读取 package.json 中的 exports 配置
 */
async function getBizExports() {
  // 读取 package.json 中的 exports 配置
  const packageJsonPath = join(__dirname, '../package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const packageExports = packageJson.exports || {}

  // 转换为测试格式
  const result: Record<string, Record<string, string>> = {}

  for (const exportPath of Object.keys(packageExports)) {
    // 动态导入每个模块来获取实际的导出
    try {
      let importPath: string
      if (exportPath === '.') {
        importPath = '../src/index'
      }
      else {
        // 移除开头的 './' 并构建导入路径
        const cleanPath = exportPath.replace(/^\.\//, '')
        // 直接使用 cleanPath，因为 experimental.ts 文件直接存在于 src 目录下
        importPath = `../src/${cleanPath}`
      }

      const moduleExports = await import(importPath)
      const exports: Record<string, string> = {}

      for (const [name, value] of Object.entries(moduleExports)) {
        if (typeof value === 'function') {
          exports[name] = 'function'
        }
        else if (typeof value === 'object' && value !== null) {
          exports[name] = 'object'
        }
        else {
          exports[name] = typeof value
        }
      }

      result[exportPath] = exports
    }
    catch (error) {
      console.warn(`Failed to import ${exportPath}:`, error)
      result[exportPath] = {}
    }
  }

  return result
}

/**
 * 测试 biz 包的所有导出
 * 直接读取 package.json 中的 exports 配置，确保测试与实际配置一致
 * 为每个入口文件单独生成快照文件，便于维护和追踪变化
 */
describe('exports-snapshot', () => {
  it('@esdora/biz - all exports', async () => {
    const exports = await getBizExports()

    // 为每个导出路径生成单独的快照文件
    for (const [exportPath, moduleExports] of Object.entries(exports)) {
      const normalizedPath = exportPath === '.' ? 'index' : exportPath.replace(/^\.\//, '')
      const snapshotPath = `./exports/@esdora/biz-${normalizedPath}.yaml`

      await expect(yaml.stringify(moduleExports))
        .toMatchFileSnapshot(snapshotPath)
    }
  })
})
