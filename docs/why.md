# Vue3 在 Vite 上组件按需使用图标资源的一种解决方案

需要最后达到的使用目的

```vue
<!-- 引入 mdi 下的 account 图标作为图标 -->
<v-icon icon="mdi-account" />

<!-- 引入 src/icons/dashboard.svg 自定义图标作为图标 -->
<v-icon icon="dashboard" />

<!-- 引入 mdi 下的 arrow-up-bold-circle 图标作为前置按钮图标 -->
<v-button prepend-icon="mdi-arrow-up-bold-circle">按钮</v-button>
```

## VIcon 组件

假设我们首先封装一个 `v-icon` 组件在 `src/components/VIcon.vue` 。

```vue
<template>
  <i class="v-icon">
    <slot />
  </i>
</template>

<style scoped>
  .v-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: 1em;
  }

  .v-icon > svg {
    width: 100%;
    height: 100%;
  }
</style>
```

## 使用 unplugin-icons 作为图标按需加载 

在目前的解决方案中，可能会使用 [unplugin-icons](https://github.com/antfu/unplugin-icons) 插件在 `SFC` 中静态按需加载图标。

```vue
<script setup>
  import IconAccessibility from '~icons/carbon/accessibility'
</script>

<template>
  <v-icon>
    <icon-accessibility />
  </v-icon>
</template>
```

配合 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 自动导入省去 `script` 的 `import` 部分。

```vue
<template>
  <v-icon>
    <i-carbon-accessibility />
  </v-icon>
</template>
```

这在单纯使用 `v-icon` 组件的时候没什么问题，但是如果基于 `v-icon` 封装其他组件，再使用就会有点繁琐。

例如我们封装一个 `v-button` 在 `src/components/VButton.vue` ，并添加一个前置图标的插槽，代码如：

```vue
<template>
  <button class="v-button">
    <v-icon v-if="$slots['prepend-icon']">
      <slot name="prepend-icon" />
    </v-icon>
    <span><slot /></span>
  </button>
</template>
```

我们的使用方式如下：

```vue
<template>
  <v-button>
    <template #prepend-icon>
      <i-carbon-accessibility />
    </template>
    按钮
  </v-button>
</template>
```

如果 `v-button` 在嵌套在别的父组件中，使用这个父组件时传递一个按钮的前置图标将会非常繁琐，所以我可能更想这样去使用：

```vue
<template>
  <v-button prepend-icon="carbon-accessibility">按钮</v-button>
</template>
```

如何转化成这样去用呢，最简单的处理方法是将 `v-button` 属性 `prepend-icon` 的静态值 `"carbon-accessibility"` 字符串替换成 `<i-carbon-accessibility />` 组件导入。

## 如何做模板组件属性值的静态替换

我们可以在 `@vue/compiler-sfc` 模板编译后的代码中，通过正则替换文本值，例如模板代码为：

```vue
<script setup>
  import VButton from './components/VButton.vue'
</script>

<template>
  <v-button prepend-icon="mdi-delete">按钮</v-button>
</template>
```

模板会编译成

```js
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(),
    _createBlock($setup["VButton"], {
      "prepend-icon": "mdi-delete"
    }, {
      default: _withCtx(()=>[_hoisted_1]),
      _: 1 /* STABLE */
    }))
}
```

通过正则

```
/_create(?:VNode|Block)\((?:_component_v_button|\$setup\["VButton"\]), .*?{.*?("prepend-icon"): (.+?)([,|}].*?\))/gs
```

匹配出静态部分，再转化为

```js
import __icons_0 from '~icons/mdi/delete'

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(),
    _createBlock($setup["VButton"], {
      "prepend-icon": __icons_0
    }, {
      default: _withCtx(()=>[_hoisted_1]),
      _: 1 /* STABLE */
    }))
}
```

就完成了组件属性值从字符串转化为传入一个组件。

## 使用 vite-plugin-iconify 插件

这一过程我封装了一个 [vite-plugin-iconify](https://github.com/qq15725/vite-plugin-iconify) 插件，如上述只需要配置 `replaceableProps` 。

```js
// vite.config.ts
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
```

改造组件 `v-icon` 以支持属性值传入组件

```vue
<script setup lang="ts">
  defineProps<{ icon?: object }>()
</script>

<template>
  <i class="v-icon">
    <slot>
      <component :is="icon" />
    </slot>
  </i>
</template>

<style scoped>
  .v-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: 1em;
  }

  .v-icon > svg {
    width: 100%;
    height: 100%;
  }
</style>
```

改造组件 `v-button` 以支持属性值传入组件

```vue
<script setup lang="ts">
  import VIcon from './VIcon.vue'

  defineProps<{ prependIcon?: object }>()
</script>

<template>
  <button class="v-button">
    <v-icon v-if="$slots['prepend-icon'] || prependIcon" :icon="prependIcon">
      <slot name="prepend-icon" />
    </v-icon>
    <span><slot /></span>
  </button>
</template>

<style>
  .v-button {
    display: inline-flex;
    align-items: center;
  }
</style>
```

就可以直接在模板中使用

```vue
<script setup>
  import VButton from './components/VButton.vue'
  import VIcon from './components/VIcon.vue'
</script>

<template>
  <v-icon icon="mdi-delete" />
  <v-button prepend-icon="mdi-delete">按钮</v-button>
</template>
```

## 根据文件目录导入自定义图标

在以往的习惯用法中，我们通常喜欢下载 `svg` 文件到某个目录作为自定义图标载入，[vite-plugin-iconify](https://github.com/qq15725/vite-plugin-iconify) 也支持了，默认会载入 `src/icons` 目录中 `.svg` 后缀的文件，通过 `~icons` 导入组件集。

那如何将自定义图标结合 `v-icon` 使用呢，新增文件如下:

```svg
// src/icons/dashboard.svg
<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M168.106667 621.44l120.746666 57.962667 223.274667 108.138666 215.317333-104.32 128.768-61.674666a64 64 0 0 1-29.952 84.970666l-286.229333 138.624a64 64 0 0 1-55.808 0L197.994667 706.517333A64 64 0 0 1 168.106667 621.44z m687.829333-133.930667a64 64 0 0 1-29.674667 85.546667L540.010667 711.68a64 64 0 0 1-55.808 0L197.994667 573.056A64 64 0 0 1 166.826667 490.88l317.013333 149.525333 28.288 13.696 286.229333-138.624-0.149333-0.064 57.728-27.882666zM540.032 185.792l286.208 138.602667a64 64 0 0 1 0 115.2l-286.208 138.624a64 64 0 0 1-55.808 0L197.994667 439.594667a64 64 0 0 1 0-115.2L484.224 185.813333a64 64 0 0 1 55.808 0z m-27.904 57.6l-286.229333 138.602667 286.229333 138.624 286.229333-138.624-286.229333-138.602667z"></path></svg>
```

我们想通过简单指定 `icon="dashboard"` 就能使用

```vue
<v-icon icon="dashboard" />
```

这里提供一个使用方式

首先我们创建一个 `icons` 的组合式 API

```ts
// src/compositions/icons.ts

// Utils
import { inject } from 'vue'

// Types
import type { InjectionKey, DefineComponent } from 'vue'

export interface IconsInstance
{
  /**
   * @zh 所有图标的别名
   */
  aliases: Record<string, DefineComponent>
}

export const IconsKey: InjectionKey<IconsInstance> = Symbol.for('app:icons')

/**
 * @zh 创建图标集
 *
 * @param options
 */
export function createIcons (options: IconsInstance) {
  return options
}

/**
 * @zh 使用图标集
 */
export function useIcons () {
  const icons = inject(IconsKey)
  if (!icons) throw new Error('Could not find icons instance')
  return icons
}
```

在 `main.ts` 中全局注册提供者

```ts
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
```

修改 `v-icon` 组件如下

```vue
<script setup lang="ts">
  // src/components/VIcon.vue
  
  // Utils
  import { computed } from 'vue'

  // Compositions
  import { useIcons } from '../compositions/icons'

  const props = defineProps<{
    icon?: string | object
  }>()

  const icons = useIcons()

  const componentIcon = computed(() => {
    if (!props.icon) return

    if (typeof props.icon === 'string' && props.icon in icons.aliases) {
      return icons.aliases[props.icon]
    }

    return props.icon
  })
</script>

<template>
  <i class="v-icon">
    <slot>
      <component :is="componentIcon" />
    </slot>
  </i>
</template>

<style scoped>
  .v-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: 1em;
  }

  .v-icon > svg {
    width: 100%;
    height: 100%;
  }
</style>
```

你就可以愉快的这样使用了

```vue
<v-icon icon="dashboard" />
```

## 示例代码

示例完整代码查看 [examples/vite-vue3](https://github.com/qq15725/vite-plugin-iconify/blob/master/examples/vite-vue3) ，详细配置和用法查看 [vite-plugin-iconify](https://github.com/qq15725/vite-plugin-iconify) 。