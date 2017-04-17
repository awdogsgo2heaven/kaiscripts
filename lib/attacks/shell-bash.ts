'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class ShellBash extends Attack {

  static get name(): string {
    return 'Shell Bash';
  }

  get baseDamage(): number {
    if (this.defender.hasStatus('Retreat')) {
      return 90.0;
    }
    return 40.0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
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
    return ElementType.Water;
  }

  static toSymbol(): string {
    return 'ShellBash';
  }

}
