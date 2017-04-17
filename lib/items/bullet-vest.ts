'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType, ElementType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {AttackReaction, AttackAccuracy} from '../attacks/attack';
import {PlayerDamage} from '../objects/player-damage';
import * as consts from '../config/constants';

export default class BulletVest extends Item {

  static get name(): string {
    return 'Bullet Vest';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'Nullifies metal critical hits.';
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
    return 'BulletVest';
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
      return this.apply(kaiScript);
  }

  triggerReaction(playerDamage: PlayerDamage): boolean {
    if(playerDamage.attack.elementType === ElementType.Metal && playerDamage.accuracy === AttackAccuracy.Critical) {
        playerDamage.accuracy = AttackAccuracy.Normal;
        return true;
    }
    return false;
  }
  
  static get accessibility() {
    return consts.StoreAccessbility.Control;
  }

}
