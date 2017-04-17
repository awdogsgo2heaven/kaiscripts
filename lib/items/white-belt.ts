'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class WhiteBelt extends Item {

  static get name(): string {
    return 'White Belt';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'A tough charm.';
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
    return 'WhiteBelt';
  }

  triggerAddStatus(status: Status): boolean {
    if (status.toSymbol() === 'CounterStance') {
      status.totalTicks += 2;
      status.ticks += 2;
      return true;
    }
    return false;
  }
  
  static get accessibility() {
    return consts.StoreAccessbility.Control;
  }  
}
