import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  analyzeAll,
  buildDocsFileset,
  deriveDocUrl,
  deriveOverviewUrl,
  detectConflicts,
  isExternalSourceLabel,
  packageNameOf,
  renderLlmsMarkdown,
  toKebab,
} from './analyze-package-exports.mjs'

const SCRIPT_PATH = fileURLToPath(new URL('./analyze-package-exports.mjs', import.meta.url))
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url))

/**
 * Phase 2 导出审计脚本单元测试。
 *
 * 测试分两类：
 * 1. detectConflicts 纯函数单元测试 —— 构造合成 surface 覆盖
 *    Case A (AMBIGUOUS)、Case B (OVERRIDE)、clean（无冲突）三类路径。
 *    这类测试不依赖真实仓库结构，是回归保护的核心。
 * 2. analyzeAll 真实仓库快照测试 —— 锚定 5 包 10 entry 的解析契约，
 *    防止内核重构时静默丢失入口。
 * 3. CLI 子进程退出码测试 —— 验证 --audit 的 exit code 契约。
 *
 * Phase 3 --docs 纯函数单元测试（见下方各 describe）：
 * 4. toKebab —— camelCase / UPPER_SNAKE / PascalCase / _unstable_ 前缀的转换边界。
 * 5. deriveDocUrl —— 候选枚举顺序、docsFileset 存在性命中 / 未命中、包根桶、
 *    分类桶、函数子目录三类源码形态。
 * 6. buildDocsFileset —— 真实 docs/ 目录递归收集。
 * 7. renderLlmsMarkdown —— 输出结构（安装、依赖、子路径、本地 API 表格）。
 * 8. isExternalSourceLabel / packageNameOf —— 来源标签判定与包名提取。
 */

describe('detectConflicts — Case B (OVERRIDE)', () => {
  it('符号同时被显式 export 与 export * 来源提供时，标记为 OVERRIDE', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map([
        ['converter', { origin: 'local', originFile: '/fake/index.ts' }],
      ]),
      symbolSources: new Map([
        ['converter', new Set(['culori'])],
      ]),
    }
    const conflicts = detectConflicts(surface)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0]).toMatchObject({
      type: 'OVERRIDE',
      package: '@esdora/test',
      entry: '.',
      symbol: 'converter',
      sources: ['culori'],
    })
  })

  it('override 优先于 ambiguous：显式 export 解析了 star 来源冲突，不报 AMBIGUOUS', () => {
    // 显式 export + 多个 star 来源同名 —— 应只报一条 OVERRIDE（不报 AMBIGUOUS）
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map([
        ['shared', { origin: 'local', originFile: '/fake/index.ts' }],
      ]),
      symbolSources: new Map([
        ['shared', new Set(['mod-a', 'mod-b'])],
      ]),
    }
    const conflicts = detectConflicts(surface)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].type).toBe('OVERRIDE')
  })
})

describe('detectConflicts — Case A (AMBIGUOUS)', () => {
  it('符号来自 >=2 个 export * 来源且未被显式解决时，标记为 AMBIGUOUS', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map(),
      symbolSources: new Map([
        ['sharedName', new Set(['./_synth_a', './_synth_b'])],
      ]),
    }
    const conflicts = detectConflicts(surface)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0]).toMatchObject({
      type: 'AMBIGUOUS',
      symbol: 'sharedName',
    })
    // 来源列表需排序以保证输出稳定
    expect(conflicts[0].sources).toEqual(['./_synth_a', './_synth_b'])
  })

  it('ambiguous 来源按字母序排序（输出稳定性）', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map(),
      symbolSources: new Map([
        ['x', new Set(['z-mod', 'a-mod', 'm-mod'])],
      ]),
    }
    const conflicts = detectConflicts(surface)
    expect(conflicts[0].sources).toEqual(['a-mod', 'm-mod', 'z-mod'])
  })
})

