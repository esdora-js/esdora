import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'
import yaml from 'yaml'

describe('exports-snapshot', async () => {
  const packages: { name: string, path: string, private?: boolean }[] = JSON.parse(
    await x('pnpm', ['ls', '--only-projects', '-r', '--json']).then(r => r.stdout),
  )

  for (const pkg of packages) {
    if (pkg.private)
      continue
    it(`${pkg.name}`, async () => {
      const manifest = await getPackageExportsManifest({
        importMode: 'src',
        cwd: pkg.path,
        // 自定义 resolveSourcePath 函数来处理复杂的导出配置
        resolveSourcePath: (dist: any) => {
          // 如果 dist 不是字符串，尝试从对象中提取路径
          if (typeof dist !== 'string') {
            if (dist && typeof dist === 'object') {
              // 优先使用 import.default，然后是 require.default
              const importPath = dist.import?.default || dist.import
              const requirePath = dist.require?.default || dist.require
              const defaultPath = dist.default

              const path = importPath || requirePath || defaultPath
              if (typeof path === 'string') {
                return path.replace('dist', 'src').replace(/\.[mc]?js$/, '')
              }
            }
            // 如果无法解析，返回空字符串
            return ''
          }
          // 原始逻辑：处理字符串路径
          return dist.replace('dist', 'src').replace(/\.[mc]?js$/, '')
        },
      })
      await expect(yaml.stringify(manifest.exports))
        .toMatchFileSnapshot(`./exports/${pkg.name}.yaml`)
    })
  }
})
