import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

export interface BuildOptions {
  /** 包名，用于日志显示 */
  packageName: string
  /** 是否构建浏览器版本 */
  buildBrowser?: boolean
  /** 浏览器版本的全局变量名 */
  globalName?: string
  /** 浏览器版本的输出文件名（不含扩展名） */
  browserFileName?: string
  /** 项目根目录，默认为调用脚本的目录 */
  cwd?: string
}

/**
 * 将类型定义文件移动到 types 目录
 */
export function organizeTypes(cwd = process.cwd()): void {
  const distPath = join(cwd, 'dist')
  const typesPath = join(distPath, 'types')

  if (!existsSync(distPath)) {
    console.warn('❌ dist 目录不存在')
    return
  }

  // 创建 types 目录
  if (!existsSync(typesPath)) {
    mkdirSync(typesPath, { recursive: true })
  }

  console.warn('🔄 正在整理类型定义文件...')

  // 递归移动类型文件
  function moveTypeFiles(currentPath: string, relativePath = ''): void {
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
        console.warn(`  ✅ ${relativePath ? join(relativePath, item) : item} → ${relativeTargetPath}`)
      }
    }
  }

  moveTypeFiles(distPath)
  console.warn('🎉 类型文件整理完成！')
}

/**
 * 构建浏览器版本
 */
export async function buildBrowser(options: {
  globalName: string
  browserFileName: string
  cwd?: string
}): Promise<void> {
  const { globalName, browserFileName, cwd = process.cwd() } = options

  console.warn('🔨 构建浏览器版本...')

  const srcPath = join(cwd, 'src/index.ts')
  const distPath = join(cwd, 'dist')

  try {
    // 构建 IIFE 版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName,
      outfile: join(distPath, `${browserFileName}.js`),
      sourcemap: true,
      target: 'es2020',
    })

    // 构建压缩版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName,
      outfile: join(distPath, `${browserFileName}.min.js`),
      sourcemap: true,
      minify: true,
      target: 'es2020',
    })

    console.warn('✅ 浏览器版本构建成功!')
    console.warn(`  - dist/${browserFileName}.js (IIFE format)`)
    console.warn(`  - dist/${browserFileName}.min.js (minified)`)
  }
  catch (error) {
    console.error('❌ 浏览器版本构建失败:', error)
    throw error
  }
}

/**
 * 完整的构建流程
 */
export async function buildPackage(options: BuildOptions): Promise<void> {
  const {
    packageName,
    buildBrowser: shouldBuildBrowser = false,
    globalName,
    browserFileName,
    cwd = process.cwd(),
  } = options

  try {
    console.warn(`🚀 开始构建 ${packageName}...\n`)

    // 1. 运行 unbuild
    console.warn('1️⃣ 运行 unbuild...')
    execSync('unbuild', { stdio: 'inherit', cwd })
    console.warn()

    // 2. 整理类型文件
    console.warn('2️⃣ 整理类型文件...')
    organizeTypes(cwd)
    console.warn()

    // 3. 构建浏览器版本（如果需要）
    if (shouldBuildBrowser) {
      if (!globalName || !browserFileName) {
        throw new Error('构建浏览器版本需要提供 globalName 和 browserFileName')
      }

      console.warn('3️⃣ 构建浏览器版本...')
      await buildBrowser({ globalName, browserFileName, cwd })
      console.warn()
    }

    console.warn('🎉 构建完成！')
  }
  catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  }
}
