'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import Corruption from '../statuses/corruption';
import Unique from '../statuses/respite';

export default class Respite extends Attack {

  static get name(): string {
    return 'Respite';
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 40.0;
  }

  static get castTime(): number {
    return 5.0;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Water
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Corruption(6.0));
    this.attacker.addStatus(new Unique(6.0));
  }

  static toSymbol(): string {
    return 'Respite'
  }
}
