'use strict';

import Attack, {AttackType, AttackReaction} from './attack';
import PlayerState from '../objects/player-state'; 
import Unique from '../statuses/constrict';
import * as consts from '../config/constants';
import {ElementType, EffectType} from '../helpers/common';

export default class CombatFlame extends Attack {

  //Recoil

  static get name(): string {
    return 'Combat Flame';
  }

  get baseDamage(): number {
    return 70.0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
  }

  static get cost(): number {
    return 40.0;
  }

  static get castTime(): number {
    return 1.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Fire;
  }

  recoil(damage) {
      
    const attackerState = this.state;
    attackerState.endAnimation();

    const actualDamage = this.defender.incHealth(Math.round(damage * 0.25));
    
    attackerState.getClient().attackReactionEnded({
      attacker: this.attacker.snapshot,
      defender: this.defender.snapshot,
      isPassive: true,
      result: {
        text: `${actualDamage}`,
        type: EffectType.Cure
      }
    })
    attackerState.update();

  }

  addEffects(finalDamage) {
    //100 percent
    const attackerState = this.state;

    attackerState.getClient().attackReactionStarted({
      reaction: AttackReaction.Recoil,
      isPassive: true,
      origin: {
        name: this.name,
        symbol: this.toSymbol()
      },
      time: 1.5
    });
    
    attackerState.startAnimation(0.5, this.recoil.bind(this, finalDamage));
  }


  static toSymbol(): string {
    return 'CombatFlame';
  }

}
