import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Tsconfig from 'vite-tsconfig-paths'
import { groupIconVitePlugin as GroupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { sidebarWatcherPlugin } from './libs/sidebar-watcher'

export default defineConfig({
  plugins: [
    // TypeScript 路径配置
    Tsconfig({
      projects: [
        fileURLToPath(new URL('../../tsconfig.json', import.meta.url)),
      ],
    }),

    // Vue 组件自动导入
    Components({
      dirs: [
        fileURLToPath(new URL('./components', import.meta.url)),
      ],
      dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue', 'md'],
    }),

    // UnoCSS 样式引擎
    UnoCSS(
      fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    ),

    // 图标组插件
    GroupIconVitePlugin(),

    // 侧边栏文件监听插件
    sidebarWatcherPlugin(),
  ],
})
