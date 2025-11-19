import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
  },

])
