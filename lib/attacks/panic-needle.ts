'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class PanicNeedle extends Attack {

  static get name(): string {
    return 'Panic Needle';
  }

  get baseDamage(): number {
    return 40.0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
  }

  static get cost(): number {
    return 40.0;
  }


  static get castTime() {
    return 5.0;
  }

  get castTime() {
    const health = this.defender.healthRatio;
    console.log(health);
    return 5.0 * health;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Earth;
  }

  static toSymbol(): string {
    return 'PanicNeedle';
  }

}
