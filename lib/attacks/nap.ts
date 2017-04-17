'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Sleep from '../statuses/sleep';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Nap extends Attack {

  static get name(): string {
    return 'Nap';
  }

  static get isPassive(): boolean {
    return true;
  }

  get baseCure() {
    return 999.0;
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
    this.attacker.addStatus(new Sleep(6.0));
  }

  static toSymbol(): string {
    return 'Nap';
  }

}
