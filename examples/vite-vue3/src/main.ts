// Utils
import { createApp } from 'vue'
import App from './App.vue'

// Icons
import icons from '~icons'

// Compositions
import { createIcons, IconsKey } from './compositions/icons'

const app = createApp(App)

app.provide(IconsKey, createIcons({
  aliases: icons
}))

app.mount('#app')
