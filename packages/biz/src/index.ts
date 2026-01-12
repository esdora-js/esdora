// 业务工具包

// 原子化样式相关的封装
import * as atomCss from './atom-css'
// 提供基于 qs 封装的查询字符串工具和便捷函数
import * as qs from './qs'

// 保留根导出以兼容现有命名空间导入 (如 packages/esdora)
// 推荐使用子路径导入以获得更好的tree-shaking效果：
//   import { cn } from '@esdora/biz/atom-css'
//   import { parse, stringify } from '@esdora/biz/query'

export {
  atomCss,
  qs,
}
