// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import CardGrid from './components/card-grid.vue'

import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import './style.css'
import 'virtual:group-icons.css'

// @unocss-include

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
    app.component('CardGrid', CardGrid)
  },
}
