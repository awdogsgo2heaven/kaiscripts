'use strict';

import * as consts from '../config/constants';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import {Tech} from '../objects/tech';
import AlphaVirus from '../virus/alpha';
import Virus from '../virus/virus';
import * as Collections from 'typescript-collections';

import {ElementType} from '../helpers/common';

export default class KaiScript {

  static get name(): string {
    return 'Unknown';
  }

  static get desc(): string {
    return "oh shit, you shouldn't be seeing this."
  }

  static get trait(): typeof Trait {
    return Trait;
  }

  static get parents(): Collections.Set<typeof KaiScript> {
    return new Collections.Set<typeof KaiScript>();
  }

  static get primaryType(): ElementType {
    return ElementType.Water;
  }

  static get secondaryType(): ElementType {
    return ElementType.Water;
  }

  static get virus(): typeof Virus {
    return AlphaVirus;
  }

  static get isStarter(): boolean {
    return false;
  }

  static get stats(): { [key: string]: string; } {
    return { "intelligence": "C", "knowledge": "C", "security": "C", "attack": "C", "latency": "C", "resiliency": "C" };
  }

  static toSymbol(): string {
    return '';
  }

  static get attacks(): typeof Attack[] {
    return [Attack, Attack, Attack]
  }

  static getAttacks(): typeof Attack[] {
    return this.attacks.concat([this.trait.attack]);
  }

}
