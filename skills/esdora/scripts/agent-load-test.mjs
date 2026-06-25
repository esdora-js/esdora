// AI load-behavior test harness for the esdora monorepo.
//
// Simulates a real user entering the project, launching claude code or codex,
// issuing a task, and asserting the agent loaded the expected rules/skills.
//
// LOCAL-ONLY. Burns API budget and mutates files. Never wired into CI.
//
// Usage:
//   node skills/esdora/scripts/agent-load-test.mjs --dry-run
//   node skills/esdora/scripts/agent-load-test.mjs --case B1-kit --tool claude
//   node skills/esdora/scripts/agent-load-test.mjs --case B1-kit --tool codex --no-strict
//
// Flags:
//   --case <id>     run a single case by id (default: all)
//   --tool <t>      claude | codex (default: both)
//   --no-strict     skip behavior.strict file-mutation checks
//   --dry-run       do not call any agent; use built-in mock transcripts to
//                   exercise parsing / judgement / reporting only
//
// Style: ESM .mjs, no external deps, 2-space, no semicolons — matches
// check-skill-architecture.mjs.

import { execFileSync, execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import cases from './agent-load-test.cases.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..', '..', '..')

// ── tiny helpers ────────────────────────────────────────────────────

const RED = '\x1B[31m'
const YEL = '\x1B[33m'
const GRN = '\x1B[32m'
const DIM = '\x1B[2m'
const BLD = '\x1B[1m'
const RST = '\x1B[0m'

function color(c, s) {
  if (!process.stdout.isTTY)
    return s
  return `${c}${s}${RST}`
}

function runGit(args, opts = {}) {
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim()
}

function runShell(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts })
}

// Normalize an observed path to a repo-relative string for comparison.
// Absolute paths are resolved, then stripped of either the run's cwdRoot
// (worktree) or REPO_ROOT prefix; relative paths are returned as-is (already
// repo-relative). Result e.g. "packages/kit/.agents/rules/x.md".
function normPath(p, cwdRoot = REPO_ROOT) {
  if (!p)
    return ''
  if (p.startsWith('/')) {
    const abs = resolve(p)
    for (const root of [cwdRoot, REPO_ROOT]) {
      if (abs === root)
        return ''
      if (abs.startsWith(`${root}/`))
        return abs.slice(root.length + 1)
    }
    return abs
  }
  return p
}

// Does an observed file path match an expected repo-relative target?
// Both sides are normalized to repo-relative strings before comparing.
function pathMatches(observed, target, cwdRoot = REPO_ROOT) {
  if (!observed)
    return false
  const o = normPath(observed, cwdRoot)
  const t = normPath(target, cwdRoot)
  if (o === t)
    return true
  // Containment covers cases where the agent logs a parent dir or the agent
  // read a file under a target directory (e.g. target packages/kit/src,
  // observed packages/kit/src/is/index.ts). Prefer exact for rule/workflow
  // .md files, which is what expect_reads/prefer_reads list.
  return o.includes(t) || t.includes(o)
}

// ── transcript model ────────────────────────────────────────────────
// A normalized view of one agent run, independent of claude vs codex wire
// format. readPaths = files the agent loaded (via Read tool or shell cat/sed).
// replyText = the agent's final user-facing message.

function parseClaudeStreamJson(stdout) {
  const readPaths = []
  const replyParts = []
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('{'))
      continue
    let event
    try {
      event = JSON.parse(trimmed)
    }
    catch {
      continue
    }
    // claude stream-json: tool_use blocks carry name + input.
    if (event.type === 'tool_use' && event.name === 'Read' && event.input?.file_path)
      readPaths.push(event.input.file_path)
    // some variants nest under message.content
    if (event.type === 'assistant' && Array.isArray(event.message?.content)) {
      for (const block of event.message.content) {
        if (block.type === 'tool_use' && block.name === 'Read' && block.input?.file_path)
          readPaths.push(block.input.file_path)
        if (block.type === 'text' && block.text)
          replyParts.push(block.text)
      }
    }
    if (event.type === 'result' && event.result)
      replyParts.push(typeof event.result === 'string' ? event.result : JSON.stringify(event.result))
  }
  return { readPaths, replyText: replyParts.join('\n').trim() }
}

