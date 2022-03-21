import { createApp } from 'vue'
import App from './App.vue'
import icons from '~icons'

const app = createApp(App)

for (const name in icons) {
  app.component(`icon-${ name }`, icons[name])
}

app.mount('#app')
