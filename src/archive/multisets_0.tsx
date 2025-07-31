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
} from '@motion-canvas/2d'
import {
  all,
  chain,
  createRef,
  delay,
  sequence,
  waitFor,
} from '@motion-canvas/core'
import { BinaryTree, Tree } from '../components/BinaryTree'
import { List } from '../components/List'
import { Composite } from '../components/Composite'
import { Pitex } from '../components/Pitex'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { parser } from '@lezer/rust'

import monty from '../monty.svg?raw'
import intuitive from '../intuitive.svg?raw'
import boat from '../boat.svg?raw'
import union from '../union.svg?raw'
import intersection from '../intersection.svg?raw'

const MyStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#22ECDB' },
  { tag: tags.variableName, color: '#FF738A' },
  { tag: tags.className, color: '#FF738A' },
  { tag: tags.number, color: '#FF955C' },
  { tag: tags.string, color: '#3CEC85' },
  { tag: [tags.operator, tags.operatorKeyword], color: 'grey' },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.propertyName,
      tags.macroName,
    ],
    color: '#B78AFF',
  },
  { tag: tags.bracket, color: '#EACD61' },
  { tag: tags.punctuation, color: 'grey' },
])

Code.defaultHighlighter = new LezerHighlighter(parser, MyStyle)

