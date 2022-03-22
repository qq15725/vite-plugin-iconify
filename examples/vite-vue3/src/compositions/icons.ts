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