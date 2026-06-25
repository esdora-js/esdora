import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const failures = []

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function assert(condition, message) {
  if (!condition)
    failures.push(message)
}

const SKIP_DIRS = new Set(['node_modules', '.git'])

function walk(dir, predicate, out = []) {
  const abs = join(root, dir)
  if (!existsSync(abs))
    return out

  for (const entry of readdirSync(abs)) {
    if (SKIP_DIRS.has(entry))
      continue
    const rel = join(dir, entry)
    const st = statSync(join(root, rel))
    if (st.isDirectory()) {
      walk(rel, predicate, out)
    }
    else if (predicate(rel)) {
      out.push(rel)
    }
  }
  return out
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  return match?.[1] ?? ''
}

function countDescriptionLines(frontmatter) {
  const lines = frontmatter.split('\n')
  const index = lines.findIndex(line => line.startsWith('description:'))
  if (index < 0)
    return 0

  let count = 1
  for (let i = index + 1; i < lines.length; i++) {
    if (/^\w[\w-]*:/.test(lines[i]))
      break
    count++
  }
  return count
}

function parseRoutingPaths(content) {
  const paths = []
  const pathPattern = /^\s*-\s+(skills\/esdora\/\S+)|^\s*(workflow):\s+(skills\/esdora\/\S+)/gm
  for (const match of content.matchAll(pathPattern))
    paths.push(match[1] ?? match[3])
  return paths
}

function assertIncludes(file, needles) {
  if (!existsSync(join(root, file))) {
    assert(false, `${file} is missing`)
    return
  }

  const content = read(file)
  for (const needle of needles)
    assert(content.includes(needle), `${file} must include "${needle}"`)
}

const skillPath = 'skills/esdora/SKILL.md'
assert(existsSync(join(root, skillPath)), `${skillPath} is missing`)

if (existsSync(join(root, skillPath))) {
  const content = read(skillPath)
  const frontmatter = extractFrontmatter(content)
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')
  const bodyLines = body.trimEnd().split('\n').length
  const descriptionLines = countDescriptionLines(frontmatter)

  assert(frontmatter.includes('name: esdora'), 'SKILL.md must declare name: esdora')
  assert(frontmatter.includes('primary: true'), 'SKILL.md must declare primary: true')
  assert(descriptionLines <= 25, `SKILL.md description has ${descriptionLines} lines; max is 25`)
  assert(bodyLines <= 90, `SKILL.md body has ${bodyLines} lines; max is 90`)
}

const routingPath = 'skills/esdora/routing.yaml'
assert(existsSync(join(root, routingPath)), `${routingPath} is missing`)

if (existsSync(join(root, routingPath))) {
  const routingContent = read(routingPath)
  for (const path of parseRoutingPaths(routingContent))
    assert(existsSync(join(root, path)), `routing.yaml references missing file: ${path}`)
  assert(/^always_read:/m.test(routingContent), 'routing.yaml must declare an always_read: block (authoritative source)')
  assert(/^default:/m.test(routingContent), 'routing.yaml must declare a default: fallback route')
}

assert(existsSync(join(root, '.claude/skills/esdora/SKILL.md')), 'Claude native skill stub is missing')
assert(!existsSync(join(root, '.cursor')), '.cursor has been retired (Cursor support dropped). Do not re-introduce.')
assert(!existsSync(join(root, '.claude/rules')), '.claude/rules has been retired; canonical rules live in skills/esdora/rules/. Do not re-introduce.')
assert(!existsSync(join(root, '.claude/templates/api-doc.md')), '.claude/templates/api-doc.md duplicates skills/esdora/references/doc-template.md; keep one canonical API doc template.')

if (existsSync(join(root, 'CLAUDE.md')))
  assert(read('CLAUDE.md').trim() === '@AGENTS.md', 'CLAUDE.md must contain only @AGENTS.md')

const shellFiles = [
  'AGENTS.md',
  '.claude/agents/doc-generator.md',
  '.claude/agents/vibe-architect.md',
  '.claude/skills/esdora/SKILL.md',
  ...walk('packages', rel => rel.endsWith('/AGENTS.md')),
]

