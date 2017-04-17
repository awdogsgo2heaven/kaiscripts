'use strict';


import * as consts from '../config/constants';
import VengefulSpirit from '../traits/vengeful-spirit';
import Attack from '../attacks/attack';
import Scare from '../attacks/scare';

import PsychoBeam from '../attacks/psycho-beam';
import MistyVeil from '../attacks/misty-veil';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import {ElementType} from '../helpers/common';

export default class Whitemare extends KaiScript {

  static get name(): string {
    return 'Whitemare';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return VengefulSpirit;
  }

  static get primaryType(): ElementType {
    return ElementType.Wood;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Whitemare';
  }

  static get attacks(): typeof Attack[] {
    return [MistyVeil, PsychoBeam, Scare]
  }
}
