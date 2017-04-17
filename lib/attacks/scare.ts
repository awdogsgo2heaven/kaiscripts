'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Stun from '../statuses/stun';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import * as Util from '../helpers';

export default class Scare extends Attack {

  static get name(): string {
    return 'Scare';
  }

  get baseDamage(): number {
    return 30.0;
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
    if (Util.roll() < 0.1) {
      this.defender.addStatus(new Stun(0.0));
      this.defender.state.setIsCasting(false);
    }
  }

  static toSymbol(): string {
    return 'Scare';
  }

}
