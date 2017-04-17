'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Drain extends Status {
  constructor(ticks) {
    super('Drain', ticks, 0)
  }
  static toSymbol(): string {
    return 'Drain';
  }
}
