'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Shock extends Attack {

  static get name(): string {
    return 'Shock';
  }

  get baseDamage(): number {
    return 40.0;
  }

  get bandwidthDamage() {
    return 10.0;
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
    return ElementType.Metal;
  }

  static toSymbol(): string {
    return 'Shock';
  }

}
