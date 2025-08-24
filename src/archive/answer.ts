import { makeScene2D } from "@motion-canvas/2d"
import { Pitex } from "../components/Pitex"
import { math } from "../components/Pitex"
import { waitFor, waitUntil } from "@motion-canvas/core"

export default makeScene2D(function* (view) {
  yield* waitFor(1)

  const ptx = new Pitex({
    fontSize: 64,
    fill: 'white',
    tex: math('63^2 + 16^2 = BC ^2 + 56^2'),
  })

  view.add(ptx)

  yield* ptx.write(4)

  yield* waitFor(3)

  yield* ptx.edit('BC = 33', 1)

  yield* waitUntil('fade')
  yield* ptx.scale(0, 1)

  yield* waitUntil('stop')
})