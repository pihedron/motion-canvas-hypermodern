import { Path, SVG } from '@motion-canvas/2d'
import { all, any, chain, delay } from '@motion-canvas/core'

export function* draw(drawing: SVG, time: number) {
  const paths = drawing.childAs(0).children() as Path[]
  paths.forEach((x) => [x.end(0), x.lineWidth(0)])
  yield* chain(...paths.map((x) => all(x.end(1, time), x.lineWidth(8, time))))
}

export function* paint(drawing: SVG, time: number) {
  const paths = drawing.childAs(0).children() as Path[]
  const filled: any[] = []
  paths.forEach((x) => [x.end(0), x.lineWidth(0)])
  paths.forEach((x) => x.fill() ? filled.push([x.stroke(x.fill()), x.fill(null)]) : filled.push(false))
  yield* chain(...paths.map((x, i) => any(x.end(1, time), x.lineWidth(8, time), filled[i] ? delay(time, x.fill(x.stroke(), time)) : null)))
}