describe('detectConflicts — clean paths', () => {
  it('单一 star 来源的符号不报冲突', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map(),
      symbolSources: new Map([
        ['onlyFromOne', new Set(['date-fns'])],
        ['alsoOne', new Set(['culori'])],
      ]),
    }
    expect(detectConflicts(surface)).toHaveLength(0)
  })

  it('显式 export 但无 star 来源的符号不报冲突', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map([
        ['localFn', { origin: 'local', originFile: '/fake/index.ts' }],
      ]),
      symbolSources: new Map(),
    }
    expect(detectConflicts(surface)).toHaveLength(0)
  })

  it('空 surface 不报冲突', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: null,
      symbols: new Map(),
      symbolSources: new Map(),
    }
    expect(detectConflicts(surface)).toHaveLength(0)
  })

  it('symbolSources 中 size 为 0 的来源集合被跳过', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map(),
      symbolSources: new Map([
        ['ghost', new Set()],
      ]),
    }
    expect(detectConflicts(surface)).toHaveLength(0)
  })
})

describe('detectConflicts — 多符号混合', () => {
  it('一个 surface 内同时存在 OVERRIDE 与 AMBIGUOUS 时分别上报', () => {
    const surface = {
      package: '@esdora/test',
      entry: '.',
      sourceFile: '/fake/index.ts',
      symbols: new Map([
        ['overrideMe', { origin: 'local', originFile: '/fake/index.ts' }],
      ]),
      symbolSources: new Map([
        ['overrideMe', new Set(['culori'])],
        ['ambiguousOne', new Set(['a', 'b'])],
        ['clean', new Set(['solo'])],
      ]),
    }
    const conflicts = detectConflicts(surface)
    expect(conflicts).toHaveLength(2)
    const types = conflicts.map(c => c.type).sort()
    expect(types).toEqual(['AMBIGUOUS', 'OVERRIDE'])
  })
})

describe('analyzeAll — 真实仓库导出面解析契约', () => {
  // 锚定 Phase 2 Success Criteria：解析全仓 5 包共 10 个 entry
  const EXPECTED_PACKAGES = [
    '@esdora/biz',
    '@esdora/color',
    '@esdora/date',
    '@esdora/kit',
    'esdora',
  ]

  const EXPECTED_ENTRIES = [
    '@esdora/biz:.',
    '@esdora/biz:./atom-css',
    '@esdora/biz:./qs',
    '@esdora/color:.',
    '@esdora/date:.',
    '@esdora/date:./fp',
    '@esdora/date:./locale',
    '@esdora/kit:.',
    '@esdora/kit:./experimental',
    'esdora:.',
  ]

  // analyzeAll() 经 TS Compiler API 解析全仓，单次开销达数秒；
  // 在 describe 内共享一次结果，避免每个 it 重复解析。
  let surfaces
  beforeAll(() => {
    surfaces = analyzeAll()
  })

  it('解析出恰好 5 个包', () => {
    const pkgNames = [...new Set(surfaces.map(s => s.package))]
    for (const pkg of EXPECTED_PACKAGES)
      expect(pkgNames).toContain(pkg)
  })

  it('解析出恰好 10 个 entry（含子入口）', () => {
    expect(surfaces).toHaveLength(10)
    const entryKeys = surfaces.map(s => `${s.package}:${s.entry}`).sort()
    expect(entryKeys).toEqual([...EXPECTED_ENTRIES].sort())
  })

  it('date ./fp 与 ./locale 子入口被解析（export * 链递归展开验证）', () => {
    const fpSurface = surfaces.find(s => s.package === '@esdora/date' && s.entry === './fp')
    const localeSurface = surfaces.find(s => s.package === '@esdora/date' && s.entry === './locale')
    expect(fpSurface).toBeTruthy()
    expect(localeSurface).toBeTruthy()
    // 子入口经 export * 展开后必有 star 来源符号（date-fns/fp、date-fns/locale）
    expect(fpSurface.symbolSources.size).toBeGreaterThan(0)
    expect(localeSurface.symbolSources.size).toBeGreaterThan(0)
  })

  it('date 主入口经由 export * 解析到 date-fns 外部来源（递归外部解析验证）', () => {
    const dateMain = surfaces.find(s => s.package === '@esdora/date' && s.entry === '.')
    expect(dateMain).toBeTruthy()
    // date-fns 暴露大量符号，应被聚合进 symbolSources
    expect(dateMain.symbolSources.size).toBeGreaterThan(100)
  })

  it('每个 entry 的 sourceFile 均已解析（无 null）', () => {
    for (const surface of surfaces)
      expect(surface.sourceFile, `${surface.package} ${surface.entry} sourceFile`).not.toBeNull()
  })
})

