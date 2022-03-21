import type { ComponentProps } from '../types'

export default <ComponentProps[]>([
  { component: 'VeAlert', props: ['icon', 'closeIcon'] },
  { component: 'VeAvatar', props: ['icon'] },
  { component: 'VeBadge', props: ['icon'] },
  { component: 'VeButton', props: ['icon', 'prependIcon', 'appendIcon'] },
  { component: 'VeDatePicker', props: ['appendIcon', 'appendInnerIcon', 'clearIcon', 'prependInnerIcon', 'prefixIcon', 'suffixIcon'] },
  { component: 'VeFormControl', props: ['appendIcon'] },
  { component: 'VeIcon', props: ['icon'] },
  { component: 'VeInput', props: ['appendIcon', 'appendInnerIcon', 'clearIcon', 'prependInnerIcon', 'prefixIcon', 'suffixIcon'] },
  { component: 'VeLink', props: ['icon', 'prependIcon', 'appendIcon'] },
  { component: 'VeListItem', props: ['prependIcon', 'appendIcon'] },
  { component: 'VeListGroup', props: ['collapseIcon', 'expandIcon'] },
  { component: 'VeSelect', props: ['appendIcon', 'appendInnerIcon', 'clearIcon', 'prependInnerIcon', 'prefixIcon', 'suffixIcon'] },
  { component: 'VeTag', props: ['appendIcon', 'closeIcon', 'prependIcon'] },
])