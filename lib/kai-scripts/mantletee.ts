'use strict';


import * as consts from '../config/constants';
import Waterproof from '../traits/waterproof';
import Harden from '../attacks/harden';
import Molt from '../attacks/molt';
import LavaBurst from '../attacks/lava-burst';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import * as Techs from '../objects/tech';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';

export default class Mantletee extends KaiScript {

  static get name(): string {
    return 'Mantletee';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Waterproof;
  }

  static get primaryType(): ElementType {
    return ElementType.Fire;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Mantletee';
  }

  static get attacks(): typeof Attack[] {
    return [Harden, Molt, LavaBurst]
  }
}
