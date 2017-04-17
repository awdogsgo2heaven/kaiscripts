'use strict';


import Attack, {AttackType, AttackReaction} from './attack';
import PlayerState from '../objects/player-state'; 
import Drain from '../statuses/drain';
import * as consts from '../config/constants';
import {ElementType, EffectType} from '../helpers/common';
export default class DrainFang extends Attack {

  static get name(): string {
    return 'Drain Fang';
  }

  get baseDamage(): number {
    return 30.0;
  }

  static get type(): AttackType {
    return AttackType.Brute;
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
    return ElementType.Earth;
  }

  drain(damage) {
    const attackerState = this.state;
    const actualCure = this.attacker.incHealth(Math.round(damage / 2.0));
    attackerState.endAnimation();
    attackerState.getClient().attackReactionEnded({
      attacker: this.attacker.snapshot,
      defender: this.defender.snapshot,
      isPassive: true,
      result: {
        text: `${actualCure}`,
        type: EffectType.Cure
      }
    })

    attackerState.update();

  }

  addEffects(finalDamage) {
    //100 percent
    const attackerState = this.state;
    attackerState.getClient().attackReactionStarted({
      reaction: AttackReaction.Drain,
      isPassive: true,
      origin: {
        name: this.name,
        symbol: this.toSymbol()
      },
      time: 1.5
    });

    attackerState.startAnimation(1.5, this.drain.bind(this, finalDamage));
  }

  static toSymbol(): string {
    return 'DrainFang';
  }

}
