'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class HipThrow extends Attack {

  static get name(): string {
    return 'Hip Throw';
  }

  get baseDamage(): number {
    return 80.0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
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
    return ElementType.Wood;
  }

  static toSymbol(): string {
    return 'HipThrow';
  }

}
