import {
  CanvasStyle,
  Latex,
  LatexProps,
  Path,
  PossibleCanvasStyle,
} from '@motion-canvas/2d'
import { all, delay } from '@motion-canvas/core'

const factor = 2

export interface PitexProps extends LatexProps {}

export class Pitex extends Latex {
  public constructor(props: PitexProps) {
    super(props)
  }

  public *write(color: PossibleCanvasStyle, duration: number) {
    const animations = []
    const paths = this.childAs(0).childAs(0).children() as Path[]
    const divisor = paths.length / factor
    const time = duration / divisor

    for (let i = 0; i < paths.length; i++) {
      paths[i].stroke(color).lineWidth(40).end(0)
      animations.push(
        delay((i * time) / factor, paths[i].end(1, time)),
        delay(((i + 1) * time) / factor, paths[i].fill(color, time)),
        delay(((i + 1) * time) / factor, paths[i].lineWidth(0, time))
      )
    }

    yield* all(...animations)
  }

  public *unwrite(duration: number) {
    const animations = []
    const paths = this.childAs(0).childAs(0).children() as Path[]
    const divisor = paths.length / factor
    const time = duration / divisor

    for (let i = 0; i < paths.length; i++) {
      paths[i].lineWidth(0).start(0)
      animations.push(
        delay((i * time) / factor, paths[i].fill(null, time)),
        delay((i * time) / factor, paths[i].lineWidth(40, time)),
        delay(((i + 1) * time) / factor, paths[i].start(1, time))
      )
    }

    yield* all(...animations)
  }

  public reset(color: PossibleCanvasStyle) {
    const paths = this.childAs(0).childAs(0).children() as Path[]

    for (let i = 0; i < paths.length; i++) {
      paths[i].fill(color)
    }
  }

  public pi(tex: string) {
    this.tex(tex.replaceAll('@', '\\'))
  }
}
