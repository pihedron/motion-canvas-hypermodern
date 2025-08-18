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
import { draw } from '../functions/draw'
import { fill } from 'three/src/extras/TextureUtils'
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

const OFFWHITE = '#fcf1c9'
const fontFamily = 'Google Sans'

function title(text: string) {
  return new Txt({
    text,
    fill: OFFWHITE,
    fontFamily,
    fontSize: 64,
  })
}

const preset = {
  fill: OFFWHITE,
  fontFamily,
  fontSize: 64,
}

export default makeScene2D(function* (view) {
  const line1 = 'They say in every library there is a single book'
  const line2 = 'that can answer the question that burns like a fire in the mind.'

  const txt1 = new Spletters({})
  txt1.edit(line1, preset).offset([0, 1])
  view.add(txt1)

  const txt2 = new Spletters({})
  txt2.edit(line2, preset).offset([0, -1])
  view.add(txt2)

  yield* txt1.show(2)
  yield* txt2.show(2)
  yield* all(
    ...txt2.select('fire').map(l => l.fill('#ff6040', 1))
  )
  yield* txt2.select('.')[0].y(514, 1, easeOutBounce)
  yield* txt2.select('.')[0].opacity(0, 1)
  yield* waitFor(1)
  yield* all(
    txt1.hide(1),
    txt2.hide(1)
  )

  yield* waitFor(1)
})