const FILE_READ_CMDS = /\b(?:cat|bat|head|tail|sed|less|more|rg|grep|nl|view|read)\b/

function parseCodexJsonl(stdout) {
  const readPaths = []
  const replyParts = []
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('{'))
      continue
    let event
    try {
      event = JSON.parse(trimmed)
    }
    catch {
      continue
    }
    const item = event.item ?? event
    if (event.type !== 'item.completed' || !item)
      continue
    if (item.type === 'command_execution' && typeof item.command === 'string') {
      // codex reads files via shell; extract plausible repo-relative paths.
      if (FILE_READ_CMDS.test(item.command)) {
        for (const token of item.command.split(/[\s'"`]+/)) {
          if (!token || token.startsWith('-') || token.startsWith('/bin'))
            continue
          if (token.includes('/') && (token.endsWith('.md') || token.endsWith('.yaml') || token.endsWith('.json') || token.endsWith('.ts') || token.endsWith('.mjs'))) {
            readPaths.push(token.replace(/^\.?\//, ''))
          }
        }
      }
    }
    if (item.type === 'agent_message' && typeof item.text === 'string')
      replyParts.push(item.text)
  }
  return { readPaths, replyText: replyParts.join('\n').trim() }
}

// ── agent adapters ──────────────────────────────────────────────────
// Each returns { readPaths, replyText, cwd } for one run. cwd is the
// working directory the agent ran in (a worktree path, or REPO_ROOT) — used
// by pathMatches to normalize observed paths to repo-relative form.

function runClaude(task, cwd) {
  try {
    const stdout = execFileSync(
      'claude',
      ['-p', task, '--output-format', 'stream-json', '--verbose', '--dangerously-skip-permissions'],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 },
    )
    return { ...parseClaudeStreamJson(stdout), cwd }
  }
  catch (err) {
    const partial = err.stdout ? parseClaudeStreamJson(err.stdout.toString()) : { readPaths: [], replyText: '' }
    return { ...partial, cwd, error: `claude failed: ${(err.message || '').split('\n')[0]}` }
  }
}

function runCodex(task, cwd) {
  const lastMsgFile = join(cwd, '.codex-last-message.txt')
  try {
    const stdout = execFileSync(
      'codex',
      ['exec', task, '--sandbox', 'workspace-write', '--skip-git-repo-check', '--json', '-o', lastMsgFile],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 },
    )
    const parsed = parseCodexJsonl(stdout)
    if (!parsed.replyText && existsSync(lastMsgFile))
      parsed.replyText = readFileSync(lastMsgFile, 'utf8').trim()
    return { ...parsed, cwd }
  }
  catch (err) {
    // codex may exit non-zero (e.g. upstream 503 turn.failed); salvage partial stdout.
    const partial = err.stdout ? parseCodexJsonl(err.stdout.toString()) : { readPaths: [], replyText: '' }
    return { ...partial, cwd, error: `codex failed: ${(err.message || '').split('\n')[0]}` }
  }
}

// ── dry-run mock transcripts ─────────────────────────────────────────
// Deterministic fakes so --dry-run exercises judgement + reporting without
// spending API budget. Designed to produce a mix of PASS / ⚠️ / 🔴 outcomes
// so the report rendering is visibly exercised.

