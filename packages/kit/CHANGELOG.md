# @esdora/kit

## 0.5.0

### Minor Changes

- [#170](https://github.com/esdora-js/esdora/pull/170) [`b0f20d9`](https://github.com/esdora-js/esdora/commit/b0f20d9e3a68f9f0013d100a996f35332284cb9f) Thanks [@kkfive](https://github.com/kkfive)! - refactor: 重构 `treeMap` 实现，新增按需 Context 系统和智能子节点处理

  ### 新增功能
  - **按需 Context 配置**：支持选择性启用 `depth`、`index`、`parent`、`path`、`isLeaf`、`isRoot`、`processedChildren` 等字段，减少不必要的性能开销
  - **智能子节点处理**：自动检测用户对 children 的处理方式，支持自动递归、显式递归和自定义三种模式
  - **完整遍历模式**：支持 DFS（前序/后序）和 BFS 遍历
  - **增强类型安全**：Context 字段类型根据配置自动推断，新增 188 个类型测试
  - **改进错误提示**：提供更详细的错误信息，包含节点标识和实际类型

  ### 性能优化
  - Context 按需创建，减少 30-50% 内存开销
  - 智能子节点处理，避免不必要的数组复制
  - 优化遍历算法，提升执行效率

  ### 测试
  - 新增 582 个单元测试
  - 新增 188 行类型测试
  - 覆盖所有遍历模式和 Context 配置组合

  **向后兼容**：完全向后兼容，现有代码无需修改。

### Patch Changes

- [#178](https://github.com/esdora-js/esdora/pull/178) [`569da7a`](https://github.com/esdora-js/esdora/commit/569da7ad3df243c34d8c624f40aa59e700bd9614) Thanks [@kkfive](https://github.com/kkfive)! - fix: 修正包导出

- [#170](https://github.com/esdora-js/esdora/pull/170) [`b0f20d9`](https://github.com/esdora-js/esdora/commit/b0f20d9e3a68f9f0013d100a996f35332284cb9f) Thanks [@kkfive](https://github.com/kkfive)! - fix: 部分函数未导出（treeFilter、treeSome）

## 0.4.0

### Minor Changes

- [#137](https://github.com/esdora-js/esdora/pull/137) [`665c3df`](https://github.com/esdora-js/esdora/commit/665c3df193a2cb9714662a8fedd25b15c42caea8) Thanks [@kkfive](https://github.com/kkfive)! - feat: 新增判断安卓 ios 鸿蒙函数

## 0.3.0

### Minor Changes

- [#128](https://github.com/esdora-js/esdora/pull/128) [`a8f3a02`](https://github.com/esdora-js/esdora/commit/a8f3a0224d2384a37bb702d53d39c51c8730f4e8) Thanks [@kkfive](https://github.com/kkfive)! - feat: 增加 isMpSchema、getQueryParams 函数

## 0.2.0

### Minor Changes

- [#79](https://github.com/esdora-js/esdora/pull/79) [`9136215`](https://github.com/esdora-js/esdora/commit/91362157a0abd00cad115dd9a997ef071ea69341) Thanks [@kkfive](https://github.com/kkfive)! - feat: ✨ 推出全新的 `@esdora/color` 包，并为 `@esdora/kit` 增加了多个工具函数。
  - **@esdora/color:** 新增了强大的颜色处理能力。
  - **@esdora/kit:** 新增了 `clamp` 等多个工具函数，以增强核心功能。
  - **esdora:** 主包现已集成了 `@esdora/color` 的所有功能。
