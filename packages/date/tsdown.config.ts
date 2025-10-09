import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/fp.ts', 'src/locale.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
  },

])
