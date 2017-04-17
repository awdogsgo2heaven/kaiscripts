'use strict';

import * as consts from '../config/constants';
import Item from './item';
import {ItemType, IItemEffect} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';

export default class AlphaCannon extends Item {

  static get name(): string {
    return 'AlphaCannon';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'Destroys Alpha Viruses';
  }

  static get buyPrice(): number {
    return 30.0;
  }

  static get sellPrice(): number {
    return 15.0;
  }

  static get usage(): number {
    return 1;
  }

  static get isAvailable(): boolean {
    return true;
  }

  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  

  static get itemType(): ItemType {
    return 'anti-viral';
  }

  public use(): IEffect {

    if(this.defender.viral === 0) {
      this.defender.isInfected = false;
    }
    else {
      return super.use();
    }

    return {
      text: 'Virus vanquished',
      type: EffectType.None
    };
  }

  static toSymbol() {
    return 'AlphaCannon';
  }
}
