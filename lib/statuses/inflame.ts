'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';
import {IEffect, EffectType} from '../helpers/common';
import PlayerState from '../objects/player-state';

export default class Inflame extends Status {
  
  public ticker: number

  constructor(ticks, potency) {
    super('Inflame', ticks, potency)
    this.ticker = 3;
  }

  static toSymbol(): string {
    return 'Inflame';
  }

  triggerAttack(): boolean {
    this.ticker--;
    if (this.ticker === 0) {
      this.attacker.removeStatus(this);
      return true;
    }
    return false;
  }

  statusTick(kaiScript) {

    var damage = kaiScript.incHealth(this.potency * this.ticker);

    return {
      text: `${damage}`,
      type: EffectType.Damage
    }
  }
}
