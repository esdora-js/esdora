# 食用方法

esdora-kit 可以通过[@esdora/kit](https://www.npmjs.com/package/@esdora/kit)安装，你也可以通过 从 [浏览器](#浏览器) 导入 的方式在浏览器中使用 es-toolkit。

## Node.js

esdora-kit 支持 Node.js 18及更高版本。使用以下命令安装 esdora：

:::code-group

```sh [pnpm]
pnpm add @esdora/kit
```

```sh [yarn]
yarn add @esdora/kit
```

```sh [npm]
npm install @esdora/kit
```

:::

## 浏览器

你可以在诸如 [jsdelivr](https://www.jsdelivr.com) 或 [unpkg](https://unpkg.com) 等CDN上找到 @esdora/kit。为了不与其他库冲突，我们将 `esdora` 定义为包含所有函数。

::: code-group

```html [jsdelivr]
<script src="https://cdn.jsdelivr.net/npm/@esdora/packages/kit/dist/esdora.min.js"></script>
<script>
  const email = 'xxx@qq.com'
  console.log(esdora.isEmail(email))
</script>
```

```html [unpkg]
<script src="https://unpkg.com/@esdora/packages/kit/dist/esdora.min.js"></script>
<script>
  const email = 'xxx@qq.com'
  console.log(esdora.isEmail(email))
</script>
```

:::
