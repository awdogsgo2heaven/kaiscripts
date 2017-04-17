'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class SwiftLeaf extends Attack {

  static get name(): string {
    return 'SwiftLeaf';
  }

  get baseDamage(): number {
    return 30;
  }

  static get type(): AttackType {
    return AttackType.Brute;
  }

  static get cost(): number {
    return 30.0;
  }

  get castTime(): number {
    if(this.attacker.hasStatus('Glide')) {
        return 0.0;
    }
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Wood;
  }

  static toSymbol(): string {
    return 'SwiftLeaf';
  }

}
