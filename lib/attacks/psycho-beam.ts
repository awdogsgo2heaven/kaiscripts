'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class PsychoBeam extends Attack {

  static get name(): string {
    return 'Psycho Beam';
  }

  get baseDamage(): number {
    if (this.defender.hasStatus(consts.StatusTypes.CORRUPTION)) {
      return 90.0;
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
    return ElementType.Earth;
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.defender.addStatus(new Corruption(6.0));
  }

  static toSymbol(): string {
    return 'PsychoBeam';
  }

}
