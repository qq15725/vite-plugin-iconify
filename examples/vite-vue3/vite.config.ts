import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Iconify from 'vite-plugin-iconify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Iconify({
      replaceableProps: [
        { component: 'VButton', props: ['prependIcon'] },
        { component: 'VIcon', props: ['icon'] },
      ]
    }),
  ]
})
