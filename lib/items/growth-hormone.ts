'use strict';

import Item, { IItemEffect } from './item';
import { ItemType } from './item';
import PlayerState from '../objects/player-state';
import { IEffect, EffectType } from '../helpers/common';
import { AvatarKaiScript } from '../data/avatar-kai-script';
import * as consts from '../config/constants';

export default class GrowthHormone extends Item {

  static get name(): string {
    return 'Growth Hormone';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'A hormone that increases the growth of Wood based KaiScript.';
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
    return 'GrowthHormone';
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
    return this.apply(kaiScript);
  }

  public static equip(kaiScript: AvatarKaiScript) {
    kaiScript.addBonus.resiliency += 30;
  }
}
