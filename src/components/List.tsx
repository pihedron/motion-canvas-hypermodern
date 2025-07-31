import { Rect, RectProps, signal, Txt } from '@motion-canvas/2d'
import { all, createRef, easeInCubic, easeOutCubic, SignalValue, SimpleSignal, ThreadGenerator } from '@motion-canvas/core'

const spacing = 12
const size = 128
const fontSize = 64

export interface ListProps extends RectProps {
  values: SignalValue<string[]>
}

export class List extends Rect {
  @signal()
  public declare readonly values: SimpleSignal<string[], this>

  public constructor(props: ListProps) {
    super({
      layout: true,
      gap: spacing,
      alignItems: 'center',
      radius: spacing,
      padding: spacing,
      ...props,
    })

    const values = this.values()
    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      this.add(
        <Rect fill={'#202020'} width={size} height={size} radius={spacing} layout justifyContent={'center'} alignItems={'center'} clip>
          <Txt text={value} fill={'white'} fontSize={fontSize} fontFamily={'JetBrains Mono'} stroke={'white'}></Txt>
        </Rect>
      )
    }
  }

  public *push(value: string, duration: number) {
    this.values().push(value)
    const paddingDuration = 0.25 * duration
    const sizeDuration = duration - paddingDuration

    const item = createRef<Rect>()
    const text = createRef<Txt>()

    yield* this.padding([spacing, spacing * 2, spacing, spacing], paddingDuration, easeInCubic)

    this.add(
      <Rect fill={'#202020'} width={0} height={0} radius={spacing} layout justifyContent={'center'} alignItems={'center'} clip ref={item}>
        <Txt text={value} fill={'white'} fontSize={0} fontFamily={'JetBrains Mono'} stroke={'white'} ref={text}></Txt>
      </Rect>
    )

    this.padding(12)

    yield* all(
      item().width(size, sizeDuration, easeOutCubic),
      item().height(size, sizeDuration, easeOutCubic),
      text().fontSize(fontSize, sizeDuration, easeOutCubic),
    )
  }

  public *pop(duration: number) {
    this.values().pop()
    const paddingDuration = 0.25 * duration
    const sizeDuration = duration - paddingDuration

    const children = this.getChildren()
    const last = children[children.length - 1] as Rect

    yield* all(
      last.width(0, sizeDuration, easeInCubic),
      last.height(0, sizeDuration, easeInCubic),
      (last.children()[0] as Txt).fontSize(0, sizeDuration, easeInCubic),
    )

    yield* this.padding([spacing, 0, spacing, spacing], paddingDuration, easeOutCubic)

    this.removeChild(last)

    this.padding(12)
  }

  public *highlight(index: number, duration: number) {
    const children = this.getChildren()

    const tasks: ThreadGenerator[] = []

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const txt = child.children()[0] as Txt
      if (i == index) {
        tasks.push(txt.lineWidth(2, duration))
      } else {
        tasks.push(txt.opacity(0.5, duration))
      }
    }

    yield* all(...tasks)
  }

  public *unhighlight(duration: number) {
    const children = this.getChildren()
    
    const tasks: ThreadGenerator[] = []

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const txt = child.children()[0] as Txt
      tasks.push(txt.opacity(1, duration))
      tasks.push(txt.lineWidth(0, duration))
    }

    yield* all(...tasks)
  }

  public *place(value: string, index: number, duration: number) {
    this.values().splice(index, 0, value)
    const paddingDuration = 0.25 * duration
    const sizeDuration = duration - paddingDuration

    const item = createRef<Rect>()
    const text = createRef<Txt>()

    const child = this.children()[index] as Rect

    yield* child.margin([0, 0, 0, spacing], paddingDuration, easeInCubic)

    this.insert(
      <Rect fill={'#202020'} width={0} height={0} radius={spacing} layout justifyContent={'center'} alignItems={'center'} clip ref={item}>
        <Txt text={value} fill={'white'} fontSize={0} fontFamily={'JetBrains Mono'} stroke={'white'} ref={text}></Txt>
      </Rect>,
      index
    )

    child.margin(0)

    yield* all(
      item().width(size, sizeDuration, easeOutCubic),
      item().height(size, sizeDuration, easeOutCubic),
      text().fontSize(fontSize, sizeDuration, easeOutCubic),
    )
  }

  public *delete(index: number, duration: number) {
    this.values().splice(index, 1)
    const paddingDuration = 0.25 * duration
    const sizeDuration = duration - paddingDuration

    const child = this.children()[index] as Rect
    const next = this.children()[index + 1] as Rect

    yield* all(
      child.width(0, sizeDuration, easeInCubic),
      child.height(0, sizeDuration, easeInCubic),
      (child.children()[0] as Txt).fontSize(0, sizeDuration, easeInCubic),
    )

    next.margin([0, 0, 0, spacing])

    this.removeChild(child)

    yield* next.margin(0, paddingDuration, easeOutCubic)
  }

  public *set(value: string, index: number, duration: number) {
    this.values()[index] = value
    const txt = this.children()[index].children()[0] as Txt

    yield* txt.fontSize(0, duration * 0.5)
    txt.text(value)
    yield* txt.fontSize(fontSize, duration * 0.5)
  }

  public *turn(degrees: number, duration: number) {
    const tasks: ThreadGenerator[] = []

    for (const rect of this.children()) {
      const txt = rect.children()[0] as Txt
      tasks.push(txt.rotation(degrees, duration))
    }
    
    yield* all(...tasks)
  }
}