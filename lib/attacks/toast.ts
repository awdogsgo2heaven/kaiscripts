'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Toast extends Attack {

  static get name(): string {
    return 'Toast';
  }

  get baseDamage(): number {
    var defenderState = this.state.getTarget();
    return 1 * (defenderState.bandwidth/2.0);
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 30.0;
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


  static toSymbol(): string {
    return 'Toast';
  }

}
