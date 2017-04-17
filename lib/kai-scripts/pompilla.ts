'use strict';


import * as consts from '../config/constants';
import Nobility from '../traits/nobility';
import Decree from '../attacks/decree';
import Nap from '../attacks/nap';
import Thrash from '../attacks/thrash';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import {ElementType} from '../helpers/common';

export default class Pompilla extends KaiScript {

  static get name(): string {
    return 'Pompilla';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Nobility;
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
    return 'Pompilla';
  }

  static get attacks(): typeof Attack[] {
    return [Decree, Thrash, Nap]
  }
}
