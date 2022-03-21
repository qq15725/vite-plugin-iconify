# Vue3 在 Vite 上组件按需使用图标资源的一种解决方案

假设首先封装了一个 `v-icon` 组件。

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

例如我们封装一个 `v-button` ，并添加一个前置图标的插槽，代码如：

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
  defineProps<{ icon: Object }>()
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

  defineProps<{ prependIcon: Object }>()
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

在以往的习惯用法中，我们通常喜欢下载 `svg` 文件到某个目录作为自定义图标载入，[vite-plugin-iconify](https://github.com/qq15725/vite-plugin-iconify) 也支持了，默认会载入 `src/icons` 目录中 `.svg` 后缀的文件，通过 `~icons` 导入。

## 示例代码

所有示例代码参考 [examples/vite-vue3](https://github.com/qq15725/vite-plugin-iconify/blob/master/examples/vite-vue3) ，用法 [vite-plugin-iconify](https://github.com/qq15725/vite-plugin-iconify) 。

## 最后

仅提供一种 UI 库的图标解决思路。