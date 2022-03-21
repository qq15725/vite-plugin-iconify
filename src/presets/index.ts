import venoUi from './veno-ui'

export const presets = {
  'veno-ui': venoUi,
}

export type PresetName = keyof typeof presets