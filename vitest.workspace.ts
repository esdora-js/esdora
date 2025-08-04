import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/*/vitest.config.ts',
  {
    test: {
      name: 'workspace',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/',
          'dist/',
          'scripts/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/build.config.*',
          '**/test/**',
          '**/tests/**',
          '**/coverage/**',
          '**/docs/**',
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },
    },
  },
])
