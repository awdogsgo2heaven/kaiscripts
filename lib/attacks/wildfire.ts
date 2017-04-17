'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Unique from '../statuses/wildfire';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Wildfire extends Attack {

  static get name(): string {
    return 'Wildfire';
  }

  get baseDamage(): number {
    return 0;
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

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Unique(3.0, -100.0));
    this.defender.addStatus(new Unique(3.0, -100.0));
  }

  static toSymbol(): string {
    return 'Wildfire';
  }

}
