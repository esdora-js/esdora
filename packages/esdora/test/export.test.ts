import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'
import yaml from 'yaml'

describe('exports-snapshot', async () => {
  const packages: { name: string, path: string, private?: boolean }[] = JSON.parse(
    await x('pnpm', ['ls', '--only-projects', '--json']).then(r => r.stdout),
  )

  for (const pkg of packages) {
    if (pkg.private)
      continue
    it(`${pkg.name}`, async () => {
      const manifest = await getPackageExportsManifest({
        importMode: 'dist',
        cwd: pkg.path,
        resolveExportsValue: (value: string | Record<string, any>) => {
          // Handle string values directly
          if (typeof value === 'string')
            return value

          // Handle nested condition exports (import/require with types/default)
          if (value && typeof value === 'object') {
            // Try to get the default export from import or require conditions
            const importCondition = value.import || value.module
            const requireCondition = value.require

            // If import/require conditions exist, extract their default value
            if (importCondition && typeof importCondition === 'object')
              return (importCondition as Record<string, unknown>).default || importCondition
            if (requireCondition && typeof requireCondition === 'object')
              return requireCondition.default || requireCondition

            // Fallback to standard resolution
            return value['module-sync'] || value.default || value.import || value.module || value.require
          }

          return value
        },
      })
      await expect(yaml.stringify(manifest.exports))
        .toMatchFileSnapshot(`./exports/${pkg.name}.yaml`)
    })
  }
})
