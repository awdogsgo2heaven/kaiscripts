'use strict';


import * as consts from '../config/constants';
import Firestarter from '../traits/firestarter';
import Attack from '../attacks/attack';
import Ignite from '../attacks/ignite';

import CombatFlame from '../attacks/combat-flame';
import Burrow from '../attacks/hip-throw';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import {ElementType} from '../helpers/common';

export default class Whiskion extends KaiScript {

  static get name(): string {
    return 'Whiskion';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Firestarter;
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
    return 'Whiskion';
  }

  static get attacks(): typeof Attack[] {
    return [Burrow, CombatFlame, Ignite]
  }
}
