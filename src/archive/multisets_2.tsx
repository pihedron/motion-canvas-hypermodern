import {
  Circle,
  ComponentChildren,
  Img,
  makeScene2D,
  Rect,
  SVG,
  Txt,
  Path,
  Code,
  LezerHighlighter,
  insert,
  Node,
  Polygon,
  Spline,
  word,
  remove,
  TxtProps,
} from '@motion-canvas/2d'
import {
  all,
  chain,
  createRef,
  DEFAULT,
  delay,
  sequence,
  waitFor,
  easeOutBounce,
  waitUntil,
  any,
  loop,
  linear,
} from '@motion-canvas/core'

import { BinaryTree, Tree } from '../components/BinaryTree'
import { List } from '../components/List'
import { Composite } from '../components/Composite'
import { Pitex } from '../components/Pitex'

import { draw } from '../functions/draw'

import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { parser as py } from '@lezer/python'
import { parser as rs } from '@lezer/rust'

import model from '../model.svg?raw'
import adding from '../adding.svg?raw'
import pairs from '../pairs.svg?raw'
import binary from '../binary.svg?raw'

import olevel from '../olevel.png'
import theorem from '../theorem.png'

const txtProps: TxtProps = {
  fill: 'white',
  fontFamily: 'JetBrains Mono',
  fontSize: 48,
}

const MyStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#EACD61' },
  { tag: tags.bool, color: '#EACD61' },
  { tag: tags.variableName, color: '#FF738A' },
  { tag: tags.className, color: '#FF738A' },
  { tag: tags.number, color: '#FF955C' },
  { tag: tags.string, color: '#3CEC85' },
  { tag: [tags.operator], color: 'grey' },
  { tag: [tags.operatorKeyword], color: '#EACD61' },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.propertyName,
      tags.macroName,
      tags.bracket,
    ],
    color: '#B78AFF',
  },
  { tag: tags.bracket, color: '#e683e7' },
  { tag: [tags.punctuation, tags.angleBracket], color: 'grey' },
  { tag: tags.comment, color: '#404080' },
  { tag: tags.function(tags.variableName), color: '#5dc3ff' },
])

const python = new LezerHighlighter(py, MyStyle)
const rust = new LezerHighlighter(rs, MyStyle)

Code.defaultHighlighter = python

