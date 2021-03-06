'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Unique from '../statuses/retreat';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Retreat extends Attack {

  static get name(): string {
    return 'Retreat';
  }

  static get isPassive(): boolean {
    return true;
  }

  get baseDamage(): number {
    return 0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 20.0;
  }

  static get castTime(): number {
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Metal;
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Unique(6.0));

  }

  static toSymbol(): string {
    return 'Retreat';
  }

}