function mockRun(caseId, tool, runIdx) {
  // Pretend the agent always loaded the workflow + routing, sometimes the
  // prefer_reads, and (for E1) never the unrelated package rules.
  const seed = (caseId.length + runIdx + (tool === 'codex' ? 7 : 3)) % 5
  const c = cases.find(x => x.id === caseId)

  const readPaths = new Set()
  // expect_reads always satisfied in mock.
  for (const p of c.expect_reads || [])
    readPaths.add(p)
  // A1 also loads routing (its expect_reads).
  readPaths.add('skills/esdora/routing.yaml')

  // prefer_reads: codex hits some; claude hits none (@import expansion).
  if (tool === 'codex' && c.prefer_reads?.length && seed < 3)
    readPaths.add(c.prefer_reads[0])

  // E1 precision: never load unrelated package rules.
  if (caseId === 'E1-no-unrelated-pkg') {
    readPaths.delete('packages/date/.agents/rules/package-boundary.md')
    readPaths.delete('packages/biz/.agents/rules/package-boundary.md')
  }

  // reply text mocks behavior.lite keywords for most cases.
  const liteKeywords = {
    'B1-kit': 'kit 必须保持无运行时依赖 (zero runtime / dependency-free)',
    'B2-date': '基于 date-fns，提供 fp 与 locale 子路径',
    'B3-biz': 'biz 是 standalone 包，不依赖 workspace',
    'B4-esdora': 'esdora 是 meta 包，只做 re-export，无实现',
    'B5-color': '颜色工具基于 culori 构建',
    'C2-update-api-doc': '请补上 TSDoc 注释',
    'C3-verify-package': '跑 pnpm test 与 typecheck，确认 coverage 达标，过质量门',
    'C5-release-change': '新建一个 changeset，遵循 SemVer，更新 changelog',
    'D1-kit-reject-dep': '违反 kit 无运行时依赖约束，不能加依赖',
  }
  // Make D1 sometimes fail lite on one run to show a 🔴 in dry-run.
  const replyText = (caseId === 'D1-kit-reject-dep' && runIdx === 1)
    ? '好的，我帮你加上 lodash。'
    : (liteKeywords[caseId] || '已按照工作流完成任务。')

  return { readPaths: [...readPaths], replyText }
}

// ── worktree isolation for strict checks ─────────────────────────────

function makeWorktree(caseId) {
  const base = mkdtempSync(join(tmpdir(), `esdora-alt-`))
  rmSync(base, { recursive: true, force: true })
  const branch = `alt/${caseId}`
  // Discard any stale branch from a previous aborted run.
  try {
    runGit(['branch', '-D', branch])
  }
  catch {
    // ignore — branch didn't exist
  }
  runGit(['worktree', 'add', '-b', branch, base, 'HEAD'])
  return { path: base, branch }
}

function resetWorktree(path) {
  // Keep node_modules; only drop tracked changes + untracked files.
  execFileSync('git', ['restore', '.'], { cwd: path, stdio: 'ignore' })
  execFileSync('git', ['clean', '-fd'], { cwd: path, stdio: 'ignore' })
}

function removeWorktree({ path, branch }) {
  try {
    runGit(['worktree', 'remove', '--force', path])
  }
  catch {
    rmSync(path, { recursive: true, force: true })
  }
  try {
    runGit(['branch', '-D', branch])
  }
  catch {
    // ignore
  }
}

function ensureWorktreeDeps(path) {
  // One install per worktree. node_modules survives resets (clean -fd keeps it).
  if (!existsSync(join(path, 'node_modules')))
    execFileSync('pnpm', ['install', '--frozen-lockfile'], { cwd: path, stdio: 'inherit' })
}

// ── assertions ───────────────────────────────────────────────────────

function judgeExpectReads(caseDef, run) {
  const cwd = run.cwd || REPO_ROOT
  const hits = (caseDef.expect_reads || []).map((target) => {
    const ok = run.readPaths.some(p => pathMatches(p, target, cwd))
    return { target, ok, tool: run.readTools?.[target] || 'Read' }
  })
  return { passed: hits.every(h => h.ok), hits }
}

function judgeExpectNot(caseDef, run) {
  const cwd = run.cwd || REPO_ROOT
  const hits = (caseDef.expect_not || []).map((target) => {
    const ok = !run.readPaths.some(p => pathMatches(p, target, cwd))
    return { target, ok }
  })
  return { passed: hits.every(h => h.ok), hits }
}

