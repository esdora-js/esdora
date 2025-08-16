#!/usr/bin/env tsx

import { organizeTypes } from './generate-entries'

/**
 * 完整的构建流程
 */
async function build() {
  try {
    console.log('🚀 开始构建 @esdora/kit...\n')

    // 1. 运行 unbuild（通过 npm script）
    console.log('1️⃣ 运行 unbuild...')
    const { execSync } = await import('node:child_process')
    // eslint-disable-next-line node/prefer-global/process
    execSync('unbuild', { stdio: 'inherit', cwd: process.cwd() })
    console.log()

    // 2. 整理类型文件
    console.log('2️⃣ 整理类型文件...')
    organizeTypes()
    console.log()

    console.log('🎉 构建完成！')
  }
  catch (error) {
    console.error('❌ 构建失败:', error)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
}

// 直接执行时运行构建
// eslint-disable-next-line node/prefer-global/process
if (import.meta.url === `file://${process.argv[1]}`) {
  build()
}

export { build }
