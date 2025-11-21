# 食用方法

@esdora/biz 可以通过 [@esdora/biz](https://www.npmjs.com/package/@esdora/biz) 安装，你也可以通过 从 [浏览器](#浏览器) 导入 的方式在浏览器中使用。

## Node.js

@esdora/biz 支持 Node.js 18 及更高版本。使用以下命令安装：

:::code-group

```sh [pnpm]
pnpm add @esdora/biz
```

```sh [yarn]
yarn add @esdora/biz
```

```sh [npm]
npm install @esdora/biz
```

:::

## 基本使用

安装完成后，你可以直接导入需要的函数：

```typescript
import { parseSearch, stringify } from '@esdora/biz'

// 从浏览器 URL 解析查询参数
const params = parseSearch()
console.log(params) // { foo: 'bar', baz: 'qux' }

// 将对象序列化为查询字符串
const queryString = stringify({ foo: 'bar', baz: 'qux' })
console.log(queryString) // 'foo=bar&baz=qux'
```

## 浏览器

你可以在诸如 [jsdelivr](https://www.jsdelivr.com) 或 [unpkg](https://unpkg.com) 等 CDN 上找到 @esdora/biz。为了不与其他库冲突，我们将 `esdoraBiz` 定义为包含所有函数的命名空间。

::: code-group

```html [jsdelivr]
<script src="https://cdn.jsdelivr.net/npm/@esdora/biz/dist/index.min.js"></script>
<script>
  const params = esdoraBiz.parseSearch()
  console.log(params)
</script>
```

```html [unpkg]
<script src="https://unpkg.com/@esdora/biz/dist/index.min.js"></script>
<script>
  const params = esdoraBiz.parseSearch()
  console.log(params)
</script>
```

:::
