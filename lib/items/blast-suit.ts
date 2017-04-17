'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType, ElementType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {PlayerDamage} from '../objects/player-damage';
import * as consts from '../config/constants';

export default class BlastSuit extends Item {

  static get name(): string {
    return 'Blast Suit';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'Prevents knockout from Fire attack.';
  }

  static get buyPrice(): number {
    return 30.0;
  }

  static get sellPrice(): number {
    return 15.0;
  }

  static get isAvailable(): boolean {
    return true;
  }

  static get itemType(): ItemType {
    return 'equipment';
  }

  static toSymbol() {
    return 'BlastSuit';
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
    return this.apply(kaiScript);
  }

  triggerDamage(playerDamage: PlayerDamage): boolean {
    if (playerDamage.attack.elementType === ElementType.Fire && this.defender.healthRatio === 100) {
      var healthNow = this.defender.totalHealth;
      var health = healthNow - playerDamage.damage;

      if (health <= 0) {
        playerDamage.damage = healthNow - 1
        return true;
      }
    }
    return false;
  }

  static get accessibility() {
    return consts.StoreAccessbility.Control;
  }

}
