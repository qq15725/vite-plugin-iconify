// Utils
import { deepMerge, wrapInArray } from '@veno-ui/utils'
import { join, resolve } from 'node:path'

// Presets
import { presets } from './presets'

// Types
import type { Options, ResolvedOptions } from './types'

const DEFAULT_OPTIONS: Options = {
  include: [/\.vue$/, /\.vue\?vue/],
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
  dirs: 'src/icons',
  extensions: ['svg'],
  svgoOptions: {
    plugins: [
      'preset-default',
      'removeViewBox',
      'removeDimensions',
    ]
  },
}

/**
 * @param str
 */
function slash(str: string) {
  return str.replace(/\\/g, "/")
}

export function resolveOptions(userOptions: Options, root: string) {
  const resolved = deepMerge(DEFAULT_OPTIONS, userOptions) as ResolvedOptions

  resolved.replaceableProps = userOptions.replaceableProps?.flatMap(value => {
    return typeof value === 'string'
      ? value in presets ? presets[value] : []
      : value
  }) || []

  resolved.root = root

  const extensions = wrapInArray(resolved.extensions || [])
  const extsGlob = extensions.length === 1 ? extensions : `{${ extensions.join(',') }}`

  resolved.resolvedDirs = wrapInArray(resolved.dirs || [])
    .map(dir => slash(resolve(root, dir)))

  resolved.globs = resolved.resolvedDirs.map(
    i => resolved.deep
      ? slash(join(i, `**/*.${ extsGlob }`))
      : slash(join(i, `*.${ extsGlob }`))
  )

  return resolved
}
