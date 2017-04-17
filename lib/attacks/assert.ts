'use strict';
import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import SecurityUp from '../statuses/security-up';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Assert extends Attack {

  static get name(): string {
    return 'Assert';
  }

  static get isPassive(): boolean {
    return true;
  }

  get baseDamage(): number {
    return 0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 40.0;
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

  addEffects(): void {
    super.addEffects(null);
    this.attacker.addStatus(new SecurityUp(6.0, 4.0));
  }

  static toSymbol(): string {
    return 'Assert';
  }
}
//# sourceMappingURL=adrenaline-rush.js.map
