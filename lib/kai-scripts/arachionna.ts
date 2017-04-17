'use strict';


import * as consts from '../config/constants';
import Startler from '../traits/startler';
import Attack from '../attacks/attack';
import Sniff from '../attacks/sniff';
import Curse from '../attacks/curse';
import SpiritFang from '../attacks/spirit-fang';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';

export default class Arachionna extends KaiScript {

  static get name(): string {
    return 'Arachionna';
  }

  static get desc(): string {
    return "Spider"
  }

  static get trait(): typeof Trait {
    return Startler;
  }

  static get primaryType(): ElementType {
    return ElementType.Water;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Arachionna';
  }

  static get attacks(): typeof Attack[] {
    return [SpiritFang, Curse, Sniff]
  }
}
