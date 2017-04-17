'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Reflect from '../statuses/reflect';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class MirrorFeather extends Attack {

  static get name(): string {
    return 'Mirror Feather';
  }

  get baseDamage(): number {
    return 0.0;
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
    return ElementType.Metal;
  }

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    this.attacker.addStatus(new Reflect(6.0));
  }

  static toSymbol(): string {
    return 'MirrorFeather';
  }

}