for (const file of shellFiles) {
  if (!existsSync(join(root, file)))
    continue

  const content = read(file)
  const lines = content.trimEnd().split('\n').length
  // Removed check: .agents/rules is valid for package-level rules
  assert(!content.includes('@include ../../.agents'), `${file} contains removed @include path`)

  if (file === 'AGENTS.md') {
    assert(lines <= 55, `${file} has ${lines} lines; root compatibility shell should stay thin`)
    assert(!content.includes('## Common Commands'), `${file} must not duplicate command tables; read package.json`)
    assert(!content.includes('## Core Project Facts'), `${file} must not duplicate project facts; route to skills/esdora/`)
  }

  if (file.startsWith('packages/') && file.endsWith('/AGENTS.md')) {
    assert(lines <= 10, `${file} has ${lines} lines; package overlay should stay thin`)
    assert(!content.includes('Package-specific boundary'), `${file} must not duplicate package boundaries; use skills/esdora/rules/package-boundaries.md`)
  }
}

for (const file of ['.claude/agents/doc-generator.md', '.claude/agents/vibe-architect.md']) {
  if (!existsSync(join(root, file)))
    continue

  const lines = read(file).trimEnd().split('\n').length
  assert(lines <= 40, `${file} has ${lines} lines; Claude agent wrappers should stay thin`)
  assert(read(file).includes('skills/esdora/SKILL.md'), `${file} must route to formal skill`)
}

const alwaysReadAuthorityFiles = [
  'skills/esdora/SKILL.md',
  'AGENTS.md',
  '.claude/skills/esdora/SKILL.md',
]
const literalAlwaysReadPaths = [
  'rules/project-rules.md',
  'rules/coding-standards.md',
  'rules/agent-behavior.md',
]

for (const file of alwaysReadAuthorityFiles) {
  if (!existsSync(join(root, file)))
    continue

  const content = read(file)
  for (const literal of literalAlwaysReadPaths)
    assert(!content.includes(literal), `${file} must not list always_read paths verbatim (found "${literal}"); reference routing.yaml instead`)
}

assertIncludes('skills/esdora/rules/quality-gates.md', [
  'export snapshots',
  'test:coverage',
  'fully covered',
])

if (existsSync(join(root, 'skills/esdora/references/package-scaffold.md'))) {
  const packageScaffold = read('skills/esdora/references/package-scaffold.md')
  assert(!packageScaffold.includes('Package-specific boundary:'), 'package-scaffold.md must not generate package AGENTS boundary text')
}

assertIncludes('skills/esdora/rules/coding-standards.md', [
  'Public API Stability',
  'src/experimental/',
  '_unstable_',
  '@experimental',
])

assertIncludes('skills/esdora/rules/docs-rules.md', [
  'TSDoc',
  'overloaded APIs',
  'Chinese TSDoc',
])

assertIncludes('skills/esdora/workflows/implement-utility.md', [
  'stable or experimental',
  'export snapshots',
  'TSDoc',
])

assertIncludes('skills/esdora/workflows/update-api-doc.md', [
  'source TSDoc',
  'experimental or',
  'deprecated status',
])

assertIncludes('skills/esdora/workflows/release-change.md', [
  'SemVer',
  '@deprecated',
  'major release',
])

