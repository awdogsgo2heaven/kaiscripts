'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Disable extends Status {
  
  constructor(public position: number, ticks) {
    super('Disable', ticks, 0)
  }

  static toSymbol(): string {
    return 'Disable';
  }
  
  triggerTryCast(state: { position: number }): boolean {
    if (state.position - 1 === this.position) {
      return false;
    }
    return true;
  }
  
}
