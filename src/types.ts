import type { FilterPattern } from '@veno-ui/utils'
import type { IconifyLoaderOptions } from '@iconify/utils/lib/loader/types'
import type { Config } from 'svgo'
import type { PresetName } from './presets'

export type ComponentProps = { component: string, props: string[] }

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
  svgoOptions?: Config
}


export interface ResolvedOptions extends Required<Options>
{
  replaceableProps: ComponentProps[],
  root: string
  resolvedDirs: string[]
  globs: string[]
}
