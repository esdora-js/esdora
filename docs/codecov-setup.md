# Codecov 配置说明

本项目使用 Codecov 进行代码覆盖率跟踪和报告。

## 配置概览

### 自动发现机制

- ✅ 自动发现所有包的覆盖率文件
- ✅ 支持 monorepo 多包结构
- ✅ 无需手动添加新包路径

### 文件结构

```
.github/workflows/ci.yml  # CI 配置，包含 Codecov 上传
codecov.yml              # Codecov 配置文件
packages/*/vitest.config.ts  # 各包的测试配置
```

## 工作流程

1. **测试运行**: `pnpm run test:coverage`
2. **文件发现**: 自动查找 `./packages/*/coverage/coverage-final.json`
3. **上传报告**: 上传到 Codecov 进行分析

## 添加新包

当添加新包时，只需要：

1. 创建包目录：`packages/your-new-package/`
2. 添加 vitest 配置，确保生成 `coverage/coverage-final.json`
3. 运行测试：CI 会自动发现并上传新包的覆盖率

## 覆盖率配置

- **目标范围**: 70-100%
- **项目阈值**: 自动调整，允许 1% 波动
- **补丁阈值**: 自动调整，允许 1% 波动

## 忽略文件

以下文件类型被排除在覆盖率统计之外：

- 测试文件 (`*.test.ts`, `*.spec.js` 等)
- 配置文件 (`*.config.*`)
- 类型定义 (`*.d.ts`)
- 构建产物 (`dist/`, `build/`)
- 文档和示例

## 故障排除

如果覆盖率上传失败：

1. 检查测试是否成功运行
2. 确认覆盖率文件是否生成：`packages/*/coverage/coverage-final.json`
3. 检查 CI 日志中的文件发现步骤
4. 确认 `CODECOV_TOKEN` 密钥配置正确

## 技术细节

- **上传工具**: codecov/codecov-action@v5
- **覆盖率格式**: JSON (coverage-final.json)
- **发现命令**: `find ./packages -name "coverage-final.json" -type f`
- **失败处理**: `fail_ci_if_error: false` (不阻塞 CI)
