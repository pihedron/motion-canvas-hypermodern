/*
  This code should trigger the error:
  
  ```
  Matching between Latex SVG and tex parts failed
  ```

  Clicking on the scope icon will open the scene hierarchy.
*/

import { Code, Latex, Node, Path } from '@motion-canvas/2d/lib/components'
import { makeScene2D } from '@motion-canvas/2d/lib/scenes'
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow'
import { ShikiHighlighter } from '../components/Shiki'
import { Pitex } from '../components/Pitex'

const dart = new ShikiHighlighter({
  highlighter: {
    lang: 'dart',
    theme: 'tokyo-night',
  },
})

function math(tex: string) {
  return tex.split(' ')
}

export default makeScene2D(function* (view) {
  const code = new Code({
    highlighter: dart,
    fontSize: 64,
  })

  view.add(code)

  yield* code.code('void main() => runApp(MyApp());', 1)

  yield* code.opacity(0, 1)

  const tex = new Pitex({
    fill: 'white',
    tex: math('( a + x ) ^2 + b ^2 - x^2 = c^2'),
  })

  view.add(tex)

  yield* tex.write(1)

  yield* tex.tex(math('a ^2 + b ^2 - 2ab\\cos C = c^2'), 1)

  yield* tex.unwrite(1)
})
