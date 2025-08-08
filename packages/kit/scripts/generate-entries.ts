import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 扫描 src 目录，只找到顶级目录（用于 exports）
 */
function scanTopLevelDirectories(srcPath: string): string[] {
  const entries: string[] = []

  if (!existsSync(srcPath) || !statSync(srcPath).isDirectory()) {
    return entries
  }

  const items = readdirSync(srcPath)

  // 添加根目录（如果有 index.ts）
  if (items.includes('index.ts')) {
    entries.push('src')
  }

  // 只扫描第一级子目录
  for (const item of items) {
    const itemPath = join(srcPath, item)
    if (statSync(itemPath).isDirectory() && !item.startsWith('.') && !item.startsWith('_')) {
      // 检查子目录是否有 index.ts
      const subItems = readdirSync(itemPath)
      if (subItems.includes('index.ts')) {
        entries.push(`src/${item}`)
      }
    }
  }

  return entries.sort()
}

/**
 * 生成构建入口点
 */
export function generateBuildEntries(): string[] {
  const srcPath = join(__dirname, '../src')
  const entries = scanTopLevelDirectories(srcPath)

  // 将 'src' 替换为 'src/index' 以生成正确的主入口点
  return entries.map(entry => entry === 'src' ? 'src/index' : entry)
}

/**
 * 生成 package.json 的 exports 字段（用于源码目录的 package.json）
 */
export function generatePackageExports(): Record<string, any> {
  const srcPath = join(__dirname, '../src')
  const entries = scanTopLevelDirectories(srcPath)
  const exports: Record<string, any> = {}

  // 路径相对于包根目录，指向 dist 目录
  const pathPrefix = './dist/'
  const typesPrefix = './dist/types/'

  for (const entry of entries) {
    // 移除 src/ 前缀
    const cleanEntry = entry.replace(/^src\//, '')

    if (entry === 'src') {
      // 主入口点
      exports['.'] = {
        import: {
          types: `${typesPrefix}index.d.mts`,
          default: `${pathPrefix}index.mjs`,
        },
        require: {
          types: `${typesPrefix}index.d.cts`,
          default: `${pathPrefix}index.cjs`,
        },
      }
    }
    else {
      // 只导出目录级别的入口点，不导出每个函数
      const exportPath = `./${cleanEntry}`

      exports[exportPath] = {
        import: {
          types: `${typesPrefix}${cleanEntry}.d.mts`,
          default: `${pathPrefix}${cleanEntry}.mjs`,
        },
        require: {
          types: `${typesPrefix}${cleanEntry}.d.cts`,
          default: `${pathPrefix}${cleanEntry}.cjs`,
        },
      }
    }
  }

  return exports
}

/**
 * 更新源码 package.json 的 exports 字段
 */
export function updatePackageExports() {
  const packageJsonPath = join(__dirname, '../package.json')

  // 读取当前的 package.json
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  // 生成新的 exports
  const newExports = generatePackageExports()

  // 更新 exports 字段
  packageJson.exports = newExports

  // 写回文件
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log('✅ Updated package.json exports with', Object.keys(newExports).length, 'entries')
}

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
