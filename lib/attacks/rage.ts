'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Unique from '../statuses/rage';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Rage extends Attack {

  static get name(): string {
    return 'Rage';
  }

  get baseDamage(): number {
    const rage = this.attacker.findStatus('Rage');
    if (rage) {
      return 30.0 * rage.potency;
    }
    return 30.0;
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
    return ElementType.Fire;
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Unique(6.0));
  }

  static toSymbol(): string {
    return 'Rage';
  }

}
