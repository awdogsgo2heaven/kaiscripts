'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import * as consts from '../config/constants';

export default class MemorySwapC extends Item {

  static get name(): string {
    return 'Memory Swap C'
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'A heavy sword.';
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
    return 'MemorySwapC';
  }

  public static equip(kaiScript: AvatarKaiScript) {
    kaiScript.addBonus.intelligence += kaiScript.getBaseStat('latency');
    kaiScript.addBonus.intelligence -= kaiScript.getBaseStat('intelligence');
    kaiScript.addBonus.latency += kaiScript.getBaseStat('intelligence');
    kaiScript.addBonus.latency -= kaiScript.getBaseStat('latency');
  }
  static get accessibility() {
    return consts.StoreAccessbility.Rank3;
  }  


}
