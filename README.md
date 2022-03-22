# Vite 图标插件

[![NPM version](https://img.shields.io/npm/v/vite-plugin-iconify?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-iconify)

按需导入图标作为组件。

### 特性

- 🤹 任意图标集 - 超过 10,000 个图标、徽标、表情符号等的 100 多个流行图标集。由 [Iconify](https://iconify.design/) 提供支持。
- ☁️ 按需 - 仅捆绑您真正使用的图标。
- 📥 自动加载目录 - 加载目录下的图标文件作为自定义图标。
- 📲 自动导入 - 直接在模板中使用，匹配组件属性自动替换。

## 用法

### 模板中组件属性的静态替换

通过配置 `replaceableProps` 选项为 `[{ component: 'VIcon', props: ['icon'] }]` ，当 `v-icon` 组件中 `icon` 属性值匹配 `集合-图标` 则会被模板替换（仅支持静态字符串），如：

```vue
<v-icon icon="mdi-close" />
```

会被替换成（此处只是方便理解，实际代码不是这样）

```vue
<v-icon :icon="import('~icons/mdi/close')" />
```

### 加载自定义图标

默认自动加载 `src/icons` 目录下的所有 `svg` 结尾的文件，使用 `~icons` 加载。

```ts
import { createApp } from 'vue'
import App from './App.vue'
import icons from '~icons'

const app = createApp(App)
for (const name in icons) {
  app.component(`icon-${ name }`, icons[name])
}
app.mount('#app')
```

### 🌰 例子

更多用法请参考 [例子工程](https://github.com/qq15725/vite-plugin-iconify/blob/master/examples/vite-vue3/src/App.vue)

## 安装

### 插件

```sh
npm i -D vite-plugin-iconify
```

### 图标数据

我们使用 [Iconify](https://iconify.design/) 作为图标数据源（支持 100 多个图标集）。

您有两种安装方式：

#### 安装全部插件

```sh
npm i -D @iconify/json
```

`@iconify/json` (~120MB) 包括来自 Iconify 的所有图标集。

#### 按图标集安装

如果您只想使用几个图标集而不想下载整个集合，您也可以使用 @iconify-json/[collection-id] . 例如，要安装 [Material Design Icons](https://icon-sets.iconify.design/mdi/) ，你可以这样做：

```sh
npm i -D @iconify-json/mdi
```

## 配置

```tsx
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Iconify from 'vite-plugin-iconify'

export default defineConfig({
  plugins: [
    Iconify({
      // 这些匹配的文件将会搜索组件属性做替换
      include: [
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // 可替换并注入的组件属性
      replaceableProps: [
        // 预设的 UI 库
        // 对应一组自定义配置
        'veno-ui',
        // 自定义
        { component: 'VIcon', props: ['icon'] },
      ]
    }),
    Vue()
  ],
})
```

## 可用选项

所有可用选项请查看[类型定义](https://github.com/qq15725/vite-plugin-iconify/blob/master/src/types.ts) 。

```ts
export interface Options
{
  /**
   * @zh 引入文件的过滤模式
   * @en RegExp or glob to match files to be transformed
   *
   * @default [/\.vue$/, /\.vue\?vue/]
   */
  include?: FilterPattern

  /**
   * @zh 排除文件的过滤模式
   * @en RegExp or glob to match files to NOT be transformed
   *
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern

  /**
   * @zh 识别传入组件的属性值替换成图标组件
   */
  replaceableProps?: (ComponentProps | PresetName)[],

  /**
   * @zh 用于搜索图标的相对目录路径
   * @en Relative paths to the directory to search for icons
   *
   * @default 'src/icons'
   */
  dirs?: string | string[]

  /**
   * @zh 图标的有效文件扩展名
   * @en Valid file extensions for icons
   *
   * @default ['svg']
   */
  extensions?: string | string[]

  /**
   * @zh 搜索子目录
   * @en Search for subdirectories
   *
   * @default true
   */
  deep?: boolean

  /**
   * @zh 传递给 Iconify Loader 的选项
   * @en Options passed to Iconify Loader
   */
  iconifyLoaderOptions?: IconifyLoaderOptions

  /**
   * @zh 传递给 svgo 的选项
   * @en Options passed to svgo
   *
   * @default { plugins: ['preset-default', 'removeViewBox', 'removeDimensions'] }
   */
  svgoOptions?: OptimizeOptions
}
```

## 许可

借鉴了 [antfu](https://github.com/antfu) 的 [unplugin-icons](https://github.com/antfu/unplugin-icons) 工程代码，[查看许可](https://github.com/antfu/unplugin-icons/blob/main/LICENSE) 。

vite-plugin-iconify 采用 [MIT 许可](https://github.com/qq15725/vite-plugin-iconify/blob/master/LICENSE) 。