export interface ShaderBackgroundProps extends RectProps {
  color0?: SignalValue<Color>
  color1?: SignalValue<Color>
  color2?: SignalValue<Color>
  color3?: SignalValue<Color>
}

import BACKGROUND_SHADER from '../shaders/bg.glsl'

import {
  Rect,
  RectProps,
  colorSignal,
  initial,
  signal,
} from '@motion-canvas/2d'
import { Color, ColorSignal, SignalValue } from '@motion-canvas/core'

export const PRESETS = {
  vivid: ['#f5c38b', '#316fe9', '#e31c1c', '#5dbdf3'],
  sunset: ['#FF6F61', '#D7263D', '#2E294E', '#1B998B'],
  ocean: ['#00C9FF', '#92FE9D', '#0072FF', '#00B4DB'],
  ram: ['#1F2F2F', '#2A5F6A', '#3A7E4E', '#102430'],
  ramDark: [
    '#4B2E19', // deep copper accent
    '#1F2F38', // dark bluish-slate
    '#0A2231', // navy charcoal
    '#0C3A4B', // muted teal-blue
  ],
  mindmaze: [
    '#e6d6ac', // parchment gold (highlight)
    '#2d1e36', // deep purple-black (shadow)
    '#912f56', // velvet red (accent)
    '#3a5370', // muted steel blue (cool contrast)
  ],
  pihedronQuad: [
    '#06BEBB', // inverted of #F94144 → cyan-teal
    '#A88A6F', // inverted of #577590 → warm beige
    '#0638B0', // inverted of #F9C74F → deep royal blue
    '#BC5574', // inverted of #43AA8B → magenta-rose
  ],
} as const

export interface ShaderBackgroundProps extends RectProps {
  preset?: keyof typeof PRESETS
  color0?: SignalValue<Color>
  color1?: SignalValue<Color>
  color2?: SignalValue<Color>
  color3?: SignalValue<Color>
}

export class ShaderBackground extends Rect {
  @initial(PRESETS.ocean[0])
  @colorSignal()
  public declare readonly color0: ColorSignal<this>

  @initial(PRESETS.ocean[1])
  @colorSignal()
  public declare readonly color1: ColorSignal<this>

  @initial(PRESETS.ocean[2])
  @colorSignal()
  public declare readonly color2: ColorSignal<this>

  @initial(PRESETS.ocean[3])
  @colorSignal()
  public declare readonly color3: ColorSignal<this>

  public constructor(props: ShaderBackgroundProps = {}) {
    // pick the preset array (or default to vivid)
    const presetColors = PRESETS[props.preset ?? 'vivid']

    super({
      size: '100%',
      // if user didn’t override individual signals, seed them from preset
      ...props,
    })
    this.shaders({
      fragment: BACKGROUND_SHADER,
      uniforms: {
        colorYellow: this.color0,
        colorDeepBlue: this.color1,
        colorRed: this.color2,
        colorBlue: this.color3,
      },
    })

    // override any missing custom signals with preset
    if (props.preset) {
      // only set if user didn’t pass color0 explicitly
      this.color0(presetColors[0])
      this.color1(presetColors[1])
      this.color2(presetColors[2])
      this.color3(presetColors[3])
    }
  }
}
