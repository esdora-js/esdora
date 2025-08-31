import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { createDynamicSidebar } from './libs/dynamic-sidebar'
import vite from './vite.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'Dora Pocket',
  titleTemplate: ':title | Dora Pocket',
  description: 'Dora Pocket - 前端开发的四次元口袋。一个包罗万象的知识宝库，提供从 TypeScript/JavaScript 工具函数、Vue/React 组件到前端工程化最佳实践的各种“道具”，助你轻松解决开发难题。',

  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'mask-icon', href: '/logo-mask.svg', color: '#007AFF' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],

    // --- Theme and Mobile ---
    ['meta', { name: 'theme-color', content: '#007AFF' }],
    ['meta', { name: 'author', content: 'Esdora' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Dora Pocket' }], // 保持与 title 一致的风格

    // --- Open Graph (Perfect as is) ---
    ['meta', { property: 'og:site_name', content: 'Dora Pocket' }], // (建议新增) 补充站点名称
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Dora Pocket - 前端开发的四次元口袋' }],
    ['meta', { property: 'og:description', content: '一个包罗万象的知识宝库，提供从工具函数、组件到最佳实践的各种前端“道具”。' }],
    ['meta', { property: 'og:image', content: 'https://esdora.js.org/social-preview.png' }],
    ['meta', { property: 'og:url', content: 'https://esdora.js.org' }],

    // --- Twitter Card (Perfect as is) ---
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Dora Pocket - 前端开发的四次元口袋' }],
    ['meta', { name: 'twitter:description', content: '一个包罗万象的知识宝库，提供从工具函数、组件到最佳实践的各种前端“道具”。' }],
    ['meta', { name: 'twitter:image', content: 'https://esdora.js.org/social-preview.png' }],
  ],

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    codeTransformers: [transformerTwoslash()],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => { md.use(groupIconMdPlugin) },
  },

  vite,

  themeConfig: {
    // 将 logo 从字符串改为对象，VitePress 会自动根据亮/暗模式切换
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
      alt: 'Dora Pocket Logo',
    },

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '工具函数', items: [
        { text: '工具函数 (Kit)', link: '/kit/' },
        { text: '颜色工具 (Color)', link: '/color/' },
      ] },
      { text: '参与贡献', link: '/contributing/' },
      { text: '关于我们', link: '/about' },
    ],

    sidebar: createDynamicSidebar(__dirname),

    editLink: {
      pattern: 'https://github.com/esdora-js/esdora/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/esdora-js/esdora' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} Esdora`,
    },
  },
})
