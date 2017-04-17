'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Slow extends Status {
  constructor(ticks) {
    super('Slow', ticks, 0)
  }

  get castRate(): number {
    return 0.5;
  }

  bandwidthTick(): number {
    return -1;
  }
  static toSymbol(): string {
    return 'Slow';
  }
}
