import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const PACKAGES_DIR = join(ROOT, 'packages')

/**
 * 构建编译器选项。
 * 使用 Bundler 模块解析（与项目 tsconfig.json 一致），
 * 以便正确解析 date-fns/fp、date-fns/locale 等子路径导出。
 */
function buildCompilerOptions() {
  return {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    esModuleInterop: true,
    skipLibCheck: true,
    types: [],
  }
}

const OPTIONS = buildCompilerOptions()
const HOST = ts.createCompilerHost(OPTIONS, true)

/**
 * 发现 packages/ 下所有含 package.json 的子目录。
 * @returns {Array<{ name: string, dir: string, pkgJson: any, exports: Record<string, any> }>} package descriptors
 */
function discoverPackages() {
  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map((entry) => {
      const dir = join(PACKAGES_DIR, entry.name)
      const pkgJsonPath = join(dir, 'package.json')
      if (!existsSync(pkgJsonPath))
        return null
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
      const exports = typeof pkgJson.exports === 'object' && pkgJson.exports !== null
        ? pkgJson.exports
        : { '.': pkgJson.main || './dist/index.mjs' }
      return { name: pkgJson.name || entry.name, dir, pkgJson, exports }
    })
    .filter(Boolean)
}

/**
 * 将 entry key 映射到对应源文件绝对路径。
 * '.' → src/index.ts，回退 index.ts（esdora 元包入口在包根）
 * './x' → src/x.ts，回退 src/x/index.ts
 * @returns {string | null} absolute source file path, or null if not found
 */
function entryToSourceFile(pkgDir, entryKey) {
  if (entryKey === '.') {
    const primary = join(pkgDir, 'src', 'index.ts')
    if (existsSync(primary))
      return primary
    const fallback = join(pkgDir, 'index.ts')
    if (existsSync(fallback))
      return fallback
    return null
  }
  const sub = entryKey.slice(2) // 去掉 './' 前缀
  const fileForm = join(pkgDir, 'src', `${sub}.ts`)
  if (existsSync(fileForm))
    return fileForm
  const dirForm = join(pkgDir, 'src', sub, 'index.ts')
  if (existsSync(dirForm))
    return dirForm
  return null
}

/**
 * 判断一个文件路径是否位于 packages/ 内（即本地包源码）。
 */
function isLocalSource(filePath) {
  return filePath.startsWith(PACKAGES_DIR)
}

/**
 * 获取某个 node_modules 模块的所有导出符号名。
 * 对该模块的入口 .d.ts 建独立 Program，用 checker.getExportsOfModule 取全部导出。
 * @returns {string[]} list of exported symbol names from the external module
 */
function resolveExternalExports(specifier, resolvedModule) {
  const entryFile = resolvedModule.resolvedFileName
  if (!entryFile)
    return []
  const program = ts.createProgram(
    [entryFile],
    { ...OPTIONS, rootDir: dirname(entryFile) },
    HOST,
  )
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(entryFile)
  if (!sourceFile)
    return []
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile) ?? sourceFile.symbol
  if (!moduleSymbol)
    return []
  return checker.getExportsOfModule(moduleSymbol).map(s => s.name)
}

/**
 * 解析单个源文件的导出声明。
 * - ExportDeclaration 无 moduleSpecifier（export { } / export * as ns）→ 本地显式
 * - ExportDeclaration 带 moduleSpecifier 且无 exportClause（export *）→ star re-export
 * - ExportDeclaration 带 moduleSpecifier 且有 namedExports（export { a } from 'x'）→ 显式 named re-export
 * - 顶层带 export 修饰符的声明（function/class/interface/type/const/let/var）→ 本地显式
 *
 * @returns {{ explicit: Map<string, { origin: string, originFile: string }>, stars: Array<{ specifier: string, sourceFile: string }> }} parsed exports
 */
