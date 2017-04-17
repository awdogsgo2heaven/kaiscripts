'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class LavaBurst extends Attack {

  static get name(): string {
    return 'Lava Burst';
  }

  get baseDamage(): number {
    if (this.defender.hasStatus('Harden')) {
      return 80.0;
    }
    return 40.0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 50.0;
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
    return 'LavaBurst';
  }

}
