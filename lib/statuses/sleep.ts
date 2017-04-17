'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Sleep extends Status {
  constructor(ticks) {
    super('Sleep', ticks, 0)
  }
  static toSymbol(): string {
    return 'Sleep';
  }
}