function parseFile(sourceFilePath) {
  const explicit = new Map()
  const stars = []

  const program = ts.createProgram([sourceFilePath], OPTIONS, HOST)
  const sourceFile = program.getSourceFile(sourceFilePath)
  if (!sourceFile)
    return { explicit, stars }

  for (const stmt of sourceFile.statements) {
    if (ts.isExportDeclaration(stmt)) {
      const moduleSpecifier = stmt.moduleSpecifier
      // export * from '...' 或 export * as ns from '...'
      const isNamespaceStar = stmt.exportClause != null
        && ts.isNamespaceExport(stmt.exportClause)
      if (moduleSpecifier && stmt.exportClause == null) {
        // export * from 'specifier'
        stars.push({
          specifier: moduleSpecifier.getText().slice(1, -1),
          sourceFile: sourceFilePath,
        })
      }
      else if (moduleSpecifier && isNamespaceStar) {
        // export * as ns from 'specifier' —— 命名空间整体导出，视为一个显式 export
        const nsName = stmt.exportClause.name.getText()
        explicit.set(nsName, {
          origin: moduleSpecifier.getText().slice(1, -1),
          originFile: sourceFilePath,
        })
      }
      else if (moduleSpecifier && stmt.exportClause != null && ts.isNamedExports(stmt.exportClause)) {
        // export { a, b as c } from 'specifier' —— 显式 named re-export
        const specifierText = moduleSpecifier.getText().slice(1, -1)
        for (const element of stmt.exportClause.elements) {
          const exportName = (element.propertyName ?? element.name).getText()
          // 这里以对外暴露名 name 为 key（对外名更重要），origin 为来源
          const publicName = element.name.getText()
          explicit.set(publicName, { origin: specifierText, originFile: sourceFilePath })
          // 同时记录 propertyName 以便来源溯源（不污染 explicit 的 key）
          void exportName
        }
      }
      else if (!moduleSpecifier && stmt.exportClause != null && ts.isNamedExports(stmt.exportClause)) {
        // export { a, b } —— 本地显式（来自同一文件内其他声明）
        for (const element of stmt.exportClause.elements) {
          const publicName = element.name.getText()
          explicit.set(publicName, { origin: 'local', originFile: sourceFilePath })
        }
      }
      else if (!moduleSpecifier && stmt.exportClause != null && ts.isNamespaceExport(stmt.exportClause)) {
        // export * as ns（无 from）—— 本地命名空间，罕见，记录为本地
        const nsName = stmt.exportClause.name.getText()
        explicit.set(nsName, { origin: 'local', originFile: sourceFilePath })
      }
      continue
    }

    // 顶层带 export 修饰符的声明语句
    const modifiers = ts.canHaveModifiers(stmt) ? ts.getModifiers(stmt) : undefined
    const hasExport = modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!hasExport)
      continue

    let name = null
    if (
      ts.isFunctionDeclaration(stmt)
      || ts.isClassDeclaration(stmt)
      || ts.isInterfaceDeclaration(stmt)
      || ts.isTypeAliasDeclaration(stmt)
    ) {
      name = stmt.name?.getText() ?? null
    }
    else if (ts.isVariableStatement(stmt)) {
      // const/let/var 可能声明多个：export const a = 1, b = 2
      for (const declaration of stmt.declarationList.declarations) {
        const declName = declaration.name.getText()
        if (declName)
          explicit.set(declName, { origin: 'local', originFile: sourceFilePath })
      }
      continue
    }

    if (name)
      explicit.set(name, { origin: 'local', originFile: sourceFilePath })
  }

  return { explicit, stars }
}

/**
 * 递归展开 export * 链，将每个符号的来源聚合到 symbolSources。
 *
 * 数据模型（关键）：
 *   - symbolSources: symbolName -> Set<sourceLabel>
 *     汇聚所有「经由 export * 链到达」的符号来源。本地 barrel 的符号以其
 *     解析到的文件路径作为来源标签（便于追溯），外部 bare module 的符号
 *     以 specifier 作为来源标签（如 'date-fns'、'culori'）。
 *   - 注意：本地 barrel 文件中本身的 export * 会进一步递归；barrel 文件中
 *     的「直接声明」也作为该 barrel 的来源贡献进 symbolSources。
 *
 * 这样新模型下，两个 barrel 都 export 同名符号 → symbolSources[name] 含
 * 两个来源 → Case A (AMBIGUOUS)；entry 自身又显式 export 同名 → Case B (OVERRIDE)。
 *
 * @param {Array} stars - 当前文件的 star re-export 声明
 * @param {Map} symbolSources - symbolName -> Set<sourceLabel>
 * @param {Set} visited - 已访问文件（防环）
 */
