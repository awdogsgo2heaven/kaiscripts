'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class CounterStance extends Status {
  constructor(ticks) {
    super('Counter Stance', ticks, 0)
  }
  static toSymbol(): string {
    return 'CounterStance';
  }
}
