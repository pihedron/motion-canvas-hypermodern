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
import { makeScene2D, useScene2D } from '@motion-canvas/2d/lib/scenes'
import {
  Circle,
  Img,
  insert,
  Line,
  Node,
  Path,
  Polygon,
  Ray,
  Rect,
  Spline,
  SVG,
  Txt,
} from '@motion-canvas/2d'
import {
  all,
  any,
  chain,
  delay,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow'

import { LinePlot, Plot } from '@hhenrichsen/motion-canvas-graphing'

// three.js integration
import * as THREE from 'three'

// custom componnets
import { ShikiHighlighter } from '../components/Shiki'
import { math, Pitex } from '../components/Pitex'
import {
  Color,
  createSignal,
  easeInCubic,
  easeInExpo,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  map,
  PossibleVector2,
  tween,
} from '@motion-canvas/core'
import { Pihedron, Three } from '../components/Three'

// CSS fonts
import '../global.css'

// SVG
import impsvg from '../impossible.svg?raw'
import { draw } from '../functions/draw'
import { ShaderBackground } from '../components/ShaderBackground'
import { Spletters } from '../components/Spletters'

// a better code highlighter
const highlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'python', // more languages supported than lezer
    theme: 'vitesse-black', // you can now choose themes
  },
})

// constants
const pi = Math.PI
const e = Math.E
const tau = pi * 2

const cos = (deg: number) => Math.cos((deg / 180) * Math.PI)
const sin = (deg: number) => Math.sin((deg / 180) * Math.PI)

function title(text: string) {
  return new Txt({
    text,
    fill: OFFWHITE,
    fontFamily: 'Poppins',
    fontSize: 64,
  })
}

const OFFWHITE = '#fcf1c9'
const preset = {
  fontFamily: 'Poppins',
  fontSize: 64,
  fill: OFFWHITE,
}

