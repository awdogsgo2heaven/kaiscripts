'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';
import * as Util from "../helpers";
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {IEffect, EffectType} from '../helpers/common';
import PlayerState from '../objects/player-state';

export default class Constrict extends Status {
  constructor(ticks, potency) {
    super('Constrict', ticks, potency)
  }

  static toSymbol(): string {
    return 'Constrict';
  }

  get isTrapped(): boolean {
    return true;
  }

  triggerAttack(): boolean {
    if (Util.roll() < 0.3) {
      this.attacker.removeStatus(this);
      return true;
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
