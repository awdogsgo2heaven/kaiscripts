'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import KnowledgeDown from '../statuses/knowledge-down';
import SecurityDown from '../statuses/security-down';
import * as Util from '../helpers';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class MagneticShock extends Attack {

  static get name(): string {
    return 'Magnetic Shock';
  }

  get baseDamage(): number {
    return 40.0;
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

  addEffects(): void {
    super.addEffects(null);
    //100 percent
    if(Util.roll() < 0.30){
      this.defender.addStatus(new KnowledgeDown(6.0, 2.0));
      this.defender.addStatus(new SecurityDown(6.0, 2.0));
    }
  }

  static get elementType(): ElementType {
    return ElementType.Metal;
  }

  static toSymbol(): string {
    return 'MagneticShock';
  }

}
