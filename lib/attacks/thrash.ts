'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import * as Util from '../helpers';

export default class Thrash extends Attack {

  static get name(): string {
    return 'Thrash';
  }

  get baseDamage(): number {
    return 50.0;
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
    return ElementType.Earth;
  }

  addEffects(): void {
    super.addEffects(null);

    //100 percent
    this.attacker.addStatus( new Corruption(6.0));
  }

  static toSymbol(): string {
    return 'Thrash';
  }

}
