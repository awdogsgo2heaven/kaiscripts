'use strict';

import Attack, {AttackReaction} from '../attacks/attack';
import * as consts from '../config/constants';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {IEffect, EffectType} from '../helpers/common';
import PlayerState from '../objects/player-state';
import {IBattleTrigger} from '../objects/triggers';
import {PlayerDamage} from '../objects/player-damage';

export default class Status implements IBattleTrigger {
  public totalTicks: number
  private stackSize: number
  public timerId: number
  public clientId: number
  public state: PlayerState
  
  constructor(public name: string, public ticks: number, public potency: number) {
    this.totalTicks = this.ticks;
    this.stackSize = 1;
  }

  static toSymbol(): string {
    return '';
  }

  toSymbol(): string {
    return (<typeof Status>this.constructor).toSymbol();
  }

  get attacker() {
    return this.state.getActiveKaiScript();
  }  

  get defender() {
    return this.state.getTarget().getActiveKaiScript();
  }  

  get bonus() {
    return {
    }
  }

  get copy() {
    return new (<any>this.constructor)(this.ticks, this.potency);
  }

  //trick statuses are special designation where 
  //the monster does a move to prep for another attack
  get isTrick(): boolean {
    return false;
  }

  //trap statuses prevent the user from swapping
  get isTrapped(): boolean {
    return false;
  }

  get castRate(): number {
    return 0.0;
  }

  get hitChance(): number {
    return 0.0;
  }

  get maxStack(): number {
    return 1;
  }

  bandwidthTick(): number {
    return 0;
  }

  triggerDeath(): boolean {
    return false;
  }

  triggerReaction(playerDamage: PlayerDamage): boolean {
    return false;
  }

  triggerTryCast(state: { position: number }): boolean {
    return true;
  }
  
  triggerCast(): boolean {
    return false;
  }

  triggerAddStatus(status: Status): boolean {
    return false;
  }

  triggerAttack(): boolean {
    return false;
  }

  triggerHit(): boolean {
    return false;
  }

  triggerDamage(playerDamage: PlayerDamage): boolean {
    return false;
  }


  statusTick(kaiScript: AvatarKaiScript): IEffect | void {
  }

  merge(status): void {
    if (this.stackSize < this.maxStack) {
      this.stackSize++;
      var pd1 = this.potency * this.ticks;
      var pd2 = status.potency * status.ticks;
      var pd = pd1 + pd2;

      if (this.potency > status.potency) {
        this.potency = this.potency;
        this.ticks = pd / this.potency;
      }
      else {
        this.potency = status.potency;
        this.ticks = pd / status.potency;
      }
    }
  }
}
