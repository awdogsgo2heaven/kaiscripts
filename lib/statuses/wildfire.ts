'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {IEffect, EffectType} from '../helpers/common';

export default class Wildfire extends Status {
  
  constructor(public ticks, public potency) {
    super('Wildfire', ticks, potency)
  }

  static toSymbol(): string {
    return 'Wildfire';
  }

  statusTick(kaiScript: AvatarKaiScript): IEffect {
    if (this.ticks === 1) {
      var damage = kaiScript.incHealth(this.potency);
      return {
        text: `${damage}`,
        type: EffectType.Damage
      }
    }

    var damage = kaiScript.incHealth(1);
    return {
      text: `${damage}`,
      type: EffectType.Damage
    }
  }
}
