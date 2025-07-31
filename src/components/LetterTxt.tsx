import { Txt, TxtProps } from '@motion-canvas/2d'

export interface LetterTxtProps extends TxtProps {}

export class LetterTxt extends Txt {
  public constructor(props: LetterTxtProps) {
    super(props)
  }
}