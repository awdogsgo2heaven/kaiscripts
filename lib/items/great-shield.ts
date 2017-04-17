'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import * as consts from '../config/constants';

export default class GreatShield extends Item {

  static get name(): string {
    return 'Great Shield';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'A large heavy shield.';
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
    return 'GreatShield';
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
      return this.apply(kaiScript);
  }
  
  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  

  public static equip(kaiScript: AvatarKaiScript) {
    kaiScript.addBonus.attack -= 30;
    kaiScript.addBonus.security += 30;
  }


}
