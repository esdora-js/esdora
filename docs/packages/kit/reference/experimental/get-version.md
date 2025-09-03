---
title: get-version
---

# \_unstable_getVersion <Badge type="warning" text="实验性" />

<!-- 1. 简介：一句话核心功能描述 -->

这是一个实验性的函数**示例**，用于获取当前包的版本号。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

当 Promise 成功时，返回 `[null, data]`。

```typescript
import { _unstable_getVersion } from '@esdora/packages/kit/experimental'

const version = await _unstable_getVersion()
// => 0.2.0
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * @experimental
 *
 * 这是一个实验性的函数**示例**，用于获取当前包的版本号。
 *
 * @returns 当前包的版本号
 */
export function _unstable_getVersion(): string {}
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

该函数只是作为示例，实际上并无作用。

<!-- 5. 相关链接：提供相关链接 -->

## 相关链接

- **源码**: [`src/experimental/get-version/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/kit/src/experimental/get-version/index.ts)
