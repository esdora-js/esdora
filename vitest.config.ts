import { defineConfig } from 'vitest/config'

/**
 * 根级 vitest 配置：仅覆盖 scripts/ 下的工具脚本测试。
 *
 * 各 packages/* 子包有各自的 vitest.config.ts，通过 `turbo test` 运行。
 * 此根配置专门为 scripts/ 下的 build-tooling 脚本（如
 * analyze-package-exports.mjs）提供单元测试运行环境，不与子包配置冲突。
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'scripts/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
    ],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'packages/**'],
    // analyze-package-exports.mjs 经 TypeScript Compiler API 解析全仓 10 entry
    // 并对多个外部 .d.ts 建独立 Program，单次 analyzeAll 耗时可达数秒，
    // 需要高于 vitest 默认 5s 的超时。
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
