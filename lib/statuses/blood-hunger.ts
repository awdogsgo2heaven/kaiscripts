'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {IEffect, EffectType} from '../helpers/common';

export default class BloodHunger extends Status {
  constructor(ticks, potency) {
    super('Blood Hunger', ticks, potency)
  }
  static toSymbol(): string {
    return 'BloodHunger';
  }
  get bonus() {
    return {
      attack: (this.ticks / this.totalTicks) * (this.potency * this.totalTicks)
    }
  }

  statusTick(kaiScript: AvatarKaiScript): IEffect {
    //increase attack
    var damage = kaiScript.incHealth(this.potency);
    return {
      text: `${damage}`,
      type: EffectType.Damage
    }
  }
}
