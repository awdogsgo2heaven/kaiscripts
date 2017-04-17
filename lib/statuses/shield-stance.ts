'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class ShieldStance extends Status {
  constructor(ticks) {
    super('Shield Stance', ticks, 0)
  }
  static toSymbol(): string {
    return 'ShieldStance';
  }
}
