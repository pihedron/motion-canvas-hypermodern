import {
  Node,
  NodeProps,
  Rect,
  Txt,
  initial,
  signal,
} from '@motion-canvas/2d';
import {
  SignalValue,
  SimpleSignal,
  Vector2,
  all,
  createRef,
  delay,
  easeInCubic,
  easeInOutCubic,
  useLogger,
  useRandom,
  waitFor
} from '@motion-canvas/core';

export interface LiveArrayProps extends NodeProps {
  initialArray?: SignalValue<string[]>;
}

const byTag = <T extends Node,>(tag: string) => (node: T) => node.key.includes(tag)

const CONTAINER_NODE_TAG = 'itemContainerNode';
const ITEM_NODE_TAG = 'itemNode';


export class LiveArray extends Node {
  @initial([])
  @signal()
  public declare readonly initialArray: SimpleSignal<string[], this>;


  private array: string[];
  private readonly container = createRef<Rect>();
  private get itemNodes(): Rect[] {
    return this.container()?.findAll(byTag('itemNode')) ?? []
  };
  private get itemContainerNodes(): Rect[] {
    return this.container()?.findAll(byTag(CONTAINER_NODE_TAG)) ?? []
  };


  public constructor(props?: LiveArrayProps) {
    super({
      ...props,
    });

    this.array = this.initialArray();

    this.add(
      <Rect
        layout
        padding={15}
        y={200}
        opacity={0}
        height={'0%'}
        width={'0%'}
        ref={this.container}
        radius={15}
        fill={'#555'}
      >
        {this.array.map((item, index) => this.createItem(index, item))}
      </Rect>,
    );
  }

  private createItem(index: number, item: string) {
    return <Rect
      key={CONTAINER_NODE_TAG + '-' + item}
      layout={true}
      marginLeft={index === 0 ? 0 : 15}
      size={[100, 100]}
    >
      <Node>
        <Rect
          layout={false}
          key={ITEM_NODE_TAG + '-' + item}
          alignItems={'center'}
          justifyContent={'center'}
          size={[100, 100]}
          opacity={0}
          fill="#464"
          radius={10}
          y={20}
        >

          <Txt fill="#FFF" text={item}></Txt>
        </Rect>
      </Node>
    </Rect> as Rect;
  }

  public *animateEntrance() {
    yield* all(
      this.container().position.y(0, .5),
      this.container().opacity(1, .5),
      this.container().width('auto', .5),
      this.container().height('auto', .5)
    )
    yield* all(...this.itemNodes.map((el, idx) => {
      return delay(idx * .3, all(
        el.opacity(1, .4),
        el.position.y(0, .4),
        delay(0.2, el.fill('#666', .3, easeInCubic))
      ))
    }))
  }

  public *highlightItem(idx: number) {
    const logger = useLogger();
    const nodeToHighlight = this.itemNodes[idx];
    if (!nodeToHighlight) {
      logger.error('Cannot highlight item at idx = ' + idx);
      return;
    }
    yield* all(
      nodeToHighlight.scale([1.2, 1.2], 0.2).to([1, 1], 0.2),
      nodeToHighlight.fill('#868686', 0.1).to("#666", 0.6),
    )
  }

  public *popItem(idx: number) {
    const random = useRandom();
    const logger = useLogger();
    yield* waitFor(random.nextFloat(0, 0.1))
    const nodeToPop = this.itemNodes[idx];
    const containerNodeToPop = this.itemContainerNodes[idx];
    if (!nodeToPop) {
      logger.error('Cannot pop item at idx = ' + idx);
      return;
    }
    yield* all(
      nodeToPop.fill('#311', 0.2),
      nodeToPop.position.y(-random.nextInt(150, 250), .8),
      nodeToPop.opacity(0, .8),
      nodeToPop.rotation(random.nextInt(-90, 90), .8),
      nodeToPop.filters.blur(16, .8),
      delay(0.4, all(containerNodeToPop.width(0, 0.4), containerNodeToPop.margin.left(0, 0.4))),
      ...[idx === 0 ? this.itemContainerNodes[1].margin.left(0, .8) : null]
    );
    this.removeContainerNode(containerNodeToPop);
    this.removeNode(nodeToPop);
  }

  private removeNode(node: Node) {
    node.remove();
  }

  private removeContainerNode(node: Node) {
    node.remove();
  }

  public *pushItem(idx: number, item: string) {
    const logger = useLogger();
    idx === 0 ? yield this.itemContainerNodes[0].margin.left(15, .5) : null
    const newItemContainer = this.createItem(idx, item);
    newItemContainer.width(0);
    newItemContainer.margin.left(0);
    const newItem = newItemContainer.findFirst<Rect>(byTag('itemNode'));
    if (!newItem) {
      logger.error('Cannot push new item at item at idx = ' + idx);
      return;
    }
    this.container().insert(newItemContainer, idx)

    yield* all(
      newItemContainer.width(newItem.width, 0.5),
      newItemContainer.margin.left(idx !== 0 ? 15 : 0, .5)
    )
    yield* all(
      newItem.opacity(1, .4),
      newItem.position.y(0, .4),
      delay(0.2, newItem.fill('#666', .3, easeInCubic))
    )
  }

  public *swapItems(idx1: number, idx2: number) {
    const item1 = this.itemNodes[idx1];
    const item2 = this.itemNodes[idx2];
    const itemContainer1 = this.itemContainerNodes[idx1];
    const itemContainer2 = this.itemContainerNodes[idx2];

    const pos1 = item1.absolutePosition()
    const pos2 = item2.absolutePosition()

    yield* all(
      item1.fill('#446', .1, easeInOutCubic),
      item2.fill('#446', .1, easeInOutCubic),
      item1.absolutePosition(pos2, 0.8, easeInOutCubic, Vector2.createPolarLerp(false, pos2.lerp(pos1, 0.5).addY(0))),
      item2.absolutePosition(pos1, 0.8, easeInOutCubic, Vector2.createPolarLerp(false, pos1.lerp(pos2, 0.5).addY(0))),
    )
    yield* all(
      item1.fill('#666', .2),
      item2.fill('#666', .2),
    )
    itemContainer1.moveTo(idx2);
    if (this.itemContainerNodes.indexOf(itemContainer2) !== idx1) {
      itemContainer2.moveTo(idx1);
    }
    this.recalculateMargins();
    item1.absolutePosition(pos2);
    item2.absolutePosition(pos1);
  }

  recalculateMargins() {
    for (const [idx, node] of this.itemContainerNodes.entries()) {
      if (idx === 0) {
        node.margin.left(0)
      } else {
        node.margin.left(15)
      };
    }
  }
}