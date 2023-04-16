// Utils
import MagicString from 'magic-string'
import { toSnakeCase, toKebabCase, toPascalCase } from '@veno-ui/utils'
import { DISABLE_COMMENT, VIRTUAL_ID } from './constants'
import { relative } from 'node:path'
import { importModule } from 'local-pkg'
import { optimize } from 'svgo'
import { hasCollection } from './collections'

// Types
import type { ResolvedOptions } from './types'

export async function transformComponent(source: string, id: string, ctx: ResolvedOptions) {
  let no = -1
  const s = new MagicString(source)
  for (const { component, props } of ctx.replaceableProps) {
    const componentNameRE = `(?:_component_${ toSnakeCase(component) }|\\$setup\\["${ toPascalCase(component) }"\\])`
    const componentPropNameRE = `(${ props.map(toKebabCase).map(v => v.indexOf('-') > -1 ? `"${ v }"` : v).join('|') })`
    const matchAllRE = new RegExp(
      `_create(?:VNode|Block)\\(${componentNameRE}, .*?{.*?${componentPropNameRE}: (.+?)([,|}].*?\\))`,
      'gs'
    )
    for (const match of source.matchAll(matchAllRE)) {
      const matched = match[2]
      if (match.index == null || !matched) continue
      const startOffset = match.index + match[0].length - match[2].length - match[3].length
      for (const subMatch of matched.matchAll(/"(.+?)"|'(.+?)'/g)) {
        const subMatched = subMatch[1] || subMatch[2]
        const [collection] = subMatched.split('-', 1) || []
        const icon = subMatched.substring(collection.length + 1)
        if (subMatch.index != null && collection && hasCollection(collection) && icon) {
          const start = startOffset + subMatch.index
          const end = start + subMatched.length + 2
          const component = `__vite_plugin_iconify_${ ++no }`
          s.prepend(`import ${ component } from '${ VIRTUAL_ID }/${ collection }/${ icon }';\n`)
          s.overwrite(start, end, component)
        }
      }
    }
  }
  if (no > -1) s.prepend(`\n${ DISABLE_COMMENT }\n`)
  return {
    code: s.toString(),
    map: s.generateMap({ source: id, includeContent: true })
  }
}

/**
 * transform icon to component
 *
 * @param source icon source content
 * @param id icon id
 * @param ctx
 */
export async function transformIcon(source: string, id: string, ctx: ResolvedOptions) {
  // optimize svg
  const optimized = optimize(source, ctx.svgoOptions)
  // compile svg to vue3 template
  const kebab = toKebabCase(relative(ctx.root, id).replace(/\//g, '-'))
  const { compileTemplate } = await importModule('@vue/compiler-sfc')
  let { code } = compileTemplate({
    source: optimized.data,
    id: kebab,
    filename: `${ kebab }.vue`,
  })
  // clean render export
  code = code.replace(/^export /gm, '')
  // export default
  code += `\n\nexport default { name: '${ toPascalCase(kebab) }', render }`
  return DISABLE_COMMENT + '\n' + code
}