function expandStars(stars, symbolSources, visited) {
  for (const star of stars) {
    const { resolvedModule } = ts.resolveModuleName(
      star.specifier,
      star.sourceFile,
      OPTIONS,
      HOST,
    )
    if (!resolvedModule) {
      // 无法解析（可能仅类型/运行时模块）——跳过，无符号可归属
      continue
    }

    const resolvedPath = resolvedModule.resolvedFileName
    if (isLocalSource(resolvedPath)) {
      // 本地 barrel：该 barrel 的直接声明 + 其再 re-export 的符号，
      // 统一标记来源为 barrel 文件路径（相对项目根的可读形式）。
      const label = relPath(resolvedPath)
      collectLocalExports(resolvedPath, label, symbolSources, visited)
    }
    else {
      // 外部 bare module（node_modules）——取其全部导出名
      const externalNames = resolveExternalExports(star.specifier, resolvedModule)
      for (const name of externalNames)
        ensureSet(symbolSources, name).add(star.specifier)
    }
  }
}

/**
 * 递归收集本地 barrel 文件经由 export * 链到达的全部符号。
 * barrel 自身的直接声明与 named re-export 标记为 barrel 文件来源；
 * barrel 内的 export * 继续递归（本地递归、外部取集合）。
 *
 * @param {string} filePath - 本地 barrel 文件绝对路径
 * @param {string} label - 该 barrel 的来源标签（相对路径）
 * @param {Map} symbolSources - symbolName -> Set<sourceLabel>
 * @param {Set} visited - 已访问文件（防环）
 */
function collectLocalExports(filePath, label, symbolSources, visited) {
  if (visited.has(filePath))
    return
  visited.add(filePath)

  const { explicit, stars } = parseFile(filePath)

  // barrel 自身的直接声明与 named re-export：标记来源为 barrel 文件
  for (const name of explicit.keys())
    ensureSet(symbolSources, name).add(label)

  // barrel 内的 export *：本地递归（沿用 label 以保留溯源性）或外部取集合
  for (const star of stars) {
    const { resolvedModule } = ts.resolveModuleName(
      star.specifier,
      filePath,
      OPTIONS,
      HOST,
    )
    if (!resolvedModule)
      continue

    const resolvedPath = resolvedModule.resolvedFileName
    if (isLocalSource(resolvedPath)) {
      collectLocalExports(resolvedPath, relPath(resolvedPath), symbolSources, visited)
    }
    else {
      const externalNames = resolveExternalExports(star.specifier, resolvedModule)
      for (const name of externalNames)
        ensureSet(symbolSources, name).add(star.specifier)
    }
  }
}

/**
 * 将绝对路径转为相对项目根的可读形式，用于来源标签。
 * 例如 packages/date/src/index.ts
 */
function relPath(absPath) {
  if (absPath.startsWith(ROOT))
    return absPath.slice(ROOT.length + 1).replace(/\\/g, '/')
  return absPath.replace(/\\/g, '/')
}

function ensureSet(map, key) {
  if (!map.has(key))
    map.set(key, new Set())
  return map.get(key)
}

/**
 * 解析单个 package 单个 entry 的完整导出面。
 * @returns {{
 *   package: string, entry: string, sourceFile: string,
 *   symbols: Map<string, { origin: string, originFile: string }>,
 *   symbolSources: Map<string, Set<string>>,
 * }} export surface for the entry
 */
