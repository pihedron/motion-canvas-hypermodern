import { Rect, RectProps, Txt, TxtProps } from '@motion-canvas/2d'
import { TxtLeaf } from '@motion-canvas/2d/lib/components/TxtLeaf'
import { all, delay, easeOutCubic, SignalValue, ThreadGenerator } from '@motion-canvas/core'

const factor = 0.5 // 0 <= factor <= 1

export function getSpaceWidth(
  fontSize: SignalValue<number>,
  fontFamily: SignalValue<string>
) {
  const spaceless = new Txt({ text: '00', fontSize, fontFamily })
  const spaced = new Txt({ text: '0 0', fontSize, fontFamily })

  const width = spaced.width() - spaceless.width()

  spaced.dispose()
  spaceless.dispose()

  return width
}

export interface SplettersProps extends RectProps {}

export class Spletters extends Rect {
  text: string
  letters: Txt[]

  constructor(props: SplettersProps) {
    super(props)
  }

  getDimensions(
    fontSize: SignalValue<number>,
    fontFamily: SignalValue<string>,
    text: string
  ) {
    const full = new Txt({ text, fontSize, fontFamily, fill: 'white' })

    return full.childAs<TxtLeaf>(0).size()
  }

  edit(text: string, props?: TxtProps) {
    this.text = text
    this.letters = text.split('').map((l) => new Txt({ text: l, ...props }))
    this.size(this.getDimensions(props.fontSize, props.fontFamily, text))

    let pad = 0
    const spaceWidth = getSpaceWidth(props.fontSize, props.fontFamily)

    this.letters.forEach((l, i) => {
      l.offset([0, 1])

      if (text[i] === ' ') l.width(spaceWidth)

      const w = l.width() / 2
      pad += w
      l.x(pad - this.width() / 2).y(this.height() / 2)
      pad += w

      this.add(l)

      l.scale(0)
    })

    return this
  }

  *show(time: number) {
    const interval = time * factor
    const lag = (time - interval) / (this.letters.length - 1)

    yield* all(
      ...this.letters.map((l, i) =>
        delay(
          easeOutCubic(i / this.letters.length) * i * lag,
          l.scale(1, interval)
        )
      )
    )
  }

  *hide(time: number) {
    const interval = time * factor
    const lag = (time - interval) / (this.letters.length - 1)

    yield* all(
      ...this.letters.map((l, i) =>
        delay(
          easeOutCubic(i / this.letters.length) * i * lag,
          l.scale(0, interval)
        )
      )
    )
  }

  select(value: string) {
    const start = this.text.indexOf(value)
    if (start < 0) return

    const letters = this.letters.slice(start, start + value.length)

    return letters
  }
}
