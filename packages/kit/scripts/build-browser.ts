#!/usr/bin/env tsx

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildBrowser() {
  const srcPath = join(__dirname, '../src/index.ts')
  const distDir = join(__dirname, '../dist')

  console.log('🔨 Building browser versions...')

  try {
    // 构建未压缩版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName: 'esdora',
      outfile: join(distDir, 'esdora.js'),
      target: 'es2015',
      sourcemap: true,
      minify: false,
    })

    // 构建压缩版本
    await build({
      entryPoints: [srcPath],
      bundle: true,
      format: 'iife',
      globalName: 'esdora',
      outfile: join(distDir, 'esdora.min.js'),
      target: 'es2015',
      sourcemap: true,
      minify: true,
    })

    console.log('✅ Browser versions built successfully!')
    console.log('  - dist/esdora.js (IIFE format)')
    console.log('  - dist/esdora.min.js (minified)')
  }
  catch (error) {
    console.error('❌ Failed to build browser versions:', error)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
}

// 直接执行
buildBrowser()

export { buildBrowser }
