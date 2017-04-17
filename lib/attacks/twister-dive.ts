'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class TwisterDive extends Attack {

  static get name(): string {
    return 'Twister Dive';
  }

  get baseDamage(): number {
    if(this.attacker.hasStatus('Glide')) {
        return 100.0;
    }
    return 0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
  }

  static get cost(): number {
    return 30.0;
  }

  get castTime(): number {
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Wood;
  }

  static toSymbol(): string {
    return 'TwisterDive';
  }

}
