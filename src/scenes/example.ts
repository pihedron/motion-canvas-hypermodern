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
import geosvg from '../geometry.svg?raw'
import oversvg from '../overcomplicate.svg?raw'
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
    fill: 'white',
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
    zIndex: -10
  })

  view.add(bg.opacity(0))

  const algebra = new Spletters({})
  algebra.edit('Algebra', { ...preset, fontSize: 128 })
  view.add(algebra)

  yield* bg.opacity(1, 0.5)

  yield* algebra.show(1)
  yield* waitUntil('problem')
  yield* algebra.hide(1)

  yield* waitUntil('forming')

  const ptx = new Pitex({
    fill: OFFWHITE,
    fontSize: 64,
    tex: math('y = m x + c'),
  })

  view.add(ptx)

  const code = new Code({ highlighter })

  code.y(200).offset([0, -1])
  view.add(code)

  yield* ptx.write(1)
  yield* all(ptx.edit('y - c = m x', 1), code.code('translate([0, c])', 1))
  yield* all(
    ptx.edit('{{ y - c }/over{ m }} = x', 1),
    code.code('scale([1, m])\ntranslate([0, c])', 1)
  )

  yield* waitFor(0.5)

  yield* all(ptx.unwrite(1), code.opacity(0, 1))

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

  yield* all(plot.opacity(1, 1), line.end(1, 1))

  yield* waitUntil('you')

  yield* plot.scale([1, 0], 1)

  yield* waitFor(1)

  ptx.tex(math('/cos{x}=/min(y, 0)'))

  yield* ptx.write(3)

  yield* waitFor(2)

  function range(start: number, end: number, step: number) {
    const nums = []
    for (let i = start; i < end; i += step) {
      nums.push(i)
    }
    return nums
  }

  const style = {
    end: 0,
    stroke: OFFWHITE,
    lineWidth: 4,
    lineCap: 'round' as CanvasLineCap,
    opacity: 0,
    zIndex: -2
  }

  const dim = new Rect({
    fill: bg.fill(),
    opacity: 0,
    width: view.width(),
    height: view.height(),
    zIndex: -1
  })

  view.add(dim)

  const verts = range(-960, 960, 120).map(
    (n) => new Ray({ from: [n, -540], to: [n, 540], ...style })
  )
  const horis = range(-540, 540, 120).map(
    (n) => new Ray({ from: [-960, n], to: [960, n], ...style })
  )

  verts.forEach((ray) => view.add(ray))
  horis.forEach((ray) => view.add(ray))

  yield* all(...verts.map((ray, i) => delay(i * 0.1, all(ray.end(1, 1), ray.opacity(1, 0.5)))), dim.opacity(0.75, 0.5))
  yield* all(...horis.map((ray, i) => delay(i * 0.1, all(ray.end(1, 1), ray.opacity(1, 0.5)))))

  yield* all(
    ...verts.map(ray => all(ray.rotation(45, 1), ray.scale(2, 1))),
    ...horis.map(ray => all(ray.rotation(15, 1), ray.scale(2, 1)))
  )

  yield* any(...verts.map((ray, i) => ray.end(0, 0.5)), ptx.opacity(0, 1))
  yield* all(...horis.map((ray, i) => ray.end(0, 0.5)))

  verts.forEach(ray => ray.remove())
  horis.forEach(ray => ray.remove())

  const txt = range(0, 3, 1).map(x => new Spletters({}))

  const input = [
    'Reflect the graph across the x-axis.',
    'Translate the graph upwards by 1 unit.',
    'Stretch the graph along the x-axis by a factor of 2.'
  ].forEach((text, i) => {
    txt[i].edit(text, preset)
    view.add(txt[i])
  })
  
  yield* txt[0].show(1)
  yield* waitFor(1)
  yield* txt[0].y(-50, 1)
  txt[1].y(50)
  yield* all(
    txt[1].show(1)
  )
  yield* waitFor(1)
  yield* all(
    txt[0].y(-100, 1),
    txt[1].y(0, 1),
  )
  txt[2].y(100)
  yield* txt[2].show(1)
  yield* waitFor(3)
  yield* all(
    ...txt.map(t => t.hide(1))
  )
})
