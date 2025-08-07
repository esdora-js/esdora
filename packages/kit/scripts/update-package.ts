#!/usr/bin/env tsx

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generatePackageExports } from './generate-entries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

  // 更新 files 字段，指向当前目录的所有内容
  distPackageJson.files = [
    '*.mjs',
    '*.cjs',
    '*.js',
    '*.map',
    'types',
    'function',
    'promise',
    'validate',
    'web',
    '_internal',
  ]

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