function parseExportSurface(pkg, entryKey) {
  const sourceFile = entryToSourceFile(pkg.dir, entryKey)
  if (!sourceFile) {
    return {
      package: pkg.name,
      entry: entryKey,
      sourceFile: null,
      symbols: new Map(),
      symbolSources: new Map(),
    }
  }

  const visited = new Set()
  const { explicit, stars } = parseFile(sourceFile)

  // symbolSources: 符号 -> 其经由 export * 链引入的来源集合
  const symbolSources = new Map()
  // entry 自身声明的 explicit export（直接声明 + named re-export）保留在 explicit，
  // 用于 Case B (OVERRIDE) 检测；export * 链的符号聚合到 symbolSources。
  expandStars(stars, symbolSources, visited)

  return {
    package: pkg.name,
    entry: entryKey,
    sourceFile,
    symbols: explicit,
    symbolSources,
  }
}

/**
 * 检测单个 entry surface 的冲突。
 * - Case A (AMBIGUOUS): 某符号来自 >=2 个 export * 来源，且未被显式 export 解析 → 运行时被丢弃
 * - Case B (OVERRIDE): 某符号既出现在 export * 来源中，又被显式 export → 静默覆盖
 *
 * @returns {Array<{ type: 'AMBIGUOUS' | 'OVERRIDE', package: string, entry: string, symbol: string, sources: string[] }>} detected conflicts
 */
function detectConflicts(surface) {
  const conflicts = []
  const { symbols: explicit, symbolSources } = surface

  for (const [symbol, sources] of symbolSources) {
    // 过滤：symbolSources 里可能混入 sourceLabel 条目（如 'date-fns' 本身），只看符号维度
    if (sources.size === 0)
      continue
    const sourceList = [...sources].sort()

    if (explicit.has(symbol)) {
      // Case B: star 来源与显式 export 同名 → OVERRIDE（静默覆盖）
      conflicts.push({
        type: 'OVERRIDE',
        package: surface.package,
        entry: surface.entry,
        symbol,
        sources: sourceList,
      })
    }
    else if (sources.size >= 2) {
      // Case A: 多个 star 来源提供同名符号且未显式解决 → AMBIGUOUS（运行时丢弃）
      conflicts.push({
        type: 'AMBIGUOUS',
        package: surface.package,
        entry: surface.entry,
        symbol,
        sources: sourceList,
      })
    }
  }

  return conflicts
}

/**
 * 将 surface 的 symbols Map 序列化为可读结构（供 JSON 打印）。
 */
function serializeSurface(surface) {
  const symbols = {}
  for (const [name, info] of surface.symbols)
    symbols[name] = { origin: info.origin, originFile: info.originFile }

  const starSources = {}
  for (const [name, sources] of surface.symbolSources) {
    if (sources.size > 0)
      starSources[name] = [...sources].sort()
  }

  return {
    package: surface.package,
    entry: surface.entry,
    sourceFile: surface.sourceFile,
    symbols,
    starSources,
  }
}

/**
 * 解析全仓所有包的所有 entry，返回 surface 列表。
 */
function analyzeAll() {
  const packages = discoverPackages()
  const surfaces = []
  for (const pkg of packages) {
    for (const entryKey of Object.keys(pkg.exports)) {
      const surface = parseExportSurface(pkg, entryKey)
      surfaces.push(surface)
    }
  }
  return surfaces
}

/**
 * 默认模式：打印全仓导出面 JSON（供 Phase 3 --docs 复用）。
 */
function printSurfaceJSON(surfaces) {
  const output = surfaces.map(serializeSurface)
  console.log(JSON.stringify(output, null, 2))
}

/**
 * --audit 模式：检测全部冲突，打印人类可读报告，有冲突非零退出。
 */