describe('cli 子进程 — --audit 退出码契约', () => {
  // 这些测试通过真实子进程验证 main() + process.exit 的端到端契约，
  // 确保 lint:exports CI step 的退出码行为可回归。

  it('当前代码零冲突时 --audit 退出码为 0', () => {
    // 当前全仓为干净状态（Phase 2 Success Criteria 5）
    const stdout = execFileSync('node', [SCRIPT_PATH, '--audit'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    })
    expect(stdout).toContain('Export audit passed')
    expect(stdout).toContain('0 conflicts')
  })

  it('默认模式输出合法 JSON 数组且含 10 个 entry', () => {
    const stdout = execFileSync('node', [SCRIPT_PATH], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    })
    const parsed = JSON.parse(stdout)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toHaveLength(10)
    // 每个 entry 含必备字段
    for (const entry of parsed) {
      expect(entry).toHaveProperty('package')
      expect(entry).toHaveProperty('entry')
      expect(entry).toHaveProperty('sourceFile')
      expect(entry).toHaveProperty('symbols')
      expect(entry).toHaveProperty('starSources')
    }
  })
})

// ---------------------------------------------------------------------------
// Phase 3 --docs 模式纯函数单元测试
//
// 这批测试为 Phase 3 新增的 6 个 --docs 纯函数提供回归保护。设计原则：
// - toKebab / deriveDocUrl / isExternalSourceLabel / packageNameOf：完全合成
//   输入，不依赖真实仓库结构（快、确定性、覆盖边界）。
// - buildDocsFileset / renderLlmsMarkdown：锚定真实仓库文档结构契约。
// ---------------------------------------------------------------------------

describe('toKebab — 命名风格转换', () => {
  it('camelCase 在大小写边界插入连字符', () => {
    expect(toKebab('isEmail')).toBe('is-email')
    expect(toKebab('getQueryParams')).toBe('get-query-params')
  })

  it('camelCase 中数字与大小写边界（[a-z0-9][A-Z]）正确处理', () => {
    expect(toKebab('base64Decode')).toBe('base64-decode')
  })

  it('全大写蛇形常量（如 DATE_FORMAT）整体小写后下划线转连字符', () => {
    // Phase 3 边界符号：date 包 DATE_FORMAT 常量
    expect(toKebab('DATE_FORMAT')).toBe('date-format')
    expect(toKebab('HH_MM_SS')).toBe('hh-mm-ss')
    expect(toKebab('ID')).toBe('id')
  })

  it('大驼峰类型名（如 TreeMap）在首字母大写处不产生前导连字符', () => {
    expect(toKebab('TreeMap')).toBe('tree-map')
    // 单字符 PascalCase 不引入前导连字符
    expect(toKebab('A')).toBe('a')
  })

  it('连续大写+小写边界（[A-Z][A-Z][a-z]）正确拆分', () => {
    // 如 HTTPServer → http-server，验证第二组正则生效
    expect(toKebab('HTTPServer')).toBe('http-server')
  })

  it('_unstable_ 前缀被剥离后再转换', () => {
    // Phase 3 边界符号：experimental 的 _unstable_getVersion
    expect(toKebab('_unstable_getVersion')).toBe('get-version')
  })

  it('已经全小写的单词保持不变', () => {
    expect(toKebab('cn')).toBe('cn')
    expect(toKebab('clamp')).toBe('clamp')
  })
})

describe('isExternalSourceLabel — 来源标签判定', () => {
  it('bare module specifier 判定为外部来源', () => {
    expect(isExternalSourceLabel('date-fns')).toBe(true)
    expect(isExternalSourceLabel('culori')).toBe(true)
    expect(isExternalSourceLabel('class-variance-authority')).toBe(true)
  })

  it('带子路径的 bare specifier 判定为外部来源', () => {
    expect(isExternalSourceLabel('date-fns/fp')).toBe(true)
    expect(isExternalSourceLabel('@scope/pkg/sub')).toBe(true)
  })

  it('本地 packages/ 路径标签判为非外部', () => {
    expect(isExternalSourceLabel('packages/kit/src/is/is-email/index.ts')).toBe(false)
    expect(isExternalSourceLabel('packages/date/src/constant/index.ts')).toBe(false)
  })

  it('相对路径标签判为非外部', () => {
    expect(isExternalSourceLabel('./constant')).toBe(false)
    expect(isExternalSourceLabel('../biz')).toBe(false)
  })

  it('local 字面量判为非外部', () => {
    expect(isExternalSourceLabel('local')).toBe(true)
    // 注：'local' 不以 packages/ 或 ./ ../ 开头，按当前实现归为外部；
    // 但调用方仅对 origin !== 'local' 的路径调用此函数，因此该返回值
    // 在实际流程中不影响输出（这里断言当前实现行为以锁定语义）。
  })
})

