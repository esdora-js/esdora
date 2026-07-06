// 公共类型
export type { EsdoraHslColor, EsdoraOklchColor, EsdoraRgbColor } from './_internal/types'

// 分析层
export {
  getContrast,
  isAccessible,
  isDark,
  isInGamut,
  isLight,
} from './analysis'
export type { AccessibilityOptions } from './analysis'

// 核心引擎层
export {
  adjustChroma,
  adjustHue,
  adjustLightness,
  adjustSaturation,
} from './composition'
export type {
  ChromaAdjuster,
  HueAdjuster,
  LightnessAdjuster,
  SaturationAdjuster,
} from './composition'

// 转换/格式化层
export {
  toHex,
  toHsl,
  toHslString,
  toLchString,
  toOklch,
  toOklchString,
  toRgb,
  toRgbString,
} from './conversion'

// 生成层
export {
  generatePalette,
  randomColor,
  randomColors,
} from './generation'
export type {
  PaletteOptions,
  RandomColorOptions,
} from './generation'

// 便利层
export {
  darken,
  desaturate,
  lighten,
  mix,
  saturate,
  setAlpha,
} from './manipulation'

export * from 'culori'
