// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    formatters: true,
    pnpm: true,
  },
  {
    ignores: [
      '**/templates/**',
      'docs/templates/**',
      'docs/contributing/documentation/**',
    ],
    rules: {
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
