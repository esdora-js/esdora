import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
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

function walk(dir, predicate, out = []) {
  const abs = join(root, dir)
  if (!existsSync(abs))
    return out

  for (const entry of readdirSync(abs)) {
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
  for (const path of parseRoutingPaths(read(routingPath)))
    assert(existsSync(join(root, path)), `routing.yaml references missing file: ${path}`)
}

assert(existsSync(join(root, '.claude/skills/esdora/SKILL.md')), 'Claude native skill stub is missing')
assert(existsSync(join(root, '.cursor/skills/esdora/SKILL.md')), 'Cursor skill registration stub is missing')

if (existsSync(join(root, 'CLAUDE.md')))
  assert(read('CLAUDE.md').trim() === '@AGENTS.md', 'CLAUDE.md must contain only @AGENTS.md')

const shellFiles = [
  'AGENTS.md',
  '.claude/agents/doc-generator.md',
  '.claude/agents/vibe-architect.md',
  '.claude/skills/esdora/SKILL.md',
  '.cursor/skills/esdora/SKILL.md',
  ...walk('packages', rel => rel.endsWith('/AGENTS.md')),
]

for (const file of shellFiles) {
  if (!existsSync(join(root, file)))
    continue

  const content = read(file)
  assert(!content.includes('.agents/rules'), `${file} references removed .agents/rules path`)
  assert(!content.includes('@include ../../.agents'), `${file} contains removed @include path`)
}

for (const file of ['.claude/agents/doc-generator.md', '.claude/agents/vibe-architect.md']) {
  if (!existsSync(join(root, file)))
    continue

  const lines = read(file).trimEnd().split('\n').length
  assert(lines <= 40, `${file} has ${lines} lines; Claude agent wrappers should stay thin`)
  assert(read(file).includes('skills/esdora/SKILL.md'), `${file} must route to formal skill`)
}

if (failures.length) {
  console.error('Skill architecture check failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Skill architecture check passed.')
