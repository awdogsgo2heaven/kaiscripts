'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import SecurityDown from '../statuses/security-down';
import KnowledgeDown from '../statuses/knowledge-down';

import AttackUp from '../statuses/attack-up';
import IntelligenceUp from '../statuses/intelligence-up';

import Unique from '../statuses/respite';

export default class BraveMove extends Attack {

  static get name(): string {
    return 'BraveMove';
  }

  static get type(): AttackType {
    return AttackType.Technical;
  }

  static get cost(): number {
    return 40.0;
  }

  static get castTime(): number {
    return 5.0;
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

    
    this.attacker.addStatus(new SecurityDown(6.0, 1.5));
    
    this.attacker.addStatus(new IntelligenceUp(6.0, 1.5));

    this.attacker.addStatus(new KnowledgeDown(6.0, 1.5));

    this.attacker.addStatus(new AttackUp(6.0, 1.5));
  }

  static toSymbol(): string {
    return 'BraveMove'
  }
}
