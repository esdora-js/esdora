import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 将类型定义文件移动到 types 目录
 */
export function organizeTypes() {
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

/**
 * 构建浏览器版本
 */
export async function buildBrowser() {
  console.log('🔨 Building browser versions...')

  const srcPath = join(__dirname, '../src/index.ts')
  const distPath = join(__dirname, '../dist')

  try {
    // 构建 IIFE 版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName: 'esdoraKit',
      outfile: join(distPath, 'esdora.js'),
      sourcemap: true,
      target: 'es2020',
    })

    // 构建压缩版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName: 'esdoraKit',
      outfile: join(distPath, 'esdora.min.js'),
      sourcemap: true,
      minify: true,
      target: 'es2020',
    })

    console.log('✅ Browser versions built successfully!')
    console.log('  - dist/esdora.js (IIFE format)')
    console.log('  - dist/esdora.min.js (minified)')
  }
  catch (error) {
    console.error('❌ Browser build failed:', error)
    throw error
  }
}
