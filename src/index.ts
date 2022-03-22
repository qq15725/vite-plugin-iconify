// Utils
import fg from 'fast-glob'
import { promises as fsp } from 'fs'
import { basename, extname, relative } from 'path'
import { createFilter } from '@veno-ui/utils'
import { resolveOptions } from './options'
import { VIRTUAL_ID_RE } from './constants'
import { transformComponent, transformIcon } from './transform'
import { loadNodeIcon } from '@iconify/utils/lib/loader/node-loader'

// Types
import type { PluginOption } from 'vite'
import type { Options } from './types'

const root = process.cwd()

export default function iconsPlugin (userOptions?: Options): PluginOption {
  const ctx = resolveOptions(userOptions || {}, root)
  const filter = createFilter(ctx.include, ctx.exclude)

  return {
    name: 'vite-plugin-iconify',
    resolveId (id) {
      return VIRTUAL_ID_RE.test(id) ? id : null
    },
    async load (id) {
      const matched = id.match(VIRTUAL_ID_RE)
      if (!matched) return
      if (matched[1]) {
        const [_, collection, name] = matched[1].split('/', 3)
        let source = await loadNodeIcon(collection, name, ctx.iconifyLoaderOptions)
        if (!source) throw new Error(`[vite-plugin-iconify] Icon \`${ id }\` not found`)
        return {
          code: await transformIcon(source, `${ collection }-${ name }`, ctx),
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      } else {
        const files = fg.sync(ctx.globs, {
          ignore: ['node_modules'],
          onlyFiles: true,
          cwd: ctx.root,
          absolute: true,
        })
        const code: any = []
        for (const i in files) {
          const file = files[i]
          const id = basename(file, extname(file))
          code.push(`  '${ id }': defineAsyncComponent(() => import('/${ relative(ctx.root, file) }')),`)
        }
        return {
          code: `import { defineAsyncComponent } from 'vue'\nexport default {\n${ code.join('\n') }\n}`,
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      }
    },
    async transform (source, id) {
      try {
        if (/\.svg(\?component)?$/.test(id)) {
          return await transformIcon(await fsp.readFile(id, 'utf-8'), id, ctx)
        } else if (filter(id)) {
          return await transformComponent(source, id, ctx)
        }
      } catch (e: any) {
        this.error(e)
      }
      return
    }
  }
}
