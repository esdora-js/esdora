<div align="center">
  <a name="readme-top"></a>

  <h1>@esdora/biz</h1>

  <p><strong>Dora Pocket 的业务工具包</strong></p>

  <p>
    <a href="https://npmjs.org/package/@esdora/biz"><img src="https://img.shields.io/npm/v/@esdora/biz.svg?style=flat-square" alt="NPM Version"></a>
    <a href="https://npmjs.org/package/@esdora/biz"><img src="https://img.shields.io/npm/dm/@esdora/biz.svg?style=flat-square" alt="NPM Downloads"></a>
    <a href="https://github.com/esdora-js/esdora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@esdora/biz.svg?style=flat-square" alt="License"></a>
    <a href="https://codecov.io/gh/esdora-js/esdora/branch/main"><img src="https://img.shields.io/codecov/c/github/esdora-js/esdora.svg?style=flat-square&flag=biz" alt="Codecov for biz"></a>
  </p>

</div>

---

`@esdora/biz` 是 [Dora Pocket](https://github.com/esdora-js/esdora) 项目中提供的一个业务工具库,专注于为 Web 开发提供常用的业务场景工具函数。

## 简介

`@esdora/biz` 采用包装器模式(wrapper pattern),对成熟的第三方库进行二次封装,提供开箱即用的业务工具函数。该包遵循 Dora Pocket 的零配置哲学,为开发者提供简洁、实用的 API。

该包设计为可扩展架构,当前提供 Query String 工具,未来将根据实际需求逐步扩展更多业务场景工具(如 hash/、http/、crypto/ 等分类)。

**核心特性:**

- 包装器模式: 基于成熟的第三方库(如 qs)进行封装
- 零配置: 开箱即用,无需复杂配置
- 可扩展: 采用分类架构设计,便于未来功能扩展
- 类型安全: 完整的 TypeScript 类型定义

## 安装

通过你喜欢的包管理器来安装它:

```bash
# pnpm
pnpm add @esdora/biz

# npm
npm install @esdora/biz

# yarn
yarn add @esdora/biz
```

## 特性

### Query String 工具 (query/)

提供查询字符串解析、序列化和合并等实用工具,基于 [qs](https://www.npmjs.com/package/qs) 库进行封装:

- **parseSearch**: 解析 URL 查询字符串为对象
- **stringifySearch**: 将对象序列化为查询字符串
- **mergeQueryParams**: 合并多个查询参数对象

此外,该包完整导出 qs 库的所有 API,你可以直接从 `@esdora/biz` 使用 qs 的全部功能。

**未来扩展**: 该包采用可扩展架构设计,未来计划根据实际业务需求添加更多工具分类,如 hash/、http/、crypto/ 等。

## 使用示例

### Query String 工具

```typescript
import { mergeQueryParams, parseSearch, stringifySearch } from '@esdora/biz'

// 解析查询字符串
const params = parseSearch('?name=John&age=30')
console.log(params) // { name: 'John', age: '30' }

// 序列化对象为查询字符串
const queryString = stringifySearch({ name: 'John', age: 30 })
console.log(queryString) // 'name=John&age=30'

// 合并查询参数
const merged = mergeQueryParams(
  { name: 'John', age: 30 },
  { city: 'Beijing', age: 25 }
)
console.log(merged) // { name: 'John', age: 25, city: 'Beijing' }
```

### 直接使用 qs API

```typescript
import { parse, stringify } from '@esdora/biz'

// 使用 qs 的 parse 方法
const result = parse('foo[bar]=baz')
console.log(result) // { foo: { bar: 'baz' } }

// 使用 qs 的 stringify 方法
const str = stringify({ foo: { bar: 'baz' } })
console.log(str) // 'foo[bar]=baz'
```

## API 文档

完整的 API 文档请访问 [Esdora 官方文档](https://esdora.js.org)。

对于 qs 库的详细 API,请参考 [qs 官方文档](https://www.npmjs.com/package/qs)。

## 🤝 参与贡献

`@esdora/biz` 是一个开放且由社区驱动的模块。如果你有好的想法或想要修复一个 Bug,我们非常欢迎!

请参考主仓库的 **[贡献指南](https://github.com/esdora-js/esdora/blob/main/CONTRIBUTING.md)** 来了解如何参与。

## 📜 许可证

[MIT](https://github.com/esdora-js/esdora/blob/main/LICENSE) &copy; Esdora
