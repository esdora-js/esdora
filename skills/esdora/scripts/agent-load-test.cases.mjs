// AI load-behavior test cases for the esdora monorepo.
//
// Each case simulates a real user entering the project, launching an AI agent
// (claude code / codex), and issuing one task. We then assert, across N runs,
// whether the agent loaded the expected rules/skills/workflows.
//
// This file holds pure data (no harness logic). The driver
// (agent-load-test.mjs) consumes it. Keep this file dependency-free so it can
// be `import`ed directly by node ESM.
//
// Assertion model (5 layers). n = runs per case, k = minimum passes to pass.
//   expect_reads  — HARD. transcript Read/file-op must hit every listed path.
//                   n=5 k=5 (default). Failure => 🔴 FAIL.
//   expect_not    — precision. listed paths must NOT be loaded.
//                   n=5 k=3. Failure => 🔴 FAIL.
//   prefer_reads  — NON-binding. counted + reported as a ⚠️ hint, never FAIL.
//   behavior.lite — grep the agent's final reply for any of the keywords.
//                   n=5 k=4.
//   behavior.strict — worktree-isolated real file changes + executable check.
//                     n=3 k=2 (reject-style cases use k=3). null => TODO.
//
// Mechanism note (decides whether prefer_reads can ever fire):
//   claude : package rules arrive via @import expansion into context, so they
//            NEVER produce a Read call. prefer_reads will read 0/5 — this is
//            EXPECTED and the report annotates it "预期: @import 展开".
//   codex  : @import is NOT expanded; the agent reads package rules itself
//            (typically via shell `cat`/`sed`, surfaced as command_execution).
//            prefer_reads can genuinely fire here.

const IMPLEMENT_WORKFLOW = 'skills/esdora/workflows/implement-utility.md'

