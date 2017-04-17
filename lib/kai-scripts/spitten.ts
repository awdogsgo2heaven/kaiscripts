'use strict';


import * as consts from '../config/constants';
import Hyper from '../traits/hyper';
import PanicNeedle from '../attacks/panic-needle';
import PricklyPaw from '../attacks/prickly-paw';
import Hiss from '../attacks/hiss';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import Attack from '../attacks/attack';
import {ElementType} from '../helpers/common';

export default class Spitten extends KaiScript {

  static get name(): string {
    return 'Spitten';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Hyper;
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
    return 'Spitten';
  }

  static get attacks(): typeof Attack[] {
    return [PanicNeedle, Hiss, PricklyPaw]
  }
}
