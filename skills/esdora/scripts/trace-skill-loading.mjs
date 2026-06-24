import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import process from 'node:process'

// Static "AI instruction loading reachability" analysis.
//
// Simulates how Claude Code and Codex discover project instruction files
// starting from their respective auto-loaded entry points, then verifies
// that per-package rules and routing.yaml always_read files are actually
// reachable through the @import / harness / hint edge graph.
//
// Edge model:
//   import  — line-start `@./x` / `@../x` / `@name.md` in markdown.
//              Claude expands recursively (<=5 levels); Codex does not.
//   harness — auto-loaded entry files (root + per-package shells).
//   hint    — routing.yaml always_read/required_reads/workflow paths and
//              prose "Read `x`" / backtick path references. Relied on by
//              both tools (weak, best-effort).
//
// Style mirrors check-skill-architecture.mjs: ESM, node-only deps, no
// semicolons, 2-space indent, assert + failures pattern.

const root = process.cwd()
const failures = []

const SKIP_DIRS = new Set(['node_modules', '.git'])
const MAX_IMPORT_DEPTH = 5

const IMPORT_RE = /^[ \t]*@(\.{1,2}\/[^\s`<>)]+|[A-Za-z][\w-]*\.md)/gm
// Root-relative paths quoted in prose (skills/.../x.md, packages/.../x.md, ...).
const PROSE_PATH_RE = /`((?:skills|packages|references|workflows|rules)\/[^`]+\.(?:md|yaml))`/g
// Bare "Read <path>" references.
const READ_REF_RE = /\bRead\s+`?([\w\-/]+\.(?:md|yaml))`?/g

function toPosix(p) {
  return p.replace(/\\/g, '/')
}

function resolveRel(fromFile, ref) {
  // Refs from prose are root-relative when they start with a known root dir;
  // @import refs are relative to the importing file's directory.
  if (/^(?:skills|packages|references|workflows|rules)\//.test(ref))
    return toPosix(normalize(ref))
  return toPosix(normalize(join(dirname(fromFile), ref)))
}

function readFile(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function exists(rel) {
  return existsSync(join(root, rel))
}

function listPackages() {
  const out = []
  const abs = join(root, 'packages')
  if (!existsSync(abs))
    return out
  for (const entry of readdirSync(abs)) {
    if (SKIP_DIRS.has(entry))
      continue
    if (statSync(join(abs, entry)).isDirectory())
      out.push(entry)
  }
  return out
}

// Parse routing.yaml (line-based, no external deps) into hint target paths.
function parseRoutingHints(routingPath) {
  if (!exists(routingPath))
    return []
  const text = readFile(routingPath)
  const targets = new Set()
  // List items anywhere: "  - skills/esdora/...".
  for (const m of text.matchAll(/^\s*-\s+(skills\/[^\s#]+)|^\s*-\s+(packages\/[^\s#]+)/gm)) {
    const p = (m[1] ?? m[2]).replace(/[`,"']+$/, '')
    if (p)
      targets.add(toPosix(normalize(p)))
  }
  // workflow: skills/esdora/workflows/x.md
  for (const m of text.matchAll(/^\s*workflow:\s+(skills\/\S+)/gm)) {
    targets.add(toPosix(normalize(m[1].replace(/[`,"']+$/, ''))))
  }
  return [...targets]
}

// Extract edges from a file node.
// Returns { imports: [rel], hints: [rel] } (targets, resolved; existence not checked here).
function extractEdges(file) {
  const imports = []
  const hints = []
  if (!exists(file))
    return { imports, hints }

  const content = readFile(file)

  if (file.endsWith('.md')) {
    for (const m of content.matchAll(IMPORT_RE)) {
      const raw = m[1].replace(/[`.,;)]+$/, '')
      imports.push(resolveRel(file, raw))
    }
    // Prose hints: keep root-prefixed backtick paths unconditionally, and
    // bare "Read X" references only when they resolve to an existing file
    // (otherwise free-text mentions like "Read `pnpm-workspace.yaml`" would
    // resolve to nonsensical relative paths).
    for (const m of content.matchAll(PROSE_PATH_RE))
      hints.push(resolveRel(file, m[1]))
    for (const m of content.matchAll(READ_REF_RE)) {
      const resolved = resolveRel(file, m[1])
      if (exists(resolved))
        hints.push(resolved)
    }
  }
  else if (file.endsWith('routing.yaml')) {
    for (const p of parseRoutingHints(file))
      hints.push(p)
  }

  // De-duplicate while preserving order.
  return {
    imports: [...new Set(imports)],
    hints: [...new Set(hints)],
  }
}

// BFS reachability.
// seeds: entry nodes (already harness-loaded).
// followImports: whether to traverse @import edges (Claude yes, Codex no).
function bfs(seeds, followImports) {
  const reached = new Set()
  const importDepth = new Map()
  const edges = []
  const queue = []

  for (const s of seeds) {
    if (!exists(s))
      continue
    queue.push({ node: s, depth: 0 })
    importDepth.set(s, 0)
  }

  while (queue.length) {
    const { node, depth } = queue.shift()
    if (reached.has(node)) {
      // Already visited; only re-expand if we have a strictly shallower import depth.
      if ((importDepth.get(node) ?? Number.POSITIVE_INFINITY) <= depth)
        continue
    }
    reached.add(node)
    importDepth.set(node, depth)

    const { imports, hints } = extractEdges(node)

    if (followImports) {
      for (const target of imports) {
        const childDepth = depth + 1
        if (childDepth > MAX_IMPORT_DEPTH)
          continue
        if (!exists(target)) {
          // Broken @import; record as a discovered edge but don't traverse.
          edges.push({ from: node, to: target, type: 'import' })
          continue
        }
        edges.push({ from: node, to: target, type: 'import' })
        if ((importDepth.get(target) ?? Number.POSITIVE_INFINITY) > childDepth)
          queue.push({ node: target, depth: childDepth })
      }
    }

    // Hints are followed by both tools; a hint-reached file starts a fresh
    // import chain (the AI reads it as a new document).
    for (const target of hints) {
      if (!exists(target)) {
        edges.push({ from: node, to: target, type: 'hint' })
        continue
      }
      edges.push({ from: node, to: target, type: 'hint' })
      const fresh = 0
      if ((importDepth.get(target) ?? Number.POSITIVE_INFINITY) > fresh)
        queue.push({ node: target, depth: fresh })
    }
  }

  return { reached: [...reached].sort(), edges }
}

// ── Seed construction ──────────────────────────────────────────
const packages = listPackages()

const claudeSeeds = ['CLAUDE.md']
const codexSeeds = ['AGENTS.md']

const packageRuleFiles = {}
for (const pkg of packages) {
  const claudeMd = `packages/${pkg}/CLAUDE.md`
  const agentsMd = `packages/${pkg}/AGENTS.md`
  // Claude activates the package's agent entry when the package is accessed.
  // Prefer the native CLAUDE.md shell; fall back to AGENTS.md (the cross-tool
  // standard that Claude Code also reads) so packages without a CLAUDE.md
  // wrapper are still covered. The Claude/Codex distinction is preserved by
  // import expansion, not by this seed choice.
  const claudePkgSeed = exists(claudeMd) ? claudeMd : agentsMd
  if (exists(claudePkgSeed))
    claudeSeeds.push(claudePkgSeed)
  if (exists(agentsMd))
    codexSeeds.push(agentsMd)

  // Collect this package's rule files for per-package reporting/assertions.
  const rulesDir = `packages/${pkg}/.agents/rules`
  packageRuleFiles[pkg] = exists(rulesDir)
    ? readdirSync(join(root, rulesDir))
        .filter(f => f.endsWith('.md'))
        .map(f => `${rulesDir}/${f}`)
    : []
}

// ── Reachability ───────────────────────────────────────────────
const claude = bfs(claudeSeeds, true)
const codex = bfs(codexSeeds, false)

const claudeSet = new Set(claude.reached)
const codexSet = new Set(codex.reached)

// Union of all discovered nodes (seeds + edge targets that exist).
const nodeSet = new Set([...claude.reached, ...codex.reached])
for (const e of [...claude.edges, ...codex.edges]) {
  if (exists(e.to))
    nodeSet.add(e.to)
}
const nodes = [...nodeSet].sort()

// De-duplicate edges (same from/to/type may appear via both traversals).
const edgeKey = e => `${e.from}|${e.to}|${e.type}`
const edgeMap = new Map()
for (const e of [...claude.edges, ...codex.edges])
  edgeMap.set(edgeKey(e), e)
const edges = [...edgeMap.values()].sort((a, b) =>
  a.from === b.from
    ? (a.to === b.to ? a.type.localeCompare(b.type) : a.to.localeCompare(b.to))
    : a.from.localeCompare(b.from))

// ── Per-package summary ────────────────────────────────────────
const perPackage = {}
for (const pkg of packages) {
  const rules = packageRuleFiles[pkg]
  perPackage[pkg] = {
    rules_files: rules,
    claude_reachable: rules.filter(f => claudeSet.has(f)),
    codex_reachable: rules.filter(f => codexSet.has(f)),
  }
}

// ── Assertions ─────────────────────────────────────────────────
const assertions = []

// 1. Each package's .agents/rules/*.md is in the Claude reachable set
//    (the @import chain from the package entry is intact).
{
  const missing = []
  for (const pkg of packages) {
    for (const f of packageRuleFiles[pkg]) {
      if (!claudeSet.has(f))
        missing.push(f)
    }
  }
  assertions.push({
    name: 'package_rules_claude_reachable',
    pass: missing.length === 0,
    detail: missing.length
      ? `not claude-reachable: ${missing.join(', ')}`
      : `all ${Object.values(packageRuleFiles).flat().length} package rule files reachable via @import`,
  })
  if (missing.length)
    failures.push(`package rule files not claude-reachable: ${missing.join(', ')}`)
}

// 2. routing.yaml always_read files are reachable by both Claude and Codex.
{
  const alwaysRead = []
  if (exists('skills/esdora/routing.yaml')) {
    const text = readFile('skills/esdora/routing.yaml')
    // Collect the always_read: block items.
    const lines = text.split('\n')
    let inBlock = false
    for (const line of lines) {
      if (line.startsWith('always_read:')) {
        inBlock = true
        continue
      }
      if (inBlock) {
        if (/^\S/.test(line))
          break
        const m = line.match(/^\s*-\s+(skills\/\S+)/)
        if (m)
          alwaysRead.push(toPosix(normalize(m[1].replace(/[`,"']+$/, ''))))
      }
    }
  }

  const missingClaude = alwaysRead.filter(f => !claudeSet.has(f))
  const missingCodex = alwaysRead.filter(f => !codexSet.has(f))
  assertions.push({
    name: 'always_read_reachable',
    pass: missingClaude.length === 0 && missingCodex.length === 0,
    detail: [
      missingClaude.length ? `claude missing: ${missingClaude.join(', ')}` : 'claude: all reachable',
      missingCodex.length ? `codex missing: ${missingCodex.join(', ')}` : 'codex: all reachable',
    ].join('; '),
  })
  if (missingClaude.length)
    failures.push(`always_read not claude-reachable: ${missingClaude.join(', ')}`)
  if (missingCodex.length)
    failures.push(`always_read not codex-reachable: ${missingCodex.join(', ')}`)
}

// ── Output ─────────────────────────────────────────────────────
const result = {
  nodes,
  edges,
  reachability: {
    claude: claude.reached,
    codex: codex.reached,
  },
  per_package: perPackage,
  assertions,
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)

if (failures.length) {
  for (const f of failures)
    process.stderr.write(`- ${f}\n`)
  process.stdout.write('Skill loading trace: FAIL\n')
  process.exit(1)
}

process.stdout.write('Skill loading trace: OK\n')
