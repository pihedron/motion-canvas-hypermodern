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
  remove,
  replace,
  Spline,
  SVG,
  Txt,
  withDefaults,
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
    lang: 'typescript', // more languages supported than lezer
    theme: 'tokyo-night', // you can now choose themes
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

const Text = withDefaults(Txt, {
  fontFamily: 'Google Sans',
  fontSize: 64,
  fill: 'white',
})

export default makeScene2D(function* (view) {
  const code = new Code({ highlighter })

  view.add(code)

  yield* code.code.edit(1)`\
function example() {
  ${insert(`// This is a comment
  `)}console.log(${replace('"Hello!"', '"Goodbye!"')});
${remove(`  return 7;
`)}}
`
})