function runAudit(surfaces) {
  const allConflicts = []
  for (const surface of surfaces)
    allConflicts.push(...detectConflicts(surface))

  const entryCount = surfaces.length

  if (allConflicts.length === 0) {
    console.log(`Export audit passed: 0 conflicts across ${entryCount} entries`)
    return 0
  }

  // 按包分组打印
  const grouped = new Map()
  for (const conflict of allConflicts) {
    const key = conflict.package
    if (!grouped.has(key))
      grouped.set(key, [])
    grouped.get(key).push(conflict)
  }

  console.log(`Export audit FAILED: ${allConflicts.length} conflict(s) across ${entryCount} entries\n`)
  for (const [pkgName, conflicts] of grouped) {
    console.log(`  ${pkgName}`)
    for (const c of conflicts) {
      const pkgDir = pkgName.replace(/^@[^/]+\//, '')
      if (c.type === 'AMBIGUOUS') {
        console.log(
          `    packages/${pkgDir} (${c.entry}): AMBIGUOUS '${c.symbol}' (${c.sources.join(' ⊕ ')})`,
        )
      }
      else {
        console.log(
          `    packages/${pkgDir} (${c.entry}): OVERRIDE '${c.symbol}' (explicit shadows ${c.sources.join(', ')})`,
        )
      }
    }
  }
  return 1
}

// ----------------------------------------------------------------------------
// --docs 模式：生成 packages/<pkg>/llms.md 轻量索引 + 根 llms.txt 总览
// 复用 analyzeAll()/parseExportSurface() 导出面解析内核（不改内核）。
// ----------------------------------------------------------------------------

const DOCS_BASE_URL = 'https://esdora.js.org/'

/**
 * 将 camelCase / UPPER_SNAKE / PascalCase 名称转为 kebab-case。
 * - isEmailStrict → is-email-strict
 * - DATE_FORMAT   → date-format
 * - treeMap       → tree-map
 * - _unstable_getVersion → get-version（去 _unstable_ 前缀）
 */
function toKebab(name) {
  let n = name
  if (n.startsWith('_unstable_'))
    n = n.slice('_unstable_'.length)
  // UPPER_SNAKE（全大写 + 下划线）→ 整体小写后下划线转连字符
  if (/^[A-Z][A-Z0-9_]*$/.test(n))
    return n.toLowerCase().replace(/_/g, '-')
  // PascalCase / camelCase：在大小写边界插入连字符
  return n
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 递归收集 docs/packages 下所有 .md 文件，转为站点路径集合（去 .md、去 docs/ 前缀）。
 * 元素如 'packages/kit/reference/is/is-email'，作为 URL 存在性校验源。
 * @returns {Set<string>} 站点路径集合
 */
function buildDocsFileset(rootDir) {
  const fileset = new Set()
  const docsDir = join(rootDir, 'docs')
  if (!existsSync(docsDir))
    return fileset

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      }
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        // 相对 docs/ 的路径（站点路径），去 .md 扩展
        // 如 'packages/kit/reference/is/is-email'
        const rel = fullPath.slice(docsDir.length + 1).replace(/\\/g, '/')
        fileset.add(rel.replace(/\.md$/, ''))
      }
    }
  }

  walk(docsDir)
  return fileset
}

/**
 * 由源码目录结构推导文档站 URL（站点路径，不含域名）。
 * 用候选枚举 + docsFileset 实测存在性校验，杜绝 404：全未命中返回 null。
 *
 * @param {string} symbol - 符号名（如 isEmailStrict、DATE_FORMAT、cn）
 * @param {string} originFile - 符号来源文件绝对路径（如 .../packages/kit/src/is/is-email/index.ts）
 * @param {string} pkgDirName - 包目录名（kit / color / date / biz / esdora）
 * @param {Set<string>} docsFileset - docs 站点路径集合
 * @returns {string | null} 命中的站点路径（如 'packages/kit/reference/is/is-email-strict'），未命中 null
 */
