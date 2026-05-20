# API Doc Template

Use this structure for API reference pages. Adapt optional sections to function
complexity.

````markdown
---
title: {FunctionName}
description: {package} 的 {FunctionName} 函数，{一句话功能描述}
---

# {FunctionName}

{一句话功能描述}

## 示例

### 基本用法

```typescript
import { {functionName} } from '{packageName}'

{functionName}({typicalInput}) // => {expectedOutput}
```

### {场景}

{从测试用例提炼的场景}

## 签名

```typescript
{completeTypeSignature}
```

## 参数

| 参数   | 类型   | 描述          | 必需    |
| ------ | ------ | ------------- | ------- |
| {name} | {type} | {description} | {是/否} |

## 返回值

- **类型**：`{ReturnType}`
- **说明**：{description}
- **特殊情况**：{edgeCases}

## 运行逻辑

{仅在有清晰流程、递归、状态转换或复杂分支时添加说明或 Mermaid 图}

## 注意事项

### 输入边界

{边界情况}

### 错误处理

{是否抛异常、返回错误值或降级}

## 相关链接

- 源码：`packages/{pkg}/src/{path}`
- 测试：`packages/{pkg}/src/{path}.test.ts`
````

Examples must include imports and prefer `// =>` output comments.
