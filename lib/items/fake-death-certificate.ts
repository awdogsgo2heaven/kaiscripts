'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import * as consts from '../config/constants';

export default class FakeDeathCertificate extends Item {

  static get name(): string {
    return 'Fake Death Certificate';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'A forged certificate of death.';
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
    return 'FakeDeathCertificate';
  }

  static get accessibility() {
    return consts.StoreAccessbility.Rank3;
  }  

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
      return this.apply(kaiScript);
  }


}
