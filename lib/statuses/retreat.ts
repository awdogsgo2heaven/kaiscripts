'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';
import PlayerState from '../objects/player-state';

export default class Retreat extends Status {
  constructor(ticks) {
    super('Retreat', ticks, 2.0)
  }

  static toSymbol(): string {
    return 'Retreat';
  }
  get compatiableAttacks() {
    return ['ShellBash'];
  }
  triggerCast() {

    var attack = this.state.getActiveAttack();

    if (this.compatiableAttacks.indexOf(attack.toSymbol()) === -1) {
      this.attacker.removeStatus(this);
      return true;
    }  
    return false;
  }

  get bonus() {
    return {
      security: this.potency
    }
  }
}