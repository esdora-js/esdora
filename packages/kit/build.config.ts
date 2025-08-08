import { defineBuildConfig } from 'unbuild'
import { generateBuildEntries } from './scripts/generate-entries'

export default defineBuildConfig({
  entries: generateBuildEntries(),
  declaration: 'node16', // 生成 .d.mts 和 .d.cts 文件
  clean: true,
  failOnWarn: false, // 禁用警告导致的构建失败
  rollup: {
    emitCJS: true,
    output: {
      preserveModules: false, // 不保留模块结构，只生成入口点文件
    },
    esbuild: {
      target: 'es2020',
    },
  },
  // 确保 tree-shaking 友好
  externals: [],
  // 启用 sourcemap 以便调试
  sourcemap: true,
})
