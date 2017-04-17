'use strict';

import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Sniff extends Attack {

  static get name(): string {
    return 'Sniff';
  }

  get baseDamage(): number {
    return 0.0;
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 20.0;
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
    this.defender.findAndRemoveTrickStatus();
    
  }

  static toSymbol(): string {
    return 'Sniff';
  }

}
