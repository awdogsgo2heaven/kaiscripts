'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';
import PlayerState from '../objects/player-state';

export default class Glide extends Status {
  constructor(ticks) {
    super('Glide', ticks, 0)
  }

  static toSymbol(): string {
    return 'Glide';
  }

  get compatiableAttacks() {
    return ['SwiftLeaf', 'TwisterDive'];
  }

  get isTrick(): boolean {
    return true;
  }

  triggerCast() {

    var attack = this.state.getActiveAttack();

    if (this.compatiableAttacks.indexOf(attack.toSymbol()) === -1) {
      this.attacker.removeStatus(this);
      return true;
    }  
  }

  triggerAttack() {

    var attack = this.state.getActiveAttack();

    if (attack.toSymbol() === 'TwisterDive') {
      this.attacker.removeStatus(this);
      return true;
    }
  }
}
