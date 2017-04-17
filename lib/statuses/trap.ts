'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Trap extends Status {
  constructor(ticks) {
    super('Trap', ticks, 0)
  }
  static toSymbol(): string {
    return 'Trap';
  }
  get isTrapped(): boolean {
    return true;
  }
}
