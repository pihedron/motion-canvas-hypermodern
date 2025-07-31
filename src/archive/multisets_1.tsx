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

import complement from '../complement.svg?raw'
import subtraction from '../subtraction.svg?raw'
import everything from '../everything.svg?raw'
import relattive from '../relative.svg?raw'
import programmer from '../programmer.svg?raw'
import filter from '../filter.svg?raw'
import intuition from '../intuition.svg?raw'
import wrong from '../wrong.svg?raw'
import { TxtLeaf } from '@motion-canvas/2d/lib/components/TxtLeaf'

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
  const group = createRef<Rect>()
  const txt = createRef<Txt>()

  function add(...nodes: ComponentChildren[]) {
    for (const node of nodes) {
      view.add(node)
    }
  }

  function pitex(tex: string) {
    return (<Pitex tex={tex} fontSize={80}></Pitex>) as Pitex
  }

  add(
    <Rect ref={group}></Rect>,
    <Txt
      ref={txt}
      fontFamily={'JetBrains Mono'}
      fontSize={80}
      y={360}
      stroke={'white'}
    ></Txt>
  )

  const eq = pitex(`A'`)
  eq.fontSize(60).y(360)
  add(eq)

  yield* waitFor(0.5)

  const comp = new SVG({ svg: complement })
  add(comp)

  yield* all(delay(0.5, eq.write('white', 0.5)), draw(comp, 0.1))

  yield* waitFor(1)

  yield* all(comp.opacity(0, 1), eq.opacity(0, 1))

  eq.opacity(1).scale(0).y(0).fontSize(80)

  yield* eq.scale(1, 0.5)

  yield* waitFor(1)

  yield* eq.scale(0, 0.5)

  eq.pi(`A @cap B'`)
  eq.fill('white')

  yield* eq.scale(1, 0.5)

  const sub = new SVG({ svg: subtraction })
  add(sub)

  yield* all(draw(sub, 0.2), eq.y(360, 0.5))

  yield* all(sub.opacity(0, 0.5), eq.opacity(0, 0.5))

  const ever = new SVG({ svg: everything })
  add(ever)

  yield* all(draw(ever, 0.08))

  yield* waitFor(0.5)
  txt().text('sets become events').fill('white').opacity(0).x(0).y(0)

  yield* all(ever.opacity(0, 0.5), txt().opacity(1, 0.5))

  yield* waitFor(1)

  yield* txt().opacity(0, 0.5)

  txt().text(`the size of a set doesn't matter`)

  yield* txt().opacity(1, 0.5)

  yield* waitFor(0.5)

  yield* txt().opacity(0, 0.5)

  yield* waitFor(1)

  const rel = new SVG({ svg: relattive })
  add(rel)

  eq.x(560).opacity(1).fill(null).pi('P(A) = @frac{n(A)}{n(U)}')

  yield* all(draw(rel, 0.3), eq.write('white', 2))

  yield* waitFor(1)

  yield* all(rel.opacity(0, 0.5), eq.opacity(0, 0.5))

  eq.x(0).y(0).opacity(1).fill(null).pi('0 @le p @le 1')

  yield* eq.write('white', 1)

  yield* waitFor(2)

  yield* eq.opacity(0, 1)

  yield* waitFor(0.5)

  txt().text('').opacity(1)

  yield* txt().text('absolute certainty = 1', 1)

  yield* waitFor(0.5)

  yield* all(txt().y(40, 1), txt().opacity(0, 1))

  yield* waitFor(0.5)

  eq.opacity(1).pi('n(A) + n(B) = n(A @cup B) + n(A @cap B)')

  yield* eq.write('white', 1)

  yield* waitFor(0.5)

  yield* eq.scale(0, 0.5)

  eq.fill('white').pi('P(A) + P(B) = P(A @cup B) + P(A @cap B)')

  yield* eq.scale(1, 0.5)

  yield* waitFor(2)

  yield* eq.scale(0, 0.5)

  eq.pi('P(A @cap B) = P(A) @times P(B)')
  txt().y(360).text(`events don't affect each other`)

  yield* all(eq.scale(1, 0.5), txt().opacity(1, 0.5))

  yield* waitFor(1)

  yield* all(eq.scale(0, 0.5), txt().opacity(0, 0.5))

  txt().text('events never happen together')
  eq.pi('P(A @cap B) = 0')

  yield* all(eq.scale(1, 0.5), txt().opacity(1, 0.5))

  yield* waitFor(2)

  eq.stroke('white')

  yield* all(txt().scale(2, 1), txt().opacity(0, 1), eq.unwrite(1))

  yield* waitFor(0.5)

  const pro = new SVG({ svg: programmer })
  add(pro)

  yield* draw(pro, 0.1)

  yield* waitFor(1)

  yield* pro.opacity(0, 0.5)

  comp.remove()
  sub.remove()
  ever.remove()
  rel.remove()
  pro.remove()

  yield* waitFor(10)

  txt().text('Set operations are logic gates.').scale(1).y(0)

  yield* txt().opacity(1, 1)

  yield* waitFor(1)

  yield* txt().opacity(0, 1)

  const code = new Code({ code: 'members = defaultdict(bool)' })
  add(code)

  code.opacity(0)

  yield* code.opacity(1, 1)
  yield* waitFor(2)
  yield* code.selection(code.findFirstRange('bool'), 1)
  yield* waitFor(0.5)
  yield* code.selection(DEFAULT, 1)
  yield* waitFor(2)
  yield* code.code('if friendly["Quetzali"]: print(":)")', 1)
  yield* waitFor(2)
  yield* code.code('friendly["Vengir"] = True', 1)
  yield* waitFor(0.5)
  yield* code.code('friendly["Vengir"] = False', 1)
  yield* waitFor(1)
  yield* code.opacity(0, 1)

  code.code('prime[2]')

  yield* code.opacity(1, 1)
  yield* waitFor(1)
  yield* code.code('prime[2] # True', 1)
  yield* waitFor(0.5)
  yield* code.code('prime[1] # False', 1)
  yield* waitFor(1)
  yield* code.selection(code.findFirstRange('False'), 1)
  yield* waitFor(1)
  yield* code.selection(DEFAULT, 1)
  yield* code.opacity(0, 0.5)

  const fil = new SVG({ svg: filter })
  add(fil)

  yield* draw(fil, 0.1)
  yield* waitFor(1)
  yield* fil.opacity(0, 1)

  fil.remove()

  code
    .x(0)
    .y(160)
    .code(
      `\
for x in U:
    U[x] = A[x] and not B[x] or not A[x] and B[x]`
    )
  eq.x(0).y(-160).fill(null).pi(`A @cap B' @cup A' @cap B`)

  yield* all(code.opacity(1, 1), eq.write('white', 1))

  yield* all(
    code.selection(code.findAllRanges('and')[0], 0.5),
    eq.childAs(0).childAs(0).childAs<Path>(1).fill('#EACD61', 0.5)
  )

  yield* all(
    ...eq
      .childAs(0)
      .childAs(0)
      .children()
      .map((x: Path) => x.fill('white', 0.5)),
    code.selection(code.findAllRanges('not')[0], 0.5),
    eq.childAs(0).childAs(0).childAs<Path>(3).fill('#EACD61', 0.5)
  )

  yield* all(
    ...eq
      .childAs(0)
      .childAs(0)
      .children()
      .map((x: Path) => x.fill('white', 0.5)),
    code.selection(code.findAllRanges('or')[1], 0.5),
    eq.childAs(0).childAs(0).childAs<Path>(4).fill('#EACD61', 0.5)
  )

  yield* all(
    ...eq
      .childAs(0)
      .childAs(0)
      .children()
      .map((x: Path) => x.fill('white', 0.5)),
    code.selection(code.findAllRanges('not')[1], 0.5),
    eq.childAs(0).childAs(0).childAs<Path>(6).fill('#EACD61', 0.5)
  )

  yield* all(
    ...eq
      .childAs(0)
      .childAs(0)
      .children()
      .map((x: Path) => x.fill('white', 0.5)),
    code.selection(code.findAllRanges('and')[1], 0.5),
    eq.childAs(0).childAs(0).childAs<Path>(7).fill('#EACD61', 0.5)
  )

  yield* all(
    ...eq
      .childAs(0)
      .childAs(0)
      .children()
      .map((x: Path) => x.fill('white', 0.5)),
    code.selection(DEFAULT, 1)
  )

  yield* code.selection(code.findFirstRange(/A.+\]/g), 1)
  yield* waitFor(2)
  yield* code.selection(code.findFirstRange(/U\[x\]/g), 1)
  yield* waitFor(1)
  yield* code.selection(DEFAULT, 1)

  yield* waitFor(1)

  yield* all(
    code.x(-400, 1),
    code.opacity(0, 1),
    eq.x(400, 1),
    eq.opacity(0, 1)
  )

  const int = new SVG({ svg: intuition })
  add(int)

  yield* draw(int, 0.1)

  yield* int.opacity(0, 1)

  int.remove()

  yield* waitFor(1)

  txt().text('What is a set plus a set?').x(0).y(0)

  yield* txt().opacity(1, 1)
  yield* waitFor(1.5)
  yield* all(txt().scale(0.5, 1), txt().y(-360, 1))

  eq.scale(1).opacity(1).x(0).y(0).pi('A @cup B = A + B')

  yield* eq.write('white', 1)
  yield* waitFor(0.5)
  eq.fill('white')
  yield* eq.tex('A \\cap B = A \\times B', 1)

  yield* waitFor(2)

  yield* all(
    eq.fill('red', 1),
    chain(eq.x(20, 0.25), eq.x(-20, 0.25), eq.x(20, 0.25), eq.x(-20, 0.25))
  )

  yield* eq.opacity(0, 1)

  yield* waitFor(1)

  eq.opacity(1).fill(null).pi('A @cap (B @cup C) = A @cap B @cup A @cap C')

  yield* eq.write('white', 1)
  yield* waitFor(0.5)
  yield* eq.scale(0, 0.5)
  eq.fill('white').pi('A @times (B + C) = A @times B + A @times C')
  yield* eq.scale(1, 0.5)

  yield* waitFor(2)

  yield* eq.bottom([0, 540], 1, easeOutBounce)
  yield* all(eq.scale([1, 0], 1), eq.bottom([0, 540], 1))

  yield* waitFor(4)

  code.code('A or B').fontSize(64).x(0).y(0)

  yield* code.opacity(1, 1)
  yield* waitFor(0.5)
  yield* code.code('A + B', 1)
  yield* waitFor(3)
  yield* code.code(
    `\
A, B = 1, 1
A + B`,
    1
  )
  yield* waitFor(2)
  yield* code.code('1 + 1', 1)
  yield* waitFor(1)
  yield* all(code.code('1 + 1 = 10', 1), txt().text('BINARY OVERFLOW!', 1))
  yield* code.code('1 + 1 = 0', 1)

  yield* waitFor(2)

  yield* all(code.opacity(0, 1), txt().opacity(0, 1))

  yield* waitUntil('hero')

  code.code('').opacity(1)

  yield* code.code('min()', 0.5)
  yield* code.code('min()\nmax()', 0.5)

  yield* waitFor(1)

  yield* code.scale(0, 1)

  code.code('A or B')

  yield* waitUntil('fixes')
  yield* code.scale(1, 1)
  yield* code.code('max(A, B)', 1)
  yield* code.code('max(1, 1)', 1)
  yield* code.code('1', 1)

  yield* waitUntil('operators')
  yield* code.opacity(0, 1)

  yield* waitUntil('beyond')
  txt().x(0).y(0).opacity(1).scale(0).text('beyond binary')
  yield* txt().scale(1, 0.5)

  yield* waitUntil('scope')
  code.code('A = True')
  yield* txt().opacity(0, 1)
  yield* code.opacity(1, 1)
  yield* code.code('A = 69', 1)
  yield* code.opacity(0, 1)

  yield* waitUntil('instead')

  const pyfile = new Rect({
    width: 1440,
    height: 240,
    fill: '#182030',
    radius: 16,
    padding: [32, 32, 16],
    layout: true,
    direction: 'column',
    justifyContent: 'space-between',
  })

  add(pyfile)

  const pyname = new Txt({
    text: 'main.py',
    ...txtProps,
  })

  pyfile.add(pyname)
  pyfile.add(code)
  code.fontSize(64)

  const rsfile = new Rect({
    width: 1440,
    height: 240,
    fill: '#182030',
    radius: 16,
    padding: [32, 32, 16],
    layout: true,
    direction: 'column',
    justifyContent: 'space-between',
  })

  add(rsfile)

  const rsname = new Txt({
    text: 'main.rs',
    ...txtProps,
  })

  const rscode = new Code({ highlighter: rust, fontSize: 64 })

  rsfile.add(rsname)
  rsfile.add(rscode)

  pyfile.y(-160).scale(0.5).opacity(0)
  rsfile.y(160).scale(0.5).opacity(0)

  code.code('').opacity(1)
  yield* all(
    pyfile.scale(1, 1),
    pyfile.opacity(1, 1),
    rsfile.scale(1, 1),
    rsfile.opacity(1, 1)
  )
  yield* all(
    code.code('items = defaultdict(bool)', 1),
    rscode.code('let mut items = HashMap::<T, bool>()', 1)
  )
  yield* waitFor(1)
  yield* all(
    code.code('items = defaultdict(int)', 1),
    rscode.code('let mut items = HashMap::<T, u32>()', 1)
  )

  yield* waitUntil('coming')
  yield* all(
    pyfile.y(-200, 1),
    pyfile.opacity(0, 1),
    rsfile.y(200, 1),
    rsfile.opacity(0, 1)
  )

  txt().text('A set').opacity(1).scale(0)

  yield* txt().scale(1, 0.5)
  yield* txt().text('A set plus a set', 0.5)
  yield* waitFor(0.5)
  yield* txt().text('A set plus a set is a multiset.', 0.5)
  yield* waitFor(1)
  yield* txt().text(
    'You have to convert sets\nto multisets to avoid overflow.',
    1
  )

  yield* waitUntil('now')
  yield* txt().opacity(0, 0.5)
  add(code)
  code.code('count["Bardur"]').scale(0).opacity(0)
  yield* all(code.scale(1, 1), code.opacity(1, 1))
  yield* code.code('count["Bardur"] # 3', 1)
  yield* waitFor(1)
  yield* code.opacity(0, 1)

  yield* waitUntil('min and max')
  eq.fill(null).opacity(1).scale(1).y(0).pi(`A @cap B = @text{min}(A_x, B_x)`)
  yield* eq.write('white', 1)
  yield* waitFor(0.5)
  eq.fill('white')
  yield* eq.tex('A \\cup B = \\text{max}(A_x, B_x)', 1)

  yield* waitUntil('turns out')
  yield* eq.opacity(0, 1)
  eq.fill(null).opacity(1).pi(`A' = | A_x - 1 |`)
  yield* eq.write('white', 1)

  yield* waitUntil('verify')
  yield* eq.opacity(0, 1)
  code.code('A[x] and not B[x] or not A[x] and B[x]').y(40).opacity(0).scale(1)
  yield* all(code.opacity(1, 1), code.y(0, 1))
  yield* code.code(
    `\
max(min(A[x], 1 - B[x]), min(1 - A[x], B[x]))`,
    1
  )
  yield* code.code(
    `\
A[x], B[x] = 0, 1
max(min(A[x], 1 - B[x]), min(1 - A[x], B[x]))`,
    1
  )
  yield* code.code(
    `\
max(min(0, 1 - 1), min(1 - 0, 1))`,
    0.5
  )
  const wro = new SVG({ svg: wrong })
  add(wro)
  yield* all(
    chain(
      code.code(
        `\
max(min(0, 0), min(1, 1))`,
        0.5
      ),
      code.code(
        `\
max(0, 1)`,
        0.5
      ),
      code.code(
        `\
1`,
        0.5
      )
    ),
    draw(wro, 0.1)
  )

  yield* all(code.code('', 1), wro.opacity(0, 1))

  wro.remove()

  yield* code.code(
    `\
def xor(a, b)
  return a and not b or not a and b`,
    1
  )

  yield* waitUntil('not')
  yield* code.selection(code.findAllRanges(/not ./g), 1)
  yield* code.selection(DEFAULT, 0.5)
  yield* code.code(
    `\
def xor(a, b)
  return a and xor(1, b) or xor(1, a) and b`,
    1
  )
  yield* waitFor(1)
  yield* code.code('', 1)

  yield* waitUntil('addition')
  eq.fill(null).opacity(1).pi('A + B')
  yield* eq.write('white', 0.5)

  const quad = new Polygon({
    sides: 4,
    size: 480,
    radius: 40,
    fill: '#FF738A',
  })

  add(quad)

  quad.x(-500).scale(0)

  const tri = new Polygon({
    sides: 3,
    size: 480,
    radius: 40,
    fill: '#22ECDB',
  })

  add(tri)

  tri.x(500).scale(0)

  yield* all(
    tri.scale(1, 1),
    quad.scale(1, 1),
  )

  yield* any(
    waitFor(2),
    tri.rotation(360 * 4 / 3, 5),
    quad.rotation(360, 5),
  )

  yield* all(
    tri.x(0, 1),
    quad.x(0, 1),
    tri.scale(2, 1),
    quad.scale(2, 1),
  )

  eq.opacity(0)

  yield* all(
    tri.scale(10, 1),
    quad.scale(10, 1),
    tri.opacity(0, 1),
    quad.opacity(0, 1),
  )
})
