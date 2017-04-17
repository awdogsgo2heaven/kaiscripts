'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Unique from '../statuses/inflame';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Inflame extends Attack {

  static get name(): string {
    return 'Inflame';
  }

  get baseDamage(): number {
    return 0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 40.0;
  }

  static get castTime(): number {
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Fire;
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.defender.addStatus(new Unique(6.0, -2.0));
  }

  static toSymbol(): string {
    return 'Inflame';
  }

}
