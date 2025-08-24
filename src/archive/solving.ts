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
  Color,
  createSignal,
  easeInCubic,
  easeInExpo,
  easeInOutCubic,
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
  const bg = new ShaderBackground({
    preset: 'pihedronQuad',
    opacity: 0,
    zIndex: -10,
  })
  view.add(bg)

  const BLUE = '#75acffff'
  const RED = '#ff7a59ff'

  const preset = {
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
  }

  let a = createSignal(400)
  let b = createSignal(300)

  let theta = createSignal(100)
  let phi = createSignal(70)

  function compute(override?: boolean) {
    const points: [number, number][] = []
    points[0] = [a(), 0]
    points[1] = override
      ? [b() * cos(phi()), b() * sin(phi())]
      : [b() * cos(theta()), b() * sin(theta())]
    points[2] = [a() * cos(theta() + phi()), a() * sin(theta() + phi())]
    points[3] = [b() * cos(180 + phi()), b() * sin(180 + phi())]
    return points
  }

  const txtProps = {
    fill: 'black',
    fontSize: 48,
    fontFamily: 'Poppins',
  }

  function vertex(text: string, i: number) {
    return new Rect({
      size: 64,
      radius: 32,
      fill: 'white',
      lineWidth: 8,
      scale: 0,
      position: () => compute()[i],
    }).add(
      new Txt({
        text,
        ...txtProps,
      })
    )
  }

  function edge(i: number) {
    return new Ray({
      stroke: 'white',
      lineWidth: 8,
      from: () => vertices[i].position(),
      to: () => vertices[(i + 1) % vertices.length].position(),
      ...preset,
    })
  }

  function wire(i: number) {
    return new Ray({
      stroke: 'white',
      lineWidth: 8,
      to: () => vertices[i].position(),
      ...preset,
    })
  }

  const group = new Node({})

  const vertices = ['A', 'B', 'C', 'D'].map((lbl, i) => vertex(lbl, i))

  const edges = vertices.map((_, i) => edge(i))

  vertices.forEach((v, i) => {
    v.zIndex(1)
    group.add(v)
  })

  edges.forEach((e, i) => {
    e.end(0)
    group.add(e)
  })

  const wires = vertices.map((_, i) => wire(i))

  wires.forEach((w, i) => {
    w.end(0)
    group.add(w)
  })

  view.add(group)

  yield* all(
    ...vertices.map((v) =>
      all(v.scale(1, 0.5), v.childAs<Txt>(0).rotation(30, 0.5))
    ),
    ...edges.map((e) => e.end(1, 0.5)),
    ...wires.map((w) => w.end(1, 0.5)),
    bg.opacity(1, 0.5),
    group.rotation(-30, 0.5)
  )

  const ptx = ['a', 'b', 'a', 'b', '/theta', '/phi'].map(
    (x) =>
      new Pitex({
        fill: 'white',
        fontSize: 64,
        tex: math(x),
      })
  )

  ptx.map((p) => view.add(p.scale(0)))

  ptx[0].position([160, -50])
  ptx[1].position([-150, -60])
  ptx[2].position([-170, 80])
  ptx[3].position([80, 110])
  ptx[4].position([10, -60])
  ptx[5].position([-20, 70])

  yield* ptx.map((p) => p.scale(1, 1))

  yield* waitFor(3)

  const conc = new Pitex({
    fill: 'white',
    fontSize: 64,
    tex: math('/sin{/theta} = /sin{/phi}'),
  })

  view.add(conc.position([600, 100]))

  yield* conc.write(2)

  yield* waitUntil('because')

  yield* all(ptx[4].position([60, 20], 1), ptx[5].position([-80, 0], 1))

  const left = new Txt({
    text: '16',
    ...txtProps,
  })

  const right = new Txt({
    text: '63',
    ...txtProps,
  })

  left.fill('white').scale(0).position([-340, 0])
  right.fill('white').scale(0).position([300, 60])

  view.add(left).add(right)

  yield* all(left.scale(1.5, 1), right.scale(1.5, 1))

  yield* waitFor(1)

  yield* all(
    ...ptx.map((p) => p.opacity(0, 1)),
    left.opacity(0, 1),
    right.opacity(0, 1),
    conc.unwrite(1)
  )

  yield* all(
    group.rotation(-70, 1),
    group.scale(1.5, 1),
    group.y(200, 1),
    ...vertices.map((v) =>
      all(v.scale(1, 0.5), v.childAs<Txt>(0).rotation(70, 0.5))
    )
  )

  yield* all(vertices[1].position(compute(true)[1], 1))

  const ray = new Ray({
    stroke: 'white',
    lineWidth: 12,
    from: [200, -350],
    to: [200, -350],
    zIndex: -1,
    lineCap: 'round',
  })

  view.add(ray)

  yield* ray.to([200, 200], 1)

  yield* waitFor(2)

  yield* all(wires[1].stroke(BLUE, 1), wires[3].stroke(BLUE, 1))

  yield* ray.end(0, 1)

  ray.remove()

  yield* all(
    group.rotation(-30, 1),
    group.scale(1, 1),
    group.y(0, 1),
    ...vertices.map((v) =>
      all(v.scale(1, 0.5), v.childAs<Txt>(0).rotation(30, 0.5))
    ),
    vertices[1].position(compute()[1], 1),
    wires[1].stroke('white', 1),
    wires[3].stroke('white', 1)
  )

  yield* all(ptx[4].opacity(1, 1), ptx[5].opacity(1, 1))

  conc.tex(math('/theta + /phi = 180^{/circ}')).position([-540, 0])

  yield* conc.write(1)
  yield* waitFor(1)
  yield* waitFor(1)

  yield* all(...vertices.map(v => v.scale(0, 1)))

  const ABO = new Line({
    points: [vertices[0].position(), vertices[1].position(), [0, 0], vertices[0].position()],
    fill: 'white',
    stroke: 'white',
    lineWidth: 8,
    lineCap: 'round',
    lineJoin: 'round',
    rotation: -30,
    zIndex: -1,
  })

  const CBO = new Line({
    points: [vertices[2].position(), vertices[1].position(), [0, 0], vertices[2].position()],
    fill: 'white',
    stroke: 'white',
    lineWidth: 8,
    lineCap: 'round',
    lineJoin: 'round',
    rotation: -30,
    zIndex: -1,
  })

  view.add(ABO.opacity(0)).add(CBO.opacity(0))

  yield* all(
    ABO.opacity(1, 0.5),
    ptx[4].fill('black', 0.5)
  )
  yield* all(
    ABO.points([compute(true)[2], compute(true)[1], [0, 0], compute(true)[2]], 1),
    ptx[4].position([-10, 70], 1)
  )
  yield* CBO.opacity(1, 0.5)
  yield* CBO.points([compute(true)[0], compute(true)[1], [0, 0], compute(true)[0]], 1)

  yield* all(
    wires[1].end(0, 1),
    edges[0].end(0, 1),
    edges[1].start(1, 1),
  )

  yield* all(
    ABO.fill(null, 1),
    CBO.fill(null, 1),
    ptx[4].fill('white', 1)
  )

  yield* waitUntil('try')

  yield* all(
    group.opacity(0, 1),
    ...ptx.map(p => p.opacity(0, 1)),
    ABO.opacity(0, 1),
    CBO.opacity(0, 1),
    conc.unwrite(1)
  )

  const big = new Line({
    points: [
      [0, 0],
      [600, 0],
      [400, -400],
      [0, 0],
    ],
    stroke: 'white',
    lineWidth: 8,
    lineJoin: 'round',
    lineCap: 'round',
  })

  const small = new Line({
    points: [
      [600, 0],
      [1200, 0],
      [400, -400],
      [600, 0],
    ],
    stroke: 'white',
    lineWidth: 8,
    lineJoin: 'round',
    lineCap: 'round',
  })
  
  const comp = new Rect({}).add(big).add(small).opacity(0)

  view.add(comp.position([-600, 200]))

  yield* comp.opacity(1, 1)

  view.add(ray)

  ray.from([-200, -200]).to([-200, 200]).opacity(1).lineWidth(8)

  ptx[0].position([260, 240]).opacity(1)
  ptx[1].position([-50, 10]).opacity(1)
  ptx[2].position([-450, -60]).opacity(1).tex('c_1^2')
  ptx[3].position([280, -60]).opacity(1).tex('c_2^2')
  ptx[4].position([-80, 150]).opacity(1)

  yield* all(
    ray.end(1, 1),
    ptx[0].write(0.5),
    ptx[1].write(0.5),
    ptx[2].write(0.5),
    ptx[3].write(0.5),
    ptx[4].write(0.5),
  )

  const h = new Pitex({
    fontSize: 64,
    fill: 'white',
    tex: math('h')
  })

  view.add(h.position([-240, 20]))

  yield* h.write(0.5)

  const x = new Pitex({
    fontSize: 64,
    fill: 'white',
    tex: math('x')
  })

  view.add(x.position([-110, 240]))

  yield* x.write(0.5)

  yield* waitUntil('pythagoras')

  const pythag = new Pitex({
    fontSize: 64,
    fill: 'white',
    tex: math('( a - x ) ^2 + h ^2 = c_1^2')
  })

  const pythago = new Pitex({
    fontSize: 64,
    fill: 'white',
    tex: math('( a + x ) ^2 + h ^2 = c_2^2')
  })

  view.add(pythag.position([-500, -300])).add(pythago.position([420, -300]))

  yield* all(
    pythag.write(1),
    pythago.write(1),
  )

  yield* waitFor(0.5)

  yield* all(
    pythag.edit('( a - x ) ^2 + b ^2 - x ^2 = c_1^2', 1),
    pythago.edit('( a + x ) ^2 + b ^2 - x ^2 = c_2^2', 1),
  )

  yield* waitFor(0.5)

  yield* all(
    pythag.edit('a ^2 - 2ax + b ^2 = c_1^2', 1),
    pythago.edit('a ^2 + 2ax + b ^2 = c_2^2', 1),
  )

  yield* waitFor(2)

  yield* x.edit('b/sin{/theta}', 1)

  yield* waitUntil('cancel')

  yield* waitFor(1)

  yield* all(
    pythago.edit('a ^2 + 2ax - 2ax + b ^2 = c_1^2 + c_2^2', 1),
    pythag.unwrite(1)
  )

  yield* waitFor(1)

  yield* pythago.edit('a ^2 + b ^2 = c_1^2 + c_2^2', 1)

  yield* waitUntil('deduce')

  const txt = new Spletters({})
  txt.edit('The sum of the squares of opposite sides are equal.', {
    fill: 'white',
    fontSize: 64,
    fontFamily: 'Poppins',
  })

  view.add(txt.y(400))

  yield* txt.show(2)

  yield* all(
    waitFor(1.5),
    ...view.children().map(child => child.opacity(0, 1))
  )
})
