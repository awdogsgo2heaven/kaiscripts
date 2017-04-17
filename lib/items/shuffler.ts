'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import Disable from '../statuses/disable';
import * as consts from '../config/constants';

export default class BanHammer extends Item {

  static get name(): string {
    return 'Shuffler';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'Shuffles your team';
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
  
  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  

  static get baseCure(): number {
    return 100.0;
  }

  static toSymbol() {
    return 'Shuffler';
  }

  public use(): IEffect {

    const target = this.state;
    
    this.shuffle(target.kaiScripts.array)

    return {
      text: `Shuffled`,
      type: EffectType.None
    };

  }

  private shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
  }
}
