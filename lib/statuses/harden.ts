'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Harden extends Status {
  constructor(ticks) {
    super('Harden', ticks, 0)
  }
  static toSymbol(): string {
    return 'Harden';
  }
  get bonus() {
    return {
      security: 0.5
    }
  }

  triggerAttack() {
    var attack = this.state.getActiveAttack().toSymbol();
    if (attack === 'Molt' || attack === 'LavaBurst') {
      this.ticks = 0;
      return true;
    }
    return false;
  }
}
