'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import IntelligenceUp from '../statuses/intelligence-up';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Overheat extends Attack {

  static get name(): string {
    return 'Overheat';
  }

  get baseDamage(): number {
    return 0;
  }
  
  static get isPassive(): boolean {
    return true;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 30.0;
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
    const defenderPlayer = this.state.getTarget();
    //const bandwidth = defenderPlayer.bandwidth;
    //BACK UP DATE
    this.defender.addStatus(new IntelligenceUp(10.0, 1.0));
  }

  static toSymbol(): string {
    return 'Overheat';
  }

}
