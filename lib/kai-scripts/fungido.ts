'use strict';


import * as consts from '../config/constants';
import Redirection from '../traits/redirection';
import CounterStance from '../attacks/counter-stance';
import ShadowDecoy from '../attacks/shadow-decoy';
import SporeBomb from '../attacks/spore-bomb';
import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import * as Techs from '../objects/tech';
import {ElementType} from '../helpers/common';

export default class Fungido extends KaiScript {

  static get name(): string {
    return 'Fungido';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Redirection;
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
    return 'Fungido';
  }

  static get attacks(): typeof Attack[] {
    return [CounterStance, ShadowDecoy, SporeBomb]
  }
}
