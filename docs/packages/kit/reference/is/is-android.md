---
title: isAndroid
description: "isAndroid - Dora Pocket 中 @esdora/kit 库提供的环境检测工具函数，用于判断用户代理（User Agent）是否为安卓设备。"
---

# isAndroid

检查用户代理（User Agent）字符串是否表明客户端是安卓（Android）设备。

## 示例

### 基本用法

```typescript
import { isAndroid } from '@esdora/kit'

// 典型的安卓设备 User Agent
const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
isAndroid(androidUA) // => true
```

### 非安卓环境

```typescript
import { isAndroid } from '@esdora/kit'

// iOS 设备的 User Agent
const iosUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
isAndroid(iosUA) // => false

// 桌面浏览器的 User Agent
const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
isAndroid(desktopUA) // => false
```

### 空字符串与非标准 UA

```typescript
import { isAndroid } from '@esdora/kit'

// 空字符串
isAndroid('') // => false

// 非标准 UA 文本
isAndroid('CustomClient/1.0') // => false
```

## 签名与说明

### 类型签名

```typescript
function isAndroid(ua: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                                     | 必需 |
| ---- | -------- | ------------------------------------------------------------------------ | ---- |
| ua   | `string` | 要进行检查的用户代理（User Agent）字符串，通常来自 `navigator.userAgent` | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果用户代理字符串表明是安卓设备，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 空字符串或不包含 `Android` 关键字的字符串返回 `false`
  - 函数不会尝试解析或校验版本号、品牌型号等额外信息

## 注意事项与边界情况

### 输入边界

- 仅适用于完整或部分用户代理（User Agent）字符串
- 空字符串或仅包含空白字符时返回 `false`
- 匹配逻辑不区分大小写（`Android` / `android` 均可匹配）
- 对于经过裁剪或自定义的 UA，只要包含 `Android` 关键字就会被识别为安卓设备

### 错误处理

- **异常类型**: 函数本身不会抛出异常
- **处理建议**: 建议在调用前确保 `ua` 为字符串类型，非字符串输入会被隐式转换为字符串后再进行匹配

### 性能考虑

- **时间复杂度**: O(n) - 正则表达式按字符遍历输入字符串
- **空间复杂度**: O(1) - 使用预定义正则表达式，无额外内存分配
- **优化建议**: 适用于高频环境检测场景，如需更精确的设备识别可结合专业 UA 解析库

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-android/index.ts)
