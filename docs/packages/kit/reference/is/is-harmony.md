---
title: isHarmony
description: "isHarmony - Dora Pocket 中 @esdora/kit 库提供的环境检测工具函数，用于判断用户代理（User Agent）是否为鸿蒙（HarmonyOS）设备。"
---

# isHarmony

检查用户代理（User Agent）字符串是否表明客户端是鸿蒙（HarmonyOS / OpenHarmony）设备，便于在前端代码中针对鸿蒙生态进行能力适配或统计分析。

## 示例

### 基本用法

```typescript
import { isHarmony } from '@esdora/kit'

// 包含 "HarmonyOS" 关键字的 User Agent
const harmonyUA
  = 'Mozilla/5.0 (Linux; Android 10; TAS-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 HuaweiBrowser/11.1.1.301 Mobile Safari/537.36 HarmonyOS/2.0.0'

isHarmony(harmonyUA)
// => true

// 包含 "OpenHarmony" 关键字的 User Agent
const openHarmonyUA
  = 'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile HuaweiBrowser/5.1.9.301'

isHarmony(openHarmonyUA)
// => true
```

### 非鸿蒙环境

```typescript
import { isHarmony } from '@esdora/kit'

// Android 设备的 User Agent
const androidUA
  = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
isHarmony(androidUA)
// => false

// 桌面浏览器的 User Agent
const desktopUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
isHarmony(desktopUA)
// => false

// iOS 设备的 User Agent
const iosUA
  = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
isHarmony(iosUA)
// => false
```

### 批量检测 UA 列表

```typescript
import { isHarmony } from '@esdora/kit'

const userAgents: string[] = [
  'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile HuaweiBrowser/5.1.9.301',
  'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
]

const harmonyCount = userAgents.filter(isHarmony).length
// => 1
```

## 签名与说明

### 类型签名

```typescript
export function isHarmony(ua: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                                       | 必需 |
| ---- | -------- | -------------------------------------------------------------------------- | ---- |
| ua   | `string` | 要进行检查的用户代理（User Agent）字符串，通常来自 `navigator.userAgent`。 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果 `ua` 字符串表明是鸿蒙（HarmonyOS / OpenHarmony）设备，则返回 `true`，否则返回 `false`。
- **特殊情况**:
  - 当输入为空字符串 `''` 时，返回 `false`。
  - 当 UA 字符串中不包含 `HarmonyOS`、`OpenHarmony` 或 `ArkWeb` 等关键字时，返回 `false`。

### 泛型约束（如适用）

- 此函数未使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 函数通过正则表达式检查输入字符串中是否包含 `HarmonyOS`、`OpenHarmony` 或 `ArkWeb` 等关键字。
- 空字符串、仅包含空白字符的字符串或明显不符合浏览器 UA 格式的字符串都会返回 `false`。
- 对于未来可能出现的新鸿蒙 UA 变体，如果仍然包含上述关键字，也可以被正确识别。

### 错误处理

- **异常类型**: 函数不会主动抛出异常，只要传入的是 `string` 类型就会被安全处理。
- **处理建议**: 建议在 Node.js 或其他非浏览器环境中使用时，对 UA 来源进行判空处理，在无法获取 UA 时传入空字符串或跳过检测逻辑。

### 性能考虑

- **时间复杂度**: O(n) - 其中 n 为 UA 字符串长度，内部仅执行一次正则匹配。
- **空间复杂度**: O(1) - 使用预编译的正则表达式 `REGEX_UA_HARMONY`，不分配额外内存。
- **优化建议**:
  - 适合在前端运行时频繁调用，例如针对鸿蒙用户的样式适配或功能开关。
  - 对于批量 UA 分析场景，可在上层缓存检测结果，但通常无需额外优化。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-harmony/index.ts)
