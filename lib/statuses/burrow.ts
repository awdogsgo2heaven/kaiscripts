'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';
import PlayerState from '../objects/player-state';

export default class Burrow extends Status {
  constructor(ticks) {
    super('Burrow', ticks, 0)
  }

  static toSymbol(): string {
    return 'Burrow';
  }

  triggerCast() {
    this.attacker.removeStatus(this);
    return true;
  }

  get isTrapped(): boolean {
    return true;
  }

  get isTrick(): boolean {
    return true;
  }
}
