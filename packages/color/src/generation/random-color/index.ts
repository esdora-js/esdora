import { formatHex, formatHsl, formatRgb, modeHsl, random, useMode } from 'culori/fn'

// 注册 HSL 色彩空间
useMode(modeHsl)

/**
 * 随机颜色生成选项
 */
export interface RandomColorOptions {
  /** 输出格式，默认为 'hex' */
  format?: 'hex' | 'rgb' | 'hsl'
  /** 色相范围，0-360，可以指定范围 [min, max] */
  hue?: number | [number, number] | 'random'
  /** 饱和度范围，0-100，可以指定范围 [min, max] */
  saturation?: number | [number, number] | 'random'
  /** 亮度范围，0-100，可以指定范围 [min, max] */
  lightness?: number | [number, number] | 'random'
  /** 透明度范围，0-1，可以指定范围 [min, max] */
  alpha?: number | [number, number] | 'random'
  /** 预设的颜色类型 */
  preset?: 'bright' | 'dark' | 'light' | 'pastel' | 'vibrant' | 'monochrome'
}

/**
 * 生成随机颜色。
 *
 * @remarks
 * 此函数可以生成完全随机的颜色，也可以根据指定的参数约束生成特定范围内的随机颜色。
 * 支持多种预设类型，方便快速生成符合特定风格的颜色。
 *
 * 预设类型说明：
 * - `bright`: 明亮的颜色（高饱和度，中等亮度）
 * - `dark`: 深色（低亮度）
 * - `light`: 浅色（高亮度）
 * - `pastel`: 柔和色（低饱和度，高亮度）
 * - `vibrant`: 鲜艳色（高饱和度，中等亮度）
 * - `monochrome`: 单色（无饱和度，灰度）
 *
 * @param options - 随机颜色生成选项
 * @returns 生成的随机颜色字符串
 *
 * @example
 * ```typescript
 * // 生成完全随机的颜色
 * randomColor(); // => '#a7c4e8'
 *
 * // 指定输出格式
 * randomColor({ format: 'rgb' }); // => 'rgb(167, 196, 232)'
 * randomColor({ format: 'hsl' }); // => 'hsl(210, 65%, 78%)'
 *
 * // 使用预设类型
 * randomColor({ preset: 'bright' }); // => '#ff3366' (明亮的颜色)
 * randomColor({ preset: 'pastel' }); // => '#e8d5ff' (柔和的颜色)
 *
 * // 指定参数范围
 * randomColor({
 *   hue: [0, 60],        // 红色到黄色范围
 *   saturation: [70, 100], // 高饱和度
 *   lightness: [40, 60]    // 中等亮度
 * }); // => '#cc6600'
 *
 * // 指定固定值
 * randomColor({
 *   hue: 120,           // 固定绿色色相
 *   saturation: 'random', // 随机饱和度
 *   lightness: 50       // 固定亮度
 * }); // => '#40bf40'
 * ```
 */
export function randomColor(options: RandomColorOptions = {}): string | null {
  const { format = 'hex', preset } = options

  let { hue, saturation, lightness, alpha } = options

  // 应用预设
  if (preset) {
    const presetOptions = getPresetOptions(preset)
    hue = hue ?? presetOptions.hue
    saturation = saturation ?? presetOptions.saturation
    lightness = lightness ?? presetOptions.lightness
    alpha = alpha ?? presetOptions.alpha
  }

  // 构建 culori random 函数的约束条件
  const constraints: Record<string, number | [number, number]> = {}

  // 处理色相约束
  if (hue !== undefined && hue !== 'random') {
    if (typeof hue === 'number') {
      constraints.h = hue
    }
    else {
      constraints.h = hue
    }
  }

  // 处理饱和度约束
  if (saturation !== undefined && saturation !== 'random') {
    if (typeof saturation === 'number') {
      constraints.s = saturation > 1 ? saturation / 100 : saturation
    }
    else {
      constraints.s = [
        saturation[0] > 1 ? saturation[0] / 100 : saturation[0],
        saturation[1] > 1 ? saturation[1] / 100 : saturation[1],
      ]
    }
  }

  // 处理亮度约束
  if (lightness !== undefined && lightness !== 'random') {
    if (typeof lightness === 'number') {
      constraints.l = lightness > 1 ? lightness / 100 : lightness
    }
    else {
      constraints.l = [
        lightness[0] > 1 ? lightness[0] / 100 : lightness[0],
        lightness[1] > 1 ? lightness[1] / 100 : lightness[1],
      ]
    }
  }

  // 处理透明度约束
  if (alpha !== undefined && alpha !== 'random') {
    if (typeof alpha === 'number') {
      constraints.alpha = alpha
    }
    else {
      constraints.alpha = alpha
    }
  }

  // 使用 culori 的 random 函数生成颜色
  const color = random('hsl', constraints)

  // 根据格式返回
  switch (format) {
    case 'rgb':
      return formatRgb(color)
    case 'hsl':
      return formatHsl(color)
    case 'hex':
    default:
      return formatHex(color)
  }
}

/**
 * 生成指定数量的随机颜色数组。
 *
 * @param count - 要生成的颜色数量
 * @param options - 随机颜色生成选项
 * @returns 生成的随机颜色数组
 *
 * @example
 * ```typescript
 * // 生成5个随机颜色
 * randomColors(5); // => ['#a7c4e8', '#ff6b9d', '#4ecdc4', '#ffe66d', '#ff6b6b']
 *
 * // 生成3个明亮的颜色
 * randomColors(3, { preset: 'bright' }); // => ['#ff3366', '#33ff66', '#3366ff']
 * ```
 */
export function randomColors(count: number, options: RandomColorOptions = {}): string[] {
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const color = randomColor(options)
    if (color) {
      colors.push(color)
    }
  }
  return colors
}

function getPresetOptions(preset: string): Partial<RandomColorOptions> {
  switch (preset) {
    case 'bright':
      return {
        saturation: [70, 100],
        lightness: [45, 65],
      }
    case 'dark':
      return {
        lightness: [10, 40],
      }
    case 'light':
      return {
        lightness: [70, 95],
        saturation: [20, 80],
      }
    case 'pastel':
      return {
        saturation: [20, 50],
        lightness: [70, 90],
      }
    case 'vibrant':
      return {
        saturation: [80, 100],
        lightness: [40, 70],
      }
    case 'monochrome':
      return {
        saturation: 0,
      }
    default:
      return {}
  }
}
