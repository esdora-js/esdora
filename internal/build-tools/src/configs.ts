import type { BuildConfig } from 'unbuild'
import type { UserConfig } from 'vitest/config'

export interface PackageBuildOptions {
  /** 入口文件，默认为 ['src/index'] */
  entries?: string[]
  /** 外部依赖 */
  externals?: string[]
  /** 是否启用 sourcemap，默认为 true */
  sourcemap?: boolean
  /** esbuild 目标，默认为 'es2020' */
  target?: string
}

export interface PackageTestOptions {
  /** 覆盖率阈值 */
  coverageThresholds?: {
    branches?: number
    functions?: number
    lines?: number
    statements?: number
  }
  /** 测试环境，默认为 'node' */
  environment?: 'node' | 'jsdom' | 'happy-dom'
  /** 额外的排除文件 */
  excludeFiles?: string[]
  /** 额外的包含文件 */
  includeFiles?: string[]
}

/**
 * 生成 unbuild 配置
 */
export function createBuildConfig(options: PackageBuildOptions = {}): BuildConfig {
  const {
    entries = ['src/index'],
    externals = [],
    sourcemap = true,
    target = 'es2020',
  } = options

  return {
    entries,
    declaration: 'node16',
    clean: true,
    failOnWarn: false,
    rollup: {
      emitCJS: true,
      output: {
        preserveModules: false,
      },
      esbuild: {
        target,
      },
    },
    externals,
    sourcemap,
  }
}

/**
 * 生成 vitest 配置
 */
export function createTestConfig(options: PackageTestOptions = {}): UserConfig {
  const {
    coverageThresholds = {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    environment = 'node',
    excludeFiles = [],
    includeFiles = [],
  } = options

  const defaultExclude = [
    'node_modules/',
    'dist/',
    'scripts/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/build.config.*',
    ...excludeFiles,
  ]

  const defaultInclude = [
    'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ...includeFiles,
  ]

  return {
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: defaultExclude,
        thresholds: {
          global: coverageThresholds,
        },
      },
      environment,
      globals: true,
      env: {
        NODE_ENV: 'development',
      },
      include: defaultInclude,
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      server: {
        deps: {
          inline: ['vitest-package-exports'],
        },
      },
      testTimeout: 3_600_000,
    },
  }
}
