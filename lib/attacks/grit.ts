'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Grit extends Attack {
  static get name(): string {
    return 'Grit';
  }
  get baseDamage(): number {
    const health = this.defender.healthRatio * 100;
    return 90.0 * (1.0 / health);
  }
  static get type(): AttackType {
    return AttackType.Brute;
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
    return ElementType.Earth;
  }
  static toSymbol(): string {
    return 'Grit';
  }
}
