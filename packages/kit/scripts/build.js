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

/**
 * 从包名生成全局变量名
 */
function generateGlobalName(packageName) {
  // @esdora/kit -> esdoraKit
  return packageName
    .replace('@', '')
    .replace('/', '')
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 从包名生成浏览器文件名
 */
function generateBrowserFileName(packageName) {
  // @esdora/kit -> esdora-kit
  return packageName.replace('@', '').replace('/', '-')
}

async function main() {
  // eslint-disable-next-line node/prefer-global/process
  const cwd = process.cwd()
  const packageInfo = getPackageInfo(cwd)

  // 检查是否需要构建浏览器版本
  const shouldBuildBrowser = !!packageInfo.browser

  const buildOptions = {
    packageName: packageInfo.name,
    buildBrowser: shouldBuildBrowser,
    cwd,
  }

  if (shouldBuildBrowser) {
    Object.assign(buildOptions, {
      globalName: generateGlobalName(packageInfo.name),
      browserFileName: generateBrowserFileName(packageInfo.name),
    })
  }

  await buildPackage(buildOptions)
}

main().catch((error) => {
  console.error('❌ 构建失败:', error)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
