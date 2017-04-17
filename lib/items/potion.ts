'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import * as consts from '../config/constants';

export default class Potion extends Item {

  static get name(): string {
    return 'Potion';
  }

  static get isPassive(): boolean {
    return true;
  }

  static get desc(): string {
    return 'Heals';
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
    return 'field';
  }

  static get baseCure(): number {
    return 100.0;
  }

  static toSymbol() {
    return 'Potion';
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {

    const cure = this.baseCure;
    const cureAmount = kaiScript.incHealth(cure);

    await kaiScript.updateHeatlh();

    return {
      text: `${cureAmount}`,
      type: EffectType.Cure
    }
  }

  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  

}
