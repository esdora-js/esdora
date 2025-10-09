import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/experimental.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
  },
  {
    entry: {
      'esdora-kit': 'src/index.ts',
    },
    format: 'iife',
    globalName: 'esdoraKit',
    target: 'es2015',
  },
  {
    entry: {
      'esdora-kit.min': 'src/index.ts',
    },
    format: 'iife',
    globalName: 'esdoraKit',
    target: 'es2015',
    minify: true,
  },
])
