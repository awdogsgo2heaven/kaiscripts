'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import * as consts from '../config/constants';

export default class HealingCrystal extends Item {

  static get name(): string {
    return 'Healing Crystal';
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
    return 'battle';
  }

  static get baseCure(): number {
    return 100.0;
  }

  static toSymbol() {
    return 'HealingCrystal';
  }

  public use(): IEffect {

    const kaiScript = this.defender;
    const cure = this.baseCure;
    const cureAmount = kaiScript.incHealth(cure);

    this.used++;

    return {
      text: `${cureAmount}`,
      type: EffectType.Cure
    };
  }
  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  

}