function deriveDocUrl(symbol, originFile, pkgDirName, docsFileset) {
  const srcRoot = `packages/${pkgDirName}/src/`
  const rel = relPath(originFile)
  if (!rel.startsWith(srcRoot))
    return null

  const srcRel = rel.slice(srcRoot.length) // e.g. 'is/is-email/index.ts'
  // 规范化：去末尾 '/index.ts' 得段路径，或去 '.ts'；src/index.ts（包根桶）→ 空
  let segPath = srcRel
  if (segPath === 'index.ts' || segPath.endsWith('/index.ts'))
    segPath = segPath === 'index.ts' ? '' : segPath.slice(0, -'/index.ts'.length)
  else if (segPath.endsWith('.ts'))
    segPath = segPath.slice(0, -'.ts'.length)

  const symbolKebab = toKebab(symbol)
  const refBase = `packages/${pkgDirName}/reference/`

  // 候选枚举（站点路径）按优先级，每项标注是否为"伴生页"（需锚点）
  const segParts = segPath.split('/').filter(Boolean)
  const candidates = []

  if (segPath === '') {
    // src/index.ts 直接声明（包根桶，如 color 的显式类型）—— 仅符号维度
    candidates.push({ path: `${refBase}${symbolKebab}`, anchor: null })
  }
  else if (segParts.length === 1) {
    // src/<cat>/index.ts 形态：cat 桶（如 constant/index.ts、atom-css/index.ts）
    const cat = segParts[0]
    // 1. reference/<cat>/<symbol-kebab>（如 constant/date-format、atom-css/cn）
    candidates.push({ path: `${refBase}${cat}/${symbolKebab}`, anchor: null })
    // 2. reference/<cat>（桶整体页，少命中）
    candidates.push({ path: `${refBase}${cat}`, anchor: null })
  }
  else {
    // src/<cat>/<fn>/index.ts 或 src/<cat>/<fn>.ts 形态
    const cat = segParts[0]
    const fn = segParts.slice(1).join('/')
    // 1. reference/<cat>/<symbol-kebab>（符号专属页，如 is/is-email-strict 独立页）
    candidates.push({ path: `${refBase}${cat}/${symbolKebab}`, anchor: null })
    // 2. reference/<cat>/<fn>（目录页，如 tree/map、function/safe）
    //    若 symbolKebab !== fn，说明是同源文件的伴生符号（如 isExternalLinkStrict
    //    与 isExternalLink 共享 index.ts），命中时追加 #symbol-kebab 锚点指向页内 heading
    const needsAnchor = symbolKebab !== fn
    candidates.push({ path: `${refBase}${cat}/${fn}`, anchor: needsAnchor ? symbolKebab : null })
    // 3. reference/<cat>/<fn>/<symbol-kebab>（同桶多符号嵌套独立页，兜底）
    candidates.push({ path: `${refBase}${cat}/${fn}/${symbolKebab}`, anchor: null })
  }

  for (const candidate of candidates) {
    if (docsFileset.has(candidate.path))
      return candidate.anchor ? `${candidate.path}#${candidate.anchor}` : candidate.path
  }
  return null
}

/**
 * 推导包级 overview 页 URL（站点路径，不含域名）。
 * 与 deriveDocUrl 同样经 docsFileset 实测存在性校验，杜绝 404。
 * 候选优先级：packages/<pkg>/index.md → packages/<pkg>.md。
 * 未命中返回 null（调用方据此决定是省略链接还是标注"无独立文档页"）。
 *
 * @param {string} pkgDirName - 包目录名（kit / color / date / biz / esdora）
 * @param {Set<string>} docsFileset - docs 站点路径集合
 * @returns {string | null} 命中的站点路径，未命中 null
 */
function deriveOverviewUrl(pkgDirName, docsFileset) {
  const candidates = [
    `packages/${pkgDirName}/index`,
    `packages/${pkgDirName}`,
  ]
  for (const candidate of candidates) {
    if (docsFileset.has(candidate))
      return `packages/${pkgDirName}`
  }
  return null
}

/**
 * 判断一个来源标签是否为外部 bare specifier（非本地 packages/ 路径、非相对路径）。
 * 如 'date-fns'、'culori'、'class-variance-authority' → true。
 */
function isExternalSourceLabel(label) {
  return !label.startsWith('packages/') && !label.startsWith('./') && !label.startsWith('../')
}

/**
 * 提取 bare specifier 的包名（去子路径）。
 * 'date-fns/fp' → 'date-fns'；'class-variance-authority' → 'class-variance-authority'。
 */
