import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 动态生成侧边栏配置
 * 这个函数会在每次构建时重新扫描文件系统
 */
export function createDynamicSidebar(docsRoot: string): DefaultTheme.Sidebar {
  const baseDir = path.dirname(docsRoot)

  return {
    '/packages/kit/': [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/packages/kit/' },
          { text: '食用方法', link: '/packages/kit/usage' },
        ],
      },
      {
        text: '参考',
        items: [
          {
            text: '函数类 (Function)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/function'),
          },
          {
            text: '验证类 (Is)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/is'),
          },
          {
            text: '数字类 (Number)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/number'),
          },
          {
            text: 'Promise类 (Promise)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/promise'),
          },
          {
            text: '树类 (Tree)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/tree'),
          },

          {
            text: '实验性 (Experimental)',
            items: getSidebarItem(baseDir, 'packages/kit/reference/experimental'),
          },
        ],
      },
    ],
    '/packages/color/': [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/packages/color/' },
          { text: '食用方法', link: '/packages/color/usage' },
        ],
      },
      {
        text: '参考',
        items: [
          {
            text: '分析类 (Analysis)',
            items: getSidebarItem(baseDir, 'packages/color/reference/analysis'),
          },
          {
            text: '引擎层 (Composition)',
            items: getSidebarItem(baseDir, 'packages/color/reference/composition'),
          },
          {
            text: '转换/格式化层 (Conversion)',
            items: getSidebarItem(baseDir, 'packages/color/reference/conversion'),
          },
          {
            text: '生成层 (Generation)',
            items: getSidebarItem(baseDir, 'packages/color/reference/generation'),
          },
          {
            text: '便利层 (Manipulation)',
            items: getSidebarItem(baseDir, 'packages/color/reference/manipulation'),
          },
        ],
      },
    ],
    '/contributing/': [
      {
        text: '贡献指南',
        items: [
          { text: '介绍与环境设置', link: '/contributing/' },
          { text: 'Git 工作流与提交规范', link: '/contributing/git-workflow' },
          { text: '函数设计与实现指南', link: '/contributing/implementation-guide' },
          { text: '测试指南', link: '/contributing/testing-guide' },
          {
            text: '文档编写',
            collapsed: false, // 默认展开
            items: [
              { text: '总览', link: '/contributing/documentation/overview' },
              { text: 'Kit 文档模板', link: '/contributing/documentation/kit-template' },
              // 未来可以添加:
              // { text: 'Hooks 模板', link: '/contributing/documentation/hooks-template' },
              // { text: '文章模板', link: '/contributing/documentation/practices-template' },
            ],
          },
        ],
      },
    ],
    '/guide/': [
      {
        text: '项目指南',
        items: [
          { text: '快速上手', link: '/guide/getting-started' },
          { text: '核心理念', link: '/guide/core-concepts' },
          { text: '版本与更新策略', link: '/guide/versioning' },
        ],
      },
    ],
  }
}

/**
 * 获取侧边栏项目
 * @param docsRoot 文档根目录
 * @param relativePath 相对路径
 * @returns 侧边栏项目数组
 */
function getSidebarItem(docsRoot: string, relativePath: string): DefaultTheme.SidebarItem[] {
  const targetDir = path.join(docsRoot, relativePath)

  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    console.warn(`[Dynamic Sidebar] Directory not found: ${targetDir}`)
    return []
  }

  try {
    // 读取目录下的所有 .md 文件并排序
    const files = fs.readdirSync(targetDir)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .sort()

    return files.map((file) => {
      const filename = path.basename(file, '.md')
      const link = `/${relativePath}/${filename}`
      const title = extractTitleFromFile(path.join(targetDir, file)) || formatTitle(filename)

      return {
        text: title,
        link,
      }
    })
  }
  catch (error) {
    console.error(`[Dynamic Sidebar] Error reading directory ${targetDir}:`, error)
    return []
  }
}

/**
 * 从 Markdown 文件中提取标题
 * @param filePath 文件路径
 * @returns 提取的标题或 null
 */
function extractTitleFromFile(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    // 检查是否有 frontmatter
    if (lines[0] === '---') {
      const frontmatterEndIndex = lines.findIndex((line, index) => index > 0 && line === '---')
      if (frontmatterEndIndex > 0) {
        // 在 frontmatter 中查找 title
        for (let i = 1; i < frontmatterEndIndex; i++) {
          const line = lines[i].trim()
          if (line.startsWith('title:')) {
            const title = line.substring(6).trim().replace(/['"]/g, '')
            if (title)
              return title
          }
        }
      }
    }

    // 查找第一个 # 标题
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('# ')) {
        return trimmed.substring(2).trim()
      }
    }

    return null
  }
  catch (error) {
    console.warn(`[Dynamic Sidebar] Error reading file ${filePath}:`, error)
    return null
  }
}

/**
 * 格式化文件名为标题
 * @param filename 文件名
 * @returns 格式化后的标题
 */
function formatTitle(filename: string): string {
  return filename
    .replace(/[-_]/g, ' ') // 将连字符和下划线替换为空格
    .replace(/\b\w/g, letter => letter.toUpperCase()) // 首字母大写
    .trim()
}
