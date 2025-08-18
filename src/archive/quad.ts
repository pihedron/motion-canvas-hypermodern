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
import { draw } from '../functions/draw'

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
  const txt = title('Geometry')
  txt.fontSize(128).scale(0).stroke('white')

  // #region 3d

  const { x: width, y: height } = useScene2D().getSize()

  const camera = new THREE.PerspectiveCamera()
  const scene = new THREE.Scene()

  const icogeo = new THREE.IcosahedronGeometry(1, 0)
  const tetrageo = new THREE.TetrahedronGeometry(1, 0)
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  })

  const ico = new Pihedron(icogeo, material)
  ico.position.set(4.5, -2.5, 0)
  scene.add(ico)

  const tetra = new Pihedron(tetrageo, material)
  tetra.position.set(-4.5, 2.5, 0)
  scene.add(tetra)

  const color = 0xffffff
  const intensity = 1
  const light = new THREE.AmbientLight(color, intensity)
  scene.add(light)

  const pl = new THREE.PointLight(color, 1)
  pl.position.y = 2
  scene.add(pl)

  const dl = new THREE.DirectionalLight(color, 2)
  dl.position.x = -2
  scene.add(dl)

  camera.position.set(0, 0, 4)

  const v = new Three({ camera, scene, width, height })

  // #endregion

  view.add(v)
  view.add(txt)

  yield* all(
    chain(
      all(txt.scale(1, 1), delay(1, txt.rotation(-10, 0.5, easeInCubic))),
      txt.rotation(0, 0.5, easeOutCubic)
    ),
    ico.pos([3, -1, 0], 2),
    ico.rot([0, tau / 2, 0], 2),
    tetra.pos([-3, 1, 0], 2),
    tetra.rot([0, tau * 1.1, tau * 0.1], 2)
  )

  const circle = new Circle({
    fill: 'white',
  })
  const svg = new SVG({
    svg: geosvg,
    compositeOperation: 'source-in',
  })

  view.add(new Node({ cache: true }).add(circle).add(svg))

  yield* all(
    chain(
      all(delay(0.5, circle.size(800, 1)), draw(svg, 0.2), txt.opacity(0, 1)),
      waitFor(1),
      circle.size(0, 1)
    ),
    tween(3, (t) => {
      t = easeInOutCubic(t)
      camera.position.z = map(4, 7, t)
      ico.rotation.y = map(0, tau, t)
      tetra.rotation.y = map(tau * 1.1, 0, t)
    })
  )

  svg.remove()

  yield* tween(1, (t) => {
    t = easeInExpo(t)
    camera.rotation.x = map(0, tau / 4, t)
  })

  const preset = {
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
  }

  const origin = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ] as PossibleVector2[]

  const quad = new Line({
    points: origin,
    stroke: 'white',
    lineWidth: 8,
    ...preset,
  })

  let a = 400
  let b = 300

  let theta = 60
  let phi = 70

  function compute() {
    const points: [number, number][] = []
    points[0] = [a, 0]
    points[1] = [b * cos(theta), b * sin(theta)]
    points[2] = [a * cos(theta + phi), a * sin(theta + phi)]
    points[3] = [b * cos(180 + phi), b * sin(180 + phi)]
    points[4] = points[0]
    return points
  }

  view.add(quad)

  const txtProps = {
    fill: 'white',
    fontSize: 64,
  }

  const letters = [
    new Txt({
      text: 'A',
      ...txtProps,
    }),
    new Txt({
      text: 'B',
      ...txtProps,
    }),
    new Txt({
      text: 'C',
      ...txtProps,
    }),
    new Txt({
      text: 'D',
      ...txtProps,
    }),
  ]

  quad.points(compute())

  const group = new Node({})

  letters.forEach((letter, i) => {
    group.add(letter)
    letter.opacity(0).position([quad.parsedPoints()[i].x - 40, quad.parsedPoints()[i].y - 80])
  })

  view.add(group)

  quad.points(origin)

  yield* all(
    quad.points(compute(), 1),
    ...letters.map((letter) => letter.opacity(1, 1))
  )

  const pt = new Circle({
    size: 16,
    fill: 'white',
  })

  pt.scale(0)

  view.add(pt)

  yield* all(
    chain(
      tween(1, (t) => {
        phi = easeInOutCubic(t, 70, 50)
        quad.points(compute())
        letters.forEach((letter, i) => letter.position([quad.parsedPoints()[i].x - 40, quad.parsedPoints()[i].y - 80]))
      }),
      tween(1, (t) => {
        theta = easeInOutCubic(t, 60, 100)
        quad.points(compute())
        letters.forEach((letter, i) => letter.position([quad.parsedPoints()[i].x - 40, quad.parsedPoints()[i].y - 80]))
      })
    ),
    quad.rotation(-30, 2, easeInOutCubic),
    group.rotation(-30, 2, easeInOutCubic),
    ...letters.map(letter => letter.rotation(30, 2)),
    delay(1, pt.scale(1, 1))
  )

  const lines = [
    new Line({
      points: [
        [0, 0],
        [0, 0],
      ],
      stroke: '#69C3FF',
      ...preset,
    }),
    new Line({
      points: [
        [0, 0],
        [0, 0],
      ],
      stroke: '#FF738A',
      ...preset,
    }),
    new Line({
      points: [
        [0, 0],
        [0, 0],
      ],
      stroke: '#69C3FF',
      ...preset,
    }),
    new Line({
      points: [
        [0, 0],
        [0, 0],
      ],
      stroke: '#FF738A',
      ...preset,
    }),
  ]

  const net = new Node({})

  lines.forEach((line) => net.add(line))

  view.add(net)

  yield* all(
    pt.size(8, 1),
    ...letters.map(letter => letter.opacity(0, 1)),
    ...lines.map((line, i) =>
      delay(i * 0.1, line.points([[0, 0], quad.points()[i]], 1))
    ),
    ...lines.map((line, i) => delay(i * 0.1, line.lineWidth(8, 1))),
    net.rotation(-30, 1),
  )

  yield* waitFor(2.5)

  const abo = new Line({
    points: [
      [0, 0],
      quad.points()[0],
      quad.points()[1],
      [0, 0]
    ]
  })

  const cdo = new Line({
    points: [
      [0, 0],
      quad.points()[2],
      quad.points()[3],
      [0, 0]
    ]
  })

  abo.rotation(-30)
  cdo.rotation(-30)

  view.add(abo)

  yield* all(
    abo.fill('white', 1),
    pt.size(0, 1),
    ...lines.map(line => line.lineWidth(0, 1))
  )

  view.add(cdo)

  yield* cdo.fill('white', 1)

  // yield* waitFor(10)
})
