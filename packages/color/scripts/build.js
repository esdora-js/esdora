#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildPackage } from '@esdora/build-tools'

/**
 * 从 package.json 读取包信息
 */
// eslint-disable-next-line node/prefer-global/process
function getPackageInfo(cwd = process.cwd()) {
  try {
    const packageJsonPath = join(cwd, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return {
      name: packageJson.name,
      browser: packageJson.browser,
    }
  }
  catch (error) {
    console.error('❌ 无法读取 package.json:', error)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
}

async function main() {
  // eslint-disable-next-line node/prefer-global/process
  const cwd = process.cwd()
  const packageInfo = getPackageInfo(cwd)

  const buildOptions = {
    packageName: packageInfo.name,
    buildBrowser: false, // color 包不需要浏览器版本
    cwd,
  }

  await buildPackage(buildOptions)
}

main().catch((error) => {
  console.error('❌ 构建失败:', error)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
