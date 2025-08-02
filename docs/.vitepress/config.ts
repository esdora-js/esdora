import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { createDynamicSidebar } from './libs/dynamic-sidebar'
import vite from './vite.config'

// 获取当前目录路径（ES 模块兼容）
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'esdora',
  description: '一个想要成为开发者的百宝袋的工具库',
  lang: 'zh-CN',
  lastUpdated: true,

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },

  cleanUrls: true,
  vite,

  themeConfig: {
    // logo: '/logo.svg',
    nav: [
      { text: '主页', link: '/' },
      { text: 'kit', link: '/kit' },
    ],

    // 使用动态侧边栏生成器
    sidebar: createDynamicSidebar(__dirname),
    editLink: {
      pattern: 'https://github.com/esdora-js/esdora/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/esdora-js/esdora' },
    ],

    footer: {
      // message: 'Released under the MIT License.',
      // copyright: 'Copyright © 2025-PRESENT Esdora.',
    },
  },

  head: [
    // ['meta', { name: 'theme-color', content: '#ffffff' }],
    // ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Esdora' }],
    // ['meta', { property: 'og:title', content: '' }],
    // ['meta', { property: 'og:image', content: '' }],
    // ['meta', { property: 'og:description', content: '_description_' }],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: '' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
