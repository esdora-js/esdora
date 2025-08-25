import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/configs', 'src/cli'],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    output: {
      preserveModules: true,
    },
    esbuild: {
      target: 'es2020',
    },
  },
  externals: ['esbuild', 'unbuild', 'vitest'],
  sourcemap: false,
})