// ── Package boundary localization ─────────────────────────────
// Every package listed in package-boundaries.md must carry localized
// rules under packages/<pkg>/.agents/rules/, and its AGENTS.md must
// @import them. Guards against the color-style omission regression.
{
  const boundariesPath = 'skills/esdora/rules/package-boundaries.md'
  if (existsSync(join(root, boundariesPath))) {
    const boundaries = read(boundariesPath)
    const pkgRe = /\|\s*`(@esdora\/[\w-]+|esdora)`\s*\|/g
    const listed = [...boundaries.matchAll(pkgRe)].map(m => m[1])
    for (const name of listed) {
      const dir = name === 'esdora' ? 'esdora' : name.replace('@esdora/', '')
      const rulesDir = `packages/${dir}/.agents/rules`
      assert(existsSync(join(root, rulesDir)), `${name} is listed in package-boundaries.md but ${rulesDir}/ is missing`)
      // Every file under .agents/{rules,references}/ must be @import'd by the
      // package AGENTS.md. @import is file-level (no dir glob), so coverage is
      // explicit — this catches the "added a rule file, forgot the import" drift.
      const agents = `packages/${dir}/AGENTS.md`
      if (existsSync(join(root, agents))) {
        const agentsContent = read(agents)
        for (const sub of ['rules', 'references']) {
          const subDir = `packages/${dir}/.agents/${sub}`
          if (!existsSync(join(root, subDir)))
            continue
          for (const f of readdirSync(join(root, subDir)).filter(_ => _.endsWith('.md'))) {
            const token = `@./.agents/${sub}/${f}`
            assert(agentsContent.includes(token), `${agents} must @import ${token} (exists under .agents/${sub}/ but not imported — add the @import or remove the file)`)
          }
        }
      }
    }
  }
}

// ── Category-level localized rules ────────────────────────────
// Same full-coverage rule as package-level, but for a single category of
// tools inside a package: packages/<pkg>/src/<cat>/.agents/. No package
// uses category-level rules today, so this is a dormant guard that activates
// the moment one is added — its .md files must be @import'd by that
// category's AGENTS.md/CLAUDE.md. See references/instruction-loading.md.
{
  const pkgsAbs = join(root, 'packages')
  if (existsSync(pkgsAbs)) {
    for (const pkg of readdirSync(pkgsAbs)) {
      if (SKIP_DIRS.has(pkg))
        continue
      const srcAbs = join(pkgsAbs, pkg, 'src')
      if (!existsSync(srcAbs))
        continue
      for (const cat of readdirSync(srcAbs)) {
        if (SKIP_DIRS.has(cat))
          continue
        const catAbs = join(srcAbs, cat)
        if (!statSync(catAbs).isDirectory())
          continue
        const agentsAbs = join(catAbs, '.agents')
        if (!existsSync(agentsAbs))
          continue
        const catRel = `packages/${pkg}/src/${cat}`
        const shellAgents = `${catRel}/AGENTS.md`
        const shellClaude = `${catRel}/CLAUDE.md`
        const shell = existsSync(join(root, shellAgents)) ? shellAgents : shellClaude
        if (!existsSync(join(root, shell))) {
          assert(false, `${catRel} has .agents/ but no AGENTS.md/CLAUDE.md to @import them`)
          continue
        }
        const shellContent = read(shell)
        for (const sub of ['rules', 'references']) {
          const subDir = `${catRel}/.agents/${sub}`
          if (!existsSync(join(root, subDir)))
            continue
          for (const f of readdirSync(join(root, subDir)).filter(_ => _.endsWith('.md'))) {
            const token = `@./.agents/${sub}/${f}`
            assert(shellContent.includes(token), `${shell} must @import ${token} (exists under ${subDir}/ but not imported)`)
          }
        }
      }
    }
  }
}

// ── @import target existence ──────────────────────────────────
// Resolve @./, @../, and @name.md references in AI-instruction files
// and verify each target exists. Catches broken compatibility-shell
// include chains across CLAUDE.md / AGENTS.md / .agents/.
{
  const importRe = /^[ \t]*@(\.{1,2}\/[^\s`<>)]+|[A-Za-z][\w-]*\.md)/gm
  const mdFiles = [
    ...new Set([
      'AGENTS.md',
      'CLAUDE.md',
      ...walk('packages', rel => rel.endsWith('.md')),
      ...walk('skills', rel => rel.endsWith('.md')),
      ...walk('.claude', rel => rel.endsWith('.md')),
    ]),
  ]
  for (const file of mdFiles) {
    if (!existsSync(join(root, file)))
      continue
    for (const token of read(file).matchAll(importRe)) {
      const rel = token[1].replace(/[`.,;)]+$/, '')
      const target = normalize(join(root, dirname(file), rel))
      assert(existsSync(target), `${file}: broken @import → ${rel}`)
    }
  }
}

if (failures.length) {
  console.error('Skill architecture check failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Skill architecture check passed.')