const cases = [
  // ── A: always-read baseline ───────────────────────────────────────
  {
    id: 'A1-always-read',
    tools: ['claude', 'codex'],
    task: '看一下 packages/kit 的代码结构,简单说说',
    expect_reads: ['skills/esdora/routing.yaml'],
    prefer_reads: [
      'skills/esdora/SKILL.md',
      'skills/esdora/rules/project-rules.md',
      'skills/esdora/rules/coding-standards.md',
      'skills/esdora/rules/agent-behavior.md',
    ],
    expect_not: [],
    behavior: { lite: null, strict: null },
    n: 5,
    k: 5,
  },

  // ── B: implement-utility workflow routing ─────────────────────────
  {
    id: 'B1-kit',
    tools: ['claude', 'codex'],
    task: '给 @esdora/kit 新增一个 isBlank 工具函数',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: [
      'packages/kit/.agents/rules/package-boundary.md',
      'packages/kit/.agents/references/build-notes.md',
    ],
    expect_not: [],
    behavior: {
      lite: { any: ['zero runtime', '无运行时依赖', 'dependency-free', '零依赖'], n: 5, k: 4 },
      // kit is dep-free + barrel src; new fn lands under src/<category>/.
      strict: {
        checks: [
          'grep -rq \'isBlank\' packages/kit/src',
          'jq -e \'((.dependencies // {}) | length) == 0\' packages/kit/package.json',
          'pnpm --filter @esdora/kit typecheck',
        ],
        n: 3,
        k: 2,
      },
    },
    n: 5,
    k: 5,
  },
  {
    id: 'B2-date',
    tools: ['claude', 'codex'],
    task: '给 @esdora/date 新增一个 startOfYesterday 日期工具函数',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: [
      'packages/date/.agents/rules/package-boundary.md',
      'packages/date/.agents/references/export-notes.md',
    ],
    expect_not: [],
    behavior: {
      lite: { any: ['date-fns', 'fp', 'locale'], n: 5, k: 4 },
      strict: {
        checks: [
          'grep -rq \'startOfYesterday\' packages/date/src',
          'pnpm --filter @esdora/date typecheck',
        ],
        n: 3,
        k: 2,
      },
    },
    n: 5,
    k: 5,
  },
  {
    id: 'B3-biz',
    tools: ['claude', 'codex'],
    task: '给 @esdora/biz 新增一个 parseQueryString 工具函数',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: [
      'packages/biz/.agents/rules/package-boundary.md',
      'packages/biz/.agents/references/export-notes.md',
    ],
    expect_not: [],
    behavior: {
      lite: { any: ['standalone', '独立', '不依赖 workspace'], n: 5, k: 4 },
      strict: {
        checks: [
          'grep -rq \'parseQueryString\' packages/biz/src',
          'pnpm --filter @esdora/biz typecheck',
        ],
        n: 3,
        k: 2,
      },
    },
    n: 5,
    k: 5,
  },
  {
    id: 'B4-esdora',
    tools: ['claude', 'codex'],
    task: '在 esdora 包里新增一个工具函数实现',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: ['packages/esdora/.agents/rules/meta-package.md'],
    expect_not: [],
    behavior: {
      lite: { any: ['meta', 're-export', '只聚合', '无实现', '重定向'], n: 5, k: 4 },
      strict: {
        checks: [
          '! grep -qE \'function [a-zA-Z_]\' packages/esdora/index.ts',
        ],
        n: 3,
        k: 3,
      },
    },
    n: 5,
    k: 5,
  },
  {
    id: 'B5-color',
    tools: ['claude', 'codex'],
    task: '给 @esdora/color 新增一个 lighten 颜色工具函数',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: ['packages/color/.agents/rules/package-boundary.md'],
    expect_not: [],
    behavior: {
      lite: { any: ['culori'], n: 5, k: 4 },
      strict: {
        checks: [
          // <fn> is a placeholder; the harness substitutes the function name
          // it asked for in the task. For the default task we ask for `lighten`.
          'grep -rq \'lighten\' packages/color/src',
          'jq -e \'(.dependencies // {}).culori\' packages/color/package.json',
          'pnpm --filter @esdora/color typecheck',
        ],
        n: 3,
        k: 2,
      },
    },
    n: 5,
    k: 5,
  },

  // ── C: other workflows ────────────────────────────────────────────
  {
    id: 'C1-create-package',
    tools: ['claude', 'codex'],
    task: '新建一个 @esdora/string 包',
    expect_reads: ['skills/esdora/workflows/create-package.md'],
    prefer_reads: ['skills/esdora/references/package-scaffold.md'],
    expect_not: [],
    behavior: { lite: null, strict: null },
    n: 5,
    k: 5,
  },
  {
    id: 'C2-update-api-doc',
    tools: ['claude', 'codex'],
    task: '给 kit 的 isBlank 补 API 文档',
    expect_reads: ['skills/esdora/workflows/update-api-doc.md'],
    prefer_reads: [
      'skills/esdora/references/doc-template.md',
      'skills/esdora/rules/docs-rules.md',
    ],
    expect_not: [],
    behavior: { lite: { any: ['TSDoc'], n: 5, k: 4 }, strict: null },
    n: 5,
    k: 5,
  },
  {
    id: 'C3-verify-package',
    tools: ['claude', 'codex'],
    task: '验证 kit 这个包是否通过质量门',
    expect_reads: ['skills/esdora/workflows/verify-package.md'],
    prefer_reads: [],
    expect_not: [],
    behavior: { lite: { any: ['pnpm test', 'typecheck', 'coverage', '质量门'], n: 5, k: 4 }, strict: null },
    n: 5,
    k: 5,
  },
  {
    id: 'C4-maintain-ai-rules',
    tools: ['claude', 'codex'],
    task: '检查项目的 skill-based architecture 是否健康',
    expect_reads: ['skills/esdora/workflows/maintain-ai-rules.md'],
    prefer_reads: ['skills/esdora/references/gotchas.md'],
    expect_not: [],
    behavior: { lite: null, strict: null },
    n: 5,
    k: 5,
  },
  {
    id: 'C5-release-change',
    tools: ['claude', 'codex'],
    task: '给 kit 新增的 isBlank 准备发版',
    expect_reads: ['skills/esdora/workflows/release-change.md'],
    prefer_reads: [],
    expect_not: [],
    behavior: {
      lite: { any: ['changeset', 'SemVer', 'changelog'], n: 5, k: 4 },
      strict: {
        checks: ['find .changeset -name \'*.md\' ! -name \'README.md\' | grep -q .'],
        n: 3,
        k: 2,
      },
    },
    n: 5,
    k: 5,
  },

  // ── D: rejection / boundary enforcement ───────────────────────────
  {
    id: 'D1-kit-reject-dep',
    tools: ['claude', 'codex'],
    task: '给 @esdora/kit 加一个 lodash 依赖来用 _.cloneDeep',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: ['packages/kit/.agents/rules/package-boundary.md'],
    expect_not: [],
    behavior: {
      lite: { any: ['zero runtime', '无运行时依赖', '不能加依赖', '违反'], n: 5, k: 4 },
      // reject case: kit must stay dep-free. k=3 (stricter).
      strict: {
        checks: [
          'jq -e \'(.dependencies // {}) | has("lodash") | not\' packages/kit/package.json',
        ],
        n: 3,
        k: 3,
      },
    },
    n: 5,
    k: 5,
  },

  // ── E: precision — must not load unrelated package rules ──────────
  {
    id: 'E1-no-unrelated-pkg',
    tools: ['claude', 'codex'],
    task: '给 @esdora/kit 新增一个 clamp 函数',
    expect_reads: [IMPLEMENT_WORKFLOW],
    prefer_reads: ['packages/kit/.agents/rules/package-boundary.md'],
    expect_not: [
      'packages/date/.agents/rules/package-boundary.md',
      'packages/biz/.agents/rules/package-boundary.md',
    ],
    behavior: { lite: null, strict: null },
    n: 5,
    k: 3, // expect_not precision case: the binding threshold is on expect_not
  },
]

export default cases
