'use strict';


import * as consts from '../config/constants';
import ThickFat from '../traits/thick-fat';
import Attack from '../attacks/attack';
import MegaBite from '../attacks/mega-bite';

import Nap from '../attacks/nap';
import Pigout from '../attacks/pigout';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import {ElementType} from '../helpers/common';

export default class Gigpig extends KaiScript {

  static get name(): string {
    return 'Gigpig';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return ThickFat;
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
    return 'Gigpig';
  }

  static get attacks(): typeof Attack[] {
    return [Pigout, Nap, MegaBite]
  }
}
