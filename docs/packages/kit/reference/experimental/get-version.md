---
title: _unstable_getVersion
description: '@esdora/kit 的 _unstable_getVersion 函数，获取当前包的版本号（实验性 API）'
---

# \_unstable_getVersion

获取 `@esdora/kit` 包的当前版本号。

::: warning 实验性 API
该函数属于实验性 API，命名以 `_unstable_` 前缀标识。未来可能会发生变更或移除，请勿在生产环境关键路径中依赖此函数。
:::

## 示例

### 基本用法

```typescript
import { _unstable_getVersion } from '@esdora/kit/experimental'

_unstable_getVersion() // => '0.6.0'
```

## 签名

```typescript
export function _unstable_getVersion(): string
```

## 参数

该函数不接受任何参数。

## 返回值

- **类型**: `string`
- **说明**: 当前 `@esdora/kit` 包的版本号，格式遵循 [SemVer](https://semver.org/lang/zh-CN/)（如 `'0.6.0'`）。
- **特殊情况**: 返回值的具体内容取决于当前安装的包版本，不同版本返回的字符串不同。

## 注意事项

### 输入边界

- 该函数无参数，调用时无需传入任何值。
- 版本号来源于构建时嵌入的 `package.json` 中的 `version` 字段。

### 错误处理

- 该函数不会抛出异常。
- 在正常的构建产物中，版本号始终存在且为字符串类型。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/experimental/get-version/index.ts)
- [单元测试](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/experimental/get-version/index.test.ts)
