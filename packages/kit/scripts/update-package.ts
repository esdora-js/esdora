#!/usr/bin/env tsx

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generatePackageExports } from './generate-entries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 自动发现 dist 目录中的所有文件和目录，生成 files 字段
 */
function generateFilesField(distPath: string): string[] {
  const files: string[] = []

  if (!existsSync(distPath)) {
    return files
  }

  const items = readdirSync(distPath)

  for (const item of items) {
    const itemPath = join(distPath, item)
    const stat = statSync(itemPath)

    if (stat.isDirectory()) {
      // 添加目录名
      files.push(item)
    }
    else if (item !== 'package.json') {
      // 添加文件，但排除 package.json（避免循环引用）
      files.push(item)
    }
  }

  // 按文件类型和名称排序，确保一致性
  return files.sort((a, b) => {
    // 文件模式（*.xxx）排在前面
    const aIsPattern = a.includes('*')
    const bIsPattern = b.includes('*')

    if (aIsPattern && !bIsPattern)
      return -1
    if (!aIsPattern && bIsPattern)
      return 1

    // 其他按字母顺序排序
    return a.localeCompare(b)
  })
}

/**
 * 生成完整的 package.json 到 dist 目录
 */
function generateDistPackageJson() {
  const sourcePackageJsonPath = join(__dirname, '../package.json')
  const distPath = join(__dirname, '../dist')
  const distPackageJsonPath = join(distPath, 'package.json')

  // 确保 dist 目录存在
  if (!existsSync(distPath)) {
    mkdirSync(distPath, { recursive: true })
  }

  // 读取源码 package.json
  const sourcePackageJson = JSON.parse(readFileSync(sourcePackageJsonPath, 'utf-8'))

  // 生成新的 exports（为 dist 目录中的 package.json）
  const newExports = generatePackageExports()

  // 需要移除的开发相关字段
  const fieldsToRemove = [
    'scripts', // 开发脚本
    'devDependencies', // 开发依赖
    'private', // 移除私有标记，使其成为公开包
    'publishConfig', // 移除发布配置，dist 版本不需要
    // 保留元数据字段：description, author, license, funding, homepage, repository, bugs, keywords
  ]

  // 创建 dist 版本的 package.json
  const distPackageJson = { ...sourcePackageJson }

  // 移除开发相关字段
  fieldsToRemove.forEach((field) => {
    delete distPackageJson[field]
  })

  // 更新路径相关字段，移除 dist/ 前缀
  distPackageJson.main = distPackageJson.main?.replace('./dist/', './')
  distPackageJson.module = distPackageJson.module?.replace('./dist/', './')
  distPackageJson.browser = distPackageJson.browser?.replace('./dist/', './')
  distPackageJson.types = distPackageJson.types?.replace('./dist/', './')

  // 复制 README.md 到 dist 目录
  const readmePath = join(__dirname, '../README.md')
  const distReadmePath = join(distPath, 'README.md')
  if (existsSync(readmePath)) {
    copyFileSync(readmePath, distReadmePath)
    console.log('✅ Copied README.md to dist directory')
  }
  else {
    console.warn('⚠️  README.md not found in source directory')
  }

  // 自动生成 files 字段，包含 dist 目录中的所有内容
  distPackageJson.files = generateFilesField(distPath)

  // 设置动态生成的 exports
  distPackageJson.exports = newExports

  // 写入 dist 目录
  writeFileSync(distPackageJsonPath, `${JSON.stringify(distPackageJson, null, 2)}\n`)

  console.log('✅ Generated dist/package.json with exports:')
  console.log(JSON.stringify(newExports, null, 2))
}

// 直接执行时生成 dist package.json
// eslint-disable-next-line node/prefer-global/process
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDistPackageJson()
}

export { generateDistPackageJson }
