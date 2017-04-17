'use strict';


import * as consts from '../config/constants';
import Haunt from '../traits/haunt';
import Grudge from '../attacks/grudge';
import Scare from '../attacks/scare';
import Curse from '../attacks/curse';
import Polterheist from '../attacks/polterheist';

import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import Valoroast from '../kai-scripts/valoroast';

import {ElementType} from '../helpers/common';
import Attack from '../attacks/attack';
import * as Collections from 'typescript-collections';

export default class Solster extends KaiScript {

  static get name(): string {
    return 'Solster';
  }

  static get desc(): string {
    return ""
  }

  static get trait(): typeof Trait {
    return Haunt;
  }

  static get primaryType(): ElementType {
    return ElementType.Metal;
  }

  static get secondaryType(): ElementType {
    return ElementType.Earth;
  }

  static get parents(): Collections.Set<typeof KaiScript> {
    const parents = new Collections.Set<typeof KaiScript>();
    parents.add(Valoroast);
    parents.add(Valoroast);
    return parents;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Solster';
  }

  static get attacks(): typeof Attack[] {
    return [Grudge, Scare, Polterheist]
  }
}