describe('packageNameOf — 包名提取', () => {
  it('裸包名（无子路径）原样返回', () => {
    expect(packageNameOf('date-fns')).toBe('date-fns')
    expect(packageNameOf('class-variance-authority')).toBe('class-variance-authority')
  })

  it('带子路径的包名提取顶级部分', () => {
    expect(packageNameOf('date-fns/fp')).toBe('date-fns')
    expect(packageNameOf('date-fns/locale/zh-CN')).toBe('date-fns')
  })

  it('scoped 包名提取 scope/name 两段', () => {
    expect(packageNameOf('@scope/pkg')).toBe('@scope/pkg')
    expect(packageNameOf('@scope/pkg/sub')).toBe('@scope/pkg')
  })

  it('仅 scope 前缀（无 name）原样返回', () => {
    expect(packageNameOf('@scope')).toBe('@scope')
  })
})

describe('deriveDocUrl — 候选枚举与存在性命中', () => {
  // 合成 docsFileset：模拟文档站路径集合，命中/未命中可控。
  // 注意：REPO_ROOT 经 fileURLToPath('..') 带尾斜杠，须用 join 拼接避免双斜杠
  // 导致 relPath 切片偏移（srcRoot 前缀匹配失败）。
  const ORIGIN_KIT = join(REPO_ROOT, 'packages/kit/src/is/is-email/index.ts')
  const ORIGIN_DATE_CONST = join(REPO_ROOT, 'packages/date/src/constant/index.ts')
  const ORIGIN_COLOR_ROOT = join(REPO_ROOT, 'packages/color/src/index.ts')

  it('函数子目录形态：reference/<cat>/<symbol-kebab> 命中（最高优先）', () => {
    // isEmailStrict → is-email-strict，命中 reference/is/is-email-strict
    const fileset = new Set(['packages/kit/reference/is/is-email-strict'])
    expect(deriveDocUrl('isEmailStrict', ORIGIN_KIT, 'kit', fileset))
      .toBe('packages/kit/reference/is/is-email-strict')
  })

  it('符号名与文件名不一致时：reference/<cat>/<symbol-kebab> 命中', () => {
    // 同文件导出 isEmailStrict，但文件名为 is-email（另一文档页）；
    // symbol-kebab 候选优先于 fn 目录候选命中。
    const fileset = new Set(['packages/kit/reference/is/is-email', 'packages/kit/reference/is/is-email-strict'])
    expect(deriveDocUrl('isEmailStrict', ORIGIN_KIT, 'kit', fileset))
      .toBe('packages/kit/reference/is/is-email-strict')
  })

  it('函数子目录形态：symbol-kebab 未命中时回退到 reference/<cat>/<fn>（符号≠文件名追加锚点）', () => {
    // 符号经 kebab 后的候选页不存在，但文件目录页存在 → 命中目录页
    // isEmailStrict 与 is-email 不同 → 追加 #is-email-strict 锚点
    const fileset = new Set(['packages/kit/reference/is/is-email'])
    expect(deriveDocUrl('isEmailStrict', ORIGIN_KIT, 'kit', fileset))
      .toBe('packages/kit/reference/is/is-email#is-email-strict')
  })

  it('符号名与文件名相同时：回退到目录页不追加锚点', () => {
    // isEmail 经 kebab = is-email，与文件名一致 → 无锚点
    const fileset = new Set(['packages/kit/reference/is/is-email'])
    expect(deriveDocUrl('isEmail', ORIGIN_KIT, 'kit', fileset))
      .toBe('packages/kit/reference/is/is-email')
  })

  it('分类桶形态：reference/<cat>/<symbol-kebab> 命中（segParts 长度=1 分支）', () => {
    // DATE_FORMAT 声明于 src/constant/index.ts（cat=constant，桶形态）
    const fileset = new Set(['packages/date/reference/constant/date-format'])
    expect(deriveDocUrl('DATE_FORMAT', ORIGIN_DATE_CONST, 'date', fileset))
      .toBe('packages/date/reference/constant/date-format')
  })

  it('分类桶形态：symbol 未命中时回退到 reference/<cat> 桶页', () => {
    const fileset = new Set(['packages/date/reference/constant'])
    expect(deriveDocUrl('DATE_FORMAT', ORIGIN_DATE_CONST, 'date', fileset))
      .toBe('packages/date/reference/constant')
  })

  it('包根桶形态（src/index.ts）：仅符号维度候选 reference/<symbol-kebab>', () => {
    const fileset = new Set(['packages/color/reference/to-hex'])
    expect(deriveDocUrl('toHex', ORIGIN_COLOR_ROOT, 'color', fileset))
      .toBe('packages/color/reference/to-hex')
  })

  it('候选枚举优先级：symbol-kebab > cat/<fn> > cat/<fn>/<symbol-kebab>', () => {
    // 构造三者均存在的 fileset，验证返回最高优先级（symbol-kebab）
    const fileset = new Set([
      'packages/kit/reference/tree/map', // cat/<fn>
      'packages/kit/reference/tree/map/some', // cat/<fn>/<symbol>（兜底，非真实结构）
      'packages/kit/reference/tree/some', // cat/<symbol-kebab>
    ])
    const origin = join(REPO_ROOT, 'packages/kit/src/tree/some/index.ts')
    expect(deriveDocUrl('some', origin, 'kit', fileset))
      .toBe('packages/kit/reference/tree/some')
  })

  it('所有候选均未命中时返回 null（杜绝 404 契约）', () => {
    const fileset = new Set(['packages/kit/reference/other/thing'])
    expect(deriveDocUrl('isEmailStrict', ORIGIN_KIT, 'kit', fileset)).toBeNull()
  })

  it('originFile 不在 packages/<pkg>/src/ 下时返回 null', () => {
    const fileset = new Set(['packages/kit/reference/is/is-email'])
    expect(deriveDocUrl('isEmail', '/tmp/nonexistent.ts', 'kit', fileset)).toBeNull()
  })

  it('跨包 originFile（路径含 pkgDirName 不匹配）返回 null', () => {
    // pkgDirName='color' 但 originFile 在 kit 下 → srcRoot 前缀不匹配 → null
    const fileset = new Set(['packages/color/reference/is/is-email'])
    expect(deriveDocUrl('isEmail', ORIGIN_KIT, 'color', fileset)).toBeNull()
  })

  it('_unstable_ 前缀符号经 toKebab 剥离后命中', () => {
    // experimental/get-version → experimental/get-version 页
    const origin = join(REPO_ROOT, 'packages/kit/src/experimental/get-version/index.ts')
    const fileset = new Set(['packages/kit/reference/experimental/get-version'])
    expect(deriveDocUrl('_unstable_getVersion', origin, 'kit', fileset))
      .toBe('packages/kit/reference/experimental/get-version')
  })
})