function judgePreferReads(caseDef, run) {
  const cwd = run.cwd || REPO_ROOT
  return (caseDef.prefer_reads || []).map((target) => {
    const ok = run.readPaths.some(p => pathMatches(p, target, cwd))
    return { target, ok }
  })
}

function judgeLite(caseDef, run) {
  const lite = caseDef.behavior?.lite
  if (!lite)
    return null
  const ok = lite.any.some(kw => run.replyText?.toLowerCase().includes(kw.toLowerCase()))
  return { ok, matched: ok ? lite.any.find(kw => run.replyText?.toLowerCase().includes(kw.toLowerCase())) : null }
}

function runStrictChecks(caseDef, worktreePath) {
  const checks = caseDef.behavior?.strict?.checks
  if (!checks?.length)
    return { ran: false }
  const results = checks.map((cmd) => {
    try {
      runShell(cmd, { cwd: worktreePath, stdio: ['ignore', 'pipe', 'pipe'] })
      return { cmd, ok: true }
    }
    catch (err) {
      return { cmd, ok: false, stderr: (err.stderr || err.message || '').toString().split('\n')[0] }
    }
  })
  return { ran: true, results, passed: results.every(r => r.ok) }
}

// ── per-case runner ─────────────────────────────────────────────────

function runCase(caseDef, tool, opts) {
  const { dryRun, noStrict } = opts
  const n = caseDef.n
  const strictDef = caseDef.behavior?.strict

  // ── dry-run: mock transcripts, no worktree, no agent calls. ──
  // mockRun readPaths are already repo-relative; judge with REPO_ROOT cwd.
  if (dryRun) {
    const runs = []
    for (let i = 0; i < n; i++)
      runs.push({ ...mockRun(caseDef.id, tool, i), cwd: REPO_ROOT })

    const result = judgeRuns(caseDef, tool, runs)
    let strictSummary = null
    if (strictDef)
      strictSummary = { n: strictDef.n, k: strictDef.k, pass: strictDef.n, ok: true, dry: true }
    return { ...result, strict: strictSummary, todoStrict: caseDef.todoStrict || false, dryRun }
  }

  // ── real run: isolate EVERY agent call in one worktree per case×tool. ──
  // reads/lite (n runs) and strict (strictDef.n runs) share the worktree so
  // the main repo working tree is never touched. Deps install once on first
  // entry; resetWorktree before each task for a clean slate.
  const wt = makeWorktree(caseDef.id)
  let depsInstalled = false
  const runs = []
  let strictSummary = null
  try {
    for (let i = 0; i < n; i++) {
      if (i > 0)
        resetWorktree(wt.path)
      if (!depsInstalled) {
        ensureWorktreeDeps(wt.path)
        depsInstalled = true
      }
      runs.push(tool === 'claude' ? runClaude(caseDef.task, wt.path) : runCodex(caseDef.task, wt.path))
      resetWorktree(wt.path)
    }

    if (!noStrict && strictDef) {
      let passCount = 0
      for (let i = 0; i < strictDef.n; i++) {
        resetWorktree(wt.path)
        if (!depsInstalled) {
          ensureWorktreeDeps(wt.path)
          depsInstalled = true
        }
        tool === 'claude' ? runClaude(caseDef.task, wt.path) : runCodex(caseDef.task, wt.path)
        const check = runStrictChecks(caseDef, wt.path)
        if (check.ran && check.passed)
          passCount++
        resetWorktree(wt.path)
      }
      strictSummary = { n: strictDef.n, k: strictDef.k, pass: passCount, ok: passCount >= strictDef.k }
    }
  }
  finally {
    removeWorktree(wt)
  }

  const result = judgeRuns(caseDef, tool, runs)
  return { ...result, strict: strictSummary, todoStrict: caseDef.todoStrict || false, dryRun }
}

