import { createTestConfig } from '@esdora/build-tools/configs'
import { defineConfig } from 'vitest/config'

export default defineConfig(createTestConfig({
  environment: 'node',
  coverageThresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}))
