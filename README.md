# Hypermodern

This is where I experiment with new techniques and components not typically used by most [Motion Canvas](https://motioncanvas.io) projects.

The ideas behind the *hypermodern* include:
- **CODE PURITY**: only write code in TS and not TSX to avoid bloat and boost clarity
- **GOOD LATEX**: animate `Latex` with high quality like Manim
- **EASY 3D**: integrate 3D elements into animations seamlessly using `three`
- **CODE ANIMATIONS**: provide better syntax highlighting and language support through `shiki` to make programmming animations better

Many of these advancements wouldn't be possible if it weren't for the [Motion Canvas Community](https://chat.motioncanvas.io/).

## Components

### Pitex

`Pitex` is [Pihedron](https://pihedron.github.io)'s extension to the default `Latex` component that can animate your Tex like Manim.

The very first example of the *hypermodern* showcased better syntax highlighting and ports of Manim's `Write` and `Unwrite` animations.

```ts
/**
 * Welcome to the **hypermodern** example for Motion Canvas!
 * 
 * Thank you to the people who made these things possible:
 * [Motion Canvas](https://github.com/aarthificial)
 * [Latex Tweening](https://github.com/levirs565)
 * [Pitex Animations](https://github.com/pihedron)
 * [Shiki Integration](https://github.com/skearya)
 */

// default motion-canvas imports
import { Code } from '@motion-canvas/2d/lib/components'
import { makeScene2D } from '@motion-canvas/2d/lib/scenes'
import { insert } from '@motion-canvas/2d'
import { waitFor, waitUntil } from '@motion-canvas/core/lib/flow'

// custom componnets
import { ShikiHighlighter } from '../components/Shiki'
import { math, Pitex } from '../components/Pitex'

// a better code highlighter
const dart = new ShikiHighlighter({
  highlighter: {
    lang: 'dart', // more languages supported than lezer
    theme: 'github-dark', // you can now choose themes
  },
})

export default makeScene2D(function* (view) {
  // no tsx and no ref tag required
  const code = new Code({
    highlighter: dart,
    fontSize: 64,
  })

  view.add(code)

  yield* code.code(
`\
void main() {}`
  , 1)

  yield* code.code.edit(1)
`\
void main() {${insert(`
  print("Hello, world!");
`)}}`

  yield* code.opacity(0, 1)

  yield* waitUntil('equation')

  // a better `Latex` component is here
  const ptx = new Pitex({
    fill: 'white',
    tex: math('( a + a /cos{C} ) ^2 + b ^2 - ( a /cos{C} )^2 = c^2'),
    fontSize: 64
  })

  view.add(ptx)

  yield* ptx.write(2)

  yield* ptx.edit('a ^2 + b ^2 - 2 a b /cos{C} = c^2', 1) // passes string through math function

  yield* ptx.unwrite(2)

  yield* waitFor(1)
})
```

Here is an example of morphing equations.

```ts
// default motion-canvas imports
import { makeScene2D, useScene2D } from '@motion-canvas/2d/lib/scenes'
import { insert, Path } from '@motion-canvas/2d'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow'

// custom componnets
import { math, Pitex } from '../components/Pitex'
import { easeInOutCubic, easeOutCubic, tween } from '@motion-canvas/core'

// constants
const pi = Math.PI
const e = Math.E
const tau = pi * 2

export default makeScene2D(function* (view) {
  const first = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('(x+y)^2')
  })

  const second = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('|a-b|^2')
  })

  const third = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('/sum_{n=0}^{/infty}n')
  })

  const fourth = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('/int_{0}^{/pi}/sin{x}=2')
  })

  const fifth = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('/ln|x|')
  })

  view.add(first)

  yield* first.morph(second, 1)

  yield* first.morph(third, 1)

  yield* first.map(fourth, [[0], [1], [3, 7], [2, 8], [4], [5, 6]], 1)

  yield* first.map(fifth, [[0], [1], [2], [], [4], [1], [], [], [3]], 1)
})
```