// Aggregate reads/expect_not/prefer/lite judgements over a list of runs and
// assemble the non-strict fields of the case result.
function judgeRuns(caseDef, tool, runs) {
  const readsJudgements = runs.map(r => judgeExpectReads(caseDef, r))
  const notJudgements = runs.map(r => judgeExpectNot(caseDef, r))
  const preferJudgements = runs.map(r => judgePreferReads(caseDef, r))
  const liteJudgements = runs.map(r => judgeLite(caseDef, r))

  const readsPassCount = readsJudgements.filter(j => j.passed).length
  const notPassCount = notJudgements.filter(j => j.passed).length
  const litePassCount = liteJudgements.filter(j => j?.ok).length

  // prefer_reads per-target hit rate.
  const preferHit = {}
  for (const target of caseDef.prefer_reads || [])
    preferHit[target] = preferJudgements.flat().filter(h => h.target === target && h.ok).length

  const errors = runs.map(r => r.error).filter(Boolean)
  const n = caseDef.n
  return {
    caseId: caseDef.id,
    tool,
    n,
    errors,
    reads: { pass: readsPassCount, n, k: caseDef.k, ok: readsPassCount >= caseDef.k, misses: collectMisses(readsJudgements) },
    expectNot: caseDef.expect_not?.length
      ? { pass: notPassCount, n, k: caseDef.k, ok: notPassCount >= caseDef.k }
      : null,
    prefer: preferHit,
    lite: caseDef.behavior?.lite
      ? { pass: litePassCount, n: caseDef.behavior.lite.n, k: caseDef.behavior.lite.k, ok: litePassCount >= caseDef.behavior.lite.k }
      : null,
  }
}

function collectMisses(judgements) {
  const misses = {}
  for (const j of judgements) {
    for (const h of j.hits) {
      if (!h.ok)
        misses[h.target] = (misses[h.target] || 0) + 1
    }
  }
  return misses
}

// ── reporting ───────────────────────────────────────────────────────

function report(result) {
  const lines = []
  const tag = result.dryRun ? ' [DRY-RUN]' : ''
  lines.push(color(BLD, `\n══ ${result.caseId} · ${result.tool}${tag} ══`))

  // 🔴 FAIL block (hard assertions)
  const fails = []
  if (!result.reads.ok)
    fails.push(`expect_reads: ${result.reads.pass}/${result.reads.n} (need ${result.reads.k}) — misses: ${fmtMisses(result.reads.misses)}`)
  if (result.expectNot && !result.expectNot.ok)
    fails.push(`expect_not: ${result.expectNot.pass}/${result.expectNot.n} (need ${result.expectNot.k}) — loaded forbidden package rules`)
  if (result.lite && !result.lite.ok)
    fails.push(`behavior.lite: ${result.lite.pass}/${result.lite.n} (need ${result.lite.k}) — reply lacked all expected keywords`)
  if (result.strict && !result.strict.ok)
    fails.push(`behavior.strict: ${result.strict.pass}/${result.strict.n} (need ${result.strict.k})${result.strict.dry ? ' [mocked]' : ''}`)
  if (result.errors?.length)
    fails.push(`agent 调用失败: ${result.errors.length}/${result.n} 次 — 首个: ${result.errors[0]}`)

  if (fails.length)
    lines.push(color(RED, '  🔴 FAIL'))
  else
    lines.push(color(GRN, '  ✅ PASS (hard assertions)'))
  for (const f of fails)
    lines.push(color(RED, `     - ${f}`))

  // ⚠️ non-binding prefer_reads hints
  lines.push(color(YEL, '  ⚠️ 非必读提示 (prefer_reads, 仅统计)'))
  if (!Object.keys(result.prefer).length) {
    lines.push(color(DIM, '     (无 prefer_reads)'))
  }
  else {
    for (const [target, hit] of Object.entries(result.prefer)) {
      let note = ''
      if (result.tool === 'claude' && hit === 0)
        note = color(DIM, '  ← 此为预期: claude @import 展开, 包规则进 context 不产生 Read')
      lines.push(`     ${hit}/${result.n}  ${target}${note}`)
    }
  }

  if (result.todoStrict)
    lines.push(color(DIM, '  (todoStrict: behavior.strict 尚未实现, 见 cases 文件)'))

  return lines.join('\n')
}

