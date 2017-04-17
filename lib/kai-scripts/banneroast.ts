'use strict';


import * as consts from '../config/constants';
import Chivalry from '../traits/chivalry';
import Grudge from '../attacks/grudge';
import Scare from '../attacks/scare';
import FireLance from '../attacks/fire-lance';
import ShieldStance from '../attacks/shield-stance';

import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import Valoroast from '../kai-scripts/valoroast';
import Pompilla from '../kai-scripts/pompilla';

import {ElementType} from '../helpers/common';
import Attack from '../attacks/attack';
import * as Collections from 'typescript-collections';

export default class Banneroast extends KaiScript {

  static get name(): string {
    return 'Banneroast';
  }

  static get desc(): string {
    return ""
  }

  static get trait(): typeof Trait {
    return Chivalry;
  }

  static get primaryType(): ElementType {
    return ElementType.Metal;
  }

  static get secondaryType(): ElementType {
    return ElementType.Wood;
  }

  static get parents(): Collections.Set<typeof KaiScript> {
    const parents = new Collections.Set<typeof KaiScript>();
    parents.add(Valoroast);
    parents.add(Pompilla);
    return parents;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Banneroast';
  }

  static get attacks(): typeof Attack[] {
    return [Grudge, FireLance, ShieldStance]
  }
}
