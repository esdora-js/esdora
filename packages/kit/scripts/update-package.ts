#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generatePackageExports } from './generate-entries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 更新 package.json 的 exports 字段
 */
function updatePackageJson() {
  const packageJsonPath = join(__dirname, '../package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  // 生成新的 exports
  const newExports = generatePackageExports()

  // 更新 package.json
  packageJson.exports = newExports

  // 写回文件，保持格式化
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log('✅ Updated package.json exports:')
  console.log(JSON.stringify(newExports, null, 2))
}

// 直接执行
updatePackageJson()

export { updatePackageJson }