export default makeScene2D(function* (view) {
  function add(...nodes: ComponentChildren[]) {
    for (const node of nodes) {
      view.add(node)
    }
  }

  function pitex(tex: string) {
    return (<Pitex tex={tex} fontSize={80}></Pitex>) as Pitex
  }

  function rect(): Rect {
    return new Rect({
      fill: 'white',
      width: 80,
      height: 0,
      stroke: 'white',
    })
  }

  yield* waitUntil('explore')

  const comp = new Composite({ powers: [1, 4, 1, 3, 1] })
  add(comp)

  comp.y(-2 * 80)

  yield* comp.create(1)

  yield* waitUntil('pause')

  yield* comp.change([0, 0, 0, 0, 0], 1)

  const eq = new Pitex({ fontSize: 128 })
  add(eq)

  eq.pi('60')

  yield* eq.write('white', 0.5)
  yield* eq.y(-160, 0.5)

  const mod = new SVG({ svg: model })
  add(mod)

  yield* draw(mod, 0.1)

  yield* waitUntil('multiply')
  eq.fill('white')
  yield* all(mod.x(-400, 1), eq.tex('60 \\times 10', 1))

  const adn = new SVG({ svg: adding })
  add(adn)

  adn.x(280)

  yield* draw(adn, 0.1)

  yield* waitUntil('this')
  yield* all(eq.opacity(0, 0.5), mod.opacity(0, 0.5), adn.opacity(0, 0.5))

  mod.remove()
  adn.remove()

  eq.y(0).opacity(1).fill(null).pi('n^a @times n^b = n^{a+b}')

  yield* eq.write('white', 1)

  yield* waitUntil('visually')
  yield* eq.opacity(0, 1)

  comp.powers([0, 3, 1, 1]).y(-3 * 80)

  const other = new Composite({ powers: [1, 1, 0, 2, 1] })
  add(other)

  other.y(2 * 80)

  const mapping = ['#FF738A', '#FF955C', '#eacc5f', '#3CEC85', '#69C3FF']

  yield* all(comp.create(1), other.create(1))

  yield* all(comp.shade(mapping, 0.5), other.shade(mapping, 0.5))

  yield* all(comp.shade([], 0.5), other.shade([], 0.5))

  const rects = [rect(), rect(), rect(), rect()]

  rects[0].x(-160).y(200).height(80)
  rects[1].x(-80).y(200).height(80)
  rects[2]
    .x(80)
    .y(240)
    .height(80 * 2)
  rects[3].x(160).y(200).height(80)

  for (const r of rects) {
    add(r)
    r.lineWidth(1)
  }

  other.remove()

  const verts = [-200, 40, -80, -200]

  yield* all(...rects.map((r, i) => delay(0, r.y(verts[i], 1))))

  yield* waitUntil('finding')
  const group = new Node({})
  comp.remove()
  group.add(comp)
  rects.forEach((rect) => group.add(rect))
  add(group)

  yield* group.y(80, 1)
  yield* all(...rects.map((rect) => rect.opacity(0, 1)))
  add(other)
  other.opacity(0)
  yield* other.opacity(1, 1)

  yield* waitUntil('superimposing')

  yield* other.y(-160, 1)

  yield* waitUntil('union')

  const py = new Code({})
  add(py)
  py.y(320)

  eq.fontSize(64).y(-320).opacity(1).pi('@text{lcm}(945, 3234) = 145530')

  yield* all(
    eq.write('white', 1),
    py.code('for p in primes: LCM[p] = max(A[p], B[p])', 1)
  )
  yield* waitFor(2)
  yield* all(py.code('', 1), eq.unwrite(1))

  yield* waitUntil('hcf')
  eq.fill(null).pi('@gcd(945, 3234) = 21')
  yield* eq.write('white', 1)
  yield* waitFor(1)

  comp.hide()

  yield* all(other.opacity(0.5, 1), comp.opacity(0.5, 1))

  const txt = new Txt(txtProps)
  add(txt)

  txt.x(-80).y(-120).fill('black').scale(0).text('3')

  yield* txt.scale(1, 0.5)
  waitFor(1)
  yield* all(txt.text('7', 0.5), txt.x(80, 1))

  yield* txt.scale(0, 0.5)
  yield* py.code('for p in primes: HCF[p] = min(A[p], B[p])', 1)
  yield* waitFor(0.5)
  rects.forEach((rect) => rect.remove())
  other.remove()
  add(other)
  yield* all(
    eq.unwrite(1),
    other.opacity(0, 1),
    comp.opacity(1, 1),
    comp.change([1, 3, 1], 1),
    comp.childAs<Rect>(4).width(0, 1),
    py.code('', 1)
  )

  yield* waitUntil('stretch')
  eq.fill(null).pi('270^2')
  yield* all(eq.write('white', 1), comp.scale([1, 2], 1))

  yield* waitFor(1)
  eq.fill('white')
  yield* eq.tex(
    '\\{2 \\rightarrow 1, 3  \\rightarrow 3, 5  \\rightarrow 1\\} \\times 2',
    1
  )

  yield* waitUntil('however')
  yield* all(eq.opacity(0, 1), comp.scale(1, 1))

  eq.opacity(1).fill(null).pi('270 + 2 = 2^4 @times 17^1')

  yield* all(eq.write('white', 1), comp.change([4, 0, 0, 0, 0, 0, 1], 1))

  yield* waitUntil('one')
  yield* all(eq.unwrite(1), comp.scale(0, 1))

  yield* waitUntil('problem')
  const olvl = new Img({ src: olevel })
  add(olvl)

  olvl.opacity(0).scale(0).rotation(90).width(800)

  yield* all(olvl.opacity(1, 1), olvl.scale(1, 1), olvl.rotation(0, 1))

  yield* waitFor(2)

  yield* olvl.height(0, 1)

  eq.y(0).pi('@gcd(A, B) = 271 @land @text{lcm}(A, B) = 1626')

  yield* eq.write('white', 1)

  yield* waitUntil('ponder')
  const pa = new SVG({ svg: pairs })
  add(pa)

  yield* all(eq.opacity(0, 1), draw(pa, 0.15))

  yield* waitUntil('birth')
  yield* pa.opacity(0, 1)

  pa.remove()

  const the = new Img({ src: theorem })
  add(the)

  the.scale(0)

  yield* the.scale(1, 1)

  yield* waitUntil('look')
  yield* the.scale(0, 1)

  yield* waitUntil('find')
  txt
    .scale(0)
    .opacity(1)
    .fill('white')
    .x(0)
    .y(0)
    .fontSize(72)
    .text('find the number of unique possible values')
  yield* txt.scale(1, 1, easeOutBounce)
  yield* waitFor(0.5)
  yield* txt.opacity(0, 1)
  yield* waitFor(3)
  eq.opacity(1).pi('@gcd(A, B) = 50 @land @text{lcm}(A, B) = 4200')
  yield* eq.write('white', 1)
  yield* waitFor(2)
  yield* eq.unwrite(1)

  yield* waitUntil('divide')
  eq.pi('@frac{4200}{50}')
  yield* eq.write('white', 1)
  const eq2 = pitex('= 84')
  add(eq2)

  eq2.x(80).fill('white').opacity(0)

  yield* all(eq.x(-140, 1), eq2.opacity(1, 1))

  yield* waitFor(4)
  yield* all(eq.opacity(0, 1), eq2.opacity(0, 1))

  yield* waitFor(4)
  eq.fill(null).x(0).y(0).opacity(1).pi('84 = 2^2 @times 3^1 @times 7^1')
  yield* eq.write('white', 1)

  yield* waitUntil('distinct')
  const parent = eq.childAs(0).childAs(0)
  yield* all(
    parent.childAs<Path>(3).fill('#22ECDB', 1),
    parent.childAs<Path>(6).fill('#FF738A', 1),
    parent.childAs<Path>(9).fill('#EACD61', 1)
  )

  yield* waitFor(1)

  yield* eq.scale(0, 1)

  eq.fill('white').pi('2^3')

  const bin = new SVG({ svg: binary })
  add(bin)

  yield* all(
    chain(eq.scale(1, 1), waitFor(2)),
    draw(bin, 0.1)
  )
  yield* all(
    eq.opacity(0, 1),
    bin.opacity(0, 1)
  )
  yield* waitFor(2)

  eq.fill(null).opacity(1).pi('@frac{@text{lcm}}{@gcd} = A @cup B - A @cap B')

  yield* eq.write('white', 3)

  const box = new Rect({
    // width: 1280,
    // height: 160,
    layout: true,
    padding: [24, 32, 24],
    fill: '#182030',
    radius: 16,
  })
  add(box)
  box.add(txt)
  txt
    .text(
      'The symmetric difference of sets\nonly includes elements unique to each set.'
    )
    .opacity(1)
    .fontSize(48)
    .fill('#bbbbdd')
  box.top([0, 540])

  yield* box.y(320, 1)
  yield* waitFor(3)
  yield* box.top([0, 540], 1)
  yield* eq.unwrite(1)

  eq.pi(`n(A @cap B' @cap A' @cap B) > 0`)

  yield* eq.write('white', 1)
  yield* waitFor(2)
  yield* eq.unwrite(1)

  yield* waitUntil('unique')
  yield* waitFor(2)
  eq.pi('A @times B = B @times A')
  yield* eq.write('white', 1)
  yield* waitFor(2)
  yield* eq.scale(0, 0.5)
  eq.fill('white').pi('2^{3 - 1} = 4')
  yield* eq.scale(1, 0.5)
  yield* waitFor(1)
  yield* eq.scale(0, 1)

  py.code('if hcf == lcm: return 1').x(0).y(0).scale([0, 1])

  yield* py.scale(1, 1)
  yield* waitFor(4)
  yield* py.opacity(0, 1)
})
