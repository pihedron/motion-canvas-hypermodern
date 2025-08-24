import { CanvasStyle, Latex, LatexProps, Path, Rect } from '@motion-canvas/2d'
import { all, delay, TimingFunction, tween } from '@motion-canvas/core'

const factor = 2
const buffer = 0.25

export function math(tex: string) {
  return tex.replaceAll('/', '\\').split(' ')
}

export function isPath(path: Path | Rect) {
  return 'data' in path
}

export interface PitexProps extends LatexProps {}

export class Pitex extends Latex {
  color: CanvasStyle

  constructor(props: PitexProps) {
    super(props)

    this.color = this.fill()
  }

  getPaths() {
    return this.childAs(0)
      .children()
      .flatMap((part) =>
        part.children().length ? (part.children() as Path[]) : part
      ) as (Path | Rect)[]
  }

  *write(time: number, timingFunction?: TimingFunction) {
    const paths = this.getPaths()
    const duration = time / paths.length
    const animations = []

    for (let i = 0; i < paths.length; i++) {
      paths[i].fill(null).stroke(this.color).lineWidth(40).start(0).end(0)
      animations.push(
        delay(
          (i * duration) / factor,
          paths[i].end(1, duration, timingFunction)
        ),
        delay(
          ((i + 1) * duration) / factor,
          paths[i].fill(this.color, duration, timingFunction)
        ),
        delay(
          ((i + 1) * duration) / factor,
          paths[i].lineWidth(0, duration, timingFunction)
        )
      )
    }

    yield* all(...animations)
  }

  *unwrite(time: number, timingFunction?: TimingFunction) {
    const paths = this.getPaths()
    const duration = time / paths.length
    const animations = []

    for (let i = 0; i < paths.length; i++) {
      paths[i].lineWidth(0).stroke(this.color).start(0)
      animations.push(
        delay(
          (i * duration) / factor,
          paths[i].fill(null, duration, timingFunction)
        ),
        delay(
          (i * duration) / factor,
          paths[i].lineWidth(40, duration, timingFunction)
        ),
        delay(
          ((i + 1) * duration) / factor,
          paths[i].start(1, duration, timingFunction)
        )
      )
    }

    yield* all(...animations)
  }

  *edit(tex: string, time: number) {
    yield* this.tex(math(tex), time)
  }

  *morph(ptx: Pitex, time: number) {
    const paths = this.getPaths()
    const targets = ptx.getPaths()
    const animations = []

    for (let i = 0; i < paths.length; i++) {
      paths[i].stroke(this.fill())

      if (isPath(paths[i]) && isPath(targets[i]))
        animations.push(
          delay(
            time * buffer,
            (paths[i] as Path).data(
              (targets[i] as Path).data(),
              time * (1 - 2 * buffer)
            )
          )
        )
      animations.push(
        paths[i].fill(null, time * buffer),
        paths[i].lineWidth(40, time * buffer),
        delay(
          time * buffer,
          paths[i].position(targets[i].position(), time * (1 - 2 * buffer))
        ),
        delay(
          time * buffer,
          paths[i].scale(targets[i].scale(), time * (1 - 2 * buffer))
        ),
        delay(time * (1 - buffer), paths[i].fill(paths[i].stroke(), time / 2)),
        delay(time * (1 - buffer), paths[i].lineWidth(0, time / 2))
      )
    }

    yield* all(...animations)
  }

  *map(ptx: Pitex, mapping: number[][], time: number) {
    let paths = this.getPaths()
    const len = paths.length
    const targets = ptx.getPaths()
    const animations = []
    const taken = targets.map(() => false)
    const extras = []

    for (let i = 0; i < len; i++) {
      if (!mapping[i].length) {
        animations.push(
          delay(time * buffer, paths[i].opacity(0, time * (1 - 2 * buffer)))
        )
        extras.push(i)
        continue
      }

      for (let j = 0; j < mapping[i].length; j++) {
        let index = i

        if (j > 0) {
          const subToPihedron = this.childAs(0).childAs(0)
          index = subToPihedron.children().length
          subToPihedron.add(this.getPaths()[i].clone())
        }

        if (taken[mapping[i][j]]) extras.push(index)

        taken[mapping[i][j]] = true

        paths = this.getPaths()

        if (isPath(paths[i]) && isPath(targets[mapping[i][j]]))
          animations.push(
            delay(
              time * buffer,
              (paths[index] as Path).data(
                (targets[mapping[i][j]] as Path).data(),
                time * (1 - 2 * buffer)
              )
            )
          )
        animations.push(
          delay(
            time * buffer,
            paths[index].position(
              targets[mapping[i][j]].position(),
              time * (1 - 2 * buffer)
            )
          ),
          delay(
            time * buffer,
            paths[index].scale(
              targets[mapping[i][j]].scale(),
              time * (1 - 2 * buffer)
            )
          )
        )
      }
    }

    paths = this.getPaths()

    for (let i = 0; i < paths.length; i++) {
      paths[i].stroke(this.fill())

      animations.push(
        paths[i].fill(null, time * buffer),
        paths[i].lineWidth(40, time * buffer),
        delay(time * (1 - buffer), paths[i].fill(paths[i].stroke(), time / 2)),
        delay(time * (1 - buffer), paths[i].lineWidth(0, time / 2))
      )
    }

    yield* all(...animations)

    extras.forEach((i) => paths[i].remove())
  }
}