function fmtMisses(misses) {
  const entries = Object.entries(misses)
  if (!entries.length)
    return 'none'
  return entries.map(([t, c]) => `${t}(${c}x未命中)`).join(', ')
}

function summaryTable(results) {
  const rows = [['case', 'tool', 'reads', 'expect_not', 'lite', 'strict', 'verdict']]
  for (const r of results) {
    rows.push([
      r.caseId,
      r.tool,
      `${r.reads.pass}/${r.reads.n}`,
      r.expectNot ? `${r.expectNot.pass}/${r.expectNot.n}` : '—',
      r.lite ? `${r.lite.pass}/${r.lite.n}` : '—',
      r.strict ? `${r.strict.pass}/${r.strict.n}` : (r.todoStrict ? 'TODO' : '—'),
      hardPass(r) ? '✅' : (r.errors?.length ? '🔴ERR' : '🔴'),
    ])
  }
  return renderTable(rows)
}

function hardPass(r) {
  if (!r.reads.ok)
    return false
  if (r.expectNot && !r.expectNot.ok)
    return false
  if (r.lite && !r.lite.ok)
    return false
  if (r.strict && !r.strict.ok)
    return false
  return true
}

function renderTable(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map(r => r[i].length)))
  return rows.map((r) => {
    const cells = r.map((c, i) => c.padEnd(widths[i]))
    return `  ${cells.join('  ')}`
  }).join('\n')
}

// ── CLI ──────────────────────────────────────────────────────────────

const USAGE = `\
agent-load-test — local AI load-behavior harness (NOT for CI)

Usage:
  node skills/esdora/scripts/agent-load-test.mjs [flags]

Flags:
  --case <id>     run a single case by id (default: all)
  --tool <t>      claude | codex (default: both)
  --no-strict     skip behavior.strict file-mutation checks
  --dry-run       use mock transcripts (no agent calls, no API spend)
  -h, --help      show this help

Examples:
  node skills/esdora/scripts/agent-load-test.mjs --dry-run
  node skills/esdora/scripts/agent-load-test.mjs --case B1-kit --tool claude
`

function parseArgs(argv) {
  const opts = { caseId: null, tool: null, noStrict: false, dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--case') {
      opts.caseId = argv[++i]
    }
    else if (a === '--tool') {
      opts.tool = argv[++i]
    }
    else if (a === '--no-strict') {
      opts.noStrict = true
    }
    else if (a === '--dry-run') {
      opts.dryRun = true
    }
    else if (a === '-h' || a === '--help') {
      process.stdout.write(USAGE)
      process.exit(0)
    }
    else {
      console.error(color(RED, `unknown flag: ${a}`))
    }
  }
  return opts
}

function main() {
  const opts = parseArgs(process.argv.slice(2))

  // Prune stale worktrees left by a previously killed run (real runs only).
  if (!opts.dryRun)
    runGit(['worktree', 'prune'])

  const selected = cases.filter(c => !opts.caseId || c.id === opts.caseId)
  if (!selected.length) {
    console.error(color(RED, `no case matched id "${opts.caseId}". known: ${cases.map(c => c.id).join(', ')}`))
    process.exit(2)
  }

  const tools = opts.tool ? [opts.tool] : ['claude', 'codex']
  for (const t of tools) {
    if (!['claude', 'codex'].includes(t)) {
      console.error(color(RED, `unknown tool "${t}". use claude or codex.`))
      process.exit(2)
    }
  }

  const results = []
  for (const caseDef of selected) {
    for (const tool of tools) {
      if (!caseDef.tools.includes(tool)) {
        console.error(color(YEL, `skip ${caseDef.id}: tool ${tool} not in case.tools ${JSON.stringify(caseDef.tools)}`))
        continue
      }
      const result = runCase(caseDef, tool, opts)
      results.push(result)
      console.log(report(result))
    }
  }

  console.log(color(BLD, '\n══ 汇总 ══'))
  console.log(summaryTable(results))

  const anyFail = results.some(r => !hardPass(r))
  process.exit(anyFail && !opts.dryRun ? 1 : 0)
}

main()
