'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import Poison from '../statuses/poison';
import Slow from '../statuses/slow';

export default class ToxicSlick extends Attack {

  static get name(): string {
    return 'Toxic Slick';
  }

  get baseDamage(): number {
    return 40.0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 35.0;
  }

  static get castTime(): number {
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Metal
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.defender.addStatus(new Poison(6.0, -2.0));
    this.defender.addStatus(new Slow(6.0));
  }

  static toSymbol(): string {
    return 'ToxicSlick'
  }
}
