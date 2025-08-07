import { describe, expect, it } from 'vitest'
import yaml from 'yaml'

/**
 * 获取模块的导出信息，模拟 vitest-package-exports 的行为
 * 但支持私有包，并生成完整的子模块导出信息
 */
async function getKitExports() {
  const { generatePackageExports } = await import('../scripts/generate-entries')

  // 使用现有的 generatePackageExports 函数来获取完整的导出信息
  const packageExports = generatePackageExports()

  // 转换为 vitest-package-exports 的格式
  const result: Record<string, Record<string, string>> = {}

  for (const [exportPath] of Object.entries(packageExports)) {
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
 * 生成与 esdora 包一致的 YAML 格式快照
 * 由于 kit 包是私有的，我们使用自定义逻辑但保持相同的输出格式
 */
describe('exports-snapshot', () => {
  it('@esdora/kit', async () => {
    const exports = await getKitExports()

    // 生成 YAML 格式的快照，与 esdora 包保持一致
    await expect(yaml.stringify(exports))
      .toMatchFileSnapshot(`./exports/@esdora/kit.yaml`)
  })
})
