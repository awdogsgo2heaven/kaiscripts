'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {IEffect, EffectType} from '../helpers/common';

export default class Poison extends Status {

  constructor(ticks, potency) {
    super('Poison', ticks, potency)
  }

  static toSymbol(): string {
    return 'Poison';
  }

  get maxStack(): number {
    return 3;
  }

  statusTick(kaiScript: AvatarKaiScript): IEffect {
    var potency = this.potency;

    if (kaiScript.trait.toSymbol() === 'Biohazard') {
      potency *= 2;
    }

    const damage = kaiScript.incHealth(potency);
    return {
      text: `${damage}`,
      type: EffectType.Damage
    }
  }
}
