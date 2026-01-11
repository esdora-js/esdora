import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/atom-css/index.ts', 'src/qs/index.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
  },

])
