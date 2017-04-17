'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import Decoy from '../statuses/decoy';

export default class ShadowDecoy extends Attack {

  static get name(): string {
    return 'Shadow Decoy';
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
    return ElementType.Water
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Decoy(6.0))
  }

  static toSymbol(): string {
    return 'ShadowDecoy'
  }
}
