'use strict';


import * as consts from '../config/constants';
import Startler from '../traits/startler';
import Attack from '../attacks/attack';
import Sniff from '../attacks/sniff';
import Lick from '../attacks/lick';
import SpiritFang from '../attacks/spirit-fang';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';

export default class Pangullion extends KaiScript {

  static get name(): string {
    return 'Pangullion';
  }

  static get desc(): string {
    return "Panglion"
  }

  static get trait(): typeof Trait {
    return Startler;
  }

  static get primaryType(): ElementType {
    return ElementType.Earth;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Pangullion';
  }

  static get attacks(): typeof Attack[] {
    return [SpiritFang, Lick, Sniff]
  }
}
