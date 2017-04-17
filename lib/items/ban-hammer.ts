'use strict';

import Item, {IItemEffect} from './item';
import {ItemType} from './item';
import PlayerState from '../objects/player-state';
import {IEffect, EffectType} from '../helpers/common';
import Disable from '../statuses/disable';
import * as consts from '../config/constants';

export default class BanHammer extends Item {

  static get name(): string {
    return 'Ban Hammer';
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return 'Disables the opponents previous used attack temporarily.';
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
    return 'BanHammer';
  }

  public use(): IEffect {

    const target = this.state.getTarget();
    //Get previous attack
    const attackSymbol = target.attackHistory[target.attackHistory.length - (target.activeAttack != null ? 2 : 1)];


    this.used++;

    if (attackSymbol) {
      const position = this.defender.attacks.findIndex(x => x.toSymbol() === attackSymbol);
      this.defender.addStatus(new Disable(position, 6));

      return {
        text: `Banned`,
        type: EffectType.None
      };
    }
    return {
      text: `No Effect`,
      type: EffectType.None
    };
  }

  static get accessibility() {
    return consts.StoreAccessbility.Rank2;
  }  

}