function packageNameOf(specifier) {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier
  }
  return specifier.split('/')[0]
}

/**
 * 渲染单包 llms.md 轻量索引 markdown。
 * @param {{ pkgName: string, description: string, pkgDirName: string,
 *           localApis: Array<{ symbol: string, url: string | null }>,
 *           externalDeps: string[], subpaths: Array<{ entry: string, note?: string }> }} meta
 * @returns {string} 渲染后的 markdown 字符串
 */
function renderLlmsMarkdown(meta) {
  const { pkgName, description, pkgDirName, localApis, externalDeps, subpaths } = meta
  const lines = []

  lines.push(`# ${pkgName}`)
  lines.push(`> ${description}`)
  lines.push('')

  lines.push('## 安装')
  lines.push('```sh')
  lines.push(`pnpm add ${pkgName}`)
  lines.push('```')
  if (pkgDirName === 'kit')
    lines.push('零运行时依赖。')
  lines.push('')

  lines.push('## 定位与依赖来源')
  lines.push(description)
  if (externalDeps.length > 0) {
    lines.push(`本包 re-exports 以下外部库：${externalDeps.join(', ')}。`)
  }
  else {
    lines.push('本包无外部运行时依赖。')
  }
  lines.push('')

  if (subpaths.length > 0) {
    lines.push('## 子路径导出')
    for (const sp of subpaths) {
      const note = sp.note ? ` — ${sp.note}` : ''
      lines.push(`- \`${sp.entry}\`${note}，\`import { ... } from '${pkgName}${sp.entry.slice(1)}'\``)
    }
    lines.push('')
  }

  lines.push('## 本地 API')
  if (localApis.length > 0) {
    lines.push('| 符号 | 文档 |')
    lines.push('| --- | --- |')
    for (const api of localApis) {
      if (api.url)
        lines.push(`| \`${api.symbol}\` | [${api.symbol}](${DOCS_BASE_URL}${api.url}) |`)
      else
        lines.push(`| \`${api.symbol}\` | 见文档站 |`)
    }
  }
  else {
    lines.push('无本地 API。')
  }
  lines.push('')

  return lines.join('\n')
}

/**
 * --docs 模式：为全仓每个包生成 packages/<pkg>/llms.md，并写根 llms.txt 总览。
 * 复用 analyzeAll() 内核，不改内核。
 */
