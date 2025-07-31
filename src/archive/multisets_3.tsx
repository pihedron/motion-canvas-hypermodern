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

import { draw, paint } from '../functions/draw'

import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { parser as py } from '@lezer/python'
import { parser as rs } from '@lezer/rust'

import difference from '../difference.svg?raw'
import universal from '../universal.svg?raw'
import grapple from '../grapple.svg?raw'
import minus from '../minus.svg?raw'
import parallels from '../parallels.svg?raw'
import connections from '../connections.svg?raw'
import subscribe from '../subscribe.svg?raw'

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

  yield* waitUntil('derived')

  const py = new Code({})
  add(py)
  py.fontSize(64).code('not A[x]').scale(0)

  yield* py.scale(1, 1)
  yield* py.code('1 - A[x]', 1)
  yield* waitUntil('worked')
  yield* py.code('max(min(A[x], 1 - B[x]), min(1 - A[x], B[x]))', 1)
  yield* py.code(
    `\
A[x], B[x] = 2, 0
max(min(A[x], 1 - B[x]), min(1 - A[x], B[x]))`,
    1
  )
  yield* waitFor(2)
  yield* py.code('max(min(2, 1 - 0), min(1 - 2, 0))', 1)
  yield* py.code('max(min(2, 1), min(-1, 0))', 1)
  yield* py.code('max(1, -1)', 1)
  yield* py.code('1', 1)
  yield* py.code('1 != abs(2 - 0)', 1)
  yield* py.code('1 != 2', 1)

  yield* waitUntil('purpose')
  yield* py.opacity(0, 1)
  const diff = new SVG({ svg: difference })
  add(diff)

  yield* draw(diff, 0.3)
  yield* waitFor(2)
  yield* diff.opacity(0, 1)

  diff.remove()

  yield* waitUntil('method')
  const eq = pitex(`A'`)
  add(eq)

  eq.fontSize(64)

  yield* eq.write('white', 1)


  py.code('not A[x]').y(80)

  yield* all(
    py.opacity(1, 1),
    py.y(160, 1)
  )

  yield* waitFor(1)

  const txt = new Txt(txtProps)
  add(txt)

  txt.text('We never asked what this means?').fontSize(64).y(-80).opacity(0)

  yield* all(
    txt.opacity(1, 1),
    txt.y(-160, 1)
  ) 

  yield* waitFor(2)
  const uni = new SVG({ svg: universal })
  add(uni)
  yield* all(
    txt.opacity(0, 1),
    py.opacity(0, 1),
    eq.unwrite(1),
    draw(uni, 0.1)
  )

  yield* waitFor(2)
  yield* uni.opacity(0, 1)
  uni.remove()
  yield* waitFor(1)
  txt.text('"To get better, you have to\n learn to prove yourself wrong."').y(0)
  yield* txt.opacity(1, 1)

  yield* waitUntil('correctness')
  yield* txt.opacity(0, 1)

  const grap = new SVG({ svg: grapple })
  add(grap)

  yield* draw(grap, 0.2)

  yield* waitFor(1)

  yield* all(
    grap.scale(0, 1),
    grap.opacity(0, 1)
  )

  txt.text(':(')
  yield* txt.opacity(1, 1)
  yield* waitFor(2)
  yield* txt.opacity(0, 1)

  yield* waitFor(1)

  txt.text('Find the difference between 1 and 70.').opacity(1).scale(0)
  yield* txt.scale(1, 1)
  
  yield* waitFor(1)
  yield* txt.scale(0, 1)

  py.code('- min(1, 70)').y(0)
  yield* py.opacity(1, 1)
  yield* py.code('max(1, 70) - min(1, 70)', 1)
  yield* py.code('70 - 1', 1)
  yield* py.opacity(0, 1)
  yield* waitFor(1)

  eq.y(360).pi('4200 @div 50 = 84')

  const minu = new SVG({ svg: minus })
  add(minu)

  yield* all(
    paint(minu, 0.3),
    delay(1, eq.write('white', 3))
  )
  
  yield* waitFor(1)
  
  yield* all(
    minu.opacity(0, 1),
    minu.y(-80, 1),
    eq.opacity(0, 1),
    eq.y(360 - 80, 1),
  )
  
  minu.remove()
  yield* waitFor(1)

  const para = new SVG({ svg: parallels })
  add(para)

  yield* draw(para, 0.1)

  yield* waitFor(2)

  yield* para.opacity(0, 1)

  eq.y(0).opacity(1).pi('@text{min}(a, b) = @frac{a + b - @sqrt{(a-b)^2}}{2}')

  yield* eq.write('white', 1)
  yield* waitFor(2)
  yield* eq.scale(0, 1)
  eq.fill('white').pi('@text{max}(a, b) = @frac{a + b + @sqrt{(a-b)^2}}{2}')
  yield* eq.scale(1, 1)
  yield* waitFor(2)
  yield* eq.opacity(0, 1)

  yield* waitUntil('connections')
  const con = new SVG({ svg: connections })
  add(con)

  yield* draw(con, 0.2)
  yield* con.opacity(0, 0.5)

  const sub = new SVG({ svg: subscribe })
  add(sub)

  yield* draw(sub, 0.1)

  yield* waitFor(1)
})