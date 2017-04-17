'use strict';


import Attack, { AttackType, AttackReaction } from './attack';
import PlayerState from '../objects/player-state';
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import { ElementType, EffectType } from '../helpers/common';
import { PlayerDamage } from '../objects/player-damage';

export default class Explosion extends Attack {

  static get name(): string {
    return 'Explosion';
  }

  get baseDamage(): number {
    return this.attacker.health
  }

  static get isPassive(): boolean {
    return true;
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
    return ElementType.Fire;
  }

  explosion(baseDamage: number) {
    const attackerState = this.state;
    const playerDamage = new PlayerDamage(baseDamage, {
      elementType: this.elementType,
      type: AttackType.Technical,
      toSymbol: function () { return 'Explosion' },
    }, this.state, this.state.getTarget())
      .calculative()
      .elemental({
        potencies: this.potencies,
        weaknesses: this.weaknesses
      })
      .reactive({
        critRate: this.critRate,
        blockRate: this.blockRate,
        counterRate: this.counterRate
      })
      .combinative({
        combos: this.combos
      })

    const finalDamage = this.defender.incHealth(Math.round(playerDamage.damage));
    attackerState.endAnimation();
    attackerState.getClient().attackReactionEnded({
      attacker: this.attacker.snapshot,
      defender: this.defender.snapshot,
      isPassive: false,
      result: {
        text: `${finalDamage}`,
        type: EffectType.Damage
      }
    })
    attackerState.update();
  }

  addEffects(finalDamage) {
    //100 percent
    const attackerState = this.state;
    attackerState.getClient().attackReactionStarted({
      reaction: AttackReaction.Damage,
      isPassive: false,
      origin: {
        name: this.name,
        symbol: this.toSymbol()
      },
      time: 1.5
    });

    attackerState.startAnimation(1.5, this.explosion.bind(this, finalDamage));
  }
  static toSymbol(): string {
    return 'Explosion';
  }

}