export default makeScene2D(function* (view) {
  const bg = new Rect({
    width: view.width(),
    height: view.height(),
    fill: '#10141c',
    zIndex: -10,
  })

  view.add(bg)

  yield* waitFor(1)

  const imp = new SVG({ svg: impsvg })
  view.add(imp)

  yield* draw(imp, 0.1)
  yield* waitFor(0.5)
  yield* imp.opacity(0, 1)

  yield* waitUntil('trig')

  const trig = new Pitex({
    fill: OFFWHITE,
    fontSize: 64,
    tex: math('/cos{x}'),
  })

  view.add(trig.x(-200))

  yield* trig.write(1)
  yield* waitFor(0.5)

  const mini = new Pitex({
    fill: OFFWHITE,
    fontSize: 64,
    tex: math('/textrm{min}(y,0)'),
  })

  view.add(mini.x(200))

  yield* mini.write(1)
  yield* waitFor(4)

  yield* all(
    ...trig
      .childAs(0)
      .childAs(0)
      .children()
      .map((path, i) => (i == 3 ? path.opacity(1, 1) : path.opacity(0, 1))),
    ...mini
      .childAs(0)
      .childAs(0)
      .children()
      .map((path, i) => (i == 4 ? path.opacity(1, 1) : path.opacity(0, 1)))
  )

  yield* waitFor(1)

  yield* all(trig.opacity(0, 1), mini.opacity(0, 1))

  const plot = new Plot({
    clip: true,
    size: [960, 540],
    labelSize: 0,
    tickLabelSize: 24,
    fontFamily: 'Poppins',
    minX: -8,
    maxX: 8,
    minY: 0,
    maxY: 9,
    ticks: [16, 9],
  })

  const line = new LinePlot({
    lineWidth: 4,
    stroke: '#e2463bff',
  })

  view.add(plot.add(line))

  plot.opacity(0)
  line
    .data(plot.makeGraphData(0.1, (x) => Math.pow(x, 2)))
    .lineWidth(8)
    .end(0)

  yield* all(plot.opacity(1, 1), line.end(1, 2))
  yield* waitFor(4)

  yield* all(
    plot.max([8, 9 / 3], 1),
    plot.ticks([16, 9 / 3], 1),
    line.data(
      plot.makeGraphData(0.1, (x) => Math.pow(x, 2) / 3),
      1
    )
  )

  yield* waitFor(5)

  yield* all(plot.max([8, 9], 1), plot.ticks([16, 9], 1))

  yield* waitFor(2)
  yield* plot.scale(0, 1)

  const txt = title('Inversion Technique')
  view.add(txt.fontSize(96).y(-300).scale(0))

  const pihedron = new Pitex({
    fontSize: 96,
    fill: OFFWHITE,
    tex: math('x = y'),
  })

  view.add(pihedron)

  const code = new Code({ highlighter })

  code.y(200).offset([0, -1])
  view.add(code)

  yield* all(
    pihedron.write(1),
    code.code('# graph transformations', 1),
    txt.scale(1, 1)
  )

  yield* all(
    pihedron.edit('x - t_x = y - t_y', 1),
    code.code('# graph transformations\ntranslate([t.x, t.y])', 1)
  )

  yield* all(
    pihedron.edit('{{ x - t_x }/over{ s_x }} = {{ y - t_y }/over{ s_y }}', 1),
    code.code(
      '# graph transformations\nscale([s.x, s.y])\ntranslate([t.x, t.y])',
      1
    )
  )

  yield* waitUntil('next')
  yield* all(
    txt.scale(0, 1),
    pihedron.unwrite(1),
    code.opacity(0, 1)
  )

  const eq = new Pitex({
    fontSize: 64,
    fill: OFFWHITE,
    tex: math('/cos{ x } = /textrm{min} /left( y , 0 /right)')
  })

  view.add(eq.y(-420))

  plot.width(60 * 20).height(600).max([10, 5]).min([-10, -5]).ticks([20, 10])

  line.data(plot.makeGraphData(0.1, (x) => Math.cos(x) < 0 ? Math.cos(x) : 2 ** 32))

  yield* all(plot.scale(1, 1), eq.write(1))
  yield* all(
    plot.ticks([40, 10], 1),
    plot.max([20, 5], 1),
    plot.min([-20, -5], 1),
    line.scale([2, 1], 1),
    line.lineWidth(4, 1)
  )

  yield* waitFor(2)

  yield* all(
    plot.ticks([20, 10], 1),
    plot.max([10, 5], 1),
    plot.min([-10, -5], 1),
    eq.edit('/cos{ x /over 2 } = /textrm{min} /left( y , 0 /right)', 1)
  )

  yield* waitFor(3)

  yield* all(
    plot.max([10, 6], 1),
    plot.min([-10, -4], 1),
    line.data(plot.makeGraphData(0.1, (x) => Math.cos(x) + 1 < 1 ? Math.cos(x) + 1 : 2 ** 32), 1)
  )

  yield* waitFor(2)

  yield* all(
    plot.max([10, 5], 1),
    plot.min([-10, -5], 1),
    eq.edit('/cos{ x /over 2 } = /textrm{min} /left( y - 1 , 0 /right)', 1)
  )

  yield* waitFor(7)

  yield* all(
    line.data(plot.makeGraphData(0.1, (x) => -(Math.cos(x) + 1) > -1 ? -(Math.cos(x) + 1) : -(2 ** 32)), 1)
  )

  yield* waitFor(2.5)

  yield* eq.edit('/cos{ x /over 2 } = /textrm{min} /left( { y - 1 /over -1 } , 0 /right)', 1)
  yield* waitFor(4)
  yield* eq.edit('/cos{ x /over 2 } = /textrm{min} /left( - /left( y - 1 /right) , 0 /right)', 1)

  yield* waitFor(5)

  yield* all(...view.children().map(child => child.opacity(0, 1)))
})