export default makeScene2D(function* (view) {
  const group = createRef<Rect>()
  const a = createRef<Composite>()
  const b = createRef<Composite>()
  const rects = [
    createRef<Composite>(),
    createRef<Composite>(),
    createRef<Composite>(),
    createRef<Composite>(),
  ]
  const txt = createRef<Txt>()

  function add(...nodes: ComponentChildren[]) {
    for (const node of nodes) {
      view.add(node)
    }
  }

  function rect(index: number) {
    return (
      <Rect
        fill={'white'}
        width={80}
        height={0}
        stroke={'white'}
        ref={rects[index]}
      ></Rect>
    )
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
      lineWidth={2}
      lineDash={[400]}
      lineDashOffset={400}
    ></Txt>
  )

  const stuff = [
    <Composite ref={a} powers={[0, 3, 1, 1]} x={-40} y={-240}></Composite>,
    <Composite ref={b} powers={[1, 1, 0, 2, 1]} x={0} y={160}></Composite>,
    rect(0),
    rect(1),
    rect(2),
    rect(3),
  ]

  for (const x of stuff) {
    group().add(x)
  }

  yield* waitFor(1)
  yield* a().create(1)
  yield* b().create(1)

  yield* waitFor(1)

  rects[0]().x(-160).y(200).height(80)
  rects[1]().x(-80).y(200).height(80)
  rects[2]()
    .x(80)
    .y(240)
    .height(80 * 2)
  rects[3]().x(160).y(200).height(80)

  for (const rect of rects) {
    rect().lineWidth(1)
  }

  b().destroy()
  b().remove()

  const verts = [-200, 40, -80, -200]

  yield* all(...rects.map((rect, i) => delay(i / 2, rect().y(verts[i], 1))))

  yield* group().y(80, 1)

  txt().text('Just multiplication!')
  yield* txt().lineDashOffset(0, 1)
  yield* txt().fill('white', 0.5)

  yield* txt().opacity(0, 1)

  add(b())

  yield* group().x(640, 1)

  b().y(-160)

  const c = createRef<Composite>()
  add(<Composite ref={c} powers={[0, 3, 1, 1]} x={-600} y={-160}></Composite>)

  const tex1 = pitex('945')
  const tex2 = pitex('\\times 3234')
  const tex3 = pitex('= 3056130')

  tex2.x(0).y(360)
  tex1.right(tex2.left()).y(360)
  tex3.left(tex2.right().addX(24)).y(360)

  add(tex1, tex2, tex3)

  yield* all(c().create(1), tex1.write('white', 1))

  yield* waitFor(1)

  yield* all(b().create(1), tex2.write('white', 1))
  yield* waitFor(1)

  yield* tex3.write('white', 1)

  yield* waitFor(1)

  yield* all(tex1.opacity(0, 1), tex2.opacity(0, 1), tex3.opacity(0, 1))

  const d = createRef<Composite>()
  add(<Composite ref={d} powers={[1, 4, 1, 3, 1]}></Composite>)
  d().x(640).y(-160)

  yield* d().create(0)

  group().remove()

  yield* all(d().rotation(-15, 1), b().rotation(-15, 1), c().rotation(-15, 1))

  yield* waitFor(2)

  yield* all(d().rotation(0, 1), b().rotation(0, 1), c().rotation(0, 1))

  const mapping = ['#FF738A', '#FF955C', '#eacc5f', '#3CEC85', '#69C3FF']

  yield* all(
    b().shade(mapping, 1),
    c().shade(mapping, 1),
    d().shade(mapping, 1)
  )

  txt().remove()
  add(txt())
  txt().stroke(null)
  txt().lineWidth(0)
  txt().text('2')
  txt().opacity(1)
  txt().scale(0)
  txt().x(-160).y(-200)

  yield* txt().scale(1, 0.5)
  yield* all(txt().x(-80, 0.5), txt().text('3', 0.25))
  yield* all(txt().x(0, 0.5), txt().text('5', 0.25))
  yield* all(txt().x(80, 0.5), txt().text('7', 0.25))
  yield* all(txt().x(160, 0.5), txt().text('11', 0.25))
  yield* txt().scale(0, 0.5)

  yield* all(
    b().scale([1, 0.5], 0.5),
    c().scale([1, 0.5], 0.5),
    d().scale([1, 0.5], 0.5)
  )

  yield* all(
    b().scale([1, 1], 0.5),
    c().scale([1, 1], 0.5),
    d().scale([1, 1], 0.5)
  )

  txt().x(720).y(125)
  txt().text('3')

  yield* txt().scale(1, 0.5)
  yield* waitFor(1)
  yield* txt().scale(0, 0.5)

  yield* all(
    b().change([0, 0, 0, 0, 0], 1),
    c().change([0, 0, 0, 0], 1),
    d().shade([], 1)
  )

  tex1.x(0).y(360)
  tex1.opacity(1)
  tex1.fontSize(80)
  tex1.pi(
    '2 @times 3 @times 3 @times 3 @times 3 @times 5 @times 7 @times 7 @times 7 @times 11'
  )

  yield* all(d().x(0, 1), tex1.write('white', 2))

  yield* tex1.scale(0, 0.5)

  tex1.pi('3056130')
  tex1.fill('white')

  yield* tex1.scale(1, 0.5)

  yield* waitFor(1)

  yield* all(tex1.opacity(0, 1), tex1.y(400, 1))

  yield* all(d().y(-400, 1), d().scale(0.5, 1))

  txt().x(0).y(0)
  txt().text('Prime Factorisation')

  yield* txt().scale(1, 1)

  yield* waitFor(1)

  tex1.pi('2^1 @times 3^4 @times 5^1 @times 7^3 @times 11^1')
  tex1.opacity(1)
  tex1.y(320)
  tex1.fill(null)

  yield* tex1.write('white', 2)

  yield* waitFor(4)

  yield* txt().text('Number Theory', 1)

  yield* waitFor(2)

  yield* all(
    txt().opacity(0, 1),
    txt().y(80, 1),
    txt().rotation(5, 1),
    tex1.opacity(0, 1),
    tex1.y(400, 1),
    tex1.rotation(-5, 1)
  )

  yield* all(d().y(-160, 1), d().scale(1, 1))

  yield* waitFor(1)

  yield* all(txt().opacity(0, 1), tex1.opacity(0, 1), d().scale(0, 1))

  const left = (
    <Circle stroke={'white'} width={320} height={320} x={-80}></Circle>
  ) as Circle
  const right = (
    <Circle stroke={'white'} width={320} height={320} x={80}></Circle>
  ) as Circle

  const venn = (<Rect></Rect>) as Rect

  venn.add(left).add(right)

  add(venn)

  yield* all(left.lineWidth(8, 1), right.lineWidth(8, 1))

  yield* all(venn.x(-560, 0.5), venn.y(-240, 0.5))

  const svg = <SVG svg={monty}></SVG>

  add(svg)

  function* write(node: Node, duration: number) {
    const factor = 2

    const animations = []
    const paths = node.childAs(0).children() as Path[]
    const divisor = paths.length / factor
    const time = duration / divisor

    for (let i = 0; i < paths.length; i++) {
      paths[i]
        .stroke(paths[i].fill() ?? 'white')
        .lineWidth(8)
        .end(0)
      animations.push(delay((i * time) / factor, paths[i].end(1, time)))
      if (i <= 1) {
        animations.push(
          delay(
            ((i + 1) * time) / factor,
            paths[i].fill(paths[i].stroke(), time)
          ),
          delay(((i + 1) * time) / factor, paths[i].lineWidth(0, time))
        )
      }
    }

    yield* all(...animations)
  }

  yield* write(svg, 1)

  const code = (<Code></Code>) as Code
  code.y(240)

  add(code)

  yield* all(
    code.code('let mut set = HashSet::new();', 0.5),
    svg.x(480, 0.5),
    svg.y(-200, 0.5)
  )
  yield* waitFor(0.5)
  yield* code.code('let mut multiset = HashMap::new();', 0.5)

  group().removeChildren()
  group().remove()
  add(group())
  group().x(0).y(0)

  group().add(venn).add(svg).add(code)

  yield* waitFor(2)

  txt().zIndex(1)
  txt().x(0).y(0)
  txt().text('Multisets')
  txt().fontSize(100)
  txt().rotation(0)

  const list = (<List values={['6']}></List>) as List
  list.scale(2)
  list.rotation(-5)
  list.x(1200).y(600)
  add(list)

  tex1.scale(2)
  tex1.fontSize(60)
  tex1.x(-1000).y(-600)
  tex1.rotation(5)
  tex1.opacity(1)
  tex1.fill(null)
  tex1.pi('A @operatorname @Delta B = @{x @rightarrow |A_x - B_x|@}')
  tex1.zIndex(1)

  yield* all(
    group().scale(0.5, 1),
    group().rotation(160, 1),
    group().opacity(0.25, 1),
    list.x(600, 1),
    list.y(300, 1),
    list.scale(1, 1),
    tex1.x(-500, 1),
    tex1.y(-300, 1),
    tex1.scale(1, 1),
    tex1.write('white', 1),
    txt().opacity(1, 1)
  )

  yield* list.push('9', 0.5)

  yield* all(
    group().scale(1, 1),
    group().opacity(0, 1),
    list.x(1200, 1),
    list.y(600, 1),
    list.scale(2, 1),
    list.opacity(0, 1),
    tex1.x(-1000, 1),
    tex1.y(-600, 1),
    tex1.scale(2, 1),
    tex1.opacity(0, 1)
  )

  yield* waitFor(2)

  yield* all(txt().text('set but more OP', 1))

  yield* waitFor(1)

  yield* all(txt().y(80, 1), txt().opacity(0, 1))

  function *draw(drawing: SVG, time: number) {
    const paths = drawing.childAs(0).children() as Path[]
    paths.forEach((x) => [x.end(0), x.lineWidth(0)])
    yield* chain(...paths.map((x) => all(x.end(1, time), x.lineWidth(8, time))))
  }

  const drawing = <SVG svg={intuitive}></SVG> as SVG

  add(drawing)

  yield* draw(drawing, 0.1)

  yield* drawing.opacity(0, 1)

  drawing.remove()

  txt().y(0)
  txt().text('What is a set?')

  yield* txt().opacity(1, 1)

  yield* txt().scale(0, 1)

  txt().fontSize(60)
  txt().text('a collection of unique items')

  yield* txt().scale(1, 1)

  yield* waitFor(1)

  yield* txt().y(-160, 1)

  const tri = (
    <Polygon sides={3} size={160} fill={'#22ECDB'}></Polygon>
  ) as Polygon
  add(tri)

  const quad = (
    <Polygon sides={4} size={160} fill={'#FF738A'}></Polygon>
  ) as Polygon
  add(quad)

  const circ = (<Circle size={160} fill={'#EACD61'}></Circle>) as Circle
  add(circ)

  const shapes = [tri, quad, circ]

  for (const shape of shapes) {
    shape.stroke(shape.fill())
    shape.fill(null)
    shape.end(0)
    shape.y(160)
  }

  tri.x(-320)
  quad.x(0)
  circ.x(320)

  yield* all(...shapes.flatMap((x) => [x.end(1, 1), x.lineWidth(4, 1)]))
  yield* all(...shapes.map((x) => x.fill(x.stroke(), 1)))

  tex1
    .opacity(1)
    .scale(1)
    .x(0)
    .y(0)
    .rotation(0)
    .pi('@phantom{1} @neq @phantom{1}')

  yield* tex1.write('white', 1)
  yield* chain(...shapes.flatMap((x) => [x.scale(0.75, 0.5), x.scale(1, 0.5)]))

  yield* all(...shapes.map((x) => x.fill(null, 1)))

  yield* all(...shapes.flatMap((x) => [x.scale(2, 1), x.opacity(0, 1)]))

  const locus1: [number, number][] = [
    [-960, 0],
    [-480, -80],
    [480, 80],
    [960, 0],
  ]

  const locus2: [number, number][] = [
    [-960, 0],
    [-480, 80],
    [480, -80],
    [960, 0],
  ]

  const spline = (
    <Spline
      lineWidth={8}
      lineCap={'round'}
      stroke={'white'}
      points={locus1}
      y={-640}
    ></Spline>
  ) as Spline
  add(spline)

  const pirate = <SVG svg={boat}></SVG> as SVG
  add(pirate)

  pirate.x(0).y(-640-100).rotation(10)

  yield* all(
    txt().y(540, 1),
    txt().opacity(0, 1),
    spline.y(0, 1),
    spline.points(locus2, 1),
    pirate.y(-100, 1),
    pirate.rotation(-10, 1)
  )

  yield* all(spline.points(locus1, 1), pirate.rotation(10, 1))

  yield* all(spline.points(locus2, 1), pirate.rotation(-10, 1))

  yield* all(spline.points(locus1, 1), spline.end(0, 1), spline.lineWidth(0, 1), pirate.rotation(10, 1))

  yield* all(
    pirate.y(540, 1),
    pirate.opacity(0, 1)
  )

  txt().y(0).text('A set is a collection of unique items.')

  yield* txt().opacity(1, 1)

  yield* waitFor(1.5)

  yield* all(
    txt().opacity(0, 1),
    txt().scale(100, 1),
    txt().rotation(60, 1),
    txt().x(700, 1),
  )

  yield* waitFor(1)

  txt().scale(0).opacity(1).x(0).rotation(0).text('sets')

  yield* txt().scale(1, 0.5)
  yield* waitFor(1.5)
  yield* chain(
    txt().text('sets have', 0.5),
    txt().text('sets have operations', 0.5),
    txt().text('sets have operations associated with them', 0.5)
  )

  yield* waitFor(1)

  yield* all(
    txt().scale([1, 0], 0.5),
    txt().y(36, 0.5),
  )  

  txt().y(-36).text('3 fundamental operations')

  yield* all(
    txt().scale(1, 0.5),
    txt().y(0, 0.5)
  )

  yield* waitFor(1)

  yield* txt().opacity(0, 1)

  yield* waitFor(0.5)

  tex1.x(0).y(300).pi('A @cup B')

  const u = <SVG svg={union}></SVG> as SVG
  add(u)

  yield* all(
    tex1.write('white', 1),
    draw(u, 0.1),
  )

  yield* all(
    tex1.opacity(0, 0.5),
    u.opacity(0, 0.5)
  )

  tex1.opacity(1).pi('A @cap B')

  const n = <SVG svg={intersection}></SVG> as SVG
  add(n)

  yield* all(
    draw(n, 0.05),
    tex1.write('white', 1)
  )

  yield* waitFor(0.5)

  yield* all(
    tex1.opacity(0, 0.5),
    n.opacity(0, 0.5)
  )
})