function runDocs(surfaces) {
  const docsFileset = buildDocsFileset(ROOT)

  // 按 package 聚合该包全部 entry 的符号
  const byPackage = new Map()
  for (const surface of surfaces) {
    const pkgName = surface.package
    if (!byPackage.has(pkgName))
      byPackage.set(pkgName, [])
    byPackage.get(pkgName).push(surface)
  }

  // 包目录名映射（@esdora/kit → kit，esdora → esdora）
  const pkgDirOf = name => name.replace(/^@[^/]+\//, '')

  const summary = []

  for (const [pkgName, pkgSurfaces] of byPackage) {
    const pkgDirName = pkgDirOf(pkgName)
    const pkgDir = join(PACKAGES_DIR, pkgDirName)
    const pkgJsonPath = join(pkgDir, 'package.json')
    const description = existsSync(pkgJsonPath)
      ? (JSON.parse(readFileSync(pkgJsonPath, 'utf8')).description || '')
      : ''

    const localApiSet = new Map() // symbol -> url
    const externalDeps = new Set()
    const subpaths = []

    const isEsdoraMeta = pkgDirName === 'esdora'

    for (const surface of pkgSurfaces) {
      // 子路径导出
      if (surface.entry !== '.') {
        subpaths.push({ entry: surface.entry })
      }

      // 显式 symbols（origin='local' 或本地 named re-export './xxx'）
      for (const [symbol, info] of surface.symbols) {
        if (isEsdoraMeta) {
          // esdora 元包：symbols 为子包命名空间（biz/color/date/kit）→ 子包 overview 链接
          localApiSet.set(symbol, deriveOverviewUrl(symbol, docsFileset))
          continue
        }
        const origin = info.origin
        if (origin === 'local' || origin.startsWith('./') || origin.startsWith('../')) {
          // 本地 API：用 originFile 推导 URL
          const url = deriveDocUrl(symbol, info.originFile, pkgDirName, docsFileset)
          if (!localApiSet.has(symbol))
            localApiSet.set(symbol, url)
        }
        else if (isExternalSourceLabel(origin)) {
          // 显式 named re-export 自外部（如 clsx）
          externalDeps.add(packageNameOf(origin))
        }
      }

      // star 来源符号（export * 链）
      for (const [symbol, sources] of surface.symbolSources) {
        for (const label of sources) {
          if (isEsdoraMeta)
            continue
          if (label.startsWith(`packages/${pkgDirName}/src/`)) {
            // 本地 barrel 符号 → 推导 URL
            const url = deriveDocUrl(symbol, resolve(join(ROOT, label)), pkgDirName, docsFileset)
            if (!localApiSet.has(symbol))
              localApiSet.set(symbol, url)
          }
          else if (isExternalSourceLabel(label)) {
            externalDeps.add(packageNameOf(label))
          }
        }
      }
    }

    const localApis = [...localApiSet.entries()].map(([symbol, url]) => ({ symbol, url }))

    const content = renderLlmsMarkdown({
      pkgName,
      description,
      pkgDirName,
      localApis,
      externalDeps: [...externalDeps].sort(),
      subpaths,
    })

    writeFileSync(join(pkgDir, 'llms.md'), content, 'utf8')
    summary.push({ pkgName, description, pkgDirName })
  }

  // 根 llms.txt 总览（overview 链接经 docsFileset 校验，无文档页则标注）
  const txtLines = ['# esdora', '', '> AI-friendly index of esdora packages', '']
  for (const s of summary) {
    txtLines.push(`- ${s.pkgName}: ${s.description}`)
    const overviewPath = deriveOverviewUrl(s.pkgDirName, docsFileset)
    if (overviewPath)
      txtLines.push(`  → ${DOCS_BASE_URL}${overviewPath}`)
    else
      txtLines.push(`  → (no dedicated docs page yet — see llms.md for API index)`)
    txtLines.push(`  → llms.md: packages/${s.pkgDirName}/llms.md`)
  }
  writeFileSync(join(ROOT, 'llms.txt'), `${txtLines.join('\n')}\n`, 'utf8')

  console.log(`Generated llms.md for ${summary.length} packages (+ llms.txt index)`)
}

function main(argv) {
  if (argv.includes('--audit')) {
    const surfaces = analyzeAll()
    const exitCode = runAudit(surfaces)
    if (exitCode !== 0)
      process.exit(exitCode)
    return
  }

  if (argv.includes('--docs')) {
    runDocs(analyzeAll())
    return
  }

  // 默认模式：打印导出面 JSON
  const surfaces = analyzeAll()
  printSurfaceJSON(surfaces)
}

// 当且仅当本文件作为入口进程被直接运行时（import.meta.url === process.argv[1]
// 的化简形式，via node:process 的 main 检测）才执行 CLI。
// 这使得测试代码可以 `import` 本模块以纯函数方式调用核心逻辑，而不会触发
// 自动执行 + process.exit。
if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2))
}

// 导出核心纯函数，供单元测试与未来复用（如 Phase 3 --docs）。
// 使用 ESM named exports；CLI 直接运行路径不受影响。
export {
  analyzeAll,
  buildCompilerOptions,
  buildDocsFileset,
  collectLocalExports,
  deriveDocUrl,
  deriveOverviewUrl,
  detectConflicts,
  discoverPackages,
  entryToSourceFile,
  expandStars,
  isExternalSourceLabel,
  isLocalSource,
  main,
  packageNameOf,
  parseExportSurface,
  parseFile,
  printSurfaceJSON,
  renderLlmsMarkdown,
  runAudit,
  runDocs,
  serializeSurface,
  toKebab,
}
