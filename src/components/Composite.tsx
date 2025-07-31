import { Rect, RectProps, signal } from '@motion-canvas/2d'
import { all, delay, SignalValue, SimpleSignal } from '@motion-canvas/core'

const width = 80
const factor = 2

function rect(w?: number, c?: string) {
  return (
    <Rect
      fill={c ?? 'white'}
      width={w ?? width}
      height={0}
      stroke={c ?? 'white'}
    ></Rect>
  )
}

export interface CompositeProps extends RectProps {
  powers: SignalValue<number[]>
}

export class Composite extends Rect {
  @signal()
  public declare readonly powers: SimpleSignal<number[], this>

  public constructor(props: CompositeProps) {
    super({
      layout: true,
      alignItems: 'start',
      ...props,
    })

    let maximum = 0

    const powers = this.powers()
    for (let i = 0; i < powers.length; i++) {
      const power = powers[i]
      maximum = Math.max(maximum, power)
      this.add(rect())
    }

    this.height(0)
  }

  public *create(duration: number) {
    const animations = []

    const powers = this.powers()
    const divisor = 1 + (powers.length - 1) / factor
    const time = duration / divisor
    for (let i = 0; i < powers.length; i++) {
      const power = powers[i]
      const child = this.getChildren()[i] as Rect
      if (power > 0)
        animations.push(
          delay((i * time) / factor, child.height(power * width, time)),
          delay((i * time) / factor, child.lineWidth(1, time))
        )
      else if (i === 0)
        animations.push(
          delay((i * time) / factor, child.height(0.5 * width, time)),
          delay((i * time) / factor, child.width(0.5 * width, time)),
          delay(
            (i * time) / factor,
            child.margin([0, 0.5 * width, 0, 0], time)
          ),
          delay((i * time) / factor, child.lineWidth(1, time))
        )
    }

    yield* all(...animations)
  }

  public destroy() {
    for (const child of this.children() as Rect[]) {
      child.height(0)
      child.lineWidth(0)
    }
  }

  public *change(values: number[], duration: number) {
    const animations = []

    const powers = this.powers()
    const divisor = 1 + (values.length - 1) / factor
    const time = duration / divisor
    for (let i = 0; i < values.length; i++) {
      if (i >= powers.length) this.add(rect(0))

      const value = values[i]
      const child = this.getChildren()[i] as Rect

      if (i === 0)
        animations.push(
          delay((i * time) / factor, child.width(1 * width, time)),
          delay((i * time) / factor, child.margin(0, time))
        )

      animations.push(
        delay((i * time) / factor, child.height(value * width, time)),
        delay((i * time) / factor, child.lineWidth(value > 0 ? 1 : 0, time))
      )

      if (i >= powers.length)
        animations.push(delay((i * time) / factor, child.width(width, time)))
    }

    for (let i = powers.length - 1; i >= values.length; i--) {
      const child = this.getChildren()[i] as Rect
      const point = powers.length - i
      animations.push(
        delay((point * time) / factor, child.height(0, time)),
        delay((point * time) / factor, child.width(0, time))
      )
    }

    
    yield* all(...animations)

    for (let i = powers.length - 1; i >= values.length; i--) {
      const child = this.getChildren()[i] as Rect
      console.log(i)
      child.remove()
    }

    this.powers(values)
  }

  public *shade(colors: string[], duration: number) {
    let reset = !colors.length

    if (reset) {
      colors = new Array(this.powers().length).fill('white')
    } else {
      for (const child of this.getChildren() as Rect[]) {
        child.lineWidth(0)
      }
    }

    for (let i = 0; i < colors.length; i++) {
      const child = this.getChildren()[i] as Rect
      if (!child) break
      yield* all(child.fill(colors[i], duration / colors.length))
    }

    if (reset) {
      for (const child of this.getChildren() as Rect[]) {
        if (child.height() > 0) child.lineWidth(1)
      }
    }
  }

  public hide() {
    if (this.powers()[0] === 0) this.childAs<Rect>(0).height(0).lineWidth(0)
  }

  public show() {
    if (this.powers()[0] === 0) this.childAs<Rect>(0).height(width / 2)
  }
}
