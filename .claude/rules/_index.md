# 项目规则索引

## 项目概览

- 类型: TypeScript monorepo (pnpm workspace + turbo)
- 包数量: 5
- 构建工具: turbo, tsdown
- 测试框架: Vitest
- 代码规范: ESLint (@antfu/eslint-config)
- 发布管理: Changesets

## Package 列表

| Package | 路径 | 类型 | 技术栈 | 规则 |
|---------|------|------|--------|------|
| @esdora/kit | packages/kit | library (零依赖) | vanilla TS | [规则](packages/kit/) |
| @esdora/color | packages/color | library | vanilla TS + culori | [规则](packages/color/) |
| @esdora/date | packages/date | library | vanilla TS + date-fns | [规则](packages/date/) |
| @esdora/biz | packages/biz | library (独立) | vanilla TS + business deps | [规则](packages/biz/) |
| esdora | packages/esdora | meta package | re-exports | [规则](packages/esdora/) |

## 共享规则

- [项目概览](project/01-overview.md)
- [工作空间](project/02-workspace.md)
- [共享技术栈](project/03-shared-stack.md)
- [质量门](project/04-quality-gates.md)
- [Git 工作流](project/05-git-workflow.md)
