#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { buildPackage } from './build'

/**
 * 从 package.json 读取包信息
 */
function getPackageInfo(cwd = process.cwd()): { name: string, browser?: string } {
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
    process.exit(1)
  }
}

/**
 * 从包名生成全局变量名
 */
function generateGlobalName(packageName: string): string {
  // @esdora/kit -> esdoraKit
  // @esdora/color -> esdoraColor
  return packageName
    .replace('@', '')
    .replace('/', '')
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 从包名生成浏览器文件名
 */
function generateBrowserFileName(packageName: string): string {
  // @esdora/kit -> esdora-kit
  // @esdora/color -> esdora-color
  return packageName.replace('@', '').replace('/', '-')
}

async function main(): Promise<void> {
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

// 直接执行时运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  })
}
