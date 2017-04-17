'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Rage extends Status {

  constructor(ticks) {
    super('Rage', ticks, 0.5)
  }

  static toSymbol(): string {
    return 'Rage';
  }

  triggerHit(): boolean {
    if (this.potency < 5) {
      this.potency *= 2;
      return true;
    }
    return false;
  }
}
