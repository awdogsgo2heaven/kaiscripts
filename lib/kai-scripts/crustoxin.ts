'use strict';


import * as consts from '../config/constants';
import Biohazard from '../traits/biohazard';
import ShellBash from '../attacks/shell-bash';
import FissurePinch from '../attacks/fissure-pinch';
import Retreat from '../attacks/retreat';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';
import Attack from '../attacks/attack';

export default class Crustoxin extends KaiScript {

  static get name(): string {
    return 'Crustoxin';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Biohazard;
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
    return 'Crustoxin';
  }

  static get attacks(): typeof Attack[] {
    return [FissurePinch, ShellBash, Retreat]
  }
}
