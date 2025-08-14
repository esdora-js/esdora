import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import yaml from 'yaml'

/**
 * 获取模块的导出信息，直接读取 package.json 中的 exports 配置
 */
async function getKitExports() {
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
        importPath = `../src/${cleanPath}/index`
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
 * 测试 kit 包的所有导出
 * 直接读取 package.json 中的 exports 配置，确保测试与实际配置一致
 */
describe('exports-snapshot', () => {
  it('@esdora/kit', async () => {
    const exports = await getKitExports()

    // 生成 YAML 格式的快照，与 esdora 包保持一致
    await expect(yaml.stringify(exports))
      .toMatchFileSnapshot(`./exports/@esdora/kit.yaml`)
  })
})
