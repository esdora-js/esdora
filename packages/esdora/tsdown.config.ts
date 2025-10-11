import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['index.ts'],
    unbundle: true,
    sourcemap: true,
    dts: true,
  },
])
