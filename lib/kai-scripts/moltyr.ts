'use strict';


import * as consts from '../config/constants';
import Hyperthermia from '../traits/hyperthermia';
import Rage from '../attacks/rage';
import Inflame from '../attacks/inflame';
import Assert from '../attacks/assert';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import * as Techs from '../objects/tech';
import {ElementType} from '../helpers/common';

export default class Moltyr extends KaiScript {

  static get name(): string {
    return 'Moltyr';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Hyperthermia;
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
    return 'Moltyr';
  }

  static get attacks(): typeof Attack[] {
    return [Rage, Assert, Inflame]
  }

}
