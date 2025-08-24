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
  Layout,
  Line,
  Node,
  Path,
  Polygon,
  Ray,
  Rect,
  SVG,
  Txt,
} from '@motion-canvas/2d'
import {
  all,
  chain,
  delay,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow'

// three.js integration
import * as THREE from 'three'

// custom componnets
import { ShikiHighlighter } from '../components/Shiki'
import { math, Pitex } from '../components/Pitex'
import {
  createSignal,
  easeInCubic,
  easeInExpo,
  easeInOutCubic,
  easeOutCubic,
  map,
  PossibleVector2,
  tween,
  Vector2,
} from '@motion-canvas/core'
import { Pihedron, Three } from '../components/Three'

// CSS fonts
import '../global.css'

// SVG
import geosvg from '../geometry.svg?raw'
import oversvg from '../overcomplicate.svg?raw'
import { draw } from '../functions/draw'
import { ShaderBackground } from '../components/ShaderBackground'

// a better code highlighter
const dart = new ShikiHighlighter({
  highlighter: {
    lang: 'dart', // more languages supported than lezer
    theme: 'github-dark', // you can now choose themes
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
    fill: 'white',
    fontFamily: 'Poppins',
    fontSize: 64,
  })
}

export default makeScene2D(function* (view) {
  const bg = new ShaderBackground({ preset: 'pihedronQuad', opacity: 0 })
  view.add(bg)

  const tri = new Line({
    points: [
      [0, 0],
      [700, 0],
      [500, -400],
      [0, 0],
    ],
    stroke: 'white',
    lineWidth: 8,
    lineJoin: 'round',
    lineCap: 'round',
  })

  const container = new Rect({ layout: true })

  view.add(container.add(tri))

  container.scale(0)

  yield* all(
    container.scale(1, 1),
    bg.opacity(1, 1)
  )

  const a = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('a'),
  })

  a.position([-130, -50])

  view.add(a)

  yield* a.write(0.5)

  const b = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('b'),
  })

  b.y(260)

  view.add(b)

  yield* b.write(0.5)

  const arc = new Circle({
    size: 200,
    stroke: 'white',
    lineWidth: 8,
    startAngle: 0,
    endAngle: 0,
    counterclockwise: true,
  })

  arc.position([-350, 200])

  view.add(arc)

  yield* arc.endAngle(-37, 1)
  yield* waitFor(3)

  const alt = new Ray({
    stroke: 'white',
    lineWidth: 8,
    lineJoin: 'round',
    lineCap: 'round',
    from: [150, -200],
    to: [150, -200],
    lineDash: [30, 40],
    lineDashOffset: 0,
  })

  view.add(alt)

  yield* alt.to([150, 200], 1)
  yield* waitFor(4)

  const hypo = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('a /sin{/theta}'),
  })

  hypo.position([20, 50])

  view.add(hypo)

  yield* hypo.write(1)
  yield* waitFor(2)

  const formula = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('A=/frac{1}{2}bh'),
  })

  formula.position([-700, -300])

  view.add(formula)

  yield* formula.write(1)
  yield* waitFor(2)

  const copy = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('A=/frac{1}{2}ba/sin{/theta}'),
  })
  
  yield* formula.map(copy, [[0], [1], [2], [3], [4], [5], [6, 7, 8, 9, 10]], 1)
  copy.tex(math('A=/frac{1}{2}ab/sin{/theta}'))
  yield* formula.morph(copy, 1)

  yield* waitUntil('comparing')

  yield* all(
    ...view.children().map(child => child.opacity(0, 0.5))
  )
})
