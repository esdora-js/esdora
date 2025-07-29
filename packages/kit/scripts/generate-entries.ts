import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 扫描 src 目录，找到所有包含 index.ts 的目录
 */
function scanSrcDirectory(srcPath: string): string[] {
  const entries: string[] = []

  function scanDir(dirPath: string) {
    if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
      return
    }

    const items = readdirSync(dirPath)

    // 检查当前目录是否有 index.ts
    if (items.includes('index.ts')) {
      const relativePath = relative(join(srcPath, '..'), dirPath)
      entries.push(relativePath)
    }

    // 递归扫描子目录
    for (const item of items) {
      const itemPath = join(dirPath, item)
      if (statSync(itemPath).isDirectory() && !item.startsWith('.') && !item.startsWith('_')) {
        scanDir(itemPath)
      }
    }
  }

  scanDir(srcPath)
  return entries.sort()
}

/**
 * 生成构建入口点
 */
export function generateBuildEntries(): string[] {
  const srcPath = join(__dirname, '../src')
  const entries = scanSrcDirectory(srcPath)

  // 将 'src' 替换为 'src/index' 以生成正确的主入口点
  return entries.map(entry => entry === 'src' ? 'src/index' : entry)
}

/**
 * 生成 package.json 的 exports 字段
 */
export function generatePackageExports(): Record<string, any> {
  const srcPath = join(__dirname, '../src')
  const entries = scanSrcDirectory(srcPath)
  const exports: Record<string, any> = {}

  for (const entry of entries) {
    // 移除 src/ 前缀
    const cleanEntry = entry.replace(/^src\//, '')

    if (entry === 'src') {
      // 主入口点
      exports['.'] = {
        import: {
          types: './dist/types/index.d.mts',
          default: './dist/index.mjs',
        },
        require: {
          types: './dist/types/index.d.cts',
          default: './dist/index.cjs',
        },
      }
    }
    else {
      // 子模块入口点
      const exportPath = `./${cleanEntry}`
      const distPath = `./dist/${cleanEntry}`

      exports[exportPath] = {
        import: {
          types: `./dist/types/${cleanEntry}.d.mts`,
          default: `${distPath}.mjs`,
        },
        require: {
          types: `./dist/types/${cleanEntry}.d.cts`,
          default: `${distPath}.cjs`,
        },
      }
    }
  }

  return exports
}