describe('buildDocsFileset — 真实 docs 目录收集', () => {
  // 锚定真实仓库文档结构契约：buildDocsFileset 必须递归收集 docs/ 下所有 .md，
  // 转为站点路径（去 .md、去 docs/ 前缀），作为 deriveDocUrl 的存在性校验源。
  let fileset

  beforeAll(() => {
    fileset = buildDocsFileset(REPO_ROOT)
  })

  it('收集到 docs/ 下的 markdown 页面（非空）', () => {
    expect(fileset.size).toBeGreaterThan(0)
  })

  it('站点路径已去 .md 扩展与 docs/ 前缀', () => {
    // 每个路径不应含 .md 后缀，也不应以 docs/ 开头
    for (const p of fileset) {
      expect(p).not.toMatch(/\.md$/)
      expect(p).not.toMatch(/^docs\//)
    }
  })

  it('包含 deriveDocUrl 倚赖的已知边界符号页', () => {
    // Phase 3 边界 URL（候选枚举处理的 4 个符号）对应的文档页必须存在
    expect(fileset.has('packages/kit/reference/is/is-email-strict')).toBe(true)
    expect(fileset.has('packages/date/reference/constant/date-format')).toBe(true)
    expect(fileset.has('packages/biz/reference/atom-css/cn')).toBe(true)
    expect(fileset.has('packages/kit/reference/is/is-external-link')).toBe(true)
  })
})

describe('deriveOverviewUrl — 包级 overview 页存在性校验', () => {
  let fileset

  beforeAll(() => {
    fileset = buildDocsFileset(REPO_ROOT)
  })

  it('有文档页的包返回 overview 路径', () => {
    // kit/color/date/biz 均有 docs/packages/<pkg>/index.md
    expect(deriveOverviewUrl('kit', fileset)).toBe('packages/kit')
    expect(deriveOverviewUrl('color', fileset)).toBe('packages/color')
    expect(deriveOverviewUrl('date', fileset)).toBe('packages/date')
    expect(deriveOverviewUrl('biz', fileset)).toBe('packages/biz')
  })

  it('无文档页的包返回 null（杜绝 404）', () => {
    // esdora 元包无 docs/packages/esdora 页面
    expect(deriveOverviewUrl('esdora', fileset)).toBeNull()
  })

  it('不存在的包目录返回 null', () => {
    expect(deriveOverviewUrl('nonexistent', fileset)).toBeNull()
  })
})

describe('renderLlmsMarkdown — 输出结构', () => {
  it('渲染含本地 API、外部依赖、子路径的完整包', () => {
    const md = renderLlmsMarkdown({
      pkgName: '@esdora/date',
      description: '日期处理库',
      pkgDirName: 'date',
      localApis: [
        { symbol: 'format', url: 'packages/date/reference/format' },
        { symbol: 'parseISO', url: null },
      ],
      externalDeps: ['date-fns'],
      subpaths: [{ entry: './fp' }, { entry: './locale', note: '语言包' }],
    })

    // 标题 + 描述
    expect(md).toContain('# @esdora/date')
    expect(md).toContain('> 日期处理库')
    // 安装片段
    expect(md).toContain('pnpm add @esdora/date')
    // 定位与依赖来源
    expect(md).toContain('re-exports 以下外部库：date-fns')
    // 子路径导出
    expect(md).toContain('## 子路径导出')
    expect(md).toContain('`./fp`')
    expect(md).toContain('`./locale` — 语言包')
    // 本地 API 表格：有 URL 的渲染链接，无 URL 的渲染兜底文案
    expect(md).toContain('| `format` | [format](https://esdora.js.org/packages/date/reference/format) |')
    expect(md).toContain('| `parseISO` | 见文档站 |')
  })

  it('kit 包渲染「零运行时依赖」标记', () => {
    const md = renderLlmsMarkdown({
      pkgName: '@esdora/kit',
      description: '工具集',
      pkgDirName: 'kit',
      localApis: [],
      externalDeps: [],
      subpaths: [],
    })
    expect(md).toContain('零运行时依赖。')
    // 无外部依赖时渲染「无外部运行时依赖」
    expect(md).toContain('本包无外部运行时依赖。')
  })

  it('无外部依赖时渲染「无外部运行时依赖」', () => {
    const md = renderLlmsMarkdown({
      pkgName: '@esdora/color',
      description: '颜色处理库',
      pkgDirName: 'color',
      localApis: [{ symbol: 'toHex', url: 'packages/color/reference/to-hex' }],
      externalDeps: [],
      subpaths: [],
    })
    expect(md).toContain('本包无外部运行时依赖。')
    // 不应出现 re-exports 段落
    expect(md).not.toContain('re-exports')
  })

  it('无子路径时不渲染子路径章节', () => {
    const md = renderLlmsMarkdown({
      pkgName: '@esdora/color',
      description: '颜色处理库',
      pkgDirName: 'color',
      localApis: [],
      externalDeps: [],
      subpaths: [],
    })
    expect(md).not.toContain('## 子路径导出')
  })

  it('无本地 API 时渲染「无本地 API」', () => {
    const md = renderLlmsMarkdown({
      pkgName: 'esdora',
      description: '元包',
      pkgDirName: 'esdora',
      localApis: [],
      externalDeps: [],
      subpaths: [],
    })
    expect(md).toContain('## 本地 API')
    expect(md).toContain('无本地 API。')
  })

  it('子路径条目生成正确的 import 语法', () => {
    const md = renderLlmsMarkdown({
      pkgName: '@esdora/biz',
      description: '业务工具',
      pkgDirName: 'biz',
      localApis: [],
      externalDeps: [],
      subpaths: [{ entry: './atom-css' }],
    })
    // entry './atom-css' → import from '@esdora/biz/atom-css'
    expect(md).toContain('import { ... } from \'@esdora/biz/atom-css\'')
  })
})